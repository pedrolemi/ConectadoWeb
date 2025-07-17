import ConectadoBaseScene from "../../conectadoBaseScene.js";

export default class LivingroomBase extends ConectadoBaseScene {
    /**
    * Escena base para el salon. Coloca los elementos que se mantienen igual todos los dias
    * @extends BaseScene
    * @param {String} name - id de la escena
    */
    constructor(name) {
        super(name, "livingroom");
    }

    create(params) {
        super.create(params);

        this.createBg("livingroomBg");

        // Nombre de la escena del salon correspondiente a la escena de la habitacion 
        this.bedroomSceneName = "";
        
        // Escala puesta a mano. La imagen original tenia otras dimensiones, pero debido a su gran
        // tamano, no es posible cargarla en dispositivos moviles, por lo que se ha reducido 
        this.bgScale = this.CANVAS_HEIGHT / 1500;


        // Puerta de la habitacion
        this.bedroomDoorClosed = this.add.image(3958 * this.bgScale - 5, 175 * this.bgScale - 2, this.atlasName, "bedroomDoorClosed").setOrigin(0, 0).setScale(this.bgScale);
        this.bedroomDoorOpened = this.add.image(3956 * this.bgScale - 4, 175 * this.bgScale - 2, this.atlasName, "bedroomDoorOpened").setOrigin(0, 0).setScale(this.bgScale);

        // Al pulsar la puerta de la habitacion, se cambia a la escena de la habitacion con la camara a la izquierda
        this.createToggle(this.bedroomDoorClosed, "bedroomDoorClosed", this.bedroomDoorOpened, "bedroomDoorOpened", false, () => {
            let params = {
                camPos: ConectadoBaseScene.CAM_POS_LEFT
            };
            this.gameManager.changeScene(this.bedroomSceneName, params, false, true);
        });


        // Puerta de la calle
        this.doorNode = null;
        this.playgroundSceneName = "";
        
        this.exitDoorClosed = this.add.image(254 * this.bgScale - 4, 10 * this.bgScale - 4, this.atlasName, "livingroomDoorClosed").setOrigin(0, 0).setScale(this.bgScale);
        this.exitDoorOpened = this.add.image(254 * this.bgScale - 4, 10 * this.bgScale - 4, this.atlasName, "livingroomDoorOpened").setOrigin(0, 0).setScale(this.bgScale);

        // Al pulsar la puerta de la calle, se cambia a la escena del patio con la camara a la izquierda
        this.createToggle(this.exitDoorClosed, "exitDoorClosed", this.exitDoorOpened, "exitDoorOpened", false, () => {
            if (this.doorNode) {
                this.dialogManager.setNode(this.doorNode);
            }
            else {
                let params = {
                    nextScene: this.playgroundSceneName
                };
                this.gameManager.changeScene("BusScene", params, false);
            }
        });


        // Se comprueba si no se ha cogido la mochila. Si no se ha cogido, se pone el dialogo en la puerta
        if (!this.gameManager.blackboard.get("bagPicked")) {
            this.doorNode = this.dialogManager.readNodes(this, this.everydayNodes, "everydayDialog", "livingroom.doorMorning");
        }

        // Suscripcion al evento de coger la mochila por si no se 
        // coge antes de salir de la habitacion por primera vez
        this.dispatcher.addOnce("pickBag", this, () => {
            this.doorNode = null;
        });

        // Suscripcion al evento de modificar la amistad. Se llama cuando se le cuenta a los padres 
        // algo de la escuela, e impide que les baje la amistad si se elige la opcion de no contarles 
        // nada en la primera tanda de opciones si se les habla de las cosas que han ocurrido
        this.dispatcher.addOnce("changeFriendship", this, () => {
            this.blackboard.set("canIgnore", false);
        });
    }
}