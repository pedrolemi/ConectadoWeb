import ClassBackBase from "../baseScenarios/classBackBase.js";

export default class ClassBackAfternoonDay3 extends ClassBackBase {
    constructor() {
        super('ClassBackAfternoonDay3');
    }

    create(params) {
        super.create(params);

        this.corridor = "CorridorAfternoonDay3";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("day3.endClass");

        let nodes = this.cache.json.get('classCorridorAfternoonDay3');
        let node = super.readNodes(nodes, "day3\\classCorridorAfternoonDay3", "player_stairs", true);
        setTimeout( () => {
            this.dialogManager.setNode(node);
        }, 100);

    }
}
