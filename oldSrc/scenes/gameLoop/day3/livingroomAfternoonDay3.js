import LivingroomBase from "../baseScenarios/livingroomBase.js";
import Character from "../../../gameObjects/character.js";

export default class LivingroomAfternoonDay3 extends LivingroomBase {
    constructor() {
        super('LivingroomAfternoonDay3');
    }

    create(params) {
        super.create(params);

        this.bedroom = "BedroomAfternoonDay3";
        this.playground = "";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("returnHome");

        // Personajes
        let tr = {
            x: this.rightBound * 0.73,
            y: this.CANVAS_HEIGHT * 0.87,
            scale: 0.16
        };
        let mom = new Character(this, "mom", tr, this.portraitTr, () => {
            this.dialogManager.setNode(momNode);
        });
        mom.setAnimation("IdleBase", true);
        this.portraits.set("mom", mom.getPortrait());

        let nodes = this.cache.json.get('livingroomAfternoonDay3');
        let momNode = super.readNodes(nodes, "day3\\livingroomAfternoonDay3", "mom", true);

        nodes = this.cache.json.get('everydayDialog');
        this.doorNode = super.readNodes(nodes, "everydayDialog", "livingroom.doorAfternoon", true);

        
        // Prepara las tandas de opciones. Solo se hace una vez, 
        // y quita de las opciones aquellas que no se puedan elegir
        this.dispatcher.addOnce("prepareChoices2", this, (obj) => {
            // Si no se ha visto o se sabe sobre la foto de los tablones, se quita la opcion para hablar de ella
            if (!this.gameManager.getValue("seenPhoto")) {
                this.dialogManager.activateOptions(false, () => {
                    let node = this.dialogManager.currNode
                
                    node.choices.splice(1, 1);
                    node.next.splice(1, 1);

                    this.dialogManager.setTalking(false);
                    this.dialogManager.setNode(node);
                }, 0, true);
            }
        });

    }

}
