
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

    create(params) {
        super.create(params);

        this.livingroom = "";

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'bedroomBg').setOrigin(0, 0);
        this.scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(this.scale);

        this.rightBound = bg.displayWidth;

        // Puerta del armario individual
        let door1Closed = this.add.image(2190 * this.scale, 330 * this.scale, 'wardrobeDoor1Closed').setOrigin(0, 0).setScale(this.scale);
        let door1Opened = this.add.image(2110 * this.scale, 330 * this.scale, 'wardrobeDoor1Opened').setOrigin(0, 0).setScale(this.scale);
        super.toggleDoor(door1Closed, door1Opened);

        // Puerta izquierda del armario
        let door2Closed = this.add.image(2500 * this.scale, 330 * this.scale, 'wardrobeDoor2Closed').setOrigin(0, 0).setScale(this.scale);
        let door2Opened = this.add.image(2435 * this.scale, 307 * this.scale, 'wardrobeDoor2Opened').setOrigin(0, 0).setScale(this.scale);
        super.toggleDoor(door2Closed, door2Opened);

        // Puerta derecha del armario
        let door3Closed = this.add.image(3155 * this.scale, 330 * this.scale, 'wardrobeDoor3Closed').setOrigin(1, 0).setScale(this.scale);
        let door3Opened = this.add.image(3220 * this.scale, 330 * this.scale, 'wardrobeDoor3Opened').setOrigin(1, 0).setScale(this.scale);
        super.toggleDoor(door3Closed, door3Opened);


        // Interior de los armarios. Se reordenan las profundidades de las puertas de los armarios
        // para hacer click sobre el elemento correcto. Al hacer click sobre el interior del armario,
        // se cambia el nodo en el dialogManager. El nodo que se pone es nulo por defecto, y se tiene
        // que establecer en la creacion de la escena 
        this.wardrobe1Node = null;
        this.wardrobe2Node = null;

        let wardrobe1 = this.add.rectangle(door1Closed.x, door1Closed.y, door1Closed.displayWidth, door1Closed.displayHeight, 0xfff, 0).setOrigin(0, 0);
        door1Closed.setDepth(bg.depth + 3);
        door1Opened.setDepth(door1Closed.depth - 1);
        wardrobe1.setDepth(door1Opened.depth - 1);
        wardrobe1.setInteractive();
        wardrobe1.on('pointerdown', () => {
            if (door1Opened.visible) {
                this.dialogManager.setNode(this.wardrobe1Node)
            }
        });

        let wardrobe2 = this.add.rectangle(door2Closed.x, door2Closed.y, door2Closed.displayWidth + door3Closed.displayWidth - 15, door1Closed.displayHeight, 0xfff, 0).setOrigin(0, 0);
        door2Closed.setDepth(bg.depth + 4);
        door2Opened.setDepth(door2Closed.depth - 1);
        door3Closed.setDepth(bg.depth + 3);
        door3Opened.setDepth(door2Closed.depth - 1);
        wardrobe2.setDepth(door2Opened.depth - 1);
        wardrobe2.setInteractive();
        wardrobe2.on('pointerdown', () => {
            if (door2Opened.visible || door3Opened.visible) {
                this.dialogManager.setNode(this.wardrobe2Node)
            }
        })


        // Ordenador
        // Al hacer click sobre el, se cambia el nodo en el dialogManager, y si
        // se lanza el evento turnPC, se cambia a la escena del ordenador
        this.pcNode = null;

        let pc = this.add.rectangle(276, 360, 150, 162, 0xfff, 0).setOrigin(0, 0);
        pc.setInteractive();
        pc.on('pointerdown', () => {
            this.dialogManager.setNode(this.pcNode);
        });
        this.dispatcher.add("turnPC", this, (obj) => {
            this.gameManager.switchToComputer();
        });

        // Silla
        this.chair = this.add.image(770 * this.scale, 859 * this.scale, 'bedroomChair').setOrigin(0, 0).setScale(this.scale);

        // Puerta de la habitacion
        let doorClosed = this.add.image(6, this.CANVAS_HEIGHT, 'bed_livingDoorClosed').setOrigin(0, 1).setScale(this.scale);
        let doorOpened = this.add.image(6, this.CANVAS_HEIGHT, 'bed_livingDoorOpened').setOrigin(0, 1).setScale(this.scale);
        super.toggleDoor(doorClosed, doorOpened, false);

        // Al hacer click sobre la puerta abierta, se 
        // pasa al salon con la camara en la derecha
        doorOpened.on('pointerdown', () => {
            let params = {
                left: false
            };
            this.gameManager.changeScene(this.livingroom, params, true);
        });


        // Cama
        // Al igual que con el interior de los armarios, se recoloca su profundidad y al
        // hacer click sobre ella, se cambia el nodo en el dialogManager
        this.bed = this.add.image(bg.displayWidth, this.CANVAS_HEIGHT, 'bed').setOrigin(1, 1).setScale(this.scale);
        this.bed.setInteractive();
        this.bed.setDepth(10);
        this.bedNode = null;
        this.bed.on('pointerdown', () => {
            this.dialogManager.setNode(this.bedNode)
        })


        this.gameManager.setValue(this.gameManager.bagPicked, false);

    }
}
