import TextInput from '../../UI/textInput.js'
import Button from '../../UI/button.js'

export default class LoginScreen extends Phaser.GameObjects.Group {
    /**
     * Pantalla de login de la red social
     * @param {Pahser.scene} computerScene - escena del ordenador
     * @extends Phaser.GameObjects.Group - se utiliza un grupo porque permite modificar todos los objetos facilmente,
     *                                      pero sin que el renderizado sea en conjunto (array extendido)
     */
    constructor(computerScene) {
        super(computerScene);

        let screenName = "loginScreen";

        // Fondo de login del ordenador
        let loginBg = this.scene.add.image(0.23 * this.scene.CANVAS_WIDTH / 5, 4.1 * this.scene.CANVAS_HEIGHT / 5, 'loginBg');
        loginBg.setOrigin(0, 1).setScale(0.61);
        loginBg.displayWidth += 20;
        this.add(loginBg);

        // Logo de la red social
        let socialNetLogo = this.scene.add.image(2.67 * this.scene.CANVAS_WIDTH / 4, this.scene.CANVAS_HEIGHT / 7, 'computerElements', 'socialNetLogo');
        socialNetLogo.setOrigin(0.5, 0).setScale(1.1);
        this.add(socialNetLogo);

        // Texto que acompana al logo
        let subtitleTextStyle = { ...this.scene.gameManager.textConfig };
        subtitleTextStyle.fontFamily = 'AUdimat-regular';
        subtitleTextStyle.fontSize = '27px';
        let subtitleTranslation = this.scene.i18next.t(screenName + ".subtitleText", { ns: this.scene.namespace });
        let subtitleText = this.scene.add.text(socialNetLogo.x, socialNetLogo.y + socialNetLogo.displayHeight + 10, subtitleTranslation, subtitleTextStyle);
        subtitleText.setOrigin(0.5, 0).setScale(1.1);
        this.add(subtitleText);

        // Caja de texto para introducir el usuario
        let textInputScale = 0.57;
        let userTranslation = this.scene.i18next.t(screenName + ".userInput", { ns: this.scene.namespace, returnObjects: true });
        this.userInput = this.createTextInput(2.5 * this.scene.CANVAS_WIDTH / 4, subtitleText.y + subtitleText.displayHeight + 80, textInputScale, userTranslation.sideText, "User ");
        // Caja de texto para introducir la contrasena
        let passwordTranslation = this.scene.i18next.t(screenName + ".passwordInput", { ns: this.scene.namespace, returnObjects: true });
        this.passwordInput = this.createTextInput(2.5 * this.scene.CANVAS_WIDTH / 4, subtitleText.y + subtitleText.displayHeight + 160, textInputScale, passwordTranslation.sideText, "Pass ");

        this.scene.events.on('shutdown', () => {
            this.userInput.removeHiddenInput();
            this.passwordInput.removeHiddenInput();
        })

        // Texto para informar que los datos introducidos son incorrectos
        let errorTextStyle = { ...this.scene.gameManager.textConfig };
        errorTextStyle.fontFamily = 'AUdimat-regular';
        errorTextStyle.fontSize = '22px';
        errorTextStyle.color = '#ff0000';
        let errorTranslation = this.scene.i18next.t(screenName + ".errorText", { ns: this.scene.namespace });
        this.errorText = this.scene.add.text(4.22 * this.scene.CANVAS_WIDTH / 5, subtitleText.y + subtitleText.displayHeight + 221, errorTranslation, errorTextStyle);
        this.errorText.setVisible(false).setOrigin(1, 0.5);
        this.add(this.errorText);

        let enterTranslation = this.scene.i18next.t(screenName + ".enterButton", { ns: this.scene.namespace });
        // Boton para acceder a la red social
        let enterButton = new Button(this.scene, 3.81 * this.scene.CANVAS_WIDTH / 5, this.errorText.y + 55, 0.55,
            () => {
                // Se comprueba que los datos introducidos son correctos
                if (this.handleErrors(this.userInput, this.passwordInput)) {
                    this.scene.logIntoSocialNet();
                }
                else {
                    this.errorText.setVisible(true);
                }
            },
            this.scene.gameManager.textBox.fillName, { R: 255, G: 255, B: 255 }, { R: 240, G: 240, B: 240 }, { R: 200, G: 200, B: 200 },
            enterTranslation, { font: 'AUdimat-regular', size: 57, style: 'normal', color: '#323232' }, this.scene.gameManager.textBox.edgeName,
            {
                area: new Phaser.Geom.Rectangle(this.scene.gameManager.textBox.offset, this.scene.gameManager.textBox.offset, this.scene.gameManager.textBox.width, this.scene.gameManager.textBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            }
        );
        this.add(enterButton);
    }

    /**
     * Comprobar si el usuario y la contrasena introducidos son correctos
     * @param {TextInput} userInput - caja de texto donde introducir el usuario 
     * @param {TextInput} passwordInput - caja de texto donde introducir la contrasena
     * @returns true en caso de que si se puede acceder, false en caso contrario
     */
    handleErrors(userInput, passwordInput) {
        let userInfo = this.scene.gameManager.getUserInfo();
        if (!userInput.isValid()) {
            return false;
        }
        if (!passwordInput.isValid()) {
            return false;
        }
        if (userInput.getText() === userInfo.username &&
            passwordInput.getText() === userInfo.password) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Crear una caja de texto con un texto informativo a la izquierda
     */
    createTextInput(x, y, scale, sideText, defaultText) {
        let container = this.scene.add.container(x, y);

        let style = { ...this.scene.gameManager.textConfig };
        style.fontFamily = 'adventpro-regular';
        style.fontSize = '55px';

        // Texto que aparece a la izquierda
        let text = this.scene.add.text(-100, 0, sideText, style);
        text.setOrigin(1, 0.5);
        container.add(text);

        // Text input
        let textInput = new TextInput(this.scene, 0, 0, 1, defaultText, 23, { R: 200, G: 200, B: 200 },
            this.scene.gameManager.inputBox.fillName, this.scene.gameManager.inputBox.edgeName, 'AUdimat-regular',
            {
                area: new Phaser.Geom.Rectangle(this.scene.gameManager.inputBox.offset, this.scene.gameManager.inputBox.offset,
                    this.scene.gameManager.inputBox.width, this.scene.gameManager.inputBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            });
        container.add(textInput);

        container.setScale(scale);

        this.add(container);

        return textInput;
    }

    start() {
        // Se hace todo visible (ya que esta escena estaba invisible completamente)
        this.setVisible(true);
        // Se hace invisible el texto de error
        this.errorText.setVisible(false);
        // Se resetean los cuadros de input
        this.userInput.reset();
        this.passwordInput.reset();
    }
}