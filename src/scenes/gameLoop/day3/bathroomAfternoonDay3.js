
import BathroomBase from '../baseScenarios/bathroomBase.js';
import Character from "../../../gameObjects/character.js";

export default class BathroomAfternoonDay3 extends BathroomBase {
    constructor() {
        super("BathroomAfternoonDay3");
    }

    create(params) {
        super.create(params);
        
        let tr = {
            x: this.rightBound * 0.85,
            y: this.CANVAS_HEIGHT * 0.96,
            scale: 0.16
        };
        let guille = new Character(this, "Guille", tr, this.portraitTr, () => {
            this.dialogManager.setNode(guilleNode);
        });
        guille.setDepth(this.stall2.depth)
        guille.setAnimation("IdleBase", true);
        this.portraits.set("Guille", guille.getPortrait());

        let nodes = this.cache.json.get('bathroomAfternoonDay3');
        let guilleNode = super.readNodes(nodes, "day3\\bathroomAfternoonDay3", "guille", true);

        // Prepara las tandas de opciones. Solo se hace una vez, 
        // y quita de las opciones aquellas que no se puedan elegir
        this.dispatcher.addOnce("prepareChoices", this, (obj) => {
            // Si no se ha visto la foto de los tablones, no se puede preguntar por ella
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