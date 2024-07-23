
import BaseScene from './baseScene.js';

export default class BathroomBase extends BaseScene {
    /**
     * Escena base para los banos. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super(name);
    }
    
    create(params) {
        super.create(params);
        
        this.corridor = "";

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'bathroomBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        this.rightBound = bg.displayWidth;
    }
}