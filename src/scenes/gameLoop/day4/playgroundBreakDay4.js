import PlaygroundBase from "../baseScenarios/playgroundBase.js";
import Character from "../../../gameObjects/character.js";

export default class PlaygroundBreakDay4 extends PlaygroundBase {
    constructor() {
        super('PlaygroundBreakDay4');
    }

    create(params) {
        super.create(params);

        this.home = "";
        this.stairs = "StairsBreakDay4";

        // Se abren las puertas 
        super.openDoors();
        this.doorNode = null;

        // Personajes
        let tr = {
            x: this.rightBound * 0.05,
            y: this.CANVAS_HEIGHT * 1.02,
            scale: 0.08
        };
        let ana = new Character(this, "Ana", tr, this.portraitTr, () => {
            this.dialogManager.setNode(ana_alexNode);
        });
        ana.setScale(-tr.scale, tr.scale);
        ana.setAnimation("IdleBase", true);
        this.portraits.set("Ana", ana.getPortrait());

        tr = {
            x: this.rightBound * 0.1,
            y: this.CANVAS_HEIGHT * 1.02,
            scale: 0.09
        };
        let alex = new Character(this, "Alex_front", tr, this.portraitTr, () => {
            this.dialogManager.setNode(ana_alexNode);
        });
        alex.setScale(-tr.scale, tr.scale)
        alex.setAnimation("IdleBase", true);
        this.portraits.set("Alex", alex.getPortrait());
        

        let nodes = this.cache.json.get('playgroundBreakDay4');
        let ana_alexNode = super.readNodes(nodes, "day4\\playgroundBreakDay4", "alex_ana", true);
                
        nodes = this.cache.json.get('everydayDialog');
        this.homeNode = super.readNodes(nodes, "everydayDialog", "playground.homeBreak", true);


        // Prepara las tandas de opciones. Solo se hace una vez, 
        // y quita de las opciones aquellas que no se puedan elegir
        this.dispatcher.addOnce("prepareChoicesAlexAna", this, (obj) => {
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
