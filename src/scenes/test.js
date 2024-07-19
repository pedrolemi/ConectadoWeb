import BaseScene from './gameLoop/baseScene.js';
import Character from '../gameObjects/character.js';

export default class Test extends BaseScene {
    constructor() {
        super('Test');
    }

    // Metodo que se llama al terminar de crear la escena. 
    onCreate() {
        super.onCreate();
        // this.phoneManager.showPhone(true);
        // this.phoneManager.openEyesAnimation();
        // this.phoneManager.phone.toAlarmScreen();
        this.phoneManager.topLid.visible = false;
        this.phoneManager.botLid.visible = false;
    }

    create() {
        super.create();

        let test1 = this.cache.json.get('momDialog');
        let test2 = this.cache.json.get('dadDialog');
        let test3 = this.cache.json.get('chat1');
        let computerTest = this.cache.json.get('computer');

        let momNode = super.readNodes("root", test1, "momDialog", true);
        let dadNode = super.readNodes("root", test2, "dadDialog", true);
        let choices = super.readNodes("root", test3, "chat1", true);
        let computerNode = super.readNodes("root1", computerTest, "computer", true);

        // Telefono
        let chatName = this.i18next.t("textMessages.chat1", { ns: "phoneInfo", returnObjects: true });
        this.phoneManager.phone.addChat(chatName, "testIcon");
        this.phoneManager.phone.setChatNode(chatName, choices);
        
        this.phoneManager.phone.addMessage(chatName, "aawequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbaa", "a", "aaaaaaaaaa" );
        this.phoneManager.phone.addMessage(chatName, "ssadasda", "a", "jjjjjj" );
        this.phoneManager.phone.addMessage(chatName, "wequkb", "a", "dddd" );

        chatName = this.i18next.t("textMessages.chat2", { ns: "phoneInfo", returnObjects: true });
        this.phoneManager.phone.addChat(chatName, "testIcon");

        // Pone una imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        let scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(scale);
        this.rightBound = bg.displayWidth;

        // Personaje
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

        // Ordenador
        let computer = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, 'computerImg');
        computer.setScale(0.5);
        computer.setInteractive();
        computer.on('pointerdown', () => {
            //this.dialogManager.setNode(computerNode);
            this.gameManager.switchToComputer();
        });

        this.dispatcher.add("switchToComputer", this, () => {
            this.gameManager.switchToComputer();
        });
    }
}
