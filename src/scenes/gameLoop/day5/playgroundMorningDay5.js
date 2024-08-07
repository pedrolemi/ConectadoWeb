import PlaygroundBase from "../baseScenarios/playgroundBase.js";
import Character from "../../../gameObjects/character.js";

export default class PlaygroundMorningDay5 extends PlaygroundBase {
    constructor() {
        super('PlaygroundMorningDay5');
    }

    create(params) {
        super.create(params);

        this.home = "";
        this.stairs = "StairsMorningDay5";
        
        let tr = {
            x: this.rightBound * 0.4,
            y: this.CANVAS_HEIGHT * 0.89,
            scale: 0.055
        };
        let alison = new Character(this, "Alison", tr, this.portraitTr, () => {
            this.dialogManager.setNode(alisonNode);
        });
        alison.setAnimation("IdleBase", true);
        this.portraits.set("Alison", alison.getPortrait());

        tr = {
            x: this.rightBound * 0.37,
            y: this.CANVAS_HEIGHT * 0.87,
            scale: 0.055
        };
        let ana = new Character(this, "Ana", tr, this.portraitTr, () => {
            this.dialogManager.setNode(anaNode);
        });
        ana.setAnimation("IdleBase", true);
        this.portraits.set("Ana", ana.getPortrait());

        let nodes = this.cache.json.get('playgroundMorningDay5');
        let alisonNode = super.readNodes(nodes, "day5\\playgroundMorningDay5", "alison", true);
        let anaNode = super.readNodes(nodes, "day5\\playgroundMorningDay5", "ana", true);
        
        nodes = this.cache.json.get('everydayDialog');
        this.homeNode = super.readNodes(nodes, "everydayDialog", "playground.homeMorning", true);

        // Se muestra el dialogo de Ana directamente
        setTimeout(() => {
            this.dialogManager.setNode(anaNode);
        }, 100);

        // Evento llamado cuando suena la campana
        this.dispatcher.addOnce("openDoors", this, (obj) => {
            // Cambia la hora del movil
            this.phoneManager.setDayInfo("classStart");

            // Se quita el dialogo que aparece al hacer click en las puertas y se abren
            this.doorNode = null;
            super.openDoors();
        });
    }
}
