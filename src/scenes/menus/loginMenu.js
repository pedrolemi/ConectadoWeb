import Button from '../../UI/button.js'
import GameManager from '../../managers/gameManager.js'
import CheckBox from '../../UI/checkbox.js'
import RadioButtonGroup from '../../UI/radioButtonGroup.js'
import TextInput from '../../UI/textInput.js'

export default class LoginMenu extends Phaser.Scene {
    /**
     * Menu donde el jugador introduce su informacion
     * @extends Phaser.Scene
     */
    constructor() {
        super({ key: 'LoginMenu' });
    }

    create() {
        const CANVAS_WIDTH = this.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.sys.game.canvas.height;

        this.gameManager = GameManager.getInstance();
        this.i18next = this.gameManager.i18next;
        this.namespace = 'menus\\loginMenu';
        this.maxNameCharacters = 10;
        this.maxUserCharacters = 16;

        // Mesa
        let bg = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'basePC');
        let scale = CANVAS_WIDTH / bg.width;
        bg.setScale(scale);

        // Color base del fondo de pantalla del ordenador
        this.add.rectangle(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, CANVAS_HEIGHT / 1.2, 0x2B9E9E).setOrigin(0.5, 0);

        // Fondo de login del ordenador
        let loginBg = this.add.image(0.23 * CANVAS_WIDTH / 5, 4.1 * CANVAS_HEIGHT / 5, 'loginBg');
        loginBg.setOrigin(0, 1).setScale(0.61);
        loginBg.displayWidth += 20;

        // Pantalla del ordenador con el tam del canvas
        let screen = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'PCscreen');
        screen.setDisplaySize(CANVAS_WIDTH, CANVAS_HEIGHT);

        // Boton atras
        let backButton = this.createBackButton(102, 3 * CANVAS_HEIGHT / 4 + 15, 4, 1.18);
        let backTranslation = this.i18next.t("backButton", { ns: this.namespace });
        let backTextStyle = { ...this.gameManager.textConfig };
        backTextStyle.fontFamily = 'AUdimat-regular';
        backTextStyle.fontSize = '35px';
        let backText = this.add.text(backButton.x + 45, backButton.y + 20, backTranslation, backTextStyle);
        backText.setOrigin(0, 0.5);

        // Titulo princiapl
        let mainTranslation = this.i18next.t("mainText", { ns: this.namespace });
        let mainTextStyle = { ...this.gameManager.textConfig };
        mainTextStyle.fontFamily = 'AUdimat-regular';
        mainTextStyle.fontSize = '56px';
        let mainText = this.add.text(CANVAS_WIDTH - 75, CANVAS_HEIGHT / 5.5, mainTranslation, mainTextStyle);
        mainText.setOrigin(1, 0.5);

        // Cajas de seleccion de genero
        let checkBoxes = [];
        // chico
        checkBoxes.push(this.createGenderCheckbox(CANVAS_WIDTH - 122, 1.68 * CANVAS_HEIGHT / 3, 0.74, 'boyIcon'));
        // chica
        checkBoxes.push(this.createGenderCheckbox(CANVAS_WIDTH - 232, 1.68 * CANVAS_HEIGHT / 3, 0.74, 'girlIcon'));
        let genderGroup = new RadioButtonGroup(checkBoxes);

        // CAJAS DONDE INTRODUCIR LOS DATOS DEL PERSONAJE (NOMBRE, USUARIO Y CONTRASENA)
        let offset = 75;
        let nameTranslation = this.i18next.t("nameInput", { ns: this.namespace, returnObjects: true });
        let nameText = this.createTextInputSet(2.1 * CANVAS_WIDTH / 3, 1.80 * CANVAS_HEIGHT / 5 - offset, 0.60,
            nameTranslation.sideText, nameTranslation.defaultText);

        let userTranslation = this.i18next.t("userInput", { ns: this.namespace, returnObjects: true });
        let userText = this.createTextInputSet(2.1 * CANVAS_WIDTH / 3, 1.80 * CANVAS_HEIGHT / 5, 0.60,
            userTranslation.sideText, userTranslation.defaultText);

        let passwordTranslation = this.i18next.t("passwordInput", { ns: this.namespace, returnObjects: true });
        let passwordText = this.createTextInputSet(2.1 * CANVAS_WIDTH / 3, 1.80 * CANVAS_HEIGHT / 5 + offset, 0.60,
            passwordTranslation.sideText, passwordTranslation.defaultText);

        // Texto de error si alguno de los parametros es incorrecto
        let errorTextStyle = { ...this.gameManager.textConfig };
        errorTextStyle.fontFamily = 'adventpro-regular';
        errorTextStyle.fontSize = '27px';
        errorTextStyle.color = '#ff0000';
        let errorText = this.add.text(CANVAS_WIDTH - 83, 3.86 * CANVAS_HEIGHT / 6, " ", errorTextStyle);
        errorText.setVisible(false).setOrigin(1, 0.5);

        // Boton de jugar
        let startTranslation = this.i18next.t("startButton", { ns: this.namespace });
        new Button(this, CANVAS_WIDTH - 208, 2.85 * CANVAS_HEIGHT / 4, 0.75,
            () => {
                // Se comprueba segun el texto introducido si alguno de los datos es incorrecto
                let aux = this.handleErrors(genderGroup, nameText, userText, passwordText);
                // Si es incorrecto, se muestra un mensaje de error
                if (aux) {
                    errorText.setVisible(true);
                    errorText.setText(aux);
                }
                // Si es correcto, se pasa a la siguiente escena con la informacion recabada
                else {
                    let userInfo = {
                        name: nameText.getText(),
                        username: userText.getText(),
                        password: passwordText.getText(),
                        gender: genderGroup.getIndexSelButton(),
                    }
                    if (userInfo.gender === 0) {
                        userInfo.gender = "male";
                    }
                    else if (userInfo.gender === 1) {
                        userInfo.gender = "female";
                    }
                    this.gameManager.startGame(userInfo);
                }
            },
            this.gameManager.textBox.fillName, { R: 145, G: 209, B: 226 }, { R: 134, G: 193, B: 208 }, { R: 200, G: 200, B: 200 },
            startTranslation, { font: 'AUdimat-regular', size: 50, style: 'bold', color: '#FFFFFF' }, this.gameManager.textBox.edgeName,
            {
                area: new Phaser.Geom.Rectangle(this.gameManager.textBox.offset, this.gameManager.textBox.offset, this.gameManager.textBox.width, this.gameManager.textBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            }
        );

        // Titulo que aparece a la izquierda
        let warningTextStyle = { ...this.gameManager.textConfig };
        warningTextStyle.fontFamily = 'adventpro-regular';
        warningTextStyle.fontSize = '31px';
        warningTextStyle.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        warningTextStyle.align = 'center';
        warningTextStyle.wordWrap = {
            width: 270,
            useAdvancedWrap: true
        }
        warningTextStyle.padding = {
            left: 63,
            top: 8
        }
        let warningTranslation = this.i18next.t("warningText", { ns: this.namespace });
        let warningText = this.add.text(CANVAS_WIDTH / 4.85, CANVAS_HEIGHT / 4, warningTranslation, warningTextStyle).setOrigin(0.5);

        // Texto explicativo que acompana al titulo de la izquierda
        let inscriptionTranslation = this.i18next.t("inscriptionText", { ns: this.namespace });

        let inscriptionStyle = { ...this.gameManager.textConfig };
        inscriptionStyle.fontFamily = 'adventpro-regular';
        inscriptionStyle.fontSize = '28px';
        inscriptionStyle.backgroundColor = 'rgba(0, 0, 0, 0.7';
        inscriptionStyle.align = 'center';
        inscriptionStyle.wordWrap = {
            width: 270,
            useAdvancedWrap: true
        }
        inscriptionStyle.padding = {
            left: 20,
            top: 20
        }
        this.add.text(CANVAS_WIDTH / 4.85, warningText.y + 34, inscriptionTranslation, inscriptionStyle).setOrigin(0.5, 0);
    }

    /**
     * Metodo para crear un boton que sirve para volver a la pantalla anterior
     * y que tiene animaciones de escalado a la hora de interactuar con el
     */
    createBackButton(x, y, tweenTime, scaleIncrease) {
        let button = this.add.image(x, y, 'backButton');
        let origScale = button.scale;
        button.setInteractive({ useHandCursor: true},);

        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scale: origScale * scaleIncrease,
                duration: tweenTime,
                ease: 'Expo.easeOut',
                repeat: 0,
            });
        });
        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scale: origScale,
                duration: tweenTime,
                ease: 'Expo.easeOut',
                repeat: 0,
            });
        });
        button.on('pointerdown', () => {
            this.gameManager.startTitleMenu();
        });
        return button;
    }

    handleErrors(genderGroup, nameText, userText, passwordText) {
        let aux = "errorTexts";
        if (!nameText.isValid()) {
            return this.i18next.t(aux + ".invalidName", { ns: this.namespace });
        }
        if (!userText.isValid()) {
            return this.i18next.t(aux + ".invalidUser", { ns: this.namespace });
        }
        if (!passwordText.isValid()) {
            return this.i18next.t(aux + ".invalidPassword", { ns: this.namespace });
        }
        if (nameText.getText().length > this.maxNameCharacters) {
            return this.i18next.t(aux + ".shorterName", { ns: this.namespace, number: this.maxNameCharacters });
        }
        if (userText.getText().length > this.maxUserCharacters || passwordText.getText().length > this.maxUserCharacters) {
            return this.i18next.t(aux + ".shorterUserOrPassword", { ns: this.namespace, number: this.maxUserCharacters });
        }
        if (genderGroup.getIndexSelButton() === -1) {
            return this.i18next.t(aux + ".invalidGender", { ns: this.namespace });
        }
        return null;
    }

    /**
     * Crear una caja de seleccion de genero. Cada una esta formada por una checkbox y una imagen
     * Clicando en la imagen se activa la checkbox
     */
    createGenderCheckbox(x, y, scale, iconSprite) {
        // Container para poder moverlo todo junto facilmente
        let container = this.add.container(x, y);
        let icon = this.add.image(0, 0, iconSprite);
        container.add(icon);

        let checkBoxParams = {
            offsetX: -50,
            offsetY: -50,
            scale: 0.3
        }
        // Hay que modificar el area de colision de la checkbox para que sea los iconos de chico/chica y no la propia imagen
        let rectangle = new Phaser.Geom.Rectangle(0, 0, icon.displayWidth / checkBoxParams.scale, icon.displayHeight / checkBoxParams.scale);
        // Inicialmente el centro del checkbox y del icono coinciden
        // Entonces, sabiendo eso, se coloca el centro del area de colision en esa posicion y luego, se mueve respecto a como
        // este la checkbox desplazada de su centro
        rectangle.centerX = this.gameManager.roundedSquare.width / 2 + this.gameManager.roundedSquare.offset - checkBoxParams.offsetX / checkBoxParams.scale;
        rectangle.centerY = this.gameManager.roundedSquare.height / 2 + this.gameManager.roundedSquare.offset - checkBoxParams.offsetY / checkBoxParams.scale;

        let checkBox = new CheckBox(this, checkBoxParams.offsetX, checkBoxParams.offsetY, checkBoxParams.scale, '#000000',
            { R: 200, G: 200, B: 200 }, this.gameManager.roundedSquare.fillName, this.gameManager.roundedSquare.edgeName,
            {
                area: rectangle,
                callback: Phaser.Geom.Rectangle.Contains
            }).setVisible(true);

        container.add(checkBox);

        container.setScale(scale);

        return checkBox;
    }

    /**
     * Crear una caja de input con un texto informativo a la izquierda
     */
    createTextInputSet(x, y, scale, sideText, defaultText) {
        let container = this.add.container(x, y);

        let style = { ...this.gameManager.textConfig };
        style.fontFamily = 'adventpro-regular';
        style.fontSize = '55px';

        let text = this.add.text(-10, 0, sideText, style);
        text.setOrigin(1, 0.5);
        container.add(text);

        let textInput = new TextInput(this, 0, 0, 1, defaultText + " ", 23, { R: 200, G: 200, B: 200 },
            this.gameManager.inputBox.fillName, this.gameManager.inputBox.edgeName, 'adventpro-regular',
            {
                area: new Phaser.Geom.Rectangle(this.gameManager.inputBox.offset, this.gameManager.inputBox.offset, this.gameManager.inputBox.width, this.gameManager.inputBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            });
        container.add(textInput);

        container.setScale(scale);

        return textInput;
    }
}