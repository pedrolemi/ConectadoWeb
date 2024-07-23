import CorridorBase from "../corridorBase.js";

export default class CorridorMorningDay1 extends CorridorBase {
    constructor() {
        super('CorridorMorningDay1');
    }

    create(params) {
        super.create(params);

        this.stairs = "StairsMorningDay1";
        this.boysBathroom = "";
        this.girlsBathroom = "";

        
    }
}
