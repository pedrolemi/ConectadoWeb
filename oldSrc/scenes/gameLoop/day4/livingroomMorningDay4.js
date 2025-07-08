import LivingroomBase from "../baseScenarios/livingroomBase.js";
import Character from "../../../gameObjects/character.js";

export default class LivingroomMorningDay4 extends LivingroomBase {
    constructor() {
        super('LivingroomMorningDay4');
    }

    create(params) {
        super.create(params);

        this.bedroom = "BedroomMorningDay4";
        this.playground = "PlaygroundMorningDay4";

        // Personajes
        let tr = {
            x: this.rightBound * 0.45,
            y: this.CANVAS_HEIGHT * 0.735,
            scale: 0.14
        };
        let mom = new Character(this, "mom", tr, this.portraitTr, () => {
            this.dialogManager.setNode(mom_dadNode);
        });
        mom.setAnimation("Idle01", true);
        this.portraits.set("mom", mom.getPortrait());

        tr = {
            x: this.rightBound * 0.4,
            y: this.CANVAS_HEIGHT * 0.72,
            scale: 0.15
        };
        let dad = new Character(this, "dad", tr, this.portraitTr, () => {
            this.dialogManager.setNode(mom_dadNode);
        });
        dad.setAnimation("Idle01", true);
        this.portraits.set("dad", dad.getPortrait());

        let nodes = this.cache.json.get('livingroomMorningDay4');
        let mom_dadNode = super.readNodes(nodes, "day4\\livingroomMorningDay4", "mom_dad", true);


        // Pone el dialogo automaticamente al entrar en la escena
        setTimeout( () => {
            this.dialogManager.setNode(mom_dadNode);
        }, 500); 

    }
}
