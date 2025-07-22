import BedroomBase from "../baseScenarios/bedroomBase.js";

export default class BedroomMorningDay1 extends BedroomBase {
    constructor() {
        super("BedroomMorningDay1");
    }

    create(params) {
        super.create(params);

        this.livingroomSceneName = "LivingroomMorningDay1";

        let namespace = "day1\\bedroomMorningDay1";

        let nodes = this.cache.json.get("bedroomMorningDay1");

        // Mochila
        let bagNode = this.localizationManager.readNodes(this, nodes, namespace, "bag");
        let bag = this.add.image(170, this.CANVAS_HEIGHT - 170, this.atlasName, "bag").setOrigin(0, 0).setScale(this.bgScale);
        this.setInteractive("bag", bag);
        bag.on("pointerdown", () => {
            this.localizationManager.setNode(bagNode)
        });


        // Evento que se llama al coger la mochila. Hace que la mochila desaparezca con 
        // una animacion (la variable de coger la mochila la cambia el propio evento)
        this.dispatcher.addOnce("pickBag", this, () => {
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