import StairsBase from "../baseScenarios/stairsBase.js";

export default class StairsMorningDay2 extends StairsBase {
    constructor() {
        super('StairsMorningDay2');
    }

    create(params) {
        super.create(params);

        this.playground = "PlaygroundMorningDay2";
        this.corridor = "CorridorMorningDay2";

        let nodes = this.cache.json.get('everydayDialog');
        this.playgroundNode = super.readNodes(nodes, "everydayDialog", "stairs.downstairs", true);

    }
}
