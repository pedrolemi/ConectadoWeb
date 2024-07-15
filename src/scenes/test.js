import BaseScene from './baseScene.js';
import Character from '../gameObjects/character.js';

export default class Test extends BaseScene {
    constructor() {
        super('Test');
    }

    create() {
        super.create();

        let test1 = this.cache.json.get('momDialog');
        let test2 = this.cache.json.get('dadDialog');
        let test3 = this.cache.json.get('chat1');

        let momNode = super.readNodes("root", test1, "momDialog", this.gameManager.getUserInfo().name, this.gameManager.getUserInfo().gender, true);
        let dadNode = super.readNodes("root", test2, "dadDialog", this.gameManager.getUserInfo().name, this.gameManager.getUserInfo().gender, true);

        let choices = super.readNodes("root", test3, "chat1", this.gameManager.getUserInfo().name, this.gameManager.getUserInfo().gender, true);

        let hour = "5:20";
        let day = this.i18next.t("clock.test", { ns: "phone" });
        
        this.phoneManager.phone.setDayInfo(hour, day)
        this.phoneManager.phone.showChat(0);
        this.phoneManager.phone.setChatNode(0, choices);
        this.phoneManager.phone.showChat(1);

        this.phoneManager.phone.toMainScreen();
        this.phoneManager.phone.addMessage(0, "aaaa", "a", "aaaaaaaaaa" );

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


        this.dispatcher.add("talked", this, (obj) => {
            console.log(obj);
            this.gameManager.setValue("talked", true);
        });
        this.dispatcher.addOnce("r", this, (obj) => {
            console.log(obj);
            this.gameManager.setValue("talked", false);
            
        });

        let rect = this.add.rectangle(0, 0, 200, 200, '0x000000');
        rect.setInteractive();
        rect.setOrigin(0);
        rect.on('pointerdown', () => {
            this.gameManager.switchToComputer();
        });
    }
}
