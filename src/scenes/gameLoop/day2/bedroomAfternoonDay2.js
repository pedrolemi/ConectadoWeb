import BedroomBase from "../baseScenarios/bedroomBase.js";

export default class BedroomAfternoonDay2 extends BedroomBase {
    constructor() {
        super('BedroomAfternoonDay2');
    }

    create(params) {
        super.create(params);

        this.livingroom = "LivingroomAfternoonDay2";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("night");

        let nodes = this.cache.json.get('bedroomAfternoonDay2');

        // Dialogos del interior del armario y la cama
        this.wardrobe1Node = super.readNodes(nodes, "day2\\bedroomAfternoonDay2", "wardrobe1", true);
        this.wardrobe2Node = super.readNodes(nodes, "day2\\bedroomAfternoonDay2", "wardrobe2", true);
        let phoneNode = super.readNodes(nodes, "day2\\bedroomAfternoonDay2", "phone", true);
        nodes = this.cache.json.get('everydayDialog');

        // Mochila
        let bagNode = super.readNodes(nodes, "everydayDialog", "bedroom.bagAfternoon", true);
        let bag = this.add.image(this.rightBound * 0.17, this.CANVAS_HEIGHT * 0.76, this.atlasName, 'bag').setOrigin(0, 0).setScale(this.scale * 1.1);
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

        this.add.image(852 * this.scale + 1, 848 * this.scale - 1, this.atlasName, 'bedroomJacket').setOrigin(0, 0).setScale(this.scale);

        // Mensajes del movil
        let chatName = this.i18next.t("textMessages.chat2", { ns: "phoneInfo", returnObjects: true });
        this.phoneManager.phone.addChat(chatName, "");
        this.phoneManager.phone.setChatNode(chatName, phoneNode);

        
    }
}
