import BedroomBase from "../baseScenarios/bedroomBase.js";
import ConectadoEventNames from "../../../eventNames.js";
import { fadeAnimation } from "../../../../framework/utils/graphics.js";

export default class BedroomMorningDay1 extends BedroomBase {
    constructor() {
        super("BedroomMorningDay1");
    }

    create(params) {
        super.create(params);

        this.livingroomSceneName = "LivingroomMorningDay1";

        let namespace = "day1\\bedroomMorningDay1";

        let nodes = this.cache.json.get("bedroomMorningDay1");

        this.smallWardrobeNode = this.localizationManager.readNodes(this, nodes, namespace, "wardrobe1");
        this.bigWardrobeNode = this.localizationManager.readNodes(this, nodes, namespace, "wardrobe2");
        this.bedNode = this.localizationManager.readNodes(this, nodes, namespace, "bed");
        
        // Mochila
        let bagNode = this.localizationManager.readNodes(this, nodes, namespace, "bag");
        let bag = this.add.image(170, this.CANVAS_HEIGHT - 170, this.atlasName, "bag").setOrigin(0, 0).setScale(this.bgScale);
        this.setInteractive("bag", bag);
        bag.on("pointerdown", () => {
            this.localizationManager.setNode(bagNode);
        });

        // Ropa
        this.add.image(852 * this.bgScale + 1, 848 * this.bgScale - 1, this.atlasName, 'bedroomJacket').setOrigin(0, 0).setScale(this.bgScale);
        this.add.image(2899 * this.bgScale + 1, 1296 * this.bgScale - 1, this.atlasName, 'clothes1').setOrigin(0, 0).setScale(this.bgScale).setDepth(this.bed + 1);
        this.add.image(2704 * this.bgScale + 1, 963 * this.bgScale - 1, this.atlasName, 'clothes2').setOrigin(0, 0).setScale(this.bgScale).setDepth(this.bed + 1);
        this.add.image(2061 * this.bgScale + 1, 928 * this.bgScale - 1, this.atlasName, 'clothes3').setOrigin(0, 0).setScale(this.bgScale);


        // Evento que se llama al encender el ordenador. Pone la hora a la de llegar tarde
        // en el telefono (la variable de llegar tarde la cambia el propio evento)
        this.dispatcher.add("turnPC", this, (obj) => {
            this.dispatcher.dispatch(ConectadoEventNames.changeHour, "pcLateHour");
        });

        // Evento que se llama al coger la mochila. Hace que la mochila desaparezca con 
        // una animacion (la variable de coger la mochila la cambia el propio evento)
        this.dispatcher.addOnce("pickBag", this, () => {
            bag.disableInteractive();
            fadeAnimation(bag, false, 100);
        });
    }
}