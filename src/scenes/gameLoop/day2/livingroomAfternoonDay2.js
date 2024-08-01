import LivingroomBase from "../baseScenarios/livingroomBase.js";
import Character from "../../../gameObjects/character.js";

export default class LivingroomAfternoonDay2 extends LivingroomBase {
    constructor() {
        super('LivingroomAfternoonDay2');
    }

    create(params) {
        super.create(params);

        this.bedroom = "BedroomAfternoonDay2";
        this.playground = "";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("returnHome");

        // Personajes
        let tr = {
            x: this.rightBound * 0.9,
            y: this.CANVAS_HEIGHT * 0.945,
            scale: 0.16
        };
        let dad = new Character(this, "dad", tr, this.portraitTr, () => {
            this.dialogManager.setNode(dadNode);
        });
        dad.setScale(-tr.scale, tr.scale);
        dad.setAnimation("IdleBase", true);
        this.portraits.set("dad", dad.getPortrait());

        let nodes = this.cache.json.get('livingroomAfternoonDay2');
        let dadNode = super.readNodes(nodes, "day2\\livingroomAfternoonDay2", "dad", true);

        nodes = this.cache.json.get('everydayDialog');
        this.doorNode = super.readNodes(nodes, "everydayDialog", "livingroom.doorAfternoon", true);

        
        // Prepara las tandas de opciones. Solo se hace una vez, 
        // y quita de las opciones aquellas que no se puedan elegir
        this.dispatcher.addOnce("prepareChoices1", this, (obj) => {
            if (!this.gameManager.getValue("aboutMatch")) {
                this.dialogManager.activateOptions(false, () => {
                    let node = this.dialogManager.currNode
                    console.log(node.choices)
                    node.choices.splice(1, 1);
                    node.next.splice(1, 1);

                    this.dialogManager.talking = false;
                    this.dialogManager.setNode(node);
                }, 0, true);
            }
        });
        
        this.dispatcher.addOnce("prepareChoices3", this, (obj) => {
            // Si no se ha conocido a Maria o no se tiene suficiente amistad con ella, se quita la opcion para hablar de ella
            if (!this.gameManager.getValue("metMaria") || this.gameManager.getValue("MariaFS") < 50) {
                this.dialogManager.activateOptions(false, () => {
                    let node = this.dialogManager.currNode
                
                    node.choices.splice(0, 1);
                    node.next.splice(0, 1);

                    this.dialogManager.talking = false;
                    this.dialogManager.setNode(node);
                }, 0, true);
            }
        });

    }

}
