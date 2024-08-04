import PlaygroundBase from "../baseScenarios/playgroundBase.js";

export default class PlaygroundAfternoonDay3 extends PlaygroundBase {
    constructor() {
        super('PlaygroundAfternoonDay3');
    }

    create(params) {
        super.create(params);

        this.home = "LivingroomAfternoonDay3";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("day3.corridor");
        
        let nodes = this.cache.json.get('everydayDialog');
        this.doorNode = super.readNodes(nodes, "everydayDialog","playground.doorAfternoon", true);

    }
}
