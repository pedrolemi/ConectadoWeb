import GameManager from '../../managers/gameManager.js'
import TextInput from '../../UI/textInput.js'
import Button from '../../UI/button.js'

export default class LoginScreen extends Phaser.GameObjects.Group {
    constructor(scene, fn) {
        super(scene);

        const CANVAS_WIDTH = this.scene.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.scene.sys.game.canvas.height;

        this.gameManager = GameManager.getInstance();
        
        // Fondo de login del ordenador
        let loginBg = this.scene.add.image(0.23 * CANVAS_WIDTH / 5, 4.1 * CANVAS_HEIGHT / 5, 'loginBg');
        loginBg.setOrigin(0, 1).setScale(0.61);
        loginBg.displayWidth += 20;
        this.add(loginBg);

        let socialNetLogo = this.scene.add.image(2.67 * CANVAS_WIDTH / 4, CANVAS_HEIGHT / 7, 'socialNetLogo');
        socialNetLogo.setOrigin(0.5, 0).setScale(1.1);
        this.add(socialNetLogo);

        let keyTextStyle = {
            fontFamily: 'AUdimat-regular',
            fontSize: '27px',
            fontStyle: 'normal',
            color: '#FFFFFF'
        }
        let keyText = this.scene.add.text(socialNetLogo.x, socialNetLogo.y + socialNetLogo.displayHeight + 10, "¡CONECTA CON TUS AMIGOS!", keyTextStyle);
        keyText.setOrigin(0.5, 0).setScale(1.1);
        this.add(keyText);

        this.userInput = this.createTextInputSet(2.5 * CANVAS_WIDTH / 4, keyText.y + keyText.displayHeight + 80, 0.57, "Usuario", "User ");
        this.passwordInput = this.createTextInputSet(2.5 * CANVAS_WIDTH / 4, keyText.y + keyText.displayHeight + 160, 0.57, "Contraseña", "Pass ");

        let errorTextStyle = {
            fontFamily: 'adventpro-regular',
            fontSize: '23.5px',
            fontStyle: 'normal',
            color: '#FF0000'
        }
        this.errorText = this.scene.add.text(4.22 * CANVAS_WIDTH / 5, keyText.y + keyText.displayHeight + 227, "El usuario/contraseña introducidos son incorrectos", errorTextStyle);
        this.errorText.setVisible(false).setOrigin(1, 0.5);
        this.add(this.errorText);

        let enterButton = new Button(this.scene, 3.81 * CANVAS_WIDTH / 5, this.errorText.y + 55, 0.55,
            () => {
                if(this.handleErrors(this.userInput, this.passwordInput)){
                    this.setVisible(false);
                    fn();
                }
                else{
                    this.errorText.setVisible(true);
                }
            },
            this.gameManager.textBox.fillName, { R: 255, G: 255, B: 255 }, { R: 240, G: 240, B: 240 }, { R: 200, G: 200, B: 200 },
            "Entrar", { font: 'AUdimat-regular', size: 57, style: 'normal', color: '#323232' }, this.gameManager.textBox.edgeName,
            {
                // La textura generada con el objeto grafico es un pelin mas grande que el dibujo en si. Por lo tanto,
                // si la caja de colision por defecto es un pelin mas grande. Es por eso que se pasa una que se ajuste
                // a las medidas reales
                area: new Phaser.Geom.Rectangle(this.gameManager.textBox.offset, this.gameManager.textBox.offset, this.gameManager.textBox.width, this.gameManager.textBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            }
        );
        this.add(enterButton);
    }

    handleErrors(userInput, passwordInput){
        let userInfo = this.gameManager.getUserInfo();
        if(!userInput.isValid()){
            return false;
        }
        if(!passwordInput.isValid()){
            return false;
        }
        if(userInput.getText() === userInfo.username &&
            passwordInput.getText() === userInfo.password){
            return true;
        }
        else {
            return false;
        }
    }

    createTextInputSet(x, y, scale, sideText, defaultText) {
        let container = this.scene.add.container(x, y);

        let style = {
            fontFamily: 'adventpro-regular',
            fontSize: '55px',
            fontStyle: 'normal',
            color: '#FFFFFF'
        }

        let text = this.scene.add.text(-100, 0, sideText, style);
        text.setOrigin(1, 0.5);
        container.add(text);

        let textInput = new TextInput(this.scene, 0, 0, 1, defaultText, 23, { R: 200, G: 200, B: 200 },
            this.gameManager.inputBox.fillName, this.gameManager.inputBox.edgeName, 'AUdimat-regular',
            {
                area: new Phaser.Geom.Rectangle(this.gameManager.inputBox.offset, this.gameManager.inputBox.offset, this.gameManager.inputBox.width, this.gameManager.inputBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            });
        container.add(textInput);

        container.setScale(scale);

        this.add(container);

        return textInput;
    }

    reset(){
        this.userInput.reset();
        this.passwordInput.reset();
        this.errorText.setVisible(false);
    }
}