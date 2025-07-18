import CorridorBase from "../baseScenarios/corridorBase.js";

export default class CorridorMorningDay1 extends CorridorBase {
    constructor() {
        super("CorridorMorningDay1");
    }

    create(params) {
        super.create(params);

        this.stairsSceneName = "StairsMorningDay1";
        this.classSceneName = "ClassFrontMorningDay1";
    }
}