
import BaseScene from './baseScene.js';

export default class ClassFrontBase extends BaseScene {
    /**
     * Escena base para el frente de la clase. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super(name);
    }
    
    create(params) {
        super.create(params);

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'classFrontBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        this.rightBound = bg.displayWidth;

        
        // Primera fila de sillas y mesas
        this.row1Chairs = this.add.image(0, 0, 'frontRow1Chairs').setOrigin(0, 0).setScale(this.scale);
        this.row1Tables = this.add.image(0, 0, 'frontRow1Tables').setOrigin(0, 0).setScale(this.scale);

        // Segunda fila de sillas y mesas
        this.row2Chairs = this.add.image(0, 0, 'frontRow2Chairs').setOrigin(0, 0).setScale(this.scale);
        this.row2Tables = this.add.image(0, 0, 'frontRow2Tables').setOrigin(0, 0).setScale(this.scale);

        // Tercera fila de sillas y mesas
        this.row3Chairs = this.add.image(0, 0, 'frontRow3Chairs').setOrigin(0, 0).setScale(this.scale);
        this.row3Tables = this.add.image(0, 0, 'frontRow3Tables').setOrigin(0, 0).setScale(this.scale);

        // Cuarta fila de sillas y mesas
        this.row4Chairs = this.add.image(0, 0, 'frontRow4Chairs').setOrigin(0, 0).setScale(this.scale);
        this.row4Tables = this.add.image(0, 0, 'frontRow4Tables').setOrigin(0, 0).setScale(this.scale);

        // Quinta fila de sillas y mesas
        this.row5Chairs = this.add.image(0, 0, 'frontRow5Chairs').setOrigin(0, 0).setScale(this.scale);
        this.row5Tables = this.add.image(0, 0, 'frontRow5Tables').setOrigin(0, 0).setScale(this.scale);


        // Se recolocan las filas para que las sillas esten por debajo de las 
        // mesas y las filas del fondo esten por debajo de las filas del frente
        this.row5Chairs.setDepth(1);
        this.row5Tables.setDepth(this.row5Chairs.depth + 1);

        this.row4Chairs.setDepth(this.row5Tables.depth + 1);
        this.row4Tables.setDepth(this.row4Chairs.depth + 1);

        this.row3Chairs.setDepth(this.row4Tables.depth + 1);
        this.row3Tables.setDepth(this.row3Chairs.depth + 1);

        this.row2Chairs.setDepth(this.row3Tables.depth + 1);
        this.row2Tables.setDepth(this.row2Chairs.depth + 1);

        this.row1Chairs.setDepth(this.row2Tables.depth + 1);
        this.row1Tables.setDepth(this.row1Chairs.depth + 1);
    }
}