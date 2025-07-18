import ConectadoBaseScene from "../../conectadoBaseScene.js";

export default class PlaygroundBase extends ConectadoBaseScene {
    /**
    * Escena base para el patio. Coloca los elementos que se mantienen igual todos los dias
    * @extends ConectadoBaseScene
    * @param {String} name - id de la escena
    */
    constructor(name) {
        super(name);
    }

    create(params) {
        super.create(params);

        this.createBg("playgroundBg");

        // Salida de la escuela
        this.homeNode = null;
        this.homeSceneName = "";

        this.schoolExit = this.add.zone(0, 913 * this.bgScale, 1140 * this.bgScale, 490 * this.bgScale).setOrigin(0, 0);
        // Al hacer click sobre la zona de salida si hay algun dialogo que mostrar (para indicar que no se puede salir), se
        // mostrara. En caso contrario, se pasara a la escena del salon con la camara a la izquierda y se eliminara esta escena
        this.setInteractive("schoolExit", this.schoolExit, () => {
            if (this.homeNode) {
                this.dialogManager.setNode(this.homeNode);
            }
            else {
                let params = {
                    nextScene: this.homeSceneName
                }
                this.gameManager.changeScene("BusScene", params);
            }
        });


        // Puertas del edificio
        this.doorNode = this.dialogManager.readNodes(this, this.everydayNodes, "everydayDialog", "playground.doorMorning");;
        this.stairsSceneName = "";

        this.schoolDoorClosed = this.add.zone(2640 * this.bgScale, 1060 * this.bgScale, 262, 186).setOrigin(0, 0);
        this.schoolDoorOpened = this.add.image(2631 * this.bgScale, 1045 * this.bgScale, "schoolDoorOpened").setOrigin(0, 0).setScale(this.bgScale);
        // Al hacer click sobre la puerta cerrada, se mostrara el dialogo que indica que no se puede pasar.
        this.setInteractive("schoolDoorClosed", this.schoolDoorClosed, () => {
            this.dialogManager.setNode(this.doorNode);
        });
        // Al hacer click sobre la puerta abierta, si hay algun dialogo que mostrar (para indicar que no se puede entrar), se
        // mostrara. En caso contrario, se pasara a la escena de las escaleras
        this.setInteractive("schoolDoorOpened", this.schoolDoorOpened, () => {
            if (!this.doorNode) {
                this.gameManager.changeScene(this.stairsSceneName, null, false, true);
            }
            else {
                this.dialogManager.setNode(this.doorNode);
            }
        });
        this.schoolDoorOpened.setVisible(false);
    }

    openDoors() {
        this.schoolDoorClosed.setVisible(false);
        this.schoolDoorOpened.setVisible(true);
        this.doorNode = null;
    }
}