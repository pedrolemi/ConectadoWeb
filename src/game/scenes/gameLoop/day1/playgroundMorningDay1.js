import ConectadoBaseScene from "../../conectadoBaseScene.js";
import PlaygroundBase from "../baseScenarios/playgroundBase.js";

export default class PlaygroundMorningDay1 extends PlaygroundBase {
    constructor() {
        super("PlaygroundMorningDay1");
    }

    create(params) {
        super.create(params);

        this.stairsSceneName = "StairsMorningDay1";

        this.homeNode = this.localizationManager.readNodes(this, this.everydayNodes, "everydayDialog", "playground.homeMorning");

        let namespace = "day1\\playgroundMorningDay1";

        let nodes = this.cache.json.get("playgroundMorningDay1");

        // Si no se llega tarde, se colocan personajes de fondo
        if (!this.gameManager.blackboard.get("isLate")) {
            let joseNode = this.localizationManager.readNodes(this, nodes, namespace, "jose");
            let jose = this.createCharacter(280, this.CANVAS_HEIGHT * 0.95, "Jose", () => {
                this.localizationManager.setNode(joseNode);
            }, 0.065, "IdleBase", ConectadoBaseScene.TOGGLES_DEPTH + 1);

            let alisonNode = this.localizationManager.readNodes(this, nodes, namespace, "alison");
            let alison = this.createCharacter(this.rightBound * 0.65, this.CANVAS_HEIGHT * 0.92, "Alison", () => {
                this.localizationManager.setNode(alisonNode);
            }, 0.055, "IdleBase", ConectadoBaseScene.TOGGLES_DEPTH + 1);

            let guilleNode = this.localizationManager.readNodes(this, nodes, namespace, "guille");
            let guille = this.createCharacter(this.rightBound * 0.96, this.CANVAS_HEIGHT * 1.25, "Guille", () => {
                this.localizationManager.setNode(guilleNode);
            }, 0.2, "IdleBase", ConectadoBaseScene.TOGGLES_DEPTH + 1);

            
        }
    }
}