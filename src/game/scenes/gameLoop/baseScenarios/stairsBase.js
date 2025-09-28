import ConectadoBaseScene from "../../conectadoBaseScene.js";

export default class StairsBase extends ConectadoBaseScene {
    /**
    * Escena base para las escaleras del colegio. Coloca los elementos que se mantienen igual todos los dias
    * @extends ConectadoBaseScene
    * @param {String} name - id de la escena
    */
    constructor(name) {
        super(name);
    }

    create(params) {
        super.create(params);

        this.createBg("stairsBg");


        // Cartel de la pared
        this.signNode = this.localizationManager.readNodes(this, this.everydayNodes, "everydayDialog", "stairs.tag");

        this.wallSign = this.add.zone(2321 * this.bgScale, 650 * this.bgScale, 130 * this.bgScale, 78 * this.bgScale).setOrigin(0, 0);
        // Al hacer click en el cartel se muestra el dialogo que indica el texto escrito en el
        this.setInteractive("stairsSign", this.wallSign, () => {
            this.localizationManager.setNode(this.signNode);
        });


        // Puerta del despacho
        this.doorNode = this.localizationManager.readNodes(this, this.everydayNodes, "everydayDialog", "stairs.door");
        
        this.officeDoorClosed = this.add.image(2490 * this.bgScale, 273 * this.bgScale, "stairsDoorClosed").setOrigin(0, 0).setScale(this.bgScale);
        this.officeDoorOpened = this.add.image(2490 * this.bgScale, 273 * this.bgScale, "stairsDoorOpened").setOrigin(0, 0).setScale(this.bgScale);
        // Al hacer click en la puerta, se muestra el dialogo de no hay nadie en el despacho
        this.createToggle(this.officeDoorClosed, "officeDoorClosed", this.officeDoorOpened, "officeDoorOpened", false, () => {
            this.localizationManager.setNode(this.doorNode);
        });


        // Escaleras al patio
        this.playgroundNode = null;
        this.playgroundSceneName = "";
        
        this.playgroundStairs = this.add.zone(379 * this.bgScale, 711 * this.bgScale, 980 * this.bgScale, 600 * this.bgScale).setOrigin(0, 0);
        // Al hacer click sobre las escaleras de bajada, si hay algun dialogo que mostrar (para indicar que no se puede bajar), se
        // mostrara. En caso contrario, se pasara a la escena del patio con la camara a la derecha sin eliminar esta escena
        this.setInteractive("playgroundStairs", this.playgroundStairs, () => {
            if (this.playgroundNode) {
                this.localizationManager.setNode(this.playgroundNode);
            }
            else {
                let params = {
                    camPos: this.CAM_POS_RIGHT
                };
                this.gameManager.changeScene(this.playgroundSceneName, params, false, true);
            }
        });


        // Escaleras al pasillo
        this.corridorNode = null;
        this.corridorSceneName = "";

        this.corridorStairs = this.add.zone(1110 * this.bgScale, 60 * this.bgScale, 800 * this.bgScale, 770 * this.bgScale).setOrigin(0, 0);
        // Al hacer click sobre las escaleras de subida, si hay algun dialogo que mostrar (para indicar que no se puede subir), se
        // mostrara. En caso contrario, se pasara a la escena del pasillo sin eliminar esta escena
        this.setInteractive("corridorStairs", this.corridorStairs, () => {
            if (this.corridorNode) {
                this.localizationManager.setNode(this.corridorNode);
            }
            else {
                let params = {
                    camPos: this.CAM_POS_LEFT
                };
                this.gameManager.changeScene(this.corridorSceneName, params, false, true);
            }
        });
    }
}