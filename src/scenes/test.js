import BaseScene from './baseScene.js';
import Character from '../character.js';

export default class Test extends BaseScene {
    constructor() {
        super('Test');
    }

    create() {
        super.create();

        let dadNode = super.readNodes("root", "ohi", "Johanna", "female", true);
        let momNode = super.readNodes("root", "test1", "Johanna", "female", true);


        // Pone una imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(this.CANVAS_WIDTH / 2, 0, 'bg').setOrigin(0.5, 0);
        let scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(scale);

        bg.setInteractive();
        // bg.on('pointerdown', (pointer) => {
        //     this.dialogManager.textbox.activate(false);
        //     this.dialogManager.activateOptions(false);

        //     super.changeScene("Test2");
        // });

        let tr = {
            x: this.CANVAS_WIDTH / 3.5,
            y: this.CANVAS_HEIGHT / 1.1,
            scale: 0.2
        };

        let mom = new Character(this, "mom", tr, this.portraitTr, () => {
            this.dialogManager.setNode(momNode)
        });
        mom.setAnimation("Walk", true);

        tr.x = this.CANVAS_WIDTH / 1.5;
        let dad = new Character(this, "dad", tr, this.portraitTr, () => {
            this.dialogManager.setNode(dadNode);
        });
        dad.setAnimation("Idle01", true);


        this.portraits.set("mom", mom.getPortrait());
        this.portraits.set("dad", dad.getPortrait());



        // IMPORTANTE: LLAMARLO CUANDO SE HAYA CREADO LA ESCENA
        this.dialogManager.changeScene(this);

    }



}
