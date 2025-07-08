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
        let momNode = super.readNodes(nodes, "day4\\livingroomAfternoonDay4", "mom", true);
        let dadNode = super.readNodes(nodes, "day4\\livingroomAfternoonDay4", "dad", true);

        nodes = this.cache.json.get('everydayDialog');
        this.doorNode = super.readNodes(nodes, "everydayDialog", "livingroom.doorAfternoon", true);

        // Si se ha perdido y encontrado el telefono, sale el dialogo de cambiar la bateria
        if (!this.gameManager.getValue("passwordExchanged") && this.gameManager.getValue("phoneFound")) {
            nodes = this.cache.json.get('livingroomAfternoonDay4');
            let node = super.readNodes(nodes, "day4\\livingroomAfternoonDay4", "noPhone", true);
            this.dialogManager.setNode(node);

            this.dispatcher.addOnce("turnPhone", this, (obj) => {
                this.phoneManager.activate(true);

                let chatName = this.i18next.t("textMessages.chat2", { ns: "phoneInfo", returnObjects: true });
                let phoneNode = super.readNodes(nodes, "day4\\livingroomAfternoonDay4", "classChat", true);
                this.phoneManager.phone.setChatNode(chatName, phoneNode);

                chatName = this.i18next.t("textMessages.chat3", { ns: "phoneInfo", returnObjects: true });
                this.phoneManager.phone.addChat(chatName, "Maria");
                phoneNode = super.readNodes(nodes, "day4\\livingroomAfternoonDay4", "mariaChat", true);
                this.phoneManager.phone.setChatNode(chatName, phoneNode);
            });
        }


        // Prepara las tandas de opciones. Solo se hace una vez, 
        // y quita de las opciones aquellas que no se puedan elegir
        this.dispatcher.addOnce("prepareChoices1", this, (obj) => {
            this.dialogManager.activateOptions(false, () => {
                let node = this.dialogManager.currNode
                
                // Si se ha hablado de gastarle la broma a Maria
                if (this.gameManager.getValue("askedPrank")) {
                    // Si se gasta la broma, quita la opcion de que han intentado chantajear al jugador
                    if (this.gameManager.getValue("pranked")) {
                        node.choices.splice(1, 1);
                        node.next.splice(1, 1);    
                    }
                    // Si no se gasta la broma, quita la opcion de que han chantajeado al jugador
                    else {
                        node.choices.splice(2, 1);
                        node.next.splice(2, 1);
                    }
                }
                // Si no, quita las dos opciones para hablar sobre la broma a Maria
                else {
                    node.choices.splice(1, 2);
                    node.next.splice(1, 2);    
                }

                this.dialogManager.setTalking(false);
                this.dialogManager.setNode(node);
            }, 0, true);
            
        });

        this.dispatcher.addOnce("prepareChoices2", this, (obj) => {
            this.dialogManager.activateOptions(false, () => {
                let node = this.dialogManager.currNode
                
                // Si se ha perdido el movil (no se han intercambiado las contrasenas)
                if (!this.gameManager.getValue("passwordExchanged")) {
                    // Se quita la opcion de hablar sobre Alison
                    node.choices.splice(2, 1);
                    node.next.splice(2, 1);
                    
                    // Si se recupera el movil, se quita la opcion de no haber encontrado el movil
                    if (this.gameManager.getValue("phoneFound")) {
                        node.choices.splice(0, 1);
                        node.next.splice(0, 1);
                        
                    }
                    // Si no, se quita la opcion de que alguien le ha quitado el movil al jugador
                    else {
                        node.choices.splice(1, 1);
                        node.next.splice(1, 1);
                    }
                }
                // Si no, quita las dos opciones para hablar sobre el movil
                else {
                    node.choices.splice(0, 2);
                    node.next.splice(0, 2);    
                }

                this.dialogManager.setTalking(false);
                this.dialogManager.setNode(node);
            }, 0, true);
            
        });
    }

}
