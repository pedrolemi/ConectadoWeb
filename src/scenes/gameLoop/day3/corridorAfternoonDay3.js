import CorridorBase from "../baseScenarios/corridorBase.js";

export default class CorridorAfternoonDay3 extends CorridorBase {
    constructor() {
        super('CorridorAfternoonDay3');
    }

    create(params) {
        super.create(params);

        this.stairs = "StairsAfternoonDay3";
        this.class = "";

        if (this.gameManager.getUserInfo().gender === "male") {
            this.boysRestroom = "RestroomAfternoonDay3";
            this.girlsRestroom = "OppositeRestroom";
        }
        else {
            this.girlsRestroom = "RestroomAfternoonDay3";
            this.boysRestroom = "OppositeRestroom";
        }

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("afternoon.corridor");
        
        let nodes = this.cache.json.get('classCorridorAfternoonDay3');
        this.stairsNode = super.readNodes(nodes, "day3\\classCorridorAfternoonDay3", "player_stairs", true);
        this.classNode = super.readNodes(nodes, "day3\\classCorridorAfternoonDay3", "class", true);


        this.dispatcher.addOnce("setTalked", this, (obj) => {
            this.stairsNode = null;
        });

        
    }

    
}
