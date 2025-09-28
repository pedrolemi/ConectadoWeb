import ConectadoEventNames from "../../../eventNames.js";
import PlaygroundBase from "../baseScenarios/playgroundBase.js";

export default class PlaygroundAfternoonDay1 extends PlaygroundBase {
    constructor() {
        super("PlaygroundAfternoonDay1");
    }

    create(params) {
        super.create(params);
        
        this.homeSceneName = "LivingroomAfternoonDay1";

        // Cambia la hora del movil
        this.dispatcher.dispatch(ConectadoEventNames.changeHour, "endClass");

        this.doorNode = this.localizationManager.readNodes(this, this.everydayNodes, "everydayDialog", "playground.doorAfternoon");

    }
}