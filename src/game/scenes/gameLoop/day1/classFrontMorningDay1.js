import ConectadoBaseScene from "../../conectadoBaseScene.js";
import ClassFrontBase from "../baseScenarios/classFrontBase.js";

export default class ClassFrontMorningDay1 extends ClassFrontBase {
    constructor() {
        super("ClassFrontMorningDay1");
    }

    create(params) {
        super.create(params);
        
        let namespace = "day1\\classFrontMorningDay1";

        let nodes = this.cache.json.get("classFrontMorningDay1");
        
        let teacher = this.createImageCharacter(0, 0, "teacherChar", "teacher", 0.087, this.INTERACTABLES_DEPTH);
        teacher.setPosition(-teacher.displayWidth * 2, -teacher.displayHeight * 2);

        // this.gameManager.blackboard.set("isLate", true);
        // Si no se ha llegado tarde, solo se coloca a Ana en clase
        if (!this.gameManager.blackboard.get("isLate")) {
            let anaNode = this.localizationManager.readNodes(this, nodes, namespace, "ana");
            let ana = this.createSpineCharacter(650, this.CANVAS_HEIGHT * 0.86, "Ana", () => {
                this.localizationManager.setNode(anaNode);
            }, 0.1, "IdleBase", this.row4Tables.depth);
        }
        // Si no, se colocan mas alumnos en la clase y se pone directamente el nodo del profesor
        else {
            this.add.image(160, this.CANVAS_HEIGHT * 0.51, this.atlasName, "frontChar3").setOrigin(0, 0).setScale(this.bgScale * 1.4).setDepth(this.row1Chairs.depth);
            this.add.image(680, this.CANVAS_HEIGHT * 0.55, this.atlasName, "frontChar2").setOrigin(0, 0).setScale(this.bgScale * 1.4).setDepth(this.row1Chairs.depth);
            this.add.image(1150, this.CANVAS_HEIGHT * 0.55, this.atlasName, "frontChar1").setOrigin(0, 0).setScale(this.bgScale * 1.4).setDepth(this.row1Chairs.depth);
            this.add.image(280, this.CANVAS_HEIGHT * 0.54, this.atlasName, "frontChar8").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row2Chairs.depth);
            this.add.image(720, this.CANVAS_HEIGHT * 0.54, this.atlasName, "frontChar10").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row2Chairs.depth);
            this.add.image(1060, this.CANVAS_HEIGHT * 0.54, this.atlasName, "frontChar11").setOrigin(0, 0).setScale(this.bgScale * 1.1).setDepth(this.row2Chairs.depth);
            this.add.image(1560, this.CANVAS_HEIGHT * 0.52, this.atlasName, "frontChar7").setOrigin(0, 0).setScale(-this.bgScale * 0.9, this.bgScale * 0.9).setDepth(this.row3Chairs.depth);
            this.add.image(1030, this.CANVAS_HEIGHT * 0.52, this.atlasName, "frontChar5").setOrigin(0, 0).setScale(this.bgScale * 0.8).setDepth(this.row3Chairs.depth);
            this.add.image(510, this.CANVAS_HEIGHT * 0.49, this.atlasName, "frontChar9").setOrigin(0, 0).setScale(this.bgScale * 0.76).setDepth(this.row4Chairs.depth);
            
            this.teacherNode = this.localizationManager.readNodes(this, nodes, namespace, "teacher");
            setTimeout(() => {
                this.localizationManager.setNode(this.teacherNode);
            }, 100);
        }


        // Evento llamado cuando terminan los dialogos y empieza la clase
        this.dispatcher.addOnce("startClass", this, (obj) => {
            let params = {
                text: this.localizationManager.translate(!this.gameManager.blackboard.get("isLate") ? 
                    "day1.startClass" : "day1.startClassLate", "transitionScenes"),
                onComplete: () => {
                    this.gameManager.changeScene("ClassBackMorningDay1", null, true);
                },
                onCompleteDelay: 500
            };
            this.gameManager.changeScene("TextOnlyScene", params, true);
        });
    }
}