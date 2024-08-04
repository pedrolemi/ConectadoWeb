import PlaygroundBase from "../baseScenarios/playgroundBase.js";

export default class PlaygroundAfternoonDay4 extends PlaygroundBase {
    constructor() {
        super('PlaygroundAfternoonDay4');
    }

    create(params) {
        super.create(params);

        this.home = "LivingroomAfternoonDay4";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("endClass");
        
        let nodes = this.cache.json.get('everydayDialog');
        this.doorNode = super.readNodes(nodes, "everydayDialog","playground.doorAfternoon", true);

    }
}
