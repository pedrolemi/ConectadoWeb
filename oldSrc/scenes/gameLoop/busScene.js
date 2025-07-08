import BaseScene from './baseScene.js';

export default class BusScene extends BaseScene {
    /**
     * Escena para las transiciones entre la casa y la escuela 
     * @extends Phaser.Scene
     */
    constructor() {
        super('BusScene');
    }

    /**
     * Crear los elementos de la escena
     * 
     * @param {Object} params - parametros de la escena. Debe contener nextScene y duration como parametro opcional
     */
    create(params) {
        super.create(params);

        // Hace invisible el UIManager entero
        this.scene.setVisible(false, this.UIManager);

        let duration = 1500;
        let nextScene = "";
        
        if (params.duration) {
            duration = params.duration;
        }
        if (params.nextScene) {
            nextScene = params.nextScene;
        }

        this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0x2B9E9E, 1).setOrigin(0, 0);        
        let bus = this.add.sprite(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT /2, 'autobus').setOrigin(0.5, 0.5);
        bus.play('moving');
        
        // Inicia un temporizador y cuando acabe, pasara a la proxima escena
        setTimeout(() => {
            this.scene.setVisible(true, this.UIManager);
            // La proxima escena sera el salon o el patio, y ambas escenas comienzan 
            // desde la izquierda tanto al llegar a casa como al llegar al colegio
            let nextParams = {
                camPos: "left"
            };
            
            this.gameManager.changeScene(nextScene, nextParams);
        }, duration);

    }

}