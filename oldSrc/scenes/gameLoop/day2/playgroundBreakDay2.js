import PlaygroundBase from "../baseScenarios/playgroundBase.js";
import Character from "../../../gameObjects/character.js";

export default class PlaygroundBreakDay2 extends PlaygroundBase {
    constructor() {
        super('PlaygroundBreakDay2');
    }

    create(params) {
        super.create(params);

        this.home = "";
        this.stairs = "StairsBreakDay2";

        // Se abren las puertas 
        super.openDoors();
        this.doorNode = null;

        // Personajes
        let tr = {
            x: this.rightBound * 0.61,
            y: this.CANVAS_HEIGHT * 0.91,
            scale: 0.055
        };
        let jose = new Character(this, "Jose", tr, this.portraitTr, () => {
            this.dialogManager.setNode(ana_joseNode);
        });
        jose.setScale(-tr.scale, tr.scale)
        jose.setAnimation("IdleBase", true);
        this.portraits.set("Jose", jose.getPortrait());
        
        tr = {
            x: this.rightBound * 0.65,
            y: this.CANVAS_HEIGHT * 0.91,
            scale: 0.05
        };
        let ana = new Character(this, "Ana", tr, this.portraitTr, () => {
            this.dialogManager.setNode(ana_joseNode);
        });
        ana.setAnimation("IdleBase", true);
        this.portraits.set("Ana", ana.getPortrait());

        tr = {
            x: this.rightBound * 0.85,
            y: this.CANVAS_HEIGHT * 1.2,
            scale: 0.1
        };
        let alison = new Character(this, "Alison", tr, this.portraitTr, () => {
            this.dialogManager.setNode(guille_alisonNode);
        });
        alison.setScale(-tr.scale, tr.scale)
        alison.setAnimation("IdleBase", true);
        this.portraits.set("Alison", alison.getPortrait());

        tr = {
            x: this.rightBound * 0.92,
            y: this.CANVAS_HEIGHT * 1.15,
            scale: 0.1
        };
        let guille = new Character(this, "Guille", tr, this.portraitTr, () => {
            this.dialogManager.setNode(guille_alisonNode);
        });
        guille.setAnimation("IdleBase", true);
        this.portraits.set("Guille", guille.getPortrait());


        let nodes = this.cache.json.get('playgroundBreakDay2');
        let ana_joseNode = super.readNodes(nodes, "day2\\playgroundBreakDay2", "ana_jose", true);
        let guille_alisonNode = super.readNodes(nodes, "day2\\playgroundBreakDay2", "guille_alison", true);
                
        nodes = this.cache.json.get('everydayDialog');
        this.homeNode = super.readNodes(nodes, "everydayDialog", "playground.homeBreak", true);

    }
}
