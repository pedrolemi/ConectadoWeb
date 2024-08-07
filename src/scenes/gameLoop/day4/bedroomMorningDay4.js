import BedroomBase from "../baseScenarios/bedroomBase.js";

export default class BedroomMorningDay4 extends BedroomBase {
    constructor() {
        super('BedroomMorningDay4');
    }

    create(params) {
        super.create(params);

        this.livingroom = "LivingroomMorningDay4";

        let nodes = this.cache.json.get('bedroomMorningDay4');

        // Dialogos del interior del armario y la cama
        this.wardrobe1Node = super.readNodes(nodes, "day4\\bedroomMorningDay4", "wardrobe1", true);
        this.wardrobe2Node = super.readNodes(nodes, "day4\\bedroomMorningDay4", "wardrobe2", true);
        this.bedNode = super.readNodes(nodes, "day4\\bedroomMorningDay4", "bed", true);

        this.chair.setDepth(this.chair.depth + 1);

        
        // Mochila
        let bagNode = super.readNodes(nodes, "day4\\bedroomMorningDay4", "bag", true);
        let bag =  this.add.image(843 * this.scale, 1035 * this.scale, this.atlasName, 'bag').setOrigin(0, 0).setScale(this.scale * 0.9).setDepth(this.chair.depth - 1);
        bag.setInteractive({ useHandCursor: true });
        bag.on('pointerdown', () => {
            this.dialogManager.setNode(bagNode)
        });

        // Ropa
        let clothes1 = this.add.image(3108 * this.scale - 20, 1466 * this.scale - 10, this.atlasName, 'clothes2').setOrigin(0, 0).setScale(this.scale * 2).setDepth(this.bed.depth + 1);
        clothes1.setCrop(0, 0, clothes1.displayWidth * 0.7, clothes1.displayHeight);
        this.add.image(3278 * this.scale + 40, 1469 * this.scale - 10, this.atlasName, 'clothes3').setOrigin(0, 0).setScale(this.scale * 2).setDepth(this.bed.depth + 1);


        // Evento que se llama al encender el ordenador. Pone la hora a la de llegar tarde
        // en el telefono (la variable de llegar tarde la cambia el propio evento)
        this.dispatcher.add("turnPC", this, (obj) => {
            this.phoneManager.setDayInfo("pcLateHour");
        });

        // Evento que se llama al coger la mochila. Hace que la mochila desaparezca con 
        // una animacion (la variable de coger la mochila la cambia el propio evento)
        this.dispatcher.addOnce("pickBag", this, (obj) => {
            bag.disableInteractive();
            this.tweens.add({
                targets: bag,
                alpha: { from: 1, to: 0 },
                duration: 100,
                repeat: 0,
            });
        });

    }
}
