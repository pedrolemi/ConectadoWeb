export default class VerticalListView extends Phaser.GameObjects.Container {
    /**
     * Clase que permite crear una lista con elementos scrolleables. Se puede incluir cualquier
     * tipo de elementos renderizable, incluso otra propia listview.
     * Notas:
     * - El "origen" de los elementos debe ser (0.5, 0)
     * - Cada elemento tiene que tener la propiedad .h, que es la altura real del elemento cuando
     *      se va a incluir en la listview
     * - Si se quiere que uno de los elementos sea interactuable hay que usar un hitListElement
     *      para marcar este area de colision
     * - Llamar a cropItems() despues de agregar o eliminar objetos
     * @param {Phaser.scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {number} scale 
     * @param {number} padding - separacion entre los diferentes elementos de la listivew 
     * @param {object} boundaries - limites de la listview (tanto para interactuar como para renderizar) 
     * @param {boolean} autocull - hacer que un los elementos que se salgan de los borden se vuelvan invisibles.
     *                              No supone un cambio visual ni funcional, pero si mejora el rendimiento 
     */
    constructor(scene, x, y, scale, padding, boundaries, bgSprite, autocull = true){
        super(scene, x, y);

        this.scene.add.existing(this);
        // poder usar el preupdate
        this.addToUpdateList();

        this.setScale(scale);
        
        // bg (es mera decoracion)
        if(bgSprite) {
            let bg = this.scene.add.image(0, 0, bgSprite);
            bg.setOrigin(0.5, 0);
            bg.displayWidth = boundaries.width;
            bg.displayHeight = boundaries.height;
            this.add(bg);
        }

        // limites de la listview
        this.boundedZone = this.scene.add.zone(0, 0, boundaries.width, boundaries.height);
        this.boundedZone.setOrigin(0.5, 0);
        this.boundedZone.setInteractive({draggable: true});
        // el scrolling esta por encima de cualquier asset
        // entonces, se va a poder scrollear sobre la propia listviewe
        this.boundedZone.setDepth(1);
        this.scene.input.enableDebug(this.boundedZone, '0x000000');
        this.add(this.boundedZone);
        // final en cuanto a tam del borde (propiedad personalizada)
        this.boundedZone.end = this.boundedZone.y + this.boundedZone.displayHeight;
        
        // Mascara
        // Importante: tiene que ser un elemento de la escena, no puede estar dentro de ningun lado
        this.rectangleMask = this.scene.add.rectangle(0, 0)
            .setAlpha(0).setOrigin(0).setFillStyle('0x000000');
        
        // PARAMETROS
        // distancia entre los diferentes items de la lista
        this.padding = padding
        this.autocull = autocull;

        // deslizar la lista
        this.h = boundaries.height * scale;
        let previousDrag = 0;
        this.currentDrag = 0;
        
        // ESTRUCTURAS DE DATOS
        // si se encuentra dentro de otro item que es una listview
        this.parentListView = null;
        // items que son listviews (poder hacer recursion)
        this.childrenListViews = new Set();
        // ultimo elem (poder colocar al sig correctamente)
        this.lastItem = null;
        // items
        // Se usa principalmente para eliminar objetos por indice facilmente
        // y para que cuando se elimina un objeto se recoloquen los siguientes facilmente
        this.items = [];
        // (item, hits) --> solo items con areas de colision
        // Nota: los hits no tienen porque ser exactamente los del propio item
        // Por ejemplo, si hay un contenedor con dos cubos, el item podria ser
        // el propio contenedor y los hits, las areas de colision de cada cubo
        this.itemsHits = new Map();
        // (item, listviews) --> listviews hijas que puede tener un item
        // Se usa principalmente para gestionar correctamente la eliminancion de items
        // Nota: se hace de esta forma porque las listviews hijas puede ser tanto
        // el propio item como elementos que tenga el item dentro
        this.itemsListViews = new Map();
        // container con los diferentes items (moverlo todo de golpe facilmente)
        // Importante: se tiene que crear el ultimo
        this.itemsCont = this.scene.add.container(0, 0);
        this.add(this.itemsCont);

        // PARAMETROS
        // deslizamiento con inercia una vez acabado el drag
        this.isBeingDragged = false;
        this.movingSpeed = 0;
        this.lastSavedPosition = new Phaser.Geom.Point(this.itemsCont.x, this.itemsCont.y);
        this.friction = 0.99;
        this.speedMul = 0.7;
        this.minDistance = 1.8;

        this.updateMask();

        this.boundedZone.on('dragenter', (pointer, x, y) => {
            this.isBeingDragged = true;
        });

        this.boundedZone.on('drag', (pointer, x, y) => {
            if(previousDrag === 0){
                // si se previousDrag en dragstart, aparece un valor incorrecto
                previousDrag = y;
            }
            else{
                if(this.lastItem !== null){
                    // final de la lista en cuanto a tam (cambia conforme se van agregando mas objetos)
                    // .h --> tam del item (propiedad personalizada)
                    let listEnd = this.itemsCont.y + this.lastItem.y + this.lastItem.h;

                    // calcular la diferencia
                    let currentDrag = y;
                    this.dragDiff = currentDrag - previousDrag;
                    previousDrag = currentDrag;

                    // movimientos
                    // se sale por ambos lados
                    if(this.itemsCont.y < this.boundedZone.y &&  // se sale por arriba
                        listEnd > this.boundedZone.end) {       // se sale por abajo
                        this.itemsCont.y += this.dragDiff;
                        this.cropItems();
                    }
                    // se sale solo por abajo (solo se puede mover hacia arriba)
                    else if(listEnd > this.boundedZone.end){
                        if(this.dragDiff < 0){  // mov hacia arriba
                            this.itemsCont.y += this.dragDiff;
                            this.cropItems();
                        }
                    }
                    // se sale solo por arriba (solo se puede mover hacia abajo)
                    else if(this.itemsCont.y < this.boundedZone.y){
                        if(this.dragDiff > 0){  // mov hacia abajo
                            this.itemsCont.y += this.dragDiff;
                            this.cropItems();
                        }
                    }
                }
            }
        });

        this.boundedZone.on('dragend', (pointer, x, y) => {
            previousDrag = 0;
            this.isBeingDragged = false;
            // (se podria quitar)
            this.movingSpeed = 0;
        });
    }

    setParentListview(listview){
        if(this.parentListView === null){
            this.parentListView = listview;
        }
    }

    /**
     * Calcular el rectangulo definido por los limites de la listview en coordenadas globales
     * (sirve tanto para ir recalcundo la mascara como el area de colision de cada uno de los items)
     * @returns rectangulo que representa los limites de la listview
     */
    getBoundingRect(){
        // limites en coordenadas globales
        let matrix = this.boundedZone.getWorldTransformMatrix();
        let posX = matrix.tx - this.boundedZone.width / 2 * matrix.scaleX;
        let posY = matrix.ty - this.boundedZone.height / 2 * matrix.scaleY;
        // el offset en y es para ponerlo en origen(0.5, 0)
        return new Phaser.Geom.Rectangle(posX, posY + (this.boundedZone.height * matrix.scaleY) / 2, 
            this.boundedZone.width * matrix.scaleX, this.boundedZone.height * matrix.scaleY);
    }

    /**
     * Calcular los limites del listiview actual y superior
     * Se utiliza a la hora de recalcular los colliders de los items
     * @returns limites del listview actual y superiroes
     */
    getCurrentBoundingRectAndAbove(){
        let rects = [];
        rects.push(this.getBoundingRect());

        if(this.parentListView !== null){
            rects = rects.concat(this.parentListView.getCurrentBoundingRectAndAbove());
        }

        return rects;
    }

    /**
     * Actualizar la mascara de renderizado
     */
    updateMask(){
        // se hallar a partir del rectangulo que define los limites
        let rect = this.getBoundingRect();
        // Nota: usar estas funciones y no setear los valores directamente
        this.rectangleMask.setPosition(rect.x, rect.y);
        this.rectangleMask.setSize(rect.width, rect.height);
        // bitmapmask --> alfa
        // geomtrymask --> interseccion
        let mask = this.rectangleMask.createGeometryMask();
        this.itemsCont.setMask(mask);
    }

    /**
     * Actualizar la mascara de renderiado de todos sus hijos y subhijos
     */
    updateChildrenMask(){
        this.childrenListViews.forEach((child) => {
            child.updateMask();
            child.updateChildrenMask();
        });
    }

    /**
     * Hacer un item y los colliders vinculados visibles o no
     * Se utiliza para el culling
     * Nota: si algo es setVisible(false) tp es interactuable
     * @param {object} item 
     * @param {boolean} visible 
     */
    makeItemVisible(item, visible){
        item.setVisible(visible);
        if(this.itemsHits.has(item)){
            let hits = this.itemsHits.get(item);
            hits.forEach((hit) => {
                hit.setVisible(visible);
            });
        }
    }

    /**
     * Recortar los items en cuanto a renderizado y areas de colision para que se
     * ajusten a los limites de las listviews
     * IMPORTANTE: HAY QUE LLAMARLO SIEMPRE DESPUES DE AGREGAR O ELIMINAR NUEVOS ITEMS
     */
    cropItems(){
        // hay que tener en cuenta la listview actual y las de orden superior
        let rects = this.getCurrentBoundingRectAndAbove();

        // Propio objeto
        if(this.autocull){
            // se hace el culling
            this.cull(rects);
        }
        else{
            // no se hace culling, por lo tanto, solo se calculan las nuevas areas de colision
            // items con colliders
            this.itemsHits.forEach((hits, item) => {
                // colliders
                hits.forEach((hit) => {
                    hit.intersect(rects);
                })
            });
        }

        // AJUSTAR COLISIONES DE LOS HIJOS
        // en cada hijo hay que tener en cuenta los limites propios de su
        // listview y de sus antecesores
        // Nota: para los hijos no tiene sentido hacer culling puesto que sus items
        // no se han movido y es imposible que se salgan de los limities
        this.cropChildrenHits(rects);

        // AJUSTAR RENDERIZADO DE LOS HIJOS
        // solo se necesita actualizar la de los hijos porque el listview
        // actual no se ha movido
        this.updateChildrenMask();
    }

    /**
     * Culling: supone una mejora de rendimiento ya que al volver invisibles los items
     * que se encuentran fuera de los limites, se calculando todo el rato las intersecciones
     * con la mascara y con el area interactuable (boundZone)
     */
    cull(boundingRects){
        this.items.forEach((item) => {
            let itemStart = this.itemsCont.y + item.y;
            let itemEnd = itemStart + item.h;

            // se sale el item completo por abajo
            if(itemStart > this.boundedZone.end){
                this.makeItemVisible(item, false);
            }
            // se sale el item completo por arriba
            else if(itemEnd < this.boundedZone.y){
                this.makeItemVisible(item, false);
            }
            else {
                this.makeItemVisible(item, true);

                // recortar colliders de los diferentes items
                if(this.itemsHits.has(item)){
                    let hits = this.itemsHits.get(item);
                    hits.forEach((hit) => {
                        hit.intersect(boundingRects);
                    })
                }
            }
        });
    }

    /**
     * Recortar los collider de los items de las listviews hijas
     * @param {Array} boudingRects - limites de las listiviews anteriores 
     */
    cropChildrenHits(boudingRects){
        let rects = [...boudingRects];
        // listviews hijas
        this.childrenListViews.forEach((child) => {
            // se agrega el limite de la list view hija actual
            rects.push(child.getBoundingRect());
            // se recalcula el collider de los items
            child.itemsHits.forEach((hits, item) => {
                hits.forEach((hit) => {
                    hit.intersect(rects);
                })
            });
            // mismo proceso para sus hijos
            child.cropChildrenHits(rects);
            // se quita los limites del listview hija actual puesto
            // que se va a pasar al sig hijo
            rects.pop();
        })
    }

    /**
     * Inicializar
     * IMPORTANTE:
     * - Se debe despues de llamar despues de agregar objetos por primera vez
     * - Si se han anidado list views, con llamarlo solo para la de orden superior funciona
     */
    /*
    init(){
        // (mejor hacerlo despues de haber añadido los objetos para que todo este colocado definitivamente)
        this.updateMask();
        this.cropItems();
    }
    */

    /**
     * Deslizamiento con inercia
     */
    preUpdate(t, dt){
        if(this.isBeingDragged){
            // se necesita la procision del frame anterio
            this.lastSavedPosition.x = this.itemsCont.x;
            this.lastSavedPosition.y = this.itemsCont.y;
        }
        else {
            if(this.movingSpeed > 1){
                // se desliza hacia abajo
                if(this.dragDiff > 0) {
                    // se va a poder mover hasta que entre todo el panel
                    if(this.itemsCont.y < this.boundedZone.y){
                        this.itemsCont.y += this.movingSpeed;
                        this.cropItems();
                    }
                    else{
                        this.movingSpeed = 0;
                    }
                }
                else if(this.dragDiff < 0){
                    let listEnd = this.itemsCont.y + this.lastItem.y + this.lastItem.h;
                    // se va a poder mover hasta que entre todo el panel
                    if(listEnd > this.boundedZone.end){
                        this.itemsCont.y -= this.movingSpeed;
                        this.cropItems();
                    }
                    else {
                        this.movingSpeed = 0;
                    }
                }
                // se va reduciendo la velocidad
                this.movingSpeed *= this.friction;
                this.lastSavedPosition.x = this.itemsCont.x;
                this.lastSavedPosition.y = this.itemsCont.y;
            }
            else{
                // distancia del ultimo drag
                let distance = Phaser.Math.Distance.Between(this.lastSavedPosition.x, this.lastSavedPosition.y, 
                    this.itemsCont.x, this.itemsCont.y);
                // si el drag ha sido de mas de cierta distancia, se desliza
                if(distance > this.minDistance){
                    this.movingSpeed = distance * this.speedMul;
                }
            }
        }
    }

    /**
     * Agregar un elemento
     * Importante: definir la propiedad .h, que es la altura completa del elemento
     * @param {object} item - origen(0.5, 0)
     * @param {Array} hits - hits que tiene el item (y sus elementos)
     * @param {Array} listviews - listviews que tiene el item (y sus elementos)
     *                              Nota: el propio item podria ser una listview
     */
    addItem(item, hits, listviews){
        if(item.hasOwnProperty('h')){            
            // ?. --> si la funcion no existe, no se llama
            item.setOrigin?.(0.5, 0);
            this.itemsCont.add(item);
            // colocar el item
            // el primero se coloca al borde los limities
            item.x = 0;
            item.y = 0;
            if(this.lastItem !== null) {
                item.y = this.lastItem.y + this.lastItem.h + this.padding;
            }

            this.items.push(item);
            this.lastItem = item;
            // se trata de un item listview
            /*
            if(item instanceof VerticalListView){
                this.childrenListViews.add(item);
                item.setParentListview(this);
            }
            */
           if(listviews){
                listviews.forEach((listview) => {
                    // se agrega a la lista de list views
                    this.childrenListViews.add(listview)
                    // se establece el padre de cada listview
                    listview.setParentListview(this);
                });
                // se guarda en el mapa
                this.itemsListViews.set(item, listviews);
           }

            // este item tiene colliders
            if(hits){
                this.itemsHits.set(item, hits);
            }
        }
    }
    
    /**
     * Eliminar los elementos que estan en la escena (mascara y colisiones)
     * y los de todos sus listviews hijos en el caso de que tengan
     */
    destroyMaskAndHits(){
        // este if es para evitar que se produza un error si el propio item
        // es de por si una list view porque ya se habra destruido y se tratara
        // de destruir dos veces
        if(this.rectangleMask !== null){
            this.rectangleMask.destroy();
            this.rectangleMask = null;
        }

        this.itemsHits.forEach((hits, item) => {
            hits.forEach((hit) => {
                hit.destroy();
                hit = null;
            });
        });
        this.itemsHits.clear();
    }

    destroy(){
        this.destroyMaskAndHits();
        this.parentListView = null;
        this.lastItem = null;
        this.items.forEach((item) => {
            // evitar que si el propio item es una listview se elimine dos veces y se produzca error
            if(!this.childrenListViews.has(item)){
                item.destroy();
            }
        })
        // eliminar listviews hijas
        this.items = [];
        this.childrenListViews.forEach((child) => {
            child.destroy();
        });
        this.childrenListViews.clear();
        super.destroy();
    }

    removeByIndex(index){
        if(index >= 0 && index < this.items.length){
            let item = this.items[index];
            // se recolocan todos los items que se encuentran por delante
            for(let i = index + 1; i < this.items.length; ++i){
                this.items[i].y = this.items[i].y - item.h - this.padding;
            }
            
            if(this.itemsHits.has(item)){
                // se destruyen las areas
                let hits = this.itemsHits.get(item);
                hits.forEach((hit) => {
                    hit.destroy();
                })
                this.itemsHits.delete(item);
            }

            // se elimina el listview en caso de que lo sea
            /*
            if(this.childrenListViews.has(item)){
                this.childrenListViews.delete(item);
            }
            */

            if(this.itemsListViews.has(item)){
                // se destruyen las listviews hijas
                let listviews = this.itemsListViews.get(item);
                listviews.forEach((listview) => {
                    if(this.childrenListViews.has(listview)){
                        this.childrenListViews.delete(listview);
                    }
                    listview.destroy();
                });
                this.itemsListViews.delete(item);
            }

            // eliminar el item del array (funciona como un remove)
            this.items.splice(index, 1);    // 1 --> solo una ocurrencia

            item.destroy();
            
            // establecer ultimo elemento
            if(this.items.length > 0){
                this.lastItem = this.items[this.items.length - 1];
            }
        }
    }

    removeItem(item){
        let index = this.items.indexOf(item);
        if (index > -1) {
            this.removeByIndex(index);
        }
    }

    /**
     * Hacer la mascara y las areas de colision visibles o invisibles
     * Aunque se cambie la visibilidad del container, la de estos elementos no cambia
     * porque pertenecen a la escena
     * @param {boolean} visible - visible o invisible 
     */
    setVisibleMaskAndHits(visible){
        this.rectangleMask.setVisible(visible);
        this.itemsHits.forEach((hits, item) => {
            hits.forEach((hit) => {
                hit.setVisible(visible);
            });
        });
    }

    setVisible(visible){
        // no hace falta hacer invisible uno por uno cada item
        // porque como estan en el container, si el container se
        // hace invisible, ellos tb se vuelven invisibles
        super.setVisible(visible);
        this.setVisibleMaskAndHits(visible);
        // se hacen invisible todos las listiviews hijas
        // (para que se puedan hacer su mascara y sus areas de colision invisibles)
        this.childrenListViews.forEach((child => {
            child.setVisible(visible);
        }));
    }
}