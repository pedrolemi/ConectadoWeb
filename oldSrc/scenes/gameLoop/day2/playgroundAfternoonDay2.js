import PlaygroundBase from "../baseScenarios/playgroundBase.js";
import Character from "../../../gameObjects/character.js";

export default class PlaygroundAfternoonDay2 extends PlaygroundBase {
    constructor() {
        super('PlaygroundAfternoonDay2');
    }

    create(params) {
        super.create(params);

        this.home = "LivingroomAfternoonDay2";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("endClass");


        // Personajes
        let tr = {
            x: this.rightBound * 0.61,
            y: this.CANVAS_HEIGHT * 0.91,
            scale: 0.055
        };
        let jose = new Character(this, "Jose", tr, this.portraitTr, () => {
            this.dialogManager.setNode(voicesNode);
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
            this.dialogManager.setNode(voicesNode);
        });
        ana.setAnimation("IdleBase", true);
        this.portraits.set("Ana", ana.getPortrait());

        tr = {
            x: this.rightBound * 0.82,
            y: this.CANVAS_HEIGHT * 1.05,
            scale: 0.08
        };
        let alex = new Character(this, "Alex_front", tr, this.portraitTr, () => {
            this.dialogManager.setNode(voicesNode);
        });
        alex.setScale(-tr.scale, tr.scale)
        alex.setAnimation("IdleBase", true);
        this.portraits.set("Alex", alex.getPortrait());


        tr = {
            x: this.rightBound * 0.05,
            y: this.CANVAS_HEIGHT * 1.1,
            scale: 0.1
        };
        let guille = new Character(this, "Guille", tr, this.portraitTr, () => {
            this.dialogManager.setNode(guilleNode);
        });
        guille.setScale(-tr.scale, tr.scale)
        guille.setAnimation("IdleBase", true);
        this.portraits.set("Guille", guille.getPortrait());


        let nodes = this.cache.json.get('playgroundAfternoonDay2');
        let voicesNode = super.readNodes(nodes, "day2\\playgroundAfternoonDay2", "voices", true);
        let guilleNode = super.readNodes(nodes, "day2\\playgroundAfternoonDay2", "guille", true);
                
        nodes = this.cache.json.get('everydayDialog');
        this.doorNode = super.readNodes(nodes, "everydayDialog","playground.doorAfternoon", true);

    }
}
