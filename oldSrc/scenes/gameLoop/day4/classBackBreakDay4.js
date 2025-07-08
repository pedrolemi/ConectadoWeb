import ClassBackBase from "../baseScenarios/classBackBase.js";

export default class ClassBackBreakDay4 extends ClassBackBase {
    constructor() {
        super('ClassBackBreakDay4');
    }

    create(params) {
        super.create(params);

        this.corridor = "CorridorBreakDay4";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("startBreak");

        // Personajes
        let tr = {
            x: this.rightBound * 0.305,
            y: this.CANVAS_HEIGHT * 0.59,
            scale: this.scale * 0.33
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar11').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row1Chairs.depth - 1);

        tr = {
            x: this.rightBound * 0.44,
            y: this.CANVAS_HEIGHT * 0.58,
            scale: this.scale * 0.37
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar15').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row1Chairs.depth - 1);

        // Se desactiva el telefono y se muestra el dialogo de que ha desaparecido
        this.phoneManager.activate(false);
        let nodes = this.cache.json.get('classBackBreakDay4');
        let node = super.readNodes(nodes, "day4\\classBackBreakDay4", "noPhone", true);
        setTimeout(() => {
            this.dialogManager.setNode(node);
        }, 100);

    }
}
