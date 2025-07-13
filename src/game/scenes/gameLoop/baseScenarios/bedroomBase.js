import ConectadoBaseScene from "../../conectadoBaseScene.js";

export default class BedroomBase extends ConectadoBaseScene {
    /**
    * Escena base para la habitacion. Coloca los elementos que se mantienen igual todos los dias
    * @extends BaseScene
    * @param {String} name - id de la escena
    */
    constructor(name) {
        super(name, "bedroom");
    }

    create(params) {
        super.create(params);

        this.livingroomScene = "";

        this.createBg("bedroomBg", 0, 0, 0, 0);
        this.rightBound = this.bg.displayWidth;


        // Puerta del armario individual
        this.smallDoorClosed = this.add.image(2190 * this.bgScale, 330 * this.bgScale, this.atlasName, 'wardrobeDoor1Closed').setOrigin(0, 0).setScale(this.bgScale);
        this.smallDoorOpened = this.add.image(2110 * this.bgScale, 330 * this.bgScale, this.atlasName, 'wardrobeDoor1Opened').setOrigin(0, 0).setScale(this.bgScale);
        this.setInteractive("bedroomSmallDoorClosed", this.smallDoorClosed);
        this.setInteractive("bedroomSmallDoorOpened", this.smallDoorOpened);
        this.createToggle(this.smallDoorClosed, this.smallDoorOpened, true);

        // Puerta izquierda del armario
        this.leftDoorClosed = this.add.image(2500 * this.bgScale, 330 * this.bgScale, this.atlasName, 'wardrobeDoor2Closed').setOrigin(0, 0).setScale(this.bgScale);
        this.leftDoorOpened = this.add.image(2435 * this.bgScale, 307 * this.bgScale, this.atlasName, 'wardrobeDoor2Opened').setOrigin(0, 0).setScale(this.bgScale);
        this.setInteractive("bedroomLeftDoorClosed", this.leftDoorClosed);
        this.setInteractive("bedroomLeftDoorOpened", this.leftDoorOpened);
        this.createToggle(this.leftDoorClosed, this.leftDoorOpened, true);

        // Puerta derecha del armario
        this.rightDoorClosed = this.add.image(3155 * this.bgScale, 330 * this.bgScale, this.atlasName, 'wardrobeDoor3Closed').setOrigin(1, 0).setScale(this.bgScale);
        this.rightDoorOpened = this.add.image(3220 * this.bgScale, 330 * this.bgScale, this.atlasName, 'wardrobeDoor3Opened').setOrigin(1, 0).setScale(this.bgScale);
        this.setInteractive("bedroomLeftDoorClosed", this.leftDoorClosed);
        this.setInteractive("bedroomLeftDoorOpened", this.leftDoorOpened);
        this.createToggle(this.rightDoorClosed, this.rightDoorOpened, true);


        // Interior de los armarios. Se reordenan las profundidades de las puertas de los armarios
        // para hacer click sobre el elemento correcto. Al hacer click sobre el interior del armario,
        // se cambia el nodo en el dialogManager. El nodo que se pone es nulo por defecto, y se tiene
        // que establecer en la creacion de la escena 
        this.smallWardrobeNode = null;
        this.bigWardrobeNode = null;

        this.smallWardrobeInside = this.add.rectangle(this.smallDoorClosed.x, this.smallDoorClosed.y, this.smallDoorClosed.displayWidth, this.smallDoorClosed.displayHeight, 
            0xfff, 1).setOrigin(0, 0);
        this.smallDoorClosed.setDepth(this.bg.depth + 3);
        this.smallDoorOpened.setDepth(this.smallDoorClosed.depth - 1);
        this.smallWardrobeInside.setDepth(this.smallDoorOpened.depth - 1);
        this.setInteractive("bedroomSmallWardrobe", this.smallWardrobeInside, () => {
            this.dialogManager.setNode(this.smallWardrobeNode);
        });

        // this.bigWardrobeInside = this.add.rectangle(door2Closed.x, door2Closed.y, door2Closed.displayWidth + door3Closed.displayWidth - 15, this.smallDoorClosed.displayHeight, 0xfff, 0).setOrigin(0, 0);
        // door2Closed.setDepth(this.bg.depth + 4);
        // door2Opened.setDepth(door2Closed.depth);
        // door3Closed.setDepth(this.bg.depth + 4);
        // door3Opened.setDepth(door2Closed.depth);
        // wardrobe2.setInteractive();
        // wardrobe2.on('pointerdown', () => {
        //     if (door2Opened.visible || door3Opened.visible) {
        //         this.dialogManager.setNode(this.bigWardrobeNode)
        //     }
        // })


        // // Ordenador
        // let nodes = this.cache.json.get('everydayDialog');
        // this.pcNode = super.readNodes(nodes, "everydayDialog", "bedroom.pc", true);
        // let pc = this.add.zone(276, 360, 150, 162).setOrigin(0, 0);
        // pc.setInteractive({ useHandCursor: true });
        // // Al hacer click sobre el, se cambia el nodo en el dialogManager, y si
        // // se lanza el evento turnPC, se cambia a la escena del ordenador
        // pc.on('pointerdown', () => {
        //     this.dialogManager.setNode(this.pcNode);
        // });
        // this.dispatcher.add("turnPC", this, (obj) => {
        //     this.gameManager.switchToComputer();
        // });

        // // Silla
        // this.chair = this.add.image(770 * this.bgScale, 859 * this.bgScale, this.atlasName, 'bedroomChair').setOrigin(0, 0).setScale(this.bgScale);

        // // Puerta de la habitacion
        // let doorClosed = this.add.image(6, this.CANVAS_HEIGHT, this.atlasName, 'bedroomDoorClosed').setOrigin(0, 1).setScale(this.bgScale);
        // let doorOpened = this.add.image(6, this.CANVAS_HEIGHT, this.atlasName, 'bedroomDoorOpened').setOrigin(0, 1).setScale(this.bgScale);
        // // Al hacer click sobre la puerta abierta, se pasa al salon con la camara en la derecha
        // super.toggleDoor(doorClosed, doorOpened, () => {
        //     let params = {
        //         camPos: "right"
        //     };
        //     this.gameManager.changeScene(this.livingroom, params, true);
        // }, false);


        // // Cama
        // // Al igual que con el interior de los armarios, se recoloca su profundidad 
        // // y al hacer click sobre ella, se cambia el nodo en el dialogManager
        // this.bed = this.add.image(this.bg.displayWidth, this.CANVAS_HEIGHT, this.atlasName, 'bed').setOrigin(1, 1).setScale(this.bgScale);
        // this.bed.setInteractive({ useHandCursor: true });
        // this.bed.setDepth(10);
        // this.bedNode = null;
        // this.bed.on('pointerdown', () => {
        //     this.dialogManager.setNode(this.bedNode);
        // })

        // // Evento que se llama al elegir dormir. Hace la animacion de cerrar 
        // // los ojos y cuando acaba pasa a la pesadilla del dia correspondiente
        // this.dispatcher.addOnce("sleep", this, (obj) => {
        //     this.phoneManager.topLid.visible = true;
        //     this.phoneManager.botLid.visible = true;
        //     this.phoneManager.topLid.y = -this.CANVAS_HEIGHT / 2;
        //     this.phoneManager.botLid.y = this.CANVAS_HEIGHT;
        //     let anim = this.phoneManager.closeEyesAnimation(false);

        //     anim.on('complete', () => {
        //         setTimeout(() => {
        //             this.phoneManager.bgBlock.disableInteractive();
        //             let nightmareScene = "NightmareDay" + this.gameManager.day;
        //             this.gameManager.changeScene(nightmareScene);
        //         }, 1000);
        //     })
        // });        
    }
}
