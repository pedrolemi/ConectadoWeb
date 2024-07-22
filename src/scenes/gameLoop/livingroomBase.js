
import BaseScene from './baseScene.js';

export default class LivingroomBase extends BaseScene {
    /**
     * Escena base para la habitacion. Coloca los elementos comunes a
     * la habitacion de todos los dias (cama, puerta, mesa, armarios...)
     * @extends BaseScene
     * @param {String} name - id de la escena
     */
    constructor(name) {
        super(name);
    }

    // Metodo que se llama al terminar de crear la escena. 
    onCreate(params) {
        super.onCreate(params);

        this.phoneManager.topLid.visible = false;
        this.phoneManager.botLid.visible = false;
    }

    create(params) {
        super.create(params);

        this.bedroom = "";
        this.playground = "";

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'livingroomBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        this.rightBound = bg.displayWidth;

        // Puerta a la calle
        let playgroundDoorClosed = this.add.image(254 * this.scale - 1, 10 * this.scale - 1, 'living_playDoorClosed').setOrigin(0, 0).setScale(this.scale);
        let playgroundDoorOpened = this.add.image(254 * this.scale - 1, 10 * this.scale - 1, 'living_playDoorOpened').setOrigin(0, 0).setScale(this.scale);
        super.toggleDoor(playgroundDoorClosed, playgroundDoorOpened, false);


        // Puerta a la habitacion
        let bedroomDoorClosed = this.add.image(3958 * this.scale - 5, 175 * this.scale - 2, 'living_bedDoorClosed').setOrigin(0, 0).setScale(this.scale);
        let bedroomDoorOpened = this.add.image(3956 * this.scale - 4, 175 * this.scale - 2, 'living_bedDoorOpened').setOrigin(0, 0).setScale(this.scale);
        super.toggleDoor(bedroomDoorClosed, bedroomDoorOpened, false);


        this.playgroundNode = null;
        // Al hacer click sobre la puerta a la calle abierta, dependiendo de si se puede salir o
        // no, salta un dialogo o pasa a la siguiente escena sin poder regresar a esta escena 
        playgroundDoorOpened.on('pointerdown', () => {
            if (this.playgroundNode) {
                this.dialogManager.setNode(this.playgroundNode);
            }
            else {
                let params = {
                    left: true
                };
                this.gameManager.changeScene(this.playground, params);
            }
        });

        // Al hacer click sobre la puerta a la habitacion abierta, 
        // se pasa a la habitacion con la camara en la izquierda
        bedroomDoorOpened.on('pointerdown', () => {
            let params = {
                left: true
            };
            this.gameManager.changeScene(this.bedroom, params, true);
        });



    }
}
