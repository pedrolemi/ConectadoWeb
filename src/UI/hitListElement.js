export default class HitListElement extends Phaser.GameObjects.Zone {
    /**
     * Collider de los elementos que se colocan en una listview
     * Se trata como un objeto aparte y no se hace dentro del propio objeto para que
     * sea mas sencillo manipularlo y modificarlo
     * Nota: se hace en posiciones globales
     * Importante: se tiene que colocar en la escena y no dentro de ningun otro elemento
     * @param {Phaser.scene} scene
     * @param {object} renderObject - origen(0.5, 0)
     */
    constructor(scene, renderObject){
        super(scene, 0, 0);
        
        this.scene.add.existing(this);
        
        renderObject.setOrigin(0.5, 0);
        this.base = renderObject;
        
        this.setOrigin(0);
        this.setInteractive();
        // la interaccion con los objetos esta por encima del scrolling
        this.setDepth(2);

        this.resetToBoundingRect();
    }

    getBoundingRect(){
        // rectangulo del propio elemento
        let matrix = this.base.getWorldTransformMatrix();
        let x = matrix.tx - this.base.width / 2 * matrix.scaleX;
        let y = matrix.ty - this.base.height / 2 * matrix.scaleY;
        // el offset en y es para ponerlo origen(0.5, 0)
        return new Phaser.Geom.Rectangle(x, y + (this.base.height * matrix.scaleY) / 2, 
        this.base.width * matrix.scaleX, this.base.height * matrix.scaleY);
    }

    resetToBoundingRect(){
        let rect = this.getBoundingRect();
        this.setPosition(rect.x, rect.y);
        this.setSize(rect.width, rect.height);
        this.scene.input.enableDebug(this, '0x000000');
    }

    /**
     * Calcular el area de colision disponible de acuerdo a los limites de los diferentes listviews
     * @param {Array} boundingRects - todos los rectangulos que limitan el collider
     *                                  (limites de los diferentes list views a los que pertenece)
     */
    intersect(boundingRects){
        if(boundingRects.length > 0){
            let rect = this.getBoundingRect();

            let intersection = new Phaser.Geom.Rectangle();
            
            // interseccion entre el rectangulo restante y los limites de cada uno de los listviews a los que pertenece
            boundingRects.forEach((boundingRect) => {
                Phaser.Geom.Intersects.GetRectangleIntersection(rect, boundingRect, intersection);
                rect = intersection;
                
                intersection = new Phaser.Geom.Rectangle();
            });
            
            // se reajusta la zona de acuerdo a la interseccion
            this.setPosition(rect.x, rect.y);
            this.setSize(rect.width, rect.height);
            
            // se reajusta el input para que corresponda a la nueva zona
            //this.setInteractive();
            this.scene.input.enableDebug(this, '0x000000');
        }
    }
}