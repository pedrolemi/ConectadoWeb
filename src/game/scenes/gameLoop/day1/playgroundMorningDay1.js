import PlaygroundBase from "../baseScenarios/playgroundBase.js";

export default class PlaygroundMorningDay1 extends PlaygroundBase {
    constructor() {
        super("PlaygroundMorningDay1");
    }

    create(params) {
        super.create(params);

        this.stairsSceneName = "StairsMorningDay1";

        this.homeNode = this.dialogManager.readNodes(this, this.everydayNodes, "everydayDialog", "playground.homeMorning");
    }
}