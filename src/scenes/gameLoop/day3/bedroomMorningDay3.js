import BedroomBase from "../baseScenarios/bedroomBase.js";

export default class BedroomMorningDay3 extends BedroomBase {
    constructor() {
        super('BedroomMorningDay3');
    }

    create(params) {
        super.create(params);

        this.livingroom = "LivingroomMorningDay3";

        let nodes = this.cache.json.get('bedroomMorningDay3');

        // Dialogos del interior del armario y la cama
        this.wardrobe1Node = super.readNodes(nodes, "day3\\bedroomMorningDay3", "wardrobe1", true);
        this.wardrobe2Node = super.readNodes(nodes, "day3\\bedroomMorningDay3", "wardrobe2", true);
        this.bedNode = super.readNodes(nodes, "day3\\bedroomMorningDay3", "bed", true);

        // Mochila
        let bagNode = super.readNodes(nodes, "day3\\bedroomMorningDay3", "bag", true);
        let bag = this.add.image(this.rightBound * 0.17, this.CANVAS_HEIGHT * 0.76, this.atlasName, 'bag').setOrigin(0, 0).setScale(this.scale * 1.1);
        bag.setInteractive({ useHandCursor: true });
        bag.on('pointerdown', () => {
            this.dialogManager.setNode(bagNode)
        });

        // Ropa
        this.add.image(2619 * this.scale + 1, 1268 * this.scale - 1, this.atlasName, 'clothes1').setOrigin(0, 0).setScale(this.scale).setDepth(this.bed.depth - 1);
        this.add.image(2700 * this.scale + 1, 972 * this.scale - 3, this.atlasName, 'clothes3').setOrigin(0, 0).setScale(this.scale).setDepth(this.bed.depth + 1);


        // Evento que se llama al encender el ordenador. Pone la hora a la de llegar tarde
        // en el telefono (la variable de llegar tarde la cambia el propio evento)
        this.dispatcher.add("turnPC", this, (obj) => {
            this.phoneManager.setDayInfo("pcLateHour");
        });

        // Evento que se llama al coger la mochila. Hace que la mochila desaparezca con 
        // una animacion (la variable de coger la mochila la cambia el propio evento)
        this.dispatcher.addOnce("pickBag", this, (obj) => {
            this.tweens.add({
                targets: bag,
                alpha: { from: 1, to: 0 },
                duration: 100,
                repeat: 0,
            });
        });

    }
}
