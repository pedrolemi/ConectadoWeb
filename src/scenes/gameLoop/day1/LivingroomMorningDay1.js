import LivingroomBase from "../livingroomBase.js";

export default class LivingroomMorningDay1 extends LivingroomBase {
    constructor() {
        super('LivingroomMorningDay1');
    }

    create(params) {
        super.create(params);

        this.bedroom = "BedroomMorningDay1";
        this.playground = "Test";

        let nodes = this.cache.json.get('bedroomMorningDay1');

        // Mochila
        let bagNode = super.readNodes("root", nodes, "day1\\bedroomMorningDay1", "bag", true);
        let bag = this.add.image(170, this.CANVAS_HEIGHT - 170, 'bag').setOrigin(0, 0).setScale(this.scale);
        bag.setInteractive();
        bag.on('pointerdown', () => {
            this.dialogManager.setNode(bagNode)
        });
        this.dispatcher.add("pickBag", this, (obj) => {
            this.gameManager.setValue(this.gameManager.bagPicked, true);
            this.tweens.add({
                targets: bag,
                alpha: { from: 1, to: 0 },
                duration: 100,
                repeat: 0,
            });
        });
    }
}
