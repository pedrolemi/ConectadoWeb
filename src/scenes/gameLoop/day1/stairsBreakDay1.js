import StairsBase from "../baseScenarios/stairsBase.js";

export default class StairsBreakDay1 extends StairsBase {
    constructor() {
        super('StairsBreakDay1');
    }

    create(params) {
        super.create(params);

        this.playground = "PlaygroundBreakDay1";
        this.corridor = "CorridorBreakDay1";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("endBreak");
    }
}
