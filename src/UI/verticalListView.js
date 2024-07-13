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
    constructor(scene, x, y, scale, padding, boundaries, autocull = true){
        super(scene, x, y);

        this.scene.add.existing(this);        
        // poder usar el preupdate
        this.addToUpdateList();

        this.setScale(scale);
        
        // TODO: falta el bg (pero es mera decoracion)

        // limites de la listview
        this.boundedZone = this.scene.add.zone(0, 0, boundaries.width, boundaries.height);
        this.boundedZone.setOrigin(0.5, 0);
        this.boundedZone.setInteractive({draggable: true});
        this.scene.input.enableDebug(this.boundedZone, '0xffffA0');
        this.add(this.boundedZone);
        // final en cuanto a tam del borde (propiedad personalizada)
        this.boundedZone.end = this.boundedZone.y + this.boundedZone.displayHeight;
        
        // mascara
        // Importante: tiene que ser un elemento de la escena, no puede estar dentro de ningun lado
        this.rectangleMask = this.scene.add.rectangle(0, 0)
            .setAlpha(0.5).setOrigin(0).setFillStyle('0x000000');
        
        this.padding = padding
        this.autocull = autocull;

        // deslizar la lista
        let previousDrag = 0;
        this.currentDrag = 0;
        
        // estructuras de datos
        // items que son listviews (poder hacer recursion)
        this.childrenListViews = new Set();
        // ultimo elem (poder colocar al sig correctamente)
        this.lastItem = null;
        // items
        this.items = [];
        // (item, hits) --> solo items con areas de colision
        // Importante: los hits no tienen puramente los del propio item
        // por ejemplo, si hay un container con dos cubos, cada uno con dos areas de colision
        // el item podria ser el propio container y los hits, las areas de los dos cubos
        this.itemsHits = new Map();
        // container con los diferentes items (moverlo todo de golpe facilmente)
        this.itemsCont = this.scene.add.container(0, 0);
        this.add(this.itemsCont);

        // deslizamiento con inercia una vez acabado el drag
        this.isBeingDragged = false;
        this.movingSpeed = 0;
        this.lastSavedPosition = new Phaser.Geom.Point(this.itemsCont.x, this.itemsCont.y);
        this.friction = 0.99;
        this.speedMul = 0.7;
        this.minDistance = 1.8;

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

    /**
     * Calcula el rectangulo definido por los limites de la listview en coordenadas globales
     * (sirve tanto para ir recalculando la mascara como para calcular el area disponible interactuable
     * para cada uno de los items)
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
     * Actualizar la mascara de renderizado
     * Es necesario recalcular cada vez que se realiza un movimiento porque podria haber 
     * una listview en movimiento (por ejemplo, una listview dentro de otra)
     */
    updateMask(){
        if(this.rectangleMask !== null){    // cuando se elimina una listview y su mascara, evitar que se produzca un error
            // se hallar a partir del rectangulo que define los limites
            let rect = this.getBoundingRect();
            // Nota: usar estas funciones y no setear estos valores directamente
            this.rectangleMask.setPosition(rect.x, rect.y);
            this.rectangleMask.setSize(rect.width, rect.height);
            // bitmapmask --> alpha
            // geomtrymask --> interseccion
            let mask = this.rectangleMask.createGeometryMask();
            this.itemsCont.setMask(mask);
            
            // se hace recursion para los hijos porque si se desplaza la listview
            // principal, la listivew que es un item ha cambiado su pos y, por lo tanto,
            // la mascara tb
            this.childrenListViews.forEach((child) => {
                child.updateMask();
            })
        }
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
     */
    cropItems(){
        // AREAS DE COLISION
        // Propio objeto
        if(this.autocull){
            // se hace el culling
            this.cull();
        }
        else{
            // no se hace culling, por lo tanto, solo se calculan las nuevas areas de colision
            let rect = this.getBoundingRect();
            // items con colliders
            this.itemsHits.forEach((hits, item) => {
                // colliders
                hits.forEach((hit) => {
                    // solo se recortan los colliders de acuerdo a los limites de la propia listview
                    hit.intersect([rect]);
                })
            });
        }
        // Items listviews hijos
        let rect = this.getBoundingRect();
        // en cada hijo hay que tener en cuenta los limites propios de su
        // listivew y de cada uno de sus antecesores
        // Nota: para los hijos no hace falta hacer culling
        this.cropChildrenHits([rect]);

        // AJUSTAR RENDERIZADO
        this.updateMask();
    }

    /**
     * Nota: aunque se podria prescindir de los dos ifs de arriba y dejar simplemente la logica de abajo
     * pues la mascara va a tapar al render y un area de colision de tam 0 no va a poder ser interactuable,
     * el culling mejora el rendimiento ya que se evita estar calculando todo el rato las intersecciones
     * con la mascara y con el area interactuable (boundZone)
     */
    cull(){
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
                    let rect = this.getBoundingRect();
                    let hits = this.itemsHits.get(item);
                    hits.forEach((hit) => {
                        hit.intersect([rect]);
                    })
                }
            }
        });
    }

    cropChildrenHits(rects){
        let rectsAux = [...rects];
        // si hay listviews hijas
        this.childrenListViews.forEach((child) => {
            // si las listviews hijas tienen items con colision
            if(child.itemsHits.size > 0){
                // se agrega el limite del listview hija
                rectsAux.push(child.getBoundingRect());
                // se intersecciona cada una de los items con colliders del listview hijo
                child.itemsHits.forEach((hits, item) => {
                    hits.forEach((hit) => {
                        hit.intersect(rectsAux);
                    })
                });
                // para los hijos del listview hija
                child.cropChildrenHits(rectsAux);
                // se quita los limites del listview hija actual puesto
                // que se va a pasar al sig hijo
                rectsAux.pop();
            }
        })
    }

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
     * @param {Array} hits
     */
    addItem(item, hits){
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
            if(item instanceof VerticalListView){
                this.childrenListViews.add(item);
            }

            // este item tiene colliders
            if(hits){
                this.itemsHits.set(item, hits);
            }
        }
    }

    destroy(){
        this.rectangleMask.destroy();
        this.rectangleMask = null;
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

            // se destruye el listview en caso de que lo sea
            if(this.childrenListViews.has){
                this.childrenListViews.delete(item);
            }

            // eliminar el item del array (funciona como un remove)
            this.items.splice(index, 1);    // 1 --> solo una ocurrencia

            item.destroy();
        }
    }

    removeChild(child){
        let index = this.items.indexOf(child);
        if (index > -1) {
            this.removeByIndex(index);
        }
    }
}