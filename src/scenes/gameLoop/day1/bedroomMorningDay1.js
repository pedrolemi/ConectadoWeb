import BedroomBase from "../bedroomBase.js";

export default class BedroomMorningDay1 extends BedroomBase {
    constructor() {
        super('BedroomMorningDay1');
    }
    
    create() {
        super.create();

        this.nexScene = "Test";
        
        let nodes = this.cache.json.get('bedroomMorningDay1');

        this.wardrobe1Node = super.readNodes("root", nodes, "day1\\bedroomMorningDay1", "wardrobe1", true);
        this.wardrobe2Node = super.readNodes("root", nodes, "day1\\bedroomMorningDay1", "wardrobe2", true);
        this.pcNode = super.readNodes("root", nodes, "day1\\bedroomMorningDay1", "pc", true);
        this.bedNode = super.readNodes("root", nodes, "day1\\bedroomMorningDay1", "bed", true);

        // Mochila
        let bagNode = super.readNodes("root", nodes, "day1\\bedroomMorningDay1", "bag", true);
        let bag = this.add.image(170, this.CANVAS_HEIGHT - 170, 'bag').setOrigin(0, 0).setScale(this.scale);
        bag.setInteractive();
        bag.on('pointerdown', () => {
            this.dialogManager.setNode(bagNode)
        });

        // Chaqueta
        this.add.image(852 * this.scale + 1, 848 * this.scale - 1, 'bedroomJacket').setOrigin(0, 0).setScale(this.scale);


        this.dispatcher.add("turnPC", this, (obj) => {
            console.log(obj);
            this.gameManager.setValue(this.gameManager.isLate, true);
            let hour = this.i18next.t("clock.pcLateHour", { ns: "phoneInfo", returnObjects: true });
            this.phoneManager.phone.setDayInfo(hour, "");
        });
        this.dispatcher.add("pickBag", this, (obj) => {
            console.log(obj);
            this.gameManager.setValue(this.gameManager.bagPicked, true);
            bag.visible = false;
        });
        
        this.cameras.main.scrollX = 0;
    }
}
