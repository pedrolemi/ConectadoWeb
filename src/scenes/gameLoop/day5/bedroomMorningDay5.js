import BedroomBase from "../baseScenarios/bedroomBase.js";

export default class BedroomMorningDay5 extends BedroomBase {
    constructor() {
        super('BedroomMorningDay5');
    }

    create(params) {
        super.create(params);

        this.livingroom = "LivingroomMorningDay5";

        let nodes = this.cache.json.get('bedroomMorningDay5');

        // Dialogos del interior del armario y la cama
        this.wardrobe1Node = super.readNodes(nodes, "day5\\bedroomMorningDay5", "wardrobe1", true);
        this.wardrobe2Node = super.readNodes(nodes, "day5\\bedroomMorningDay5", "wardrobe2", true);
        this.bedNode = super.readNodes(nodes, "day5\\bedroomMorningDay5", "bed", true);
        this.pcNode = super.readNodes(nodes, "day5\\bedroomMorningDay5", "pc", true);
        
        // Mochila
        let bagNode = super.readNodes(nodes, "day5\\bedroomMorningDay5", "bag", true);
        let bag =  this.add.image(3050 * this.scale, 625 * this.scale, this.atlasName, 'bag').setOrigin(0.5, 0).setScale(this.scale * 0.8).setDepth(3);
        bag.flipX = true;
        bag.setInteractive({ useHandCursor: true });
        bag.on('pointerdown', () => {
            this.dialogManager.setNode(bagNode)
        });

        // Ropa
        this.add.image(920 * this.scale, 1257 * this.scale + 5, this.atlasName, 'clothes3').setOrigin(0, 0).setScale(this.scale * 0.85).setDepth(this.chair.depth + 1);


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
