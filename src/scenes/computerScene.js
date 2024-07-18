import Button from '../UI/button.js';
import GameManager from '../managers/gameManager.js';
import LoginScreen from '../UI/computer/loginScreen.js'
import SocialNetworkScreen from '../UI/computer/socialNetworkScreen.js'

export default class ComputerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ComputerScene' });
    }

    create() {
        const CANVAS_WIDTH = this.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.sys.game.canvas.height;

        let gameManager = GameManager.getInstance();

        // FONDOS
        // Mesa
        let bg = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'basePC');
        let scale = CANVAS_WIDTH / bg.width;
        bg.setScale(scale);

        // Color base del fondo de pantalla del ordenador
        this.add.rectangle(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, CANVAS_HEIGHT / 1.2, 0x000000).setOrigin(0.5, 0);

        /*
        this.loginScreen = new LoginScreen(this, () => {

        });
        */
        this.socialNetScreen = new SocialNetworkScreen(this);

        new Button(this, 103.5, CANVAS_HEIGHT - 197, 0.31,
            () => {
                this.socialNetScreen.setVisible(false);
                //gameManager.leaveComputer();
            },
            'powerOff', { R: 255, G: 255, B: 255 }, { R: 200, G: 200, B: 200 }, { R: 150, G: 150, B: 150 }
        );

        let closerButton = new Button(this, CANVAS_WIDTH - 99, 54, 0.82,
            () => {
                gameManager.leaveComputer();
            },
            'closerBrowser', { R: 255, G: 255, B: 255 }, { R: 200, G: 200, B: 200 }, { R: 150, G: 150, B: 150 },
        );
        let oneButtonWidth = closerButton.fillImg.displayWidth / 3;
        closerButton.setHitArea({
            area: new Phaser.Geom.Rectangle(2 * oneButtonWidth, 0, oneButtonWidth, closerButton.fillImg.displayHeight),
            callback: Phaser.Geom.Rectangle.Contains
        })

        // Pantalla del ordenador con el tam del canvas
        let screen = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'PCscreen');
        screen.setDisplaySize(CANVAS_WIDTH, CANVAS_HEIGHT);

        let postitCont = this.add.container(1.3 * CANVAS_WIDTH / 4, CANVAS_HEIGHT - 100);
        let postitBg = this.add.image(0, 0, 'postit');
        postitCont.add(postitBg);

        let userInfo = gameManager.getUserInfo();

        let postitTextInfoStyle = { ...gameManager.textConfig };
        postitTextInfoStyle.fontFamily = 'dadha';
        postitTextInfoStyle.fontSize = '60px';
        postitTextInfoStyle.color = '#323232';

        let postitTextStyle = postitTextInfoStyle;
        postitTextStyle.fontSize = '52px';

        let postitTextsPos = {
            x: 180,
            offsetX: 15,
            firstTextY: -65,
            secondTextY: 95,
            offsetY: 75
        }
        let yourUserText = this.add.text(-postitTextsPos.x, postitTextsPos.firstTextY, "Tu usuario", postitTextInfoStyle);
        yourUserText.setOrigin(0, 0.5);
        postitCont.add(yourUserText);

        let userText = this.add.text(postitTextsPos.x + postitTextsPos.offsetX,
            postitTextsPos.firstTextY + postitTextsPos.offsetY, userInfo.username, postitTextStyle);
        userText.setOrigin(1, 0.5);
        postitCont.add(userText);

        let yourPasswordText = this.add.text(-postitTextsPos.x,
            postitTextsPos.secondTextY, "Tu contraseña", postitTextInfoStyle);
        yourPasswordText.setOrigin(0, 0.5);
        postitCont.add(yourPasswordText);

        let passwordText = this.add.text(postitTextsPos.x + postitTextsPos.offsetX,
            postitTextsPos.secondTextY + postitTextsPos.offsetY, userInfo.password, postitTextStyle);
        passwordText.setOrigin(1, 0.5);
        postitCont.add(passwordText);

        postitCont.setScale(0.37);
    }

    reset() {
        this.socialNetScreen.setVisible(false);
        this.loginScreen.reset();
        this.loginScreen.setVisible(true);
    }
}