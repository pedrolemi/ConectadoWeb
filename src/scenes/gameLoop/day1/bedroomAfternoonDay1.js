import BedroomBase from "../baseScenarios/bedroomBase.js";

export default class BedroomAfternoonDay1 extends BedroomBase {
    constructor() {
        super('BedroomAfternoonDay1');
    }

    create(params) {
        super.create(params);

        this.livingroom = "LivingroomAfternoonDay1";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("night");
        
        // Crer la informacion correspondiente en el ordenador
        this.socialNetwork.addDailyRequests(1);
        this.socialNetwork.createDailyPosts(1);

        let nodes = this.cache.json.get('bedroomAfternoonDay1');

        // Dialogos del interior del armario y la cama
        this.wardrobe1Node = super.readNodes(nodes, "day1\\bedroomAfternoonDay1", "wardrobe1", true);
        this.wardrobe2Node = super.readNodes(nodes, "day1\\bedroomAfternoonDay1", "wardrobe2", true);
        nodes = this.cache.json.get('everydayDialog');

        // Mochila
        let bagNode = super.readNodes(nodes, "everydayDialog", "bedroom.bagAfternoon", true);
        let bag = this.add.image(1900 * this.scale, 1035 * this.scale, this.atlasName, 'bag').setOrigin(0, 0).setScale(-this.scale * 0.9, this.scale * 0.9);
        bag.setInteractive({ useHandCursor: true });
        bag.on('pointerdown', () => {
            this.dialogManager.setNode(bagNode)
        });

        // Cama
        this.bedNode = super.readNodes(nodes, "everydayDialog", "bedroom.bedAfternoon", true);

        // Ordenador (el mismo nodo que el de por la manana, pero sin el dialogo del jugador)
        let node = super.readNodes(nodes, "everydayDialog", "bedroom.pc", true);
        node = node.next[0];
        this.pcNode = node;

        // Ropa
        this.add.image(852 * this.scale + 1, 848 * this.scale - 1, this.atlasName, 'bedroomJacket').setOrigin(0, 0).setScale(this.scale);
        this.add.image(2899 * this.scale + 1, 1296 * this.scale - 1, this.atlasName, 'clothes1').setOrigin(0, 0).setScale(this.scale).setDepth(this.bed + 1);
        this.add.image(2704 * this.scale + 1, 963 * this.scale - 1, this.atlasName, 'clothes2').setOrigin(0, 0).setScale(this.scale).setDepth(this.bed + 1);
        this.add.image(2061 * this.scale + 1, 928 * this.scale - 1, this.atlasName, 'clothes3').setOrigin(0, 0).setScale(this.scale);

        // Mensajes del movil
        nodes = this.cache.json.get('bedroomAfternoonDay1');
        let phoneNode = super.readNodes(nodes, "day1\\bedroomAfternoonDay1", "phone", true);
        let chatName = this.i18next.t("textMessages.chat1", { ns: "phoneInfo", returnObjects: true });
        this.phoneManager.phone.setChatNode(chatName, phoneNode);
    }
}
