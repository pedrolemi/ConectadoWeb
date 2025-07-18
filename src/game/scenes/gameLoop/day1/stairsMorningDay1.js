import StairsBase from "../baseScenarios/stairsBase.js";

export default class StairsMorningDay1 extends StairsBase {
    constructor() {
        super("StairsMorningDay1");
    }

    create(params) {
        super.create(params);

        this.playgroundSceneName = "PlaygroundMorningDay1";
        this.playgroundNode = this.dialogManager.readNodes(this, this.everydayNodes, "everydayDialog", "stairs.downstairs");

        this.corridorSceneName = "CorridorMorningDay1";
    }
}