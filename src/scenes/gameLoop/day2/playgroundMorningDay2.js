import PlaygroundBase from "../baseScenarios/playgroundBase.js";
import Character from "../../../gameObjects/character.js";

export default class PlaygroundMorningDay2 extends PlaygroundBase {
    constructor() {
        super('PlaygroundMorningDay2');
    }

    create(params) {
        super.create(params);

        this.home = "";
        this.stairs = "StairsMorningDay2";

        // Si no se llega tarde, se colocan personajes de fondo
        if (!this.gameManager.getValue(this.gameManager.isLate)) {
            let tr = {
                x: 350,
                y: this.CANVAS_HEIGHT * 0.975,
                scale: 0.075
            };
            let ana = new Character(this, "Ana", tr, this.portraitTr, () => {
                this.dialogManager.setNode(anaNode);
            });
            ana.setAnimation("IdleBase", true);
            this.portraits.set("Ana", ana.getPortrait());
    
            tr = {
                x: this.rightBound * 0.4,
                y: this.CANVAS_HEIGHT * 0.84,
                scale: 0.04
            };
            let maria = new Character(this, "Maria", tr, this.portraitTr, () => {
                this.dialogManager.setNode(mariaNode);
            });
            maria.setAnimation("IdleBase", true);
            this.portraits.set("Maria", maria.getPortrait());

            tr = {
                x: this.rightBound * 0.81,
                y: this.CANVAS_HEIGHT * 0.955,
                scale: 0.055
            };
            let jose = new Character(this, "Jose", tr, this.portraitTr, () => {
                this.dialogManager.setNode(joseNode);
            });
            jose.setAnimation("IdleBase", true);
            this.portraits.set("Jose", jose.getPortrait());


            let nodes = this.cache.json.get('playgroundMorningDay2');
            let anaNode = super.readNodes(nodes, "day2\\playgroundMorningDay2", "ana", true);
            let mariaNode = super.readNodes(nodes, "day2\\playgroundMorningDay2", "maria", true);
            let joseNode = super.readNodes(nodes, "day2\\playgroundMorningDay2", "jose", true);
            
            nodes = this.cache.json.get('everydayDialog');
            this.homeNode = super.readNodes(nodes, "everydayDialog", "playground.homeMorning", true);


            // Evento llamado cuando suena la campana
            this.dispatcher.addOnce("openDoors", this, (obj) => {
                console.log(obj);

                // Cambia la hora del movil
                this.phoneManager.setDayInfo("classStart");

                // Se quita el dialogo que aparece al hacer click en las puertas
                this.doorNode = null;
                super.openDoors();
            });
            
            // Prepara las tandas de opciones. Solo se hace una vez, 
            // y quita de las opciones aquellas que no se puedan elegir
            this.dispatcher.addOnce("prepareChoices", this, (obj) => {
                // Si Maria no ha avisado al jugador, se quita la opcion de hablarle a Ana sobre ello
                if (!this.gameManager.getValue("warned")) {
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
}
