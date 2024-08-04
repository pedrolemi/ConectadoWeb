import BedroomBase from "../baseScenarios/bedroomBase.js";

export default class BedroomAfternoonDay3 extends BedroomBase {
    constructor() {
        super('BedroomAfternoonDay3');
    }

    create(params) {
        super.create(params);

        this.livingroom = "LivingroomAfternoonDay3";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("night");

        let nodes = this.cache.json.get('bedroomAfternoonDay3');

        // Dialogos del interior del armario y la cama
        this.wardrobe1Node = super.readNodes(nodes, "day3\\bedroomAfternoonDay3", "wardrobe1", true);
        this.wardrobe2Node = super.readNodes(nodes, "day3\\bedroomAfternoonDay3", "wardrobe2", true);
        nodes = this.cache.json.get('everydayDialog');

        this.chair.setDepth(this.chair.depth + 1);

        // Mochila
        this.add.image(843 * this.scale, 1035 * this.scale, this.atlasName, 'bag').setOrigin(0, 0).setScale(this.scale * 0.9).setDepth(this.chair.depth - 1);

        // Cama
        this.bedNode = super.readNodes(nodes, "everydayDialog", "bedroom.bedAfternoon", true);

        // Ordenador (el mismo nodo que el de por la manana, pero sin el dialogo del jugador)
        let node = super.readNodes(nodes, "everydayDialog", "bedroom.pc", true);
        node = node.next[0];
        this.pcNode = node;

        this.add.image(852 * this.scale + 1, 848 * this.scale - 1, this.atlasName, 'bedroomJacket').setOrigin(0, 0).setScale(this.scale).setDepth(this.chair.depth + 1);
        
    }
}
