import StairsBase from "../baseScenarios/stairsBase.js";
import Character from "../../../gameObjects/character.js";

export default class StairsMorningDay5 extends StairsBase {
    constructor() {
        super('StairsMorningDay5');
    }

    create(params) {
        super.create(params);

        this.playground = "PlaygroundMorningDay5";
        this.corridor = "CorridorMorningDay5";

        let nodes = this.cache.json.get('everydayDialog');
        this.playgroundNode = super.readNodes(nodes, "everydayDialog", "stairs.downstairs", true);


        let tr = {
            x: this.rightBound * 0.75,
            y: this.CANVAS_HEIGHT * 0.81,
            scale: 0.12
        };
        let jose = new Character(this, "Jose", tr, this.portraitTr, () => {
            this.dialogManager.setNode(joseNode);
        });
        jose.setAnimation("IdleBase", true);
        this.portraits.set("Jose", jose.getPortrait());

        nodes = this.cache.json.get('stairsMorningDay5');
        let joseNode = super.readNodes(nodes, "day5\\stairsMorningDay5", "jose", true);
        
        // Se muestra el dialogo de Jose directamente
        setTimeout(() => {
            this.dialogManager.setNode(joseNode);
        }, 100);
    }
}
