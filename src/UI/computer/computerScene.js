import Button from '../button.js';
import GameManager from '../../managers/gameManager.js';
import LoginScreen from './loginScreen.js'
import SocialNetworkScreen from './socialNetworkScreen.js'
import BaseScene from '../../scenes/gameLoop/baseScene.js';

export default class ComputerScene extends BaseScene {
    /**
     * Ordenador que se usa dentro del juego para consultar la red social
     * Nota: esta escena existe durante todo el juego, aunque se va durmiendo y despertando
     * en funcion de si se necesita usar o no
     * @extends Phaser.Scene
     */
    constructor() {
        super('ComputerScene');
    }

    create() {
        super.create();

        this.userInfo = this.gameManager.userInfo;
        this.namespace = "computer\\computerInfo";

        // No se puede hacer scroll
        this.rightBound = this.CANVAS_WIDTH;

        // Opcione por defecto que se usan para ajustar el tam de la fuente a un ancho determinado
        this.defaultSizeConfig = {
            increament: 1.1,        // cuanto se va incrementando cada vez
            decreasement: 0.9,      // cuanto se va reduciendo cada vez
            max: 60.0,
            min: 15.0               // minimo de tam de fuente permitido
        }

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

        let postitTextStyle = { ...postitTextInfoStyle };
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

        // Nota: llamarlo despues de que el texto y el fondo se hayan metido en todos los contenedores oportunos y hayan
        // sufrido todas las transformaciones para que se puedan calcular correctamente los tamanos
        let proportion = 0.8;
        this.adjustFontSizeToObjectWidth(yourUserText, postitBg, proportion);
        this.adjustFontSizeToObjectWidth(yourPasswordText, postitBg, proportion);
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
    }

    /**
     * Metodo para iniciar la red social despues de la pantalla de login
     * Nota: es la pantalla de login el que lo llama
     */
    logIntoSocialNet() {
        this.loginScreen.setVisible(false);
        this.socialNetScreen.start();
    }

    /**
     * Ajustar el texto al ancho de un objeto teniendo tambien en cuenta unos tamanos de fuentes limites
     * Para ello se modifica el tam de la fuente del texto
     * Nota: se calcula todo en posiciones globales por si el texto y el objeto pertenecen a sistemas de coordenadas
     * Por lo tanto, es importante que este metodo se llame cuando texto y objeto han sufrido todas las transformaciones
     * oportunas para que se hagan los calculos correctamente
     * @param {Text} text - texto que se ajusta
     * @param {Object} object - objecto (ancho)
     * @param {Number} proportion - parte del ancho que se tiene en cuenta (opcional)
     * @param {Object} sizeLimits - tamanos de fuentes limites (opcional, sino se cogen los por defecto)
     */
    adjustFontSizeToObjectWidth(text, object, proportion = 1, sizeLimits) {
        // Se comprueba si se han proporcionado tams de fuentes limites
        let min = this.defaultSizeConfig.min;
        let max = this.defaultSizeConfig.max;
        if (sizeLimits) {
            if (sizeLimits.min) {
                min = sizeLimits.min;
            }
            if (sizeLimits.max) {
                max = sizeLimits.max;
            }
        }

        // Matriz del texto
        let textMatrix = text.getWorldTransformMatrix();

        // Matriz del objeto
        let objectMatrix = object.getWorldTransformMatrix();
        // Ancho que debe ocupar el objeto
        let limitWidth = object.width * proportion * objectMatrix.scaleX;

        // Si esta el debug activado, se muestra el area que debe ocupar el texto
        if (this.sys.game.debug) {
            // Posicion del texto, pero tams del objeto
            let limitWidthArea = this.add.rectangle(textMatrix.tx, textMatrix.ty, limitWidth, text.height * textMatrix.scaleY, '#000000');
            limitWidthArea.setOrigin(text.originX, text.originY);
            limitWidthArea.setAlpha(0.25);
        }

        // Se obtiene el tam del texto actual
        let fontSize = text.style.fontSize;
        fontSize = fontSize.slice(0, fontSize.length - 2);
        fontSize = Number(fontSize);

        let endSize = fontSize;

        // Ancho actual del texto
        let textWidth = text.width * textMatrix.scaleX;

        // Si el tam del texto es mayor que el ancho permitido...
        if (textWidth > limitWidth) {
            // Se va reduciendo el tam
            while (text.width * textMatrix.scaleX > limitWidth && fontSize > min) {
                fontSize = Math.floor(fontSize * this.defaultSizeConfig.decreasement);
                text.setFontSize(fontSize);
            }
            endSize = fontSize;
        }
        // Si el tam del texto es menor que el ancho permitido...
        else {
            // Se va aumentando el tam

            // Nota: hay que guardar el previo que es el que aun no se ha salido del ancho del objeto
            let previousFontSize = fontSize;
            while (text.width * textMatrix.scaleX < limitWidth && previousFontSize < max) {
                previousFontSize = fontSize;
                fontSize = Math.ceil(fontSize * this.defaultSizeConfig.increament);
                text.setFontSize(fontSize);
            }
            endSize = previousFontSize;
        }

        // Se comprueba si el tam encontrado esta dentro del permitido...
        // Es menor que el permitido
        if (endSize < min) {
            text.setFontSize(min);
        }
        else {
            // Es mayor que el permitido
            if (endSize > max) {
                text.setFontSize(max);
            }
            // Es correcto
            else {
                text.setFontSize(endSize);
            }
        }
    }
}