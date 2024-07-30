import LivingroomBase from "../baseScenarios/livingroomBase.js";
import Character from "../../../gameObjects/character.js";

export default class LivingroomMorningDay1 extends LivingroomBase {
    constructor() {
        super('LivingroomMorningDay1');
    }

    create(params) {
        super.create(params);

        this.bedroom = "BedroomMorningDay1";
        this.playground = "PlaygroundMorningDay1";

        // Personajes
        let tr = {
            x: 460,
            y: this.CANVAS_HEIGHT * 0.83,
            scale: 0.15
        };
        let mom = new Character(this, "mom", tr, this.portraitTr, () => {
            this.dialogManager.setNode(momNode);
        });
        mom.setAnimation("Idle01", true);
        this.portraits.set("mom", mom.getPortrait());

        let nodes = this.cache.json.get('livingroomMorningDay1');
        let momNode = super.readNodes(nodes, "day1\\livingroomMorningDay1", "mom", true);
        

        // Se comprueba si no se ha cogido la mochila. Si no se ha cogido, se pone el dialogo en la puerta
        if (!this.gameManager.getValue(this.gameManager.bagPicked)) {
            nodes = this.cache.json.get('everydayDialog');
            this.doorNode = super.readNodes(nodes, "everydayDialog", "livingroom.doorMorning", true);
        }


        // Suscripcion al evento de coger la mochila por si no se 
        // coge antes de salir de la habitacion por primera vez
        this.dispatcher.addOnce("pickBag", this, (obj) => {
            this.doorNode = null;
        });
    }
}
