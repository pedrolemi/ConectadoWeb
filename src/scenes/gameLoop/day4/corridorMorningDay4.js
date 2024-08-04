import CorridorBase from "../baseScenarios/corridorBase.js";
import Character from "../../../gameObjects/character.js";

export default class CorridorMorningDay4 extends CorridorBase {
    constructor() {
        super('CorridorMorningDay4');
    }

    create(params) {
        super.create(params);

        this.stairs = "StairsMorningDay4";
        this.class = "ClassFrontMorningDay4";
        
        // Tablon de anuncios
        let bulletinBoard = this.add.rectangle(2261 * this.scale, 388 * this.scale, 570 * this.scale, 590 * this.scale, 0xfff, 0).setOrigin(0, 0);
        bulletinBoard.setInteractive({ useHandCursor: true });
        bulletinBoard.on('pointerdown', () => {
            this.dialogManager.setNode(boardNode);
        })

        // Si no se llega tarde, se colocan personajes en el fondo
        if (!this.gameManager.getValue("isLate")) {
            let tr = {
                x: this.rightBound * 0.6,
                y: this.CANVAS_HEIGHT * 0.75,
                scale: 0.087
            };
            let ana = new Character(this, "Ana", tr, this.portraitTr, () => {
                this.dialogManager.setNode(alexAnaNode);
            });
            ana.setScale(-tr.scale, tr.scale)
            ana.setAnimation("IdleBase", true);
            this.portraits.set("Ana", ana.getPortrait());

            tr = {
                x: this.rightBound * 0.65,
                y: this.CANVAS_HEIGHT * 0.75,
                scale: 0.092
            };
            let alex = new Character(this, "Alex_front", tr, this.portraitTr, () => {
                this.dialogManager.setNode(alexAnaNode);
            });
            alex.setScale(-tr.scale, tr.scale)
            alex.setAnimation("IdleBase", true);
            this.portraits.set("Alex", alex.getPortrait());

            let nodes = this.cache.json.get('corridorMorningDay4');
            let alexAnaNode = super.readNodes(nodes, "day4\\corridorMorningDay4", "alexAna", true);
        }

        let nodes = this.cache.json.get('corridorMorningDay4');
        let boardNode = super.readNodes(nodes, "day4\\corridorMorningDay4", "board", true);
    }
}
