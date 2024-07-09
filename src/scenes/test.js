import BaseScene from './baseScene.js';
import Character from '../gameObjects/character.js';
import EventDispatcher from '../eventDispatcher.js';

export default class Test extends BaseScene {
    constructor() {
        super('Test');
    }

    create() {
        super.create();

        let dadNode = super.readNodes("root", "test2", "Johanna", "female", true);
        let momNode = super.readNodes("root", "test1", "Johanna", "female", true);


        // Pone una imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        let scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(scale);
        
        bg.setInteractive();
        // bg.on('pointerdown', (pointer) => {
        //     this.dialogManager.textbox.activate(false);
        //     this.dialogManager.activateOptions(false);
        // });
        this.rightBound = bg.displayWidth;

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


        let dispatcher = EventDispatcher.getInstance();
        dispatcher.add("talked", this, (obj) => {
            console.log(obj);
            this.gameManager.setValue("talked", true);
        });
        dispatcher.addOnce("r", this, (obj) => {
            console.log(obj);
            this.gameManager.setValue("talked", false);
        });

        // dispatcher.add("prueba", this, () => {
        //     console.log("prueba");
        // })
        // dispatcher.removeByOwner(this);
        // dispatcher.removeByEvent("prueba");
        // dispatcher.add("hola", this, (nombre) => {
        //     console.log(nombre);
        //     gameManager.startLangMenu();
        // });
        // dispatcher.dispatch("hola", "juan");
    }



}
