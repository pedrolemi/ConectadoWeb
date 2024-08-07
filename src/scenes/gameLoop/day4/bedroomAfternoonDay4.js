import BedroomBase from "../baseScenarios/bedroomBase.js";

export default class BedroomAfternoonDay4 extends BedroomBase {
    constructor() {
        super('BedroomAfternoonDay4');
    }

    create(params) {
        super.create(params);

        this.livingroom = "LivingroomAfternoonDay4";

        this.gameManager.setValue("passwordExchanged", true);


        if (this.gameManager.hasValue("passwordExchanged")) {
            let passwordExchanged = this.gameManager.getValue("passwordExchanged");
            if (passwordExchanged) {
                // Crear la informacion correspondiente en el ordenador
                this.socialNetwork.createDailyPosts(4);
            }
        }

        let nodes = this.cache.json.get('bedroomAfternoonDay4');

        // Dialogos del interior del armario y la cama
        this.wardrobe1Node = super.readNodes(nodes, "day4\\bedroomAfternoonDay4", "wardrobe1", true);
        this.wardrobe2Node = super.readNodes(nodes, "day4\\bedroomAfternoonDay4", "wardrobe2", true);
        this.bedNode = super.readNodes(nodes, "day4\\bedroomAfternoonDay4", "bed", true);

        // Mochila
        nodes = this.cache.json.get('everydayDialog');
        let bagNode = super.readNodes(nodes, "everydayDialog", "bedroom.bagAfternoon", true);
        let bag = this.add.image(3050 * this.scale, 625 * this.scale, this.atlasName, 'bag').setOrigin(0.5, 0).setScale(this.scale * 0.8).setDepth(3);
        bag.flipX = true;
        bag.setInteractive({ useHandCursor: true });
        bag.on('pointerdown', () => {
            this.dialogManager.setNode(bagNode)
        });

        // Ropa
        this.add.image(920 * this.scale, 1257 * this.scale + 5, this.atlasName, 'clothes3').setOrigin(0, 0).setScale(this.scale * 0.85).setDepth(this.chair.depth + 1);


        // Evento llamado cuando se elimina la publicacion con el numero de telefono. Anade el chat de Alex y envia un mensaje
        this.dispatcher.addOnce("addMessageToAlex", this, (obj) => {
            nodes = this.cache.json.get('bedroomAfternoonDay4');
            let chatName = this.i18next.t("textMessages.chat4", { ns: "phoneInfo", returnObjects: true });
            this.phoneManager.phone.addChat(chatName, "Alex");
            let phoneNode = super.readNodes(nodes, "day4\\bedroomAfternoonDay4", "phone", true);
            this.phoneManager.phone.setChatNode(chatName, phoneNode);
        });
    }
}
