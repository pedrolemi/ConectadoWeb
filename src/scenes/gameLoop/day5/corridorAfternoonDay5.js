import CorridorBase from "../baseScenarios/corridorBase.js";
import Character from "../../../gameObjects/character.js";

export default class CorridorAfternoonDay5 extends CorridorBase {
    constructor() {
        super('CorridorAfternoonDay5');
    }

    create(params) {
        super.create(params);

        this.stairs = "StairsAfternoonDay5";
        this.class = "";

        if (this.gameManager.getUserInfo().gender === "male") {
            this.boysBathroom = "BathroomAfternoonDay5";
            this.girlsBathroom = "OppositeBathroom";
        }
        else {
            this.girlsBathroom = "BathroomAfternoonDay5";
            this.boysBathroom = "OppositeBathroom";
        }

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("afternoon.corridor");
        
        let nodes = this.cache.json.get('classCorridorAfternoonDay5');
        this.classNode = super.readNodes(nodes, "day5\\classCorridorAfternoonDay5", "class", true);

        // Cuando se vuelve al pasillo, aparece Alex en la puerta
        this.dispatcher.addOnce("returnToCorridor", this, (obj) => {
            let tr = {
                x: this.rightBound * 0.3,
                y: this.CANVAS_HEIGHT * 0.625,
                scale: 0.043
            };
            let alex = new Character(this, "Alex_front", tr, this.portraitTr, () => {
                this.dialogManager.setNode(this.stairsNode);
            });
            alex.setAnimation("IdleBase", true);
            this.portraits.set("Alex", alex.getPortrait());

            this.stairsNode = super.readNodes(nodes, "day5\\classCorridorAfternoonDay5", "alex_corridor", true);
        });

        
    }

    
}
