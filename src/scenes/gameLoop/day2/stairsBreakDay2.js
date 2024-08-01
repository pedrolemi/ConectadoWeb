import StairsBase from "../baseScenarios/stairsBase.js";

export default class StairsBreakDay2 extends StairsBase {
    constructor() {
        super('StairsBreakDay2');
    }

    create(params) {
        super.create(params);

        this.playground = "PlaygroundBreakDay2";
        this.corridor = "CorridorBreakDay2";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("endBreak");
    }
}
