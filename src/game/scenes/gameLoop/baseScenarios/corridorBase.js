import ConectadoBaseScene from "../../conectadoBaseScene.js";

export default class CorridorBase extends ConectadoBaseScene {
    /**
    * Escena base para el pasillo del colegio. Coloca los elementos que se mantienen igual todos los dias
    * @extends ConectadoBaseScene
    * @param {String} name - id de la escena
    */
    constructor(name) {
        super(name, "corridor");
    }

    create(params) {
        super.create(params);

        this.createBg("corridorBg");


        // Puerta a las escaleras
        this.stairsNode = null;
        this.stairsSceneName = "";

        this.stairsDoor = this.add.zone(844 * this.bgScale, 687 * this.bgScale, 286 * this.bgScale, 290 * this.bgScale).setOrigin(0, 0);
        // Al hacer click, si hay algun dialogo que mostrar (para indicar que no se puede salir), se
        // mostrara. En caso contrario, se pasara a la escena de las escaleras sin eliminar esta escena
        this.setInteractive("stairsDoor", this.stairsDoor, () => {
            if (this.stairsNode) {
                this.dialogManager.setNode(this.stairsNode);
            }
            else {
                this.gameManager.changeScene(this.stairsSceneName, null, false, true);
            }
        });
        

        // Banos
        this.oppositeRestroomNode = this.dialogManager.readNodes(this, this.everydayNodes, "everydayDialog", "corridor.restroom");
        this.restroomSceneName = "RestroomBase";
        this.oppositeRestroomSceneName = "OppositeRestroom";
        
        // Puerta al bano de los chicos
        this.boysRestroomDoorClosed = this.add.image(1485 * this.bgScale, 596 * this.bgScale, this.atlasName, "boysDoorClosed").setOrigin(0, 0).setScale(this.bgScale);
        this.boysRestroomDoorOpened = this.add.image(1485 * this.bgScale, 596 * this.bgScale, this.atlasName, "boysDoorOpened").setOrigin(0, 0).setScale(this.bgScale);
        // Al hacer click, si hay algun dialogo que mostrar (para indicar que no se puede entrar), se
        // mostrara. En caso contrario, se pasara a la escena del bano sin eliminar esta escena
        this.createToggle(this.boysRestroomDoorClosed, "boysRestroomDoorClosed", this.boysRestroomDoorOpened, "boysRestroomDoorOpened", false, () => {
            if (this.gameManager.blackboard.get("gender") == "female") {
                this.dialogManager.setNode(this.oppositeRestroomNode);
            }
            else {
                let params = {
                    camPos: ConectadoBaseScene.CAM_POS_LEFT,
                    corridor: this.scene.key
                }
                this.gameManager.changeScene(this.restroomSceneName, params, false, true);
            }
        });

        // Puerta del bano de las chicas
        this.girlsRestroomDoorClosed = this.add.image(1361 * this.bgScale, 636 * this.bgScale, this.atlasName, "girlsDoorClosed").setOrigin(0, 0).setScale(this.bgScale);
        this.girlsRestroomDoorOpened = this.add.image(1361 * this.bgScale, 636 * this.bgScale, this.atlasName, "girlsDoorOpened").setOrigin(0, 0).setScale(this.bgScale);
        // Al hacer click, si hay algun dialogo que mostrar (para indicar que no se puede entrar), se
        // mostrara. En caso contrario, se pasara a la escena del bano sin eliminar esta escena
        this.createToggle(this.girlsRestroomDoorClosed, "girlsRestroomDoorClosed", this.girlsRestroomDoorOpened, "girlsRestroomDoorOpened", false, () => {
            if (this.gameManager.blackboard.get("gender") == "male") {
                this.dialogManager.setNode(this.oppositeRestroomNode);
            }
            else {
                let params = {
                    camPos: ConectadoBaseScene.CAM_POS_LEFT,
                    corridor: this.scene.key
                }
                this.gameManager.changeScene(this.restroomSceneName, params, false, true);
            }
        });


        // Puerta de la clase
        this.classNode = null;
        this.classSceneName = "";

        this.classDoorClosed = this.add.image(109 * this.bgScale, 341 * this.bgScale, this.atlasName, "classDoorClosed").setOrigin(0, 0).setScale(this.bgScale);
        this.classDoorOpened = this.add.image(109 * this.bgScale, 341 * this.bgScale, this.atlasName, "classDoorOpened").setOrigin(0, 0).setScale(this.bgScale);
        // Al hacer click, si hay algun dialogo que mostrar, se mostrara. 
        // En caso contrario, se pasara a la escena de la clase y se borrara esta escena
        this.createToggle(this.classDoorClosed, "classDoorClosed", this.classDoorOpened, "classDoorOpened", false, () => {
            if (this.classNode) {
                this.dialogManager.setNode(this.classNode);
            }
            else {
                let params = {
                    camPos: ConectadoBaseScene.CAM_POS_LEFT,
                }
                this.gameManager.changeScene(this.classSceneName, params, false);
            }
        });


        // Evento llamado cuando se elige volver a entrar en clase
        this.dispatcher.addOnce("endBreak", this, () => {
            let params = {
                text: this.localizationManager.translate("day" + this.gameManager.day + ".endBreak", "transitionScenes"),
                onComplete: () => {
                    this.gameManager.changeScene(this.classSceneName, { camPos: ConectadoBaseScene.CAM_POS_RIGHT});
                },
                onCompleteDelay: 500
            };
            
            // Se cambia a la escena de transicion
            this.gameManager.changeScene("TextOnlyScene", params);
        });

        // Evento llamado cuando se elige entrar al bano opuesto
        this.dispatcher.add("enterRestroom", this, () => {
            let params = {
                camPos: ConectadoBaseScene.CAM_POS_RIGHT,
                corridor: this.scene.key
            }
            this.gameManager.changeScene(this.oppositeRestroomSceneName, params, false, true);
        });
    }
}