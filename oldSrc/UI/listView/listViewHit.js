export default class ListViewHit extends Phaser.GameObjects.Zone {
    /**
     * Collide que se puede usar en los elementos que se colocan en una listview
     * Se trata como un objeto aparte y no se hace dentro del propio objeto para que
     * sea mas sencillo manipularlo y modificarlo
     * Nota: se hace en posiciones globales
     * Importante: se tiene que colocar en la escena y no dentro de ningun otro elemento
     * @param {Phaser.scene} scene
     * @param {Object} renderObject - origen(0.5, 0)
     */
    constructor(scene, renderObject) {
        super(scene, 0, 0);

        this.scene.add.existing(this);

        // Importante: la imagen debe tener origen (0.5, 0) para que se ajuste bien este collider
        // y el elemento en conjunto se coloque correctamente en la listview
        renderObject.setOrigin(0.5, 0);
        this.base = renderObject;

        this.setOrigin(0);
        this.setInteractive();
        // La interaccion con los objetos esta por encima del scrolling
        this.setDepth(2);

        this.resetToBoundingRect();
    }

    /**
     * Devuelve el rectangulo que coincide con la imagen
     * @returns rectangulo de la imagen
     */
    getBoundingRect() {
        // rectangulo del propio elemento
        let matrix = this.base.getWorldTransformMatrix();
        let x = matrix.tx - this.base.width / 2 * matrix.scaleX;
        let y = matrix.ty - this.base.height / 2 * matrix.scaleY;
        // el offset en y es para ponerlo origen(0.5, 0)
        return new Phaser.Geom.Rectangle(x, y + (this.base.height * matrix.scaleY) / 2,
            this.base.width * matrix.scaleX, this.base.height * matrix.scaleY);
    }

    /**
     * Se cambia la zona para que coincide con el area de la iamgen
     */
    resetToBoundingRect() {
        let rect = this.getBoundingRect();
        this.setPosition(rect.x, rect.y);
        this.setSize(rect.width, rect.height);
        if (this.scene.sys.game.debug) {
            this.scene.input.enableDebug(this, '0x000000');
        }
    }

    /**
     * Calcular el area de colision disponible de acuerdo a los limites de los diferentes listviews
     * @param {Array} boundingRects - todos los rectangulos que limitan el collider
     *                                  (limites de los diferentes list views a los que pertenece)
     */
    intersect(boundingRects) {
        if (boundingRects.length > 0) {
            let rect = this.getBoundingRect();

            let intersection = new Phaser.Geom.Rectangle();

            // interseccion entre el rectangulo restante y los limites de cada uno de los listviews a los que pertenece
            boundingRects.forEach((boundingRect) => {
                Phaser.Geom.Intersects.GetRectangleIntersection(rect, boundingRect, intersection);
                rect = intersection;

                intersection = new Phaser.Geom.Rectangle();
            });

            // Se reajusta la zona de acuerdo a la interseccion
            this.setPosition(rect.x, rect.y);
            this.setSize(rect.width, rect.height);

            // Cada vez que se cambia la zona, hay que volver a llamar al enableDebug
            // para que el area de colision se pinte correctamente
            if (this.scene.sys.game.debug) {
                this.scene.input.enableDebug(this, '0x000000');
            }
        }
    }
}