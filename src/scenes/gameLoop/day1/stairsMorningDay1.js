import StairsBase from "../stairsBase.js";

export default class StairsMorningDay1 extends StairsBase {
    constructor() {
        super('StairsMorningDay1');
    }

    create(params) {
        super.create(params);

        this.playground = "PlaygroundMorningDay1";
        this.corridor = "CorridorMorningDay1";

        let nodes = this.cache.json.get('everydayDialog');
        this.playgroundNode = super.readNodes(nodes, "everydayDialog", "stairs.downstairs", true);
    }
}
