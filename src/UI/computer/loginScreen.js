import TextInput from '../../UI/textInput.js'
import Button from '../../UI/button.js'

export default class LoginScreen extends Phaser.GameObjects.Group {
    /**
     * Pantalla de login de la red social
     * @param {Pahser.scene} computerScene - escena del ordenador
     * @extends Phaser.GameObjects.Group - se puede modificar todos los objetos de golpe facilmente,
     *                                      pero sin que el renderizado en conjunto (un grupo es un array extendido) 
     */
    constructor(computerScene) {
        super(computerScene);

        // Fondo de login del ordenador
        let loginBg = this.scene.add.image(0.23 * this.scene.CANVAS_WIDTH / 5, 4.1 * this.scene.CANVAS_HEIGHT / 5, 'loginBg');
        loginBg.setOrigin(0, 1).setScale(0.61);
        loginBg.displayWidth += 20;
        this.add(loginBg);

        // Logo de la red social
        let socialNetLogo = this.scene.add.image(2.67 * this.scene.CANVAS_WIDTH / 4, this.scene.CANVAS_HEIGHT / 7, 'socialNetLogo');
        socialNetLogo.setOrigin(0.5, 0).setScale(1.1);
        this.add(socialNetLogo);

        // Texto que acompana al logo
        let keyTextStyle = { ...this.scene.gameManager.textConfig };
        keyTextStyle.fontFamily = 'AUdimat-regular';
        keyTextStyle.fontSize = '27px';
        let keyText = this.scene.add.text(socialNetLogo.x, socialNetLogo.y + socialNetLogo.displayHeight + 10, "¡CONECTA CON TUS AMIGOS!", keyTextStyle);
        keyText.setOrigin(0.5, 0).setScale(1.1);
        this.add(keyText);

        // Caja de texto para introducir el usuario
        let textInputScale = 0.57;
        this.userInput = this.createTextInput(2.5 * this.scene.CANVAS_WIDTH / 4, keyText.y + keyText.displayHeight + 80, textInputScale, "Usuario", "User ");
        // Caja de texto para introducir la contrasena
        this.passwordInput = this.createTextInput(2.5 * this.scene.CANVAS_WIDTH / 4, keyText.y + keyText.displayHeight + 160, textInputScale, "Contraseña", "Pass ");

        // Texto para informar que los datos introducidos son incorrectos
        let errorTextStyle = { ...this.scene.gameManager.textConfig };
        errorTextStyle.fontFamily = 'AUdimat-regular';
        errorTextStyle.fontSize = '22px';
        errorTextStyle.color = '#ff0000';
        this.errorText = this.scene.add.text(4.22 * this.scene.CANVAS_WIDTH / 5, keyText.y + keyText.displayHeight + 221, "El usuario/contraseña introducidos son incorrectos", errorTextStyle);
        this.errorText.setVisible(false).setOrigin(1, 0.5);
        this.add(this.errorText);

        // Boton para acceder a la red social
        let enterButton = new Button(this.scene, 3.81 * this.scene.CANVAS_WIDTH / 5, this.errorText.y + 55, 0.55,
            () => {
                if (this.handleErrors(this.userInput, this.passwordInput)) {
                    this.scene.logIntoSocialNet();
                }
                else {
                    this.errorText.setVisible(true);
                }
            },
            this.scene.gameManager.textBox.fillName, { R: 255, G: 255, B: 255 }, { R: 240, G: 240, B: 240 }, { R: 200, G: 200, B: 200 },
            "Entrar", { font: 'AUdimat-regular', size: 57, style: 'normal', color: '#323232' }, this.scene.gameManager.textBox.edgeName,
            {
                // La textura generada con el objeto grafico es un pelin mas grande que el dibujo en si. Por lo tanto,
                // si la caja de colision por defecto es un pelin mas grande. Es por eso que se pasa una que se ajuste
                // a las medidas reales
                area: new Phaser.Geom.Rectangle(this.scene.gameManager.textBox.offset, this.scene.gameManager.textBox.offset, this.scene.gameManager.textBox.width, this.scene.gameManager.textBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            }
        );
        this.add(enterButton);
    }

    /**
     * Comprobar si el usuario y la contrasena introducidas son correctas
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
        this.errorText.setVisible(false);
        // Se resetean los cuadros de input
        this.userInput.reset();
        this.passwordInput.reset();
    }
}