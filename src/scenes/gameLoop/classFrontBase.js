
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
    }
}