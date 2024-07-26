import ClassBackBase from "../classBackBase.js";

export default class ClassBackMorningDay1 extends ClassBackBase {
    constructor() {
        super('ClassBackMorningDay1');
    }

    create(params) {
        super.create(params);
        
        this.doorClosed.disableInteractive();


        let tr = {
            x: this.rightBound / 2,
            y: this.CANVAS_HEIGHT * 0.37,
            scale: 0.07
        };
        let teacher = this.add.image(tr.x, tr.y, 'characters', 'teacher').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row1Tables.depth - 1);
        let teacherPortrait = this.add.image(this.portraitTr.x, this.portraitTr.y + 20, 'characters', 'teacher').setOrigin(0.5, 1).setScale(this.portraitTr.scale);
        this.portraits.set("teacher", teacherPortrait);

        let nodes = this.cache.json.get('ClassBackMorningDay1');
        setTimeout(() => {
            let node = super.readNodes(nodes, "day1\\ClassBackMorningDay1", "beforeEnter", true);
            this.dialogManager.setNode(node)
        }, 500);
    }
}
