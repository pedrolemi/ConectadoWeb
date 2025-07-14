import ConectadoBaseScene from "../../conectadoBaseScene.js";
import ConectadoEventNames from "../../../eventNames.js";

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

        this.createBg("bedroomBg", 0, 0, 0, 0);
        this.rightBound = this.bg.displayWidth;


        // Puerta del armario individual
        this.smallDoorClosed = this.add.image(2190 * this.bgScale, 330 * this.bgScale, this.atlasName, "wardrobeDoor1Closed").setOrigin(0, 0).setScale(this.bgScale);
        this.smallDoorOpened = this.add.image(2110 * this.bgScale, 330 * this.bgScale, this.atlasName, "wardrobeDoor1Opened").setOrigin(0, 0).setScale(this.bgScale);
        this.createToggle(this.smallDoorClosed, "bedroomSmallDoorClosed", this.smallDoorOpened, "bedroomSmallDoorOpened", true);

        // Puerta izquierda del armario
        this.leftDoorClosed = this.add.image(2500 * this.bgScale, 330 * this.bgScale, this.atlasName, "wardrobeDoor2Closed").setOrigin(0, 0).setScale(this.bgScale);
        this.leftDoorOpened = this.add.image(2435 * this.bgScale, 307 * this.bgScale, this.atlasName, "wardrobeDoor2Opened").setOrigin(0, 0).setScale(this.bgScale);
        this.createToggle(this.leftDoorClosed, "bedroomLeftDoorClosed", this.leftDoorOpened, "bedroomLeftDoorOpened", true);

        // Puerta derecha del armario
        this.rightDoorClosed = this.add.image(3155 * this.bgScale, 330 * this.bgScale, this.atlasName, "wardrobeDoor3Closed").setOrigin(1, 0).setScale(this.bgScale);
        this.rightDoorOpened = this.add.image(3220 * this.bgScale, 330 * this.bgScale, this.atlasName, "wardrobeDoor3Opened").setOrigin(1, 0).setScale(this.bgScale);
        this.createToggle(this.rightDoorClosed, "bedroomRightDoorClosed", this.rightDoorOpened, "bedroomRightDoorOpened", true);


        // Interior de los armarios. Al hacer click sobre el interior del armario, se cambia el nodo en el dialogManager. 
        // El nodo que se pone es nulo por defecto, y se tiene que establecer en la creacion de la escena heredada 
        this.smallWardrobeNode = null;
        this.bigWardrobeNode = null;

        this.smallWardrobeInside = this.add.zone(this.smallDoorClosed.x, this.smallDoorClosed.y, this.smallDoorClosed.displayWidth, this.smallDoorClosed.displayHeight).setOrigin(0, 0);
        this.setInteractive("bedroomSmallWardrobe", this.smallWardrobeInside, () => {
            this.dialogManager.setNode(this.smallWardrobeNode);
        });

        this.bigWardrobeInside = this.add.zone(this.leftDoorClosed.x, this.leftDoorClosed.y, this.leftDoorClosed.displayWidth + this.rightDoorClosed.displayWidth - 15, 
            this.smallDoorClosed.displayHeight).setOrigin(0, 0);
        this.setInteractive("bedroomBigWardrobe", this.bigWardrobeInside, () => {
            this.dialogManager.setNode(this.bigWardrobeNode);
        });


        // Ordenador
        this.pcNode = this.dialogManager.readNodes(this, this.everydayNodes, "everydayDialog", "bedroom.pc");

        // Al hacer click sobre el, se cambia el nodo en el dialogManager, y si se lanza el evento turnPC, se cambia a la escena del ordenador
        this.pc = this.add.zone(276, 360, 150, 162).setOrigin(0, 0);
        this.setInteractive("bedroomPC", this.pc, () => {
            this.dialogManager.setNode(this.pcNode);
        });
        this.dispatcher.add("turnPC", this, (obj) => {
            this.gameManager.startComputer();
        });

        
        // Silla
        this.chair = this.add.image(770 * this.bgScale, 859 * this.bgScale, this.atlasName, "bedroomChair").setOrigin(0, 0).setScale(this.bgScale);


        // Nombre de la escena del salon correspondiente a la escena de la habitacion 
        this.livingroomSceneName = "";
        
        // Puerta de la habitacion
        this.livingroomDoorClosed = this.add.image(6, this.CANVAS_HEIGHT, this.atlasName, "bedroomDoorClosed").setOrigin(0, 1).setScale(this.bgScale);
        this.livingroomDoorOpened = this.add.image(6, this.CANVAS_HEIGHT, this.atlasName, "bedroomDoorOpened").setOrigin(0, 1).setScale(this.bgScale);

        // Al pulsar la puerta de la habitacion, se cambia a la escena del salon con la camara a la derecha
        this.createToggle(this.livingroomDoorClosed, "livingroomDoorClosed", this.livingroomDoorOpened, "livingroomDoorOpened", false, () => {
            let params = {
                camPos: ConectadoBaseScene.CAM_POS_RIGHT
            };
            this.gameManager.changeScene(this.livingroomSceneName, params, false, true);
        });


        // Cama
        this.bedNode = this.dialogManager.readNodes(this, this.everydayNodes, "everydayDialog", "bedroom.bedAfternoon");

        // Al hacer click sobre ella, se cambia el nodo en el dialogManager
        this.bed = this.add.image(this.bg.displayWidth, this.CANVAS_HEIGHT, this.atlasName, "bed").setOrigin(1, 1).setScale(this.bgScale);
        this.setInteractive("bedroomBed", this.bed, () => {
            this.dialogManager.setNode(this.bedNode);
        });
        // Se recoloca para que este por encima de los armarios
        this.bed.setDepth(this.TOGGLES_DEPTH + 1);

        // Evento que se llama al elegir dormir
        this.dispatcher.addOnce("sleep", this, (obj) => {
            // Se suscribe al evento de cerrar los ojos para que cuando acabe la animacion se pase a la pesadilla del dia correspondiente
            this.dispatcher.addOnce(ConectadoEventNames.eyesClosed, this, (obj) => {
                setTimeout(() => {
                    this.gameManager.changeScene("NightmareDay" + this.gameManager.day, null, true);
                }, 1000);
            });
        });
    }
}
