import StairsBase from "../baseScenarios/stairsBase.js";
import Character from "../../../gameObjects/character.js";

export default class StairsBreakDay4 extends StairsBase {
    constructor() {
        super('StairsBreakDay4');
    }

    create(params) {
        super.create(params);

        this.playground = "PlaygroundBreakDay4";
        this.corridor = "CorridorBreakDay4";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("endBreak");


        let tr = {
            x: 70,
            y: this.CANVAS_HEIGHT * 0.85,
            scale: 0.13
        };
        let guille = new Character(this, "Guille", tr, this.portraitTr, () => {
            this.dialogManager.setNode(guilleAlisonNode);
        });
        guille.setScale(-tr.scale, tr.scale);
        guille.setAnimation("IdleBase", true);
        this.portraits.set("Guille", guille.getPortrait());

        tr = {
            x: 230,
            y: this.CANVAS_HEIGHT * 0.85,
            scale: 0.12
        };
        let alison = new Character(this, "Alison", tr, this.portraitTr, () => {
            this.dialogManager.setNode(guilleAlisonNode);
        });
        alison.setAnimation("IdleBase", true);
        this.portraits.set("Alison", alison.getPortrait());
        
        let nodes = this.cache.json.get('stairsBreakDay4');
        let guilleAlisonNode = super.readNodes(nodes, "day4\\stairsBreakDay4", "guilleAlison", true);
        

        // Prepara las tandas de opciones. Solo se hace una vez, 
        // y quita de las opciones aquellas que no se puedan elegir
        this.dispatcher.addOnce("prepareChoicesGuilleAlison", this, (obj) => {
            this.dialogManager.activateOptions(false, () => {
                let node = this.dialogManager.currNode

                // Si no se encuentra el telefono, se quita la opcion de preguntar quien lo ha dejado en el bano
                if (!this.gameManager.getValue("phoneFound")) {
                    node.choices.splice(0, 1);
                    node.next.splice(0, 1);
                }
                // Si no, se quita la opcion de preguntar si saben donde esta el movil
                else {
                    node.choices.splice(1, 1);
                    node.next.splice(1, 1);
                }
                

                this.dialogManager.setTalking(false);
                this.dialogManager.setNode(node);
            }, 0, true);

        });
    }
}
