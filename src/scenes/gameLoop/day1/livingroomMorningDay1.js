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

        let tr = {
            x: 460,
            y: this.CANVAS_HEIGHT * 0.83,
            scale: 0.15
        };

        let mom = new Character(this, "mom", tr, this.portraitTr, () => {
            this.dialogManager.setNode(momNode);
        });
        mom.setAnimation("Idle01", true);
        this.portraits.set("mom", mom.getPortrait());

        let nodes = this.cache.json.get('livingroomMorningDay1');
        let momNode = super.readNodes("root", nodes, "day1\\livingroomMorningDay1", "mom", true);


        this.dispatcher.addOnce("setTalked", this, (obj) => {
            console.log(obj);
            this.gameManager.setValue("talked", true, this.blackboard);
        });
    }
}
