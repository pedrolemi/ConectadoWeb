import ClassBackBase from "../baseScenarios/classBackBase.js";
import Character from "../../../gameObjects/character.js";

export default class ClassBackBreakDay1 extends ClassBackBase {
    constructor() {
        super('ClassBackBreakDay1');
    }

    create(params) {
        super.create(params);

        this.corridor = "CorridorBreakDay1";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("startBreak");


        // Imagen de la puerta (para bloquear la interaccion)
        let doorPos = {
            x: 2224 * this.scale,
            y: 530 * this.scale
        };
        let doorClosed = this.add.image(doorPos.x, doorPos.y, this.atlasName, 'classDoorClosed').setOrigin(0, 0).setScale(this.scale).setInteractive();
        doorClosed.setInteractive();


        // Personajes
        let tr = {
            x: this.rightBound * 0.33,
            y: this.CANVAS_HEIGHT * 1.12,
            scale: 0.12
        };
        let alison = new Character(this, "Alison", tr, this.portraitTr, () => {
            this.dialogManager.setNode(alisonNode);
        });
        alison.setAnimation("IdleBase", true);
        this.portraits.set("Alison", alison.getPortrait());
        alison.setScale(-tr.scale, tr.scale)
        alison.setDepth(this.row5Chairs.depth + 1);

        tr = {
            x: this.rightBound * 0.78,
            y: this.CANVAS_HEIGHT * 0.69,
            scale: 0.07
        };
        let alex = new Character(this, "Alex_front", tr, this.portraitTr, () => {
            this.dialogManager.setNode(alexNode);

         });
        alex.setScale(-tr.scale, tr.scale);
        alex.setDepth(this.row1Tables.depth - 1);
        alex.setAnimation("IdleBase", true);
        this.portraits.set("Alex", alex.getPortrait());


        let nodes = this.cache.json.get('classBackBreakDay1');
        let alexNode = super.readNodes(nodes, "day1\\classBackBreakDay1", "alex", true);
        let alisonNode = super.readNodes(nodes, "day1\\classBackBreakDay1", "alison", true);
        this.doorNode = super.readNodes(nodes, "day1\\classBackBreakDay1", "door", true);


        // Eventos llamados cuando se termina de hablar con Alex
        this.dispatcher.addOnce("moveAlex", this, (obj) => {
            console.log(obj);

            alex.char.disableInteractive();
            let anim = this.tweens.add({
                targets: [alex.char],
                alpha: { from: 1, to: 0 },
                duration: 500,
                repeat: 0,
            });

            anim.on('complete', () => {
                tr = {
                    x: this.rightBound * 0.84,
                    y: this.CANVAS_HEIGHT * 0.74,
                };
                alex.setPosition(tr.x, tr.y);

                anim = this.tweens.add({
                    targets: [alex.char],
                    alpha: { from: 0, to: 1 },
                    duration: 500,
                    repeat: 0,
                });
                alex.setScale(-0.08, 0.08)
                anim.on('complete', () => {
                    alex.char.setInteractive();
                    doorClosed.visible = false;
                    doorClosed.disableInteractive();
                })
            })
        });
        this.dispatcher.addOnce("leaveAlex", this, (obj) => {
            console.log(obj);

            alex.char.disableInteractive();
            let anim = this.tweens.add({
                targets: [alex.char],
                alpha: { from: 1, to: 0 },
                duration: 500,
                repeat: 0,
            });
            anim.on('complete', () => {
                doorClosed.visible = false;
                doorClosed.disableInteractive();
            })
        });

        // Evento llamado cuando se termina de hablar con Alison
        this.dispatcher.addOnce("setTalkedAlison", this, (obj) => {
            console.log(obj);
            this.doorNode = null;
        });



        // Personajes de fondo
        tr = {
            x: this.rightBound * 0.46,
            y: this.CANVAS_HEIGHT * 0.62,
            scale: this.scale * 0.53
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar2').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row3Chairs.depth - 1);

        tr = {
            x: this.rightBound * 0.655,
            y: this.CANVAS_HEIGHT * 0.625,
            scale: this.scale * 0.6
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar3').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row3Chairs.depth - 1);

        tr = {
            x: this.rightBound * 0.61,
            y: this.CANVAS_HEIGHT * 0.585,
            scale: this.scale * 0.53
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar9').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row2Chairs.depth - 1);
        
        tr = {
            x: this.rightBound * 0.18,
            y: this.CANVAS_HEIGHT * 0.58,
            scale: this.scale * 0.45
        };
        this.add.image(tr.x, tr.y, this.atlasName, 'backChar7').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row1Chairs.depth - 1);

    }
}
