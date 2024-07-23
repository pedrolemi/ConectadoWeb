
import BaseScene from './baseScene.js';

export default class LivingroomBase extends BaseScene {
    /**
     * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super(name);
    }

    create(params) {
        super.create(params);

        this.bedroom = "";
        this.playground = "";
        
        this.nextHour = "";

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'livingroomBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        this.rightBound = bg.displayWidth;

        // Puerta a la calle
        this.doorNode = null;
        this.canExit = false;
        let playgroundDoorClosed = this.add.image(254 * this.scale - 1, 10 * this.scale - 1, 'living_playDoorClosed').setOrigin(0, 0).setScale(this.scale);
        let playgroundDoorOpened = this.add.image(254 * this.scale - 1, 10 * this.scale - 1, 'living_playDoorOpened').setOrigin(0, 0).setScale(this.scale);
        // Al hacer click sobre la puerta abierta, si hay algun dialogo que mostrar (para indicar que no se puede salir), se 
        // mostrara. En caso contrario, se pasara a la escena del patio con la camara a la izquierda y se eliminara esta escena
        super.toggleDoor(playgroundDoorClosed, playgroundDoorOpened, () => {
            if (this.doorNode) {
                this.dialogManager.setNode(this.doorNode);
            }
            else {
                let params = {
                    camPos: "left"
                };
                this.gameManager.changeScene(this.playground, params);
            }
        }, false);


        // Puerta a la habitacion
        let bedroomDoorClosed = this.add.image(3958 * this.scale - 5, 175 * this.scale - 2, 'living_bedDoorClosed').setOrigin(0, 0).setScale(this.scale);
        let bedroomDoorOpened = this.add.image(3956 * this.scale - 4, 175 * this.scale - 2, 'living_bedDoorOpened').setOrigin(0, 0).setScale(this.scale);
        // Al hacer click sobre la puerta abierta, se pasa a la habitacion con la camara en la izquierda
        super.toggleDoor(bedroomDoorClosed, bedroomDoorOpened, () => {  
            let params = {
                camPos: "left"
            };
            this.gameManager.changeScene(this.bedroom, params, true);
        }, false);

    }


}
