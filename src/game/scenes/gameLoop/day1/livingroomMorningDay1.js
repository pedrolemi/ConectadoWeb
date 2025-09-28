import ConectadoBaseScene from "../../conectadoBaseScene.js";
import LivingroomBase from "../baseScenarios/livingroomBase.js";

export default class LivingroomMorningDay1 extends LivingroomBase {
    constructor() {
        super("LivingroomMorningDay1");
    }

    create(params) {
        super.create(params);

        this.bedroomSceneName = "BedroomMorningDay1";
        this.playgroundSceneName = "PlaygroundMorningDay1";

        let namespace = "day1\\livingroomMorningDay1";

        let nodes = this.cache.json.get("livingroomMorningDay1");

        let momNode = this.localizationManager.readNodes(this, nodes, namespace, "mom");
        
        let mom = this.createSpineCharacter(460, this.CANVAS_HEIGHT * 0.83, "mom", () => {
            this.localizationManager.setNode(momNode);
        }, 0.15, "Idle01", this.INTERACTABLES_DEPTH);
    }
}