import BedroomBase from "../bedroomBase.js";

export default class BedroomMorningDay1 extends BedroomBase {
    constructor() {
        super('BedroomMorningDay1');
    }
    
    create() {
        super.create();

        this.nexScene = "Test";
    }
}
