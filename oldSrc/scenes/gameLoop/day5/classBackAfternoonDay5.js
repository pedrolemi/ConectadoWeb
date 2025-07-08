import ClassBackBase from "../baseScenarios/classBackBase.js";

export default class ClassBackAfternoonDay5 extends ClassBackBase {
    constructor() {
        super('ClassBackAfternoonDay5');
    }

    create(params) {
        super.create(params);

        this.corridor = "CorridorAfternoonDay5";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("afternoon.endClass");

        let nodes = this.cache.json.get('classCorridorAfternoonDay5');
        let node = super.readNodes(nodes, "day5\\classCorridorAfternoonDay5", "player_stairs", true);
        setTimeout( () => {
            this.dialogManager.setNode(node);
        }, 100);

    }
}
