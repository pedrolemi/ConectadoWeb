import LivingroomBase from "../baseScenarios/livingroomBase.js";

export default class LivingroomMorningDay5 extends LivingroomBase {
    constructor() {
        super('LivingroomMorningDay5');
    }

    create(params) {
        super.create(params);

        this.bedroom = "BedroomMorningDay5";
        this.playground = "PlaygroundMorningDay5";
    }
}
