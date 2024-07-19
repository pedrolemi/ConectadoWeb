
import BaseScene from './baseScene.js';

export default class BedroomBase extends BaseScene {
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
    onCreate() {
        super.onCreate();
        this.phoneManager.topLid.visible = false;
        this.phoneManager.botLid.visible = false;
    }

    create() {
        super.create();

        this.nexScene = "";

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'bedroomBg').setOrigin(0, 0);
        let scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(scale);

        this.rightBound = bg.displayWidth;
        
        // Puerta del armario individual
        let door1Closed = this.add.image(2190 * scale, 330 * scale, 'wardrobeDoor1Closed').setOrigin(0, 0).setScale(scale);
        let door1Opened = this.add.image(2110 * scale, 330 * scale, 'wardrobeDoor1Opened').setOrigin(0, 0).setScale(scale);
        super.toggleDoor(door1Closed, door1Opened);

        // Puerta izquierda del armario
        let door2Closed = this.add.image(2500 * scale, 330 * scale, 'wardrobeDoor2Closed').setOrigin(0, 0).setScale(scale);
        let door2Opened = this.add.image(2435 * scale, 307 * scale, 'wardrobeDoor2Opened').setOrigin(0, 0).setScale(scale);
        super.toggleDoor(door2Closed, door2Opened);

        // Puerta derecha del armario
        let door3Closed = this.add.image(3155 * scale, 330 * scale, 'wardrobeDoor3Closed').setOrigin(1, 0).setScale(scale);
        let door3Opened = this.add.image(3220 * scale, 330 * scale, 'wardrobeDoor3Opened').setOrigin(1, 0).setScale(scale);
        super.toggleDoor(door3Closed, door3Opened);

        // Puerta de la habitacion
        let doorClosed = this.add.image(6, this.CANVAS_HEIGHT, 'bedroomDoorClosed').setOrigin(0, 1).setScale(scale);
        let doorOpened = this.add.image(6, this.CANVAS_HEIGHT, 'bedroomDoorOpened').setOrigin(0, 1).setScale(scale);
        super.toggleDoor(doorClosed, doorOpened, false);

        // Al hacer click sobre la puerta abierta, se pasa a la siguiente escena
        doorOpened.on('pointerdown', () => {
            this.gameManager.changeScene(this.nexScene);
        });
        
        // Cama
        this.bed = this.add.image(bg.displayWidth, this.CANVAS_HEIGHT, 'bed').setOrigin(1, 1).setScale(scale);
        this.bed.setInteractive();

        
        this.cameras.main.scrollX = bg.displayWidth - this.CANVAS_WIDTH;

    }

    toggleDoor(closed, opened, click = true) {
        closed.setInteractive();
        opened.setInteractive();

        opened.visible = false;
        let openEvt = 'pointerdown';
        let closeEvt = 'pointerdown';

        if (!click) {
            openEvt = 'pointerover';
            closeEvt = 'pointerout';
        }

        closed.on(openEvt, () => {
            closed.visible = false;
            opened.visible = true;
        });
        opened.on(closeEvt, () => {
            opened.visible = false;
            closed.visible = true;
        });
    }
}
