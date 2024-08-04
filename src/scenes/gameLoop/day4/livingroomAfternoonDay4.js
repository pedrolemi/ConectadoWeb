import LivingroomBase from "../baseScenarios/livingroomBase.js";
import Character from "../../../gameObjects/character.js";

export default class LivingroomAfternoonDay4 extends LivingroomBase {
    constructor() {
        super('LivingroomAfternoonDay4');
    }

    create(params) {
        super.create(params);

        this.bedroom = "BedroomAfternoonDay4";
        this.playground = "";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("returnHome");

        // Personajes
        let tr = {
            x: this.rightBound * 0.45,
            y: this.CANVAS_HEIGHT * 0.735,
            scale: 0.14
        };
        let mom = new Character(this, "mom", tr, this.portraitTr, () => {
            this.dialogManager.setNode(momNode);
        });
        mom.setAnimation("IdleBase", true);
        this.portraits.set("mom", mom.getPortrait());

        tr = {
            x: this.rightBound * 0.4,
            y: this.CANVAS_HEIGHT * 0.72,
            scale: 0.15
        };
        let dad = new Character(this, "dad", tr, this.portraitTr, () => {
            this.dialogManager.setNode(dadNode);
        });
        dad.setAnimation("IdleBase", true);
        this.portraits.set("dad", dad.getPortrait());

        let nodes = this.cache.json.get('livingroomAfternoonDay4');
        // let momNode = super.readNodes(nodes, "day4\\livingroomAfternoonDay4", "mom", true);
        // let dadNode = super.readNodes(nodes, "day4\\livingroomAfternoonDay4", "dad", true);

        nodes = this.cache.json.get('everydayDialog');
        this.doorNode = super.readNodes(nodes, "everydayDialog", "livingroom.doorAfternoon", true);


        // Si se ha perdido y encontrado el telefono, sale el dialogo de cambiar la bateria
        if (!this.gameManager.getValue("passwordExchanged") && this.gameManager.getValue("phoneFound")) {
            nodes = this.cache.json.get('livingroomAfternoonDay4');
        }
    }

}
