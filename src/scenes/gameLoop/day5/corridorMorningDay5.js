import CorridorBase from "../baseScenarios/corridorBase.js";
import Character from "../../../gameObjects/character.js";

export default class CorridorMorningDay5 extends CorridorBase {
    constructor() {
        super('CorridorMorningDay5');
    }

    create(params) {
        super.create(params);

        this.stairs = "StairsMorningDay5";
        this.class = "ClassFrontMorningDay5";
        
        let tr = {
            x: this.rightBound * 0.49,
            y: this.CANVAS_HEIGHT * 0.7,
            scale: 0.065
        };
        let alex = new Character(this, "Alex_front", tr, this.portraitTr, () => {
            this.dialogManager.setNode(alexNode);
        });
        alex.setScale(-tr.scale, tr.scale)
        alex.setAnimation("IdleBase", true);
        this.portraits.set("Alex", alex.getPortrait());

        tr = {
            x: this.rightBound * 0.2,
            y: this.CANVAS_HEIGHT * 0.72,
            scale: 0.075
        };
        let guille = new Character(this, "Guille", tr, this.portraitTr, () => {
            this.dialogManager.setNode(guilleNode);
        });
        guille.setScale(-tr.scale, tr.scale)
        guille.setAnimation("IdleBase", true);
        this.portraits.set("Guille", guille.getPortrait());

        let nodes = this.cache.json.get('corridorMorningDay5');
        let alexNode = super.readNodes(nodes, "day5\\corridorMorningDay5", "alex", true);
        let guilleNode = super.readNodes(nodes, "day5\\corridorMorningDay5", "guille", true);
        
        // Se muestra el dialogo de Jose directamente
        setTimeout(() => {
            this.dialogManager.setNode(alexNode);
        }, 100);
    }
}
