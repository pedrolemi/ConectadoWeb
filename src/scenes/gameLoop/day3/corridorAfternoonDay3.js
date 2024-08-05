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
            this.boysBathroom = "BathroomAfternoonDay3";
            this.girlsBathroom = "OppositeBathroom";
        }
        else {
            this.girlsBathroom = "BathroomAfternoonDay3";
            this.boysBathroom = "OppositeBathroom";
        }

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("day3.corridor");
        
        let nodes = this.cache.json.get('classCorridorAfternoonDay3');
        this.stairsNode = super.readNodes(nodes, "day3\\classCorridorAfternoonDay3", "player_stairs", true);
        this.classNode = super.readNodes(nodes, "day3\\classCorridorAfternoonDay3", "class", true);


        this.dispatcher.add("setTalked", this, (obj) => {
            // console.log(obj);
            this.stairsNode = null;
        });

        
    }

    
}