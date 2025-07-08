import StairsBase from "../baseScenarios/stairsBase.js";
import Character from "../../../gameObjects/character.js";

export default class StairsMorningDay4 extends StairsBase {
    constructor() {
        super('StairsMorningDay4');
    }

    create(params) {
        super.create(params);

        this.playground = "PlaygroundMorningDay4";
        this.corridor = "CorridorMorningDay4";

        let nodes = this.cache.json.get('everydayDialog');
        this.playgroundNode = super.readNodes(nodes, "everydayDialog", "stairs.downstairs", true);

        // Si no se llega tarde, se colocan personajes en el fondo
        if (!this.gameManager.getValue("isLate")) {
            let tr = {
                x: this.rightBound * 0.8,
                y: this.CANVAS_HEIGHT * 0.81,
                scale: 0.12
            };
            let maria = new Character(this, "Maria", tr, this.portraitTr, () => {
                this.dialogManager.setNode(mariaNode);
            });
            maria.setAnimation("IdleBase", true);
            this.portraits.set("Maria", maria.getPortrait());
    
            nodes = this.cache.json.get('stairsMorningDay4');
            let mariaNode = super.readNodes(nodes, "day4\\stairsMorningDay4", "maria", true);
        }
        
    }
}
