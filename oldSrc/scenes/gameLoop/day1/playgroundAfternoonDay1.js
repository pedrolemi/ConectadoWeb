import PlaygroundBase from "../baseScenarios/playgroundBase.js";
import Character from "../../../gameObjects/character.js";

export default class PlaygroundAfternoonDay1 extends PlaygroundBase {
    constructor() {
        super('PlaygroundAfternoonDay1');
    }

    create(params) {
        super.create(params);

        this.home = "LivingroomAfternoonDay1";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("endClass");

        let nodes = this.cache.json.get('everydayDialog');
        this.doorNode = super.readNodes(nodes, "everydayDialog","playground.doorAfternoon", true);
    }
}
