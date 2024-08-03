import BaseScene from './gameLoop/baseScene.js';
import Character from '../gameObjects/character.js';

export default class Test extends BaseScene {
    constructor() {
        super('Test');
    }

    init() {
        console.log("init");

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

    create(params) {
        super.create(params);

        // Pone una imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'playgroundClosed').setOrigin(0, 0);
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


        let test1 = this.cache.json.get('momDialog');
        let test2 = this.cache.json.get('dadDialog');
        let test3 = this.cache.json.get('chat1');

        let momNode = super.readNodes(test1, "test\\momDialog", "", true);
        let dadNode = super.readNodes(test2, "test\\dadDialog", "", true);
        let choices = super.readNodes(test3, "test\\chat1", "", true);

        // Telefono
        /*
        let chatName = this.i18next.t("textMessages.chat1", { ns: "phoneInfo", returnObjects: true });
        this.phoneManager.phone.addChat(chatName, "Alex");
        this.phoneManager.phone.setChatNode(chatName, choices);

        this.phoneManager.phone.addMessage(chatName, "aawequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbwequkbaa", "a", "aaaaaaaaaa");
        this.phoneManager.phone.addMessage(chatName, "ssadasda", "a", "jjjjjj");
        this.phoneManager.phone.addMessage(chatName, "wequkb", "a", "dddd");

        chatName = this.i18next.t("textMessages.chat2", { ns: "phoneInfo", returnObjects: true });
        */

        let debug = this.sys.game.debug;
        this.dispatcher.removeAll();
        //this.dispatcher.add('hola', this, this.fnTest);
        //this.dispatcher.add('hola', this, this.fnTest, true);

        let computerTest = this.cache.json.get('computerTest');
        // let ownPostNode = super.readNodes(computerTest, "test\\computerTest", "", true);
        // let refuseNode = super.readNodes(computerTest, "test\\computerTest", "Alison.refuse", true);
        let postNode = super.readNodes(computerTest, "test\\computerTest", "Alison.post", true);
        // let socialNetwork = this.gameManager.computerScene.socialNetScreen;
        // socialNetwork.setOwnPostNode(ownPostNode);
        // socialNetwork.createPost('Alison', 'post0');
        // socialNetwork.addFriendRequest('Alison');
        // socialNetwork.createPost('Alison', 'post0');
        // socialNetwork.setRefuseNode('Alison', refuseNode);
        // socialNetwork.setPostNode('Alison', 'post0', postNode);

        this.dialogManager.setNode(postNode);

        // Ordenador
        let computer = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, 'bedroom', 'computer');
        computer.setScale(0.5);
        computer.setInteractive();
        computer.on('pointerdown', () => {
            this.gameManager.switchToComputer();
        });
    }

    fnTest() {
        console.log("juan");
    }
}
