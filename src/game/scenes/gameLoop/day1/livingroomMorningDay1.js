import LivingroomBase from "../baseScenarios/livingroomBase.js";

export default class LivingroomMorningDay1 extends LivingroomBase {
    constructor() {
        super("LivingroomMorningDay1");
    }

    create(params) {
        super.create(params);

        this.bedroomSceneName = "BedroomMorningDay1";
        this.playgroundSceneName = "PlaygroundMorningDay1";
    }
}