import StairsBase from "../baseScenarios/stairsBase.js";

export default class StairsMorningDay3 extends StairsBase {
    constructor() {
        super('StairsMorningDay3');
    }

    create(params) {
        super.create(params);

        this.playground = "PlaygroundMorningDay3";
        this.corridor = "CorridorMorningDay3";

        let nodes = this.cache.json.get('everydayDialog');
        this.playgroundNode = super.readNodes(nodes, "everydayDialog", "stairs.downstairs", true);

    }
}
