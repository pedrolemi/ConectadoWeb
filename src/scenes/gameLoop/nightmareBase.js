
import BaseScene from './baseScene.js';

export default class NightmareBase extends BaseScene {
    /**
     * Escena base para los banos. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super(name, 'nightmaresElements');
    }

    create(params) {
        super.create(params);

        // Se oculta el telefono y el icono
        this.phoneManager.activate(false);

        // Se coloca la imagen del fondo centrada con el tam del canvas
        let bg = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, 'nightmaresBg').setOrigin(0.5);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        // No se puede hacer scroll
        this.rightBound = this.CANVAS_WIDTH;
    }
}