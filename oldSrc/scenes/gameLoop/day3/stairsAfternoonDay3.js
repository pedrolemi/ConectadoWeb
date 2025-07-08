import StairsBase from "../baseScenarios/stairsBase.js";

export default class StairsAfternoonDay3 extends StairsBase {
    constructor() {
        super('StairsAfternoonDay3');
    }

    create(params) {
        super.create(params);

        this.playground = "PlaygroundAfternoonDay3";
        this.corridor = "CorridorAfternoonDay3";
    }
}
