import PlaygroundBase from "../playgroundBase.js";

export default class PlaygroundMorningDay1 extends PlaygroundBase {
    constructor() {
        super('PlaygroundMorningDay1');
    }

    create(params) {
        super.create(params);

        this.home = "LivingroomMorningDay1";
        this.stairs = "StairsMorningDay1";

        if (this.gameManager.getValue(this.gameManager.isLate)) {
            super.openDoors();
        }

        // TEST
        this.bg.setInteractive();
        this.bg.on('pointerdown', () => {
            super.openDoors();
        })

        this.dispatcher.addOnce("openDoors", this, (obj) => {
            console.log(obj);
            super.openDoors();
        });

    }
}
