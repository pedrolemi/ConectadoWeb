import ClassBackBase from "../baseScenarios/classBackBase.js";

export default class ClassBackBreakDay1 extends ClassBackBase {
    constructor() {
        super("ClassBackBreakDay1");
    }

    create(params) {
        super.create(params);
        
        this.corridorSceneName = "CorridorBreakDay1";
        
    }

}