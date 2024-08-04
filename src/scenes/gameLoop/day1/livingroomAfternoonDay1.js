import LivingroomBase from "../baseScenarios/livingroomBase.js";
import Character from "../../../gameObjects/character.js";

export default class LivingroomAfternoonDay1 extends LivingroomBase {
    constructor() {
        super('LivingroomAfternoonDay1');
    }

    create(params) {
        super.create(params);

        this.bedroom = "BedroomAfternoonDay1";
        this.playground = "";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("returnHome");

        // Personajes
        let tr = {
            x: this.rightBound * 0.56,
            y: this.CANVAS_HEIGHT * 0.945,
            scale: 0.16
        };
        let mom = new Character(this, "mom", tr, this.portraitTr, () => {
            this.dialogManager.setNode(momNode);
        });
        mom.setAnimation("IdleBase", true);
        this.portraits.set("mom", mom.getPortrait());

        tr = {
            x: this.rightBound * 0.49,
            y: this.CANVAS_HEIGHT * 0.93,
            scale: 0.17
        };
        let dad = new Character(this, "dad", tr, this.portraitTr, () => {
            this.dialogManager.setNode(dadNode);
        });
        dad.setAnimation("IdleBase", true);
        this.portraits.set("dad", dad.getPortrait());

        let nodes = this.cache.json.get('livingroomAfternoonDay1');
        let momNode = super.readNodes(nodes, "day1\\livingroomAfternoonDay1", "mom", true);
        let dadNode = super.readNodes(nodes, "day1\\livingroomAfternoonDay1", "dad", true);

        nodes = this.cache.json.get('everydayDialog');
        this.doorNode = super.readNodes(nodes, "everydayDialog", "livingroom.doorAfternoon", true);

        
        // Prepara las tandas de opciones. Solo se hace una vez, 
        // y quita de las opciones aquellas que no se puedan elegir
        this.dispatcher.addOnce("prepareChoices1", this, (obj) => {
            // Si no se ha conocido a Guille, se quita la opcion para hablar de el
            if (!this.gameManager.getValue("metGuille")) {
                this.dialogManager.activateOptions(false, () => {
                    let node = this.dialogManager.currNode
                    node.choices.splice(1, 1);
                    node.next.splice(1, 1);

                    this.dialogManager.setTalking(false);
                    this.dialogManager.setNode(node);
                }, 0, true);
            }
        });
        
        this.dispatcher.addOnce("prepareChoices2", this, (obj) => {
            // Si no se ha conocido a Jose, se quita la opcion para hablar de el
            // No se comprueba si se ha hablado de Alison porque hay que hablar con ella si o si
            if (!this.gameManager.getValue("metJose")) {
                this.dialogManager.activateOptions(false, () => {
                    let node = this.dialogManager.currNode
                
                    node.choices.splice(1, 1);
                    node.next.splice(1, 1);

                    this.dialogManager.setTalking(false);
                    this.dialogManager.setNode(node);
                }, 0, true);
            }
        });
        
        this.dispatcher.addOnce("prepareChoices3", this, (obj) => {
            // Si no se ha conocido a Maria, se quita la opcion para hablar de ella
            // No se comprueba si se ha hablado de Alex porque hay que hablar con el si o si
            if (!this.gameManager.getValue("metMaria")) {
                this.dialogManager.activateOptions(false, () => {
                    let node = this.dialogManager.currNode
                
                    node.choices.splice(0, 1);
                    node.next.splice(0, 1);

                    this.dialogManager.setTalking(false);
                    this.dialogManager.setNode(node);
                }, 0, true);
            }
        });

        this.dispatcher.addOnce("prepareChoices4", this, (obj) => {
            // Si no se ha conocido a Ana, se quita la opcion para hablar de ella
            if (!this.gameManager.getValue("metAna")) {
                this.dialogManager.activateOptions(false, () => {
                    let node = this.dialogManager.currNode
                
                    node.choices.splice(0, 1);
                    node.next.splice(0, 1);

                    this.dialogManager.setTalking(false);
                    this.dialogManager.setNode(node);
                }, 0, true);
            }
        });
    }

}
