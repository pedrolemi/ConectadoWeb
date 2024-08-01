import ClassBackBase from "../baseScenarios/classBackBase.js";
import Character from "../../../gameObjects/character.js";

export default class ClassBackBreakDay2 extends ClassBackBase {
    constructor() {
        super('ClassBackBreakDay2');
    }

    create(params) {
        super.create(params);

        this.corridor = "CorridorBreakDay2";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("startBreak");


        // Personajes
        let tr = {
            x: this.rightBound * 0.18,
            y: this.CANVAS_HEIGHT * 0.72,
            scale: 0.08
        };
        let alex = new Character(this, "Alex_front", tr, this.portraitTr, () => {
            this.dialogManager.setNode(alexNode);
         });
        alex.setDepth(this.row1Tables.depth - 1);
        alex.setAnimation("IdleBase", true);
        this.portraits.set("Alex", alex.getPortrait());

        let nodes = this.cache.json.get('classBackBreakDay2');
        let alexNode = super.readNodes(nodes, "day2\\classBackBreakDay2", "alex", true);


        // Personajes de fondo
        tr = {
            x: this.rightBound * 0.46,
            y: this.CANVAS_HEIGHT * 0.65,
            scale: this.scale * 0.68
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar8').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row4Chairs.depth - 1);

        tr = {
            x: this.rightBound * 0.72,
            y: this.CANVAS_HEIGHT * 0.69,
            scale: this.scale * 0.72
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar12').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row4Chairs.depth - 1);

        tr = {
            x: this.rightBound * 0.05,
            y: this.CANVAS_HEIGHT * 0.62,
            scale: this.scale * 0.61
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar4').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row3Chairs.depth - 1);
        
        tr = {
            x: this.rightBound * 0.26,
            y: this.CANVAS_HEIGHT * 0.63,
            scale: this.scale * 0.56
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar10').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row3Chairs.depth - 1);

        
    }
}
