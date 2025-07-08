import LivingroomBase from "../baseScenarios/livingroomBase.js";
import Character from "../../../gameObjects/character.js";

export default class LivingroomMorningDay3 extends LivingroomBase {
    constructor() {
        super('LivingroomMorningDay3');
    }

    create(params) {
        super.create(params);

        this.bedroom = "BedroomMorningDay3";
        this.playground = "PlaygroundMorningDay3";

        // Personajes
        let tr = {
            x: 440,
            y: this.CANVAS_HEIGHT * 0.72,
            scale: 0.15
        };
        let mom = new Character(this, "mom", tr, this.portraitTr, () => {
            this.dialogManager.setNode(momNode);
        });
        mom.setAnimation("Idle01", true);
        this.portraits.set("mom", mom.getPortrait());

        let nodes = this.cache.json.get('livingroomMorningDay3');
        let momNode = super.readNodes(nodes, "day3\\livingroomMorningDay3", "mom", true);
    }
}
