import StairsBase from "../baseScenarios/stairsBase.js";
import ConectadoEventNames from "../../../eventNames.js";

export default class StairsBreakDay1 extends StairsBase {
    constructor() {
        super("StairsBreakDay1");
    }

    create(params) {
        super.create(params);
        
        this.playgroundSceneName = "PlaygroundBreakDay1";

        this.corridorSceneName = "CorridorBreakDay1";

        // Cambia la hora del movil
        this.dispatcher.dispatch(ConectadoEventNames.changeHour, "endBreak");
    }
}