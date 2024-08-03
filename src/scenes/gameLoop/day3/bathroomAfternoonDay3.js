
import BathroomBase from '../baseScenarios/bathroomBase.js';
import Character from "../../../gameObjects/character.js";

export default class BathroomAfternoonDay3 extends BathroomBase {
    constructor() {
        super("BathroomAfternoonDay3");
    }

    create(params) {
        super.create(params);
        
        let tr = {
            x: this.rightBound * 0.85,
            y: this.CANVAS_HEIGHT * 0.96,
            scale: 0.16
        };
        let guille = new Character(this, "Guille", tr, this.portraitTr, () => {
            this.dialogManager.setNode(guilleNode);
        });
        guille.setDepth(this.stall2.depth)
        guille.setAnimation("IdleBase", true);
        this.portraits.set("Guille", guille.getPortrait());

        let nodes = this.cache.json.get('bathroomAfternoonDay3');
        guilleNode = super.readNodes(nodes, "day3\\bathroomAfternoonDay3", "guille", true);
    }
}