import ConectadoBaseScene from "../../conectadoBaseScene.js";
import CorridorBase from "../baseScenarios/corridorBase.js";

export default class CorridorMorningDay1 extends CorridorBase {
    constructor() {
        super("CorridorMorningDay1");
    }

    create(params) {
        super.create(params);

        this.stairsSceneName = "StairsMorningDay1";
        this.classSceneName = "ClassFrontMorningDay1";

        let namespace = "day1\\corridorMorningDay1";

        let nodes = this.cache.json.get("corridorMorningDay1");
        
        // Si no se llega tarde, se colocan personajes de fondo
        if (!this.gameManager.blackboard.get("isLate")) {
            let mariaNode = this.localizationManager.readNodes(this, nodes, namespace, "maria");
            let maria = this.createSpineCharacter(250, this.CANVAS_HEIGHT * 0.75, "Maria", () => {
                this.localizationManager.setNode(mariaNode);
            }, 0.087, "IdleBase", this.INTERACTABLES_DEPTH);

            let alisonNode = this.localizationManager.readNodes(this, nodes, namespace, "alison");
            let alison = this.createSpineCharacter(this.rightBound * 0.60, this.CANVAS_HEIGHT * 0.75, "Alison", () => {
                this.localizationManager.setNode(alisonNode);
            }, 0.083, "IdleBase", this.INTERACTABLES_DEPTH);

            let guilleNode = this.localizationManager.readNodes(this, nodes, namespace, "guille");
            let guille = this.createSpineCharacter(this.rightBound * 0.76, this.CANVAS_HEIGHT * 0.93, "Guille", () => {
                this.localizationManager.setNode(guilleNode);
            }, 0.15, "IdleBase", this.INTERACTABLES_DEPTH);
        }
    }
}