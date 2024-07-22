import LivingroomBase from "../livingroomBase.js";
import Character from "../../../gameObjects/character.js"

export default class LivingroomMorningDay1 extends LivingroomBase {
    constructor() {
        super('LivingroomMorningDay1');
    }

    create(params) {
        super.create(params);

        this.bedroom = "BedroomMorningDay1";
        this.playground = "Test";

        // let nodes = this.cache.json.get('livingroomMorningDay1');

        // let tr = {
        //     x: 450,
        //     y: this.CANVAS_HEIGHT * 0.85,
        //     scale: 0.15
        // };

        // let momNode = super.readNodes("root", nodes, "day1\\livingroomMorningDay1", "", true);
        // let mom = new Character(this, "mom", tr, this.portraitTr, () => {
        //     // this.dialogManager.setNode(momNode)
        // });
        // mom.setAnimation("Idle01", true);
        // this.portraits.set("mom", mom.getPortrait());

    }
}
