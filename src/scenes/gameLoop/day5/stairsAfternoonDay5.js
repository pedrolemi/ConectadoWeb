import StairsBase from "../baseScenarios/stairsBase.js";
import Character from "../../../gameObjects/character.js";

export default class StairsAfternoonDay5 extends StairsBase {
    constructor() {
        super('StairsAfternoonDay5');
    }

    create(params) {
        super.create(params);

        this.playground = "";
        this.corridor = "CorridorAfternoonDay5";

        let tr = {
            x: this.rightBound * 0.61,
            y: this.CANVAS_HEIGHT * 0.545,
            scale: 0.095
        };
        let alex = new Character(this, "Alex_front", tr, this.portraitTr, () => {
            this.dialogManager.setNode(alexNode);
        });
        alex.setScale(-tr.scale, tr.scale);
        alex.setAnimation("IdleBase", true);
        this.portraits.set("Alex", alex.getPortrait());

        let nodes = this.cache.json.get('classCorridorAfternoonDay5');
        let alexNode = super.readNodes(nodes, "day5\\classCorridorAfternoonDay5", "alex_stairs", true);
        
        // Se muestra el dialogo de Alex directamente
        setTimeout(() => {
            this.dialogManager.setNode(alexNode);
        }, 100);

        // Cuando termina el dialogo, se vuelve al pasillo
        this.dispatcher.addOnce("returnToCorridor", this, (obj) => {
            // console.log(obj);
            let params = {
                camPos: "left"
            };
            this.gameManager.changeScene(this.corridor, params, true);
        });
    }
    
}
