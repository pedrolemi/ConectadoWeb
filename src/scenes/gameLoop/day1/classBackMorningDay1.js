import ClassBackBase from "../classBackBase.js";

export default class ClassBackMorningDay1 extends ClassBackBase {
    constructor() {
        super('ClassBackMorningDay1');
    }

    create(params) {
        super.create(params);
        
        this.doorClosed.disableInteractive();
    }
}
