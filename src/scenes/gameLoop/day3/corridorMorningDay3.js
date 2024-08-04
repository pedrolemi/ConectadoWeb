import CorridorBase from "../baseScenarios/corridorBase.js";
import Character from "../../../gameObjects/character.js";

export default class CorridorMorningDay3 extends CorridorBase {
    constructor() {
        super('CorridorMorningDay3');
    }

    create(params) {
        super.create(params);

        this.stairs = "StairsMorningDay3";
        this.class = "ClassFrontMorningDay3";

        
        let nodes = this.cache.json.get('everydayDialog');
        let boardNode = super.readNodes(nodes, "everydayDialog", "board", true);
        // Foto
        let blackBG = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0x000, 0.9).setOrigin(0, 0);

        let img = "photoGum";
        if (this.gameManager.getValue("gumWashed")) {
            img = "photoGumWashed";
        }
        let photo = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT * 0.4, "photos", img).setOrigin(0.5, 0.5);
        photo.setScale(1.2);
        let borderWidth = 20;
        let photoBorder = this.add.rectangle(photo.x, photo.y, photo.displayWidth + borderWidth, photo.displayHeight + borderWidth, 0xf2f2f2, 1).setOrigin(0.5, 0.5);

        this.photo = this.add.container(0, 0).setScrollFactor(0);
        this.photo.add(blackBG);
        this.photo.add(photoBorder);
        this.photo.add(photo);
        this.photo.visible = false;

        // Tablon de anuncios
        let bulletinBoard = this.add.rectangle(2261 * this.scale, 388 * this.scale, 570 * this.scale, 590 * this.scale, 0xfff, 0).setOrigin(0, 0);
        bulletinBoard.setInteractive({ useHandCursor: true });
        bulletinBoard.on('pointerdown', () => {
            this.photo.visible = true;
            this.dialogManager.setNode(boardNode);
        })

        // Evento llamado cuando acaba el dialogo de ver la foto
        this.dispatcher.add("closePhoto", this, (obj) => {
            console.log(obj);

            // Oculta la foto
            this.photo.visible = false;
        });

        this.photo.setDepth(3);
        bulletinBoard.setDepth(1);

        // Si no se llega tarde, se colocan personajes en el fondo
        if (!this.gameManager.getValue("isLate")) {
            let tr = {
                x: this.rightBound * 0.78,
                y: this.CANVAS_HEIGHT * 0.93,
                scale: 0.14
            };
            let alison = new Character(this, "Alison", tr, this.portraitTr, () => {
                this.dialogManager.setNode(alisonNode);
            });
            alison.setDepth(bulletinBoard.depth + 1)
            alison.setAnimation("IdleBase", true);
            this.portraits.set("Alison", alison.getPortrait());

            nodes = this.cache.json.get('corridorMorningDay3');
            let alisonNode = super.readNodes(nodes, "day3\\corridorMorningDay3", "alison", true);
        }


    }
}
