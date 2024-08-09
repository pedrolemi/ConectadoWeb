export default class VerticalListView extends Phaser.GameObjects.Container {
    /**
     * Clase que permite crear una lista con elementos scrolleables. Se puede incluir cualquier
     * tipo de elementos renderizable, incluso otra propia listview
     * A TENER EN CUENTA:
     * - El "origen" de los elementos debe ser (0.5, 0)
     * - Cada elemento tiene que tener la propiedad .h, que es la altura real del elemento cuando se va a incluir en la listview
     * - Si se quiere que uno de los elementos sea interactuable hay que usar un hitListElement para el area de colision
     * - Llamar a init() despues de haber creado la listview y haber metido los items iniciales. 
     *      Si hay listviews anidadas con llamar al init() de la mayor es suficente
     * @param {Phaser.scene} scene 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} scale 
     * @param {Number} padding - separacion entre los diferentes elementos de la listivew 
     * @param {Object} boundaries - limites de la listview (tanto para interactuar como para renderizar) 
     * @param {Object} background - fondo y su componente alfa (opcional)
     * @param {Boolean} autocull - hacer que un los elementos que se salgan de los borden se vuelvan invisibles.
     *                              No supone un cambio visual ni funcional, pero si mejora el rendimiento (opcional)
     */
    constructor(scene, x, y, scale, padding, boundaries, background, autocull = true, endPadding = 0, focusLastItem = false) {
        super(scene, x, y);

        this.scene.add.existing(this);

        // Poder usar el preupdate
        this.addToUpdateList();

        this.setScale(scale);

        // bg (es mera decoracion)
        if (background) {
            let bg = null;
            if (background.hasOwnProperty('atlas')) {
                bg = this.scene.add.image(0, 0, background.atlas, background.sprite);
            }
            else {
                bg = this.scene.add.image(0, 0, background.sprite);
            }
            bg.setOrigin(0.5, 0).setAlpha(background.alpha);
            bg.displayWidth = boundaries.width;
            bg.displayHeight = boundaries.height;
            this.add(bg);
        }

        // Limites de la listview
        this.boundedZone = this.scene.add.zone(0, 0, boundaries.width, boundaries.height);
        this.boundedZone.setOrigin(0.5, 0);
        this.boundedZone.setInteractive({ draggable: true });
        // El scrolling esta por encima de cualquier asset
        // De esta forma, se va a poder scrollear sobre la propia listiview
        this.boundedZone.setDepth(1);
        if (this.scene.sys.game.debug) {
            this.scene.input.enableDebug(this.boundedZone, '0x000000');
        }
        this.add(this.boundedZone);
        // Final de los limites de la listview
        this.boundedZone.end = this.boundedZone.y + this.boundedZone.displayHeight;

        // Mascara
        // IMPORTANTE: tiene que ser un elemento de la escena, no puede estar dentro de ningun lado
        this.rectangleMask = this.scene.add.rectangle(0, 0)
            .setAlpha(0).setOrigin(0).setFillStyle('0x000000');

        // ESTRUCTURAS DE DATOS
        // Si se encuentra dentro de otra listview
        this.parentListView = null;
        // Items que son listviews (poder hacer recursion)
        this.childrenListViews = new Set();
        // Ultimo elem (poder colocar al sig correctamente)
        this.lastItem = null;
        // Items
        // Se usa principalmente para eliminar objetos por indice facilmente
        // y para que cuando se elimina un objeto se recoloquen los siguientes facilmente
        this.items = [];
        // (item, hits) --> solo items con areas de colision
        // Nota: los hits no tienen porque ser exactamente los del propio item
        // Por ejemplo, si hay un contenedor con dos cubos, el item podria ser
        // el propio contenedor y los hits, las areas de colision de cada cubo
        this.itemsHits = new Map();
        // (item, listviews) --> listviews que puede tener un item
        // Se usa principalmente para gestionar correctamente la eliminacion de items
        // Nota: las listviews no tienen porque se exactamente el propio item
        // Por ejemplo, is hay un contenedor con dos listviews, el item podria ser
        // el propio contenedor y luego, se pasarian las dos listviews
        this.itemsListViews = new Map();
        // Container con los diferentes items 
        // Se usa para moverlo todo de golpe facilmente
        // Importante: se tiene que crear el ultimo
        this.itemsCont = this.scene.add.container(0, 0);
        this.add(this.itemsCont);

        // PARAMETROS
        // Distancia entre los diferentes items de la lista
        this.padding = padding
        this.endPadding = endPadding;
        // Distancia que se deja al final de la lista
        this.autocull = autocull;
        // Cuando se anade un item al final de la lista, enfocarlo
        this.focusLastItem = focusLastItem;

        // Tams de la lista
        this.w = boundaries.w * scale;
        // Alto de la listview  por si se usa como un item dentro de otra listview
        this.h = boundaries.height * scale;

        // Deslizar la lista
        let previousDrag = 0;
        this.currentDrag = 0;

        // Deslizamiento con inercia una vez acabado el drag
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
            if (previousDrag === 0) {
                // Si se setea inicialmente previousDrag en dragstart, el valor es incorrecto
                previousDrag = y;
            }
            else {
                if (this.lastItem !== null) {
                    // Final de la lista en cuanto a tam (cambia conforme se van agregando mas objetos)
                    // .h --> tam del item (propiedad personalizada)
                    let listEnd = this.itemsCont.y + this.lastItem.y + this.lastItem.h;

                    // calcular la diferencia
                    let currentDrag = y;
                    this.dragDiff = currentDrag - previousDrag;
                    previousDrag = currentDrag;

                    // MOVIMIENTO   
                    // se sale por ambos lados
                    if (this.itemsCont.y < this.boundedZone.y &&  // se sale por arriba
                        listEnd > this.boundedZone.end - this.endPadding) {         // se sale por abajo
                        this.itemsCont.y += this.dragDiff;
                        this.cropItems();
                    }
                    // Se sale solo por abajo (solo se puede mover hacia arriba)
                    else if (listEnd > this.boundedZone.end - this.endPadding) {
                        if (this.dragDiff < 0) {  // mov hacia arriba
                            this.itemsCont.y += this.dragDiff;
                            this.cropItems();
                        }
                    }
                    // Se sale solo por arriba (solo se puede mover hacia abajo)
                    else if (this.itemsCont.y < this.boundedZone.y) {
                        if (this.dragDiff > 0) {  // mov hacia abajo
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

    setParentListview(listview) {
        if (this.parentListView === null) {
            this.parentListView = listview;
        }
    }

    /**
     * Calcular el rectangulo definido por los limites de la listview en coordenadas globales
     * (sirve tanto para ir recalcundo la mascara como el area de colision de cada uno de los items)
     * @returns rectangulo que representa los limites de la listview
     */
    getBoundingRect() {
        // limites en coordenadas globales
        let matrix = this.boundedZone.getWorldTransformMatrix();
        let posX = matrix.tx - this.boundedZone.width / 2 * matrix.scaleX;
        let posY = matrix.ty - this.boundedZone.height / 2 * matrix.scaleY;
        // el offset en y es para ponerlo en origen(0.5, 0)
        return new Phaser.Geom.Rectangle(posX, posY + (this.boundedZone.height * matrix.scaleY) / 2,
            this.boundedZone.width * matrix.scaleX, this.boundedZone.height * matrix.scaleY);
    }

    /**
     * Obtener todos los limites del listview actual y de todos los padres
     * Se utiliza a la hora de recalcular los colliders de los items
     * @returns limites del listview actual y padres
     */
    getCurrentBoundingRectAndAbove() {
        let rects = [];
        rects.push(this.getBoundingRect());

        if (this.parentListView !== null) {
            rects = rects.concat(this.parentListView.getCurrentBoundingRectAndAbove());
        }

        return rects;
    }

    /**
     * Actualizar la mascara de renderizado
     */
    updateMask() {
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
     * Actualizar la mascara de renderizado de todass las listviews hijas y subhijas
     */
    updateChildrenMask() {
        this.childrenListViews.forEach((child) => {
            child.updateMask();
            child.updateChildrenMask();
        });
    }

    /**
     * Hacer un item y los colliders vinculados visibles o no
     * Se utiliza para el culling
     * Nota: si algo es setVisible(false) tp es interactuable
     * @param {Object} item 
     * @param {Boolean} visible 
     */
    makeItemVisible(item, visible) {
        item.setVisible(visible);
        if (this.itemsHits.has(item)) {
            let hits = this.itemsHits.get(item);
            hits.forEach((hit) => {
                hit.setVisible(visible);
            });
        }
    }

    init() {
        this.updateMask();
        this.cropItems();
    }

    /**
     * Recortar los items en cuanto a renderizado y areas de colision para que se
     * ajusten a los limites de las listviews
     */
    cropItems() {
        // hay que tener en cuenta la listview actual y las de orden superior
        let rects = this.getCurrentBoundingRectAndAbove();

        // Propio objeto
        if (this.autocull) {
            // se hace el culling
            this.cull(rects);
        }
        else {
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
     * que se encuentran fuera de los limites, se evita calcular todo el rato las intersecciones
     * con la mascara y con el area interactuable (boundedZone)
     */
    cull(boundingRects) {
        this.items.forEach((item) => {
            let itemStart = this.itemsCont.y + item.y;
            let itemEnd = itemStart + item.h;

            // Se sale el item completo por abajo
            if (itemStart > this.boundedZone.end) {
                this.makeItemVisible(item, false);
            }
            // Se sale el item completo por arriba
            else if (itemEnd < this.boundedZone.y) {
                this.makeItemVisible(item, false);
            }
            else {
                this.makeItemVisible(item, true);

                // Recortar colliders de los diferentes items
                if (this.itemsHits.has(item)) {
                    let hits = this.itemsHits.get(item);
                    hits.forEach((hit) => {
                        hit.intersect(boundingRects);
                    })
                }
            }
        });
    }

    /**
     * Recortar los colliders de los items de las listviews hijas
     * @param {Array} boudingRects - limites de las listviews anteriores 
     */
    cropChildrenHits(boudingRects) {
        let rects = [...boudingRects];
        // Listviews hijas
        this.childrenListViews.forEach((child) => {
            // Se agrega el limite de la list view hija actual
            rects.push(child.getBoundingRect());
            // Se recalcula el collider de los items
            child.itemsHits.forEach((hits, item) => {
                hits.forEach((hit) => {
                    hit.intersect(rects);
                })
            });
            // Mismo proceso para sus hijos
            child.cropChildrenHits(rects);
            // Se quita los limites de la listview hija actual puesto
            // que se va a pasar al sig hijo
            rects.pop();
        })
    }

    /**
     * Deslizamiento con inercia
     */
    preUpdate(t, dt) {
        if (this.isBeingDragged) {
            // Se necesita la posicion del contenedor en el frame anterior
            this.lastSavedPosition.x = this.itemsCont.x;
            this.lastSavedPosition.y = this.itemsCont.y;
        }
        else {
            if (this.movingSpeed > 1) {
                // Se desliza hacia abajo
                if (this.dragDiff > 0) {
                    // Se va a poder mover hasta que entre todo el panel
                    if (this.itemsCont.y < this.boundedZone.y) {
                        this.itemsCont.y += this.movingSpeed;
                        this.cropItems();
                    }
                    else {
                        // Si ha entrado todo el panel, ya no puede haber mas deslizamiento
                        this.movingSpeed = 0;
                    }
                }
                // Se desliza hacia arriba
                else if (this.dragDiff < 0) {
                    let listEnd = this.itemsCont.y + this.lastItem.y + this.lastItem.h;
                    // Se va a poder mover hasta que entre todo el panel
                    if (listEnd > this.boundedZone.end - this.endPadding) {
                        this.itemsCont.y -= this.movingSpeed;
                        this.cropItems();
                    }
                    else {
                        // Si ha entrado todo el panel, ya no puede haber mas deslizamiento
                        this.movingSpeed = 0;
                    }
                }
                // Se va reduciendo la velocidad
                this.movingSpeed *= this.friction;
                this.lastSavedPosition.x = this.itemsCont.x;
                this.lastSavedPosition.y = this.itemsCont.y;
            }
            else {
                // Distancia del ultimo drag
                let distance = Phaser.Math.Distance.Between(this.lastSavedPosition.x, this.lastSavedPosition.y,
                    this.itemsCont.x, this.itemsCont.y);
                // si el drag ha sido de mas de cierta distancia, se desliza
                if (distance > this.minDistance) {
                    this.movingSpeed = distance * this.speedMul;
                }
            }
        }
    }

    /**
     * Agregar un elemento al final del listview
     * Nota: el elemento queda alineado en el medio de la listview
     * Importante: definir la propiedad .h, que es la altura completa del elemento
     * @param {Object} item - origen(0.5, 0)
     * @param {Array} hits - hits que tiene el item (y sus elementos) (opcional)
     * @param {Array} listviews - listviews que tiene el item (y sus elementos) (opcional)
     *                              Nota: el propio item podria ser una listview
     */
    addLastItem(item, hits, listviews) {
        if (item.hasOwnProperty('h')) {
            // ?. --> si la funcion no existe, no se llama
            item.setOrigin?.(0.5, 0);
            this.itemsCont.add(item);
            // Colocar el item
            // El primero se coloca al borde los limities
            item.x = 0;
            item.y = 0;
            if (this.lastItem !== null) {
                item.y = this.lastItem.y + this.lastItem.h + this.padding;
            }

            this.items.push(item);
            this.lastItem = item;

            // Colocar la listview para que enfoque al ultimo item
            if (this.focusLastItem) {
                this.itemsCont.y = this.boundedZone.end - this.endPadding - (this.lastItem.y + this.lastItem.h);
                this.lastSavedPosition.x = this.itemsCont.x;
                this.lastSavedPosition.y = this.itemsCont.y;
            }

            this.addItemElems(item, hits, listviews);
        }
    }

    /**
     * Agregar un elemento al principio de la listview
     * Nota: el elemento queda alineado en el medio de la listview
     * @param {Object} item - origen(0.5, 0)
     * @param {Array} hits - hits que tiene el item (y sus elementos) (opcional)
     * @param {Array} listviews - listviews que tiene el item (y sus elementos) (opcional)
     *                              Nota: el propio item podria ser una listview
     */
    addFirstItem(item, hits, listviews) {
        if (item.hasOwnProperty('h')) {
            // ?. --> si la funcion no existe, no se llama
            item.setOrigin?.(0.5, 0);
            this.itemsCont.add(item);
            // Colocar el item
            // El primero se coloca al borde los limities
            item.x = 0;
            item.y = 0;
            if (this.lastItem !== null) {
                // Se recolocan todos los items
                for (let i = 0; i < this.items.length; ++i) {
                    this.items[i].y += item.y + item.h + this.padding;
                }
            }
            else {
                this.lastItem = item;
            }

            this.items.unshift(item);

            this.addItemElems(item, hits, listviews);
        }
    }

    /**
     * Agregar un las colisiones y las listviews de un item a las estructuras de datos de la clase
     */
    addItemElems(item, hits, listviews) {
        // Este items tiene listviews
        if (listviews) {
            listviews.forEach((listview) => {
                // Se agrega a la lista de list views
                this.childrenListViews.add(listview)
                // Se establece el padre de cada listview
                listview.setParentListview(this);
            });
            // Se guarda en el mapa
            this.itemsListViews.set(item, listviews);
        }

        // Este item tiene colliders
        if (hits) {
            this.itemsHits.set(item, hits);
        }

        this.cropItems();
    }

    /**
     * Eliminar los elementos que estan en la escena (mascara y colisiones)
     * y los de todos sus listviews hijas
     */
    destroyMaskAndHits() {
        // Este if es para evitar que se produza un error si el propio item
        // es de por si una list view porque ya se habra destruido y se tratara
        // de destruir dos veces

        // Destruir la mascara de renderizado
        if (this.rectangleMask !== null) {
            this.rectangleMask.destroy();
            this.rectangleMask = null;
        }

        // Destruir las areas de colision
        this.itemsHits.forEach((hits, item) => {
            hits.forEach((hit) => {
                hit.destroy();
                hit = null;
            });
        });
        this.itemsHits.clear();
    }

    destroy() {
        this.destroyMaskAndHits();
        this.parentListView = null;
        this.lastItem = null;
        this.items.forEach((item) => {
            // Evitar que si el propio item es una listview se elimine dos veces y se produzca error
            if (!this.childrenListViews.has(item)) {
                item.destroy();
            }
        })
        // Eliminar listviews hijas
        this.items = [];    // hacer clear del array
        this.childrenListViews.forEach((child) => {
            child.destroy();
        });
        this.childrenListViews.clear();
        super.destroy();
    }

    /**
     * Eliminar un item de la listview por indice
     * @param {Number} index - indice del item en la listview
     */
    removeByIndex(index) {
        if (index >= 0 && index < this.items.length) {
            let item = this.items[index];
            // Se recolocan todos los items que se encuentran detras
            for (let i = index + 1; i < this.items.length; ++i) {
                this.items[i].y = this.items[i].y - item.h - this.padding;
            }

            if (this.itemsHits.has(item)) {
                // Se destruyen las areas
                let hits = this.itemsHits.get(item);
                hits.forEach((hit) => {
                    hit.destroy();
                })
                this.itemsHits.delete(item);
            }

            if (this.itemsListViews.has(item)) {
                // Se destruyen las listviews hijas
                let listviews = this.itemsListViews.get(item);
                listviews.forEach((listview) => {
                    if (this.childrenListViews.has(listview)) {
                        this.childrenListViews.delete(listview);
                    }
                    listview.destroy();
                });
                this.itemsListViews.delete(item);
            }

            // Eliminar el item del array (funciona como un remove)
            this.items.splice(index, 1);    // 1 --> solo una ocurrencia

            item.destroy();

            // Establecer ultimo elemento
            if (this.items.length > 0) {
                this.lastItem = this.items[this.items.length - 1];
            }
            else {
                this.lastItem = null;
            }

            this.cropItems();
        }
    }

    removeItem(item) {
        let index = this.items.indexOf(item);
        if (index > -1) {
            this.removeByIndex(index);
        }
    }

    /**
     * Hacer la mascara y las areas de colision visibles o invisibles
     * Aunque se cambie la visibilidad del container, la de estos elementos no cambia
     * porque pertenecen a la escena
     * @param {Boolean} visible - visible o invisible 
     */
    setVisibleMaskHits(visible) {
        //this.rectangleMask.setVisible(visible);
        this.itemsHits.forEach((hits, item) => {
            hits.forEach((hit) => {
                hit.setVisible(visible);
            });
        });
    }

    setVisibleAux(visible) {
        // No hace falta hacer invisible uno por uno cada item
        // porque como estan en el container, si el container se
        // hace invisible, ellos tb se vuelven invisibles
        super.setVisible(visible);
        // Se para el deslizamiento
        this.movingSpeed = 0;
        // (No deberia hacer falta, sin embargo, si no se hace, la zona no se vuelve invisible)
        this.boundedZone.setVisible(visible);
        this.setVisibleMaskHits(visible);
        // Se hacen invisible todos las listiviews hijas
        // (para que se puedan hacer su mascara y sus areas de colision invisibles)
        this.childrenListViews.forEach((child => {
            child.setVisibleAux(visible);
        }));
    }

    setVisible(visible) {
        this.setVisibleAux(visible);
        if (visible) {
            // Luego de volver a hacer la listview visible de nuevo hay que ajustar los collider
            // porque se han hecho visibles y estan completos, pero es probable que en verdad tengan
            // que estar recortados
            this.cropItems();
        }
    }
}