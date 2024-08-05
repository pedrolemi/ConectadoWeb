import Button from '../button.js';
import GameManager from '../../managers/gameManager.js';
import LoginScreen from './loginScreen.js'
import SocialNetworkScreen from './socialNetworkScreen.js'

export default class ComputerScene extends Phaser.Scene {
    /**
     * Ordenador que se usa dentro del juego para consultar la red social
     * Nota: esta escena existe durante todo el juego, aunque se va durmiendo y despertando
     * en funcion de si se necesita usar o no
     * @extends Phaser.Scene
     */
    constructor() {
        super({ key: 'ComputerScene' });
    }

    create() {
        this.CANVAS_WIDTH = this.sys.game.canvas.width;
        this.CANVAS_HEIGHT = this.sys.game.canvas.height;

        this.gameManager = GameManager.getInstance();
        this.i18next = this.gameManager.i18next;
        this.userInfo = this.gameManager.userInfo;

        this.namespace = "computerInfo";

        // Mesa
        let bg = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, 'basePC');
        let scale = this.CANVAS_WIDTH / bg.width;
        bg.setScale(scale);

        // Color base del fondo de pantalla del ordenador
        this.add.rectangle(this.CANVAS_WIDTH / 2, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT / 1.2, 0x000000).setOrigin(0.5, 0);

        // Se crean en este punto para que las pantallas esten por encima del fondo del ordenador,
        // pero por debajo del marco
        this.socialNetScreen = new SocialNetworkScreen(this);
        this.socialNetScreen.setVisible(false);
        this.loginScreen = new LoginScreen(this);

        // Boton de apagar de la esquina inferior izquierda
        this.powerOffButton = new Button(this, 103.5, this.CANVAS_HEIGHT - 197, 0.31,
            () => {
                this.gameManager.leaveComputer();
            },
            'powerOff', { R: 255, G: 255, B: 255 }, { R: 200, G: 200, B: 200 }, { R: 150, G: 150, B: 150 }
        );

        // Boton de cerrar el ordenador de la esquina superior derecha
        this.closeButton = new Button(this, this.CANVAS_WIDTH - 99, 54, 0.82,
            () => {
                this.gameManager.leaveComputer();
            },
            { atlas: 'computerElements', frame: 'closerBrowser' }, { R: 255, G: 255, B: 255 }, { R: 200, G: 200, B: 200 }, { R: 150, G: 150, B: 150 },
        );
        // El boton de cerrar esta formado por tres botones
        // Se calcula el tam de uno (cruz) para que el area de colision sea el adecuado
        let oneButtonWidth = this.closeButton.fillImg.displayWidth / 3;
        this.closeButton.setHitArea({
            area: new Phaser.Geom.Rectangle(2 * oneButtonWidth, 0, oneButtonWidth, this.closeButton.fillImg.displayHeight),
            callback: Phaser.Geom.Rectangle.Contains
        })

        // Pantalla del ordenador con el tam del canvas
        let screen = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, 'PCscreen');
        screen.setDisplaySize(this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        // Posit con el usuario y contrasena del jugador
        let postitCont = this.add.container(1.3 * this.CANVAS_WIDTH / 4, this.CANVAS_HEIGHT - 100);
        let postitBg = this.add.image(0, 0, 'computerElements', 'postit');
        postitCont.add(postitBg);

        let postitTextInfoStyle = { ...this.gameManager.textConfig };
        postitTextInfoStyle.fontFamily = 'dadha';
        postitTextInfoStyle.fontSize = '60px';
        postitTextInfoStyle.color = '#323232';

        let postitTextStyle = postitTextInfoStyle;
        postitTextStyle.fontSize = '52px';

        // Informacion del personaje en el postit
        let postitTextsPos = {
            x: 180,
            offsetX: 15,
            firstTextY: -65,
            secondTextY: 95,
            offsetY: 75
        }
        // Nombre de usuario del personaje
        let yourUserTranslation = this.i18next.t("yourUserText", { ns: this.namespace });
        let yourUserText = this.add.text(-postitTextsPos.x, postitTextsPos.firstTextY, yourUserTranslation, postitTextInfoStyle);
        yourUserText.setOrigin(0, 0.5);
        postitCont.add(yourUserText);

        let userText = this.add.text(postitTextsPos.x + postitTextsPos.offsetX,
            postitTextsPos.firstTextY + postitTextsPos.offsetY, this.userInfo.username, postitTextStyle);
        userText.setOrigin(1, 0.5);
        postitCont.add(userText);

        // Contraseña del personaje
        let yourPasswordTranslation = this.i18next.t("yourPasswordText", { ns: this.namespace });
        let yourPasswordText = this.add.text(-postitTextsPos.x,
            postitTextsPos.secondTextY, yourPasswordTranslation, postitTextInfoStyle);
        yourPasswordText.setOrigin(0, 0.5);
        postitCont.add(yourPasswordText);

        let passwordText = this.add.text(postitTextsPos.x + postitTextsPos.offsetX,
            postitTextsPos.secondTextY + postitTextsPos.offsetY, this.userInfo.password, postitTextStyle);
        passwordText.setOrigin(1, 0.5);
        postitCont.add(passwordText);

        postitCont.setScale(0.37);
    }

    /**
     * Iniciar el ordenador
     * Nota: se llama justo antes de realizar el cambio a esta escena
     */
    start() {
        // Se resetean los colores de los botones al por defecto porque si se sale del ordenador
        // y luego se vuelve entrar, como los tweens de cambio de color al pasar el raton por encima
        // estaban activados, se sigue manteniendo ese color
        this.powerOffButton.reset();
        this.closeButton.reset();
        // Se inicia la pantalla de login
        this.socialNetScreen.setVisible(false);
        this.loginScreen.start();
        //this.loginScreen.setVisible(false);
        //this.socialNetScreen.start();
    }

    /**
     * Metodo para iniciar la red social despues de la pantalla de login
     * Nota: es la pantalla de login el que lo llama
     */
    logIntoSocialNet() {
        this.loginScreen.setVisible(false);
        this.socialNetScreen.start();
    }
}