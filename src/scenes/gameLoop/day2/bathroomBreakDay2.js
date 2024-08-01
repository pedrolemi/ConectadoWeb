
import BathroomBase from '../baseScenarios/bathroomBase.js';

export default class BathroomBreakDay2 extends BathroomBase {
    constructor() {
        super("BathroomBreakDay2");
    }

    create(params) {
        super.create(params);
        
        let nodes = this.cache.json.get('bathroomBreakDay2');
        this.sinkNode = super.readNodes(nodes, "day2\\bathroomBreakDay2", "sink", true);
    }
}