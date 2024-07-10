import Button from '../UI/button.js'
import GameManager from '../managers/gameManager.js'
import CheckBox from '../UI/checkbox.js'
import RadioButtonGroup from '../UI/radioButtonGroup.js'
import TextInput from '../UI/textInput.js'

export default class UserInfoMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'UserInfoMenu' });
    }

    create() {
        const CANVAS_WIDTH = this.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.sys.game.canvas.height;

        this.gameManager = GameManager.getInstance();

        // OBJETOS
        // Fondo escalado en cuanto al canvas
        let bg = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'basePC');
        let scale = CANVAS_WIDTH / bg.width;
        bg.setScale(scale);

        this.add.rectangle(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, CANVAS_HEIGHT / 1.2, 0x2B9E9E).setOrigin(0.5, 0);

        let loginBg = this.add.image(0.23 * CANVAS_WIDTH / 5, 4.1 * CANVAS_HEIGHT / 5, 'loginBg');
        loginBg.setOrigin(0, 1).setScale(0.61);
        loginBg.displayWidth += 20;

        // Pantalla del ordenador con el tam del canvas
        let screen = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'PCscreen');
        screen.setDisplaySize(CANVAS_WIDTH, CANVAS_HEIGHT);

        let circleStyle = {
            x: 120.5,
            y: 81.5,
            radius: 10,
            normalColor: 0xFFFFFF,
            pressedColor: 0xFF0000,
            edgeWidth: 1,
            edgeColor: 0x000000,
            pressed: false,
        }
        let circle = this.add.circle(circleStyle.x, circleStyle.y, circleStyle.radius, circleStyle.normalColor);
        circle.setStrokeStyle(circleStyle.edgeWidth, circleStyle.edgeColor);
        circle.setInteractive();
        circle.on('pointerdown', () => {
            circleStyle.pressed = !circleStyle.pressed;
            if (circleStyle.pressed) {
                circle.setFillStyle(circleStyle.pressedColor);
            }
            else {
                circle.setFillStyle(circleStyle.normalColor);
            }
        });

        let backButton = this.add.image(102, 3 * CANVAS_HEIGHT / 4 + 15, 'backButton');
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            console.log("atrasss");
            this.gameManager.startTitleMenu();
        });

        let backTextStyle = {
            fontFamily: 'AUdimat-regular',
            fontSize: '35px',
            fontStyle: 'normal',
            color: '#FFFFFF'
        }
        let backText = this.add.text(backButton.x + 80, backButton.y, "Atrás", backTextStyle);
        backText.setOrigin(0.5, 0);

        let mainTextStyle = {
            fontFamily: 'AUdimat-regular',
            fontSize: '56px',
            fontStyle: 'normal',
            color: '#FFFFFF'
        }
        let mainText = this.add.text(CANVAS_WIDTH - 75, CANVAS_HEIGHT / 5.5, "¡Conecta con tus amigos!", mainTextStyle);
        mainText.setOrigin(1, 0.5);

        let checkBoxes = [];
        // chico
        checkBoxes.push(this.createGenderCheckbox(CANVAS_WIDTH - 122, 1.68 * CANVAS_HEIGHT / 3, 0.74, 'boyIcon'));
        // chica
        checkBoxes.push(this.createGenderCheckbox(CANVAS_WIDTH - 232, 1.68 * CANVAS_HEIGHT / 3, 0.74, 'girlIcon'));

        let genderGroup = new RadioButtonGroup(checkBoxes);

        let offset = 75;
        let nameText = this.createTextInputSet(2.1 * CANVAS_WIDTH / 3, 1.80 * CANVAS_HEIGHT / 5 - offset, 0.60, "Nombre", "Tu nombre ");
        let userText = this.createTextInputSet(2.1 * CANVAS_WIDTH / 3, 1.80 * CANVAS_HEIGHT / 5, 0.60, "Usuario", "Tu usuario ");
        let passwordText = this.createTextInputSet(2.1 * CANVAS_WIDTH / 3, 1.80 * CANVAS_HEIGHT / 5 + offset, 0.60, "Contraseña", "Tu contraseña ");

        let errorTextStyle = {
            fontFamily: 'adventpro-regular',
            fontSize: '31px',
            fontStyle: 'normal',
            color: '#FF0000'
        }

        let errorText = this.add.text(CANVAS_WIDTH - 83, 3.86 * CANVAS_HEIGHT / 6, "Necesito tu usuario", errorTextStyle);
        errorText.setVisible(false).setOrigin(1, 0.5);

        // Botón de jugar
        new Button(this, CANVAS_WIDTH - 208, 2.85 * CANVAS_HEIGHT / 4, 0.75, () => {
            let aux = this.handleErrors(genderGroup, nameText, userText, passwordText);
            if (aux) {
                errorText.setVisible(true);
                errorText.setText(aux);
            }
            else {
                let userInfo = {
                    name: nameText.getText(),
                    userName: userText.getText(),
                    password: passwordText.getText(),
                    gender: genderGroup.getIndexSelButton(),
                }
                if (userInfo.gender === 0) {
                    userInfo.gender = "male";
                }
                else if (userInfo.gender === 1) {
                    userInfo.gender = "female";
                }
                console.log("jugarrrr");
                this.gameManager.startGame();
            }
        },
            this.gameManager.textBox.fillName, { R: 145, G: 209, B: 226 }, { R: 134, G: 193, B: 208 }, { R: 200, G: 200, B: 200 },
            "Empezar", { font: 'AUdimat-regular', size: 50, style: 'bold', color: '#FFFFFF' }, this.gameManager.textBox.edgeName,
            {
                area: new Phaser.Geom.Rectangle(this.gameManager.textBox.offset, this.gameManager.textBox.offset,
                    this.gameManager.textBox.width, this.gameManager.textBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            });

        let warningTextStyle = {
            fontFamily: 'adventpro-regular',
            fontSize: '31px',
            fontStyle: 'normal',
            color: '#FFFFFF',
            backgroundColor: 'rgba(255, 0, 0, 0.7)',
            align: 'center',
            wordWrap: {
                width: 270,
                useAdvancedWrap: true
            },
            padding: {
                left: 63,
                top: 8,
            }
        }
        let warningText = this.add.text(CANVAS_WIDTH / 4.85, CANVAS_HEIGHT / 4, "¡IMPORTANTE!", warningTextStyle).setOrigin(0.5);

        let aux = "No introduzcas una contraseña que ya uses. Piensa en una buena. Sólo será utilizada dentro del juego."
        let keyTextStyle = {
            fontFamily: 'adventpro-regular',
            fontSize: '28px',
            fontStyle: 'normal',
            color: '#FFFFFF',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            align: 'center',
            wordWrap: {
                width: 270,
                useAdvancedWrap: true
            },
            padding: {
                left: 20,
                top: 20,
            }
        }
        this.add.text(CANVAS_WIDTH / 4.85, warningText.y + 34, aux, keyTextStyle).setOrigin(0.5, 0);
    }

    handleErrors(genderGroup, nameText, userText, passwordText) {
        if (!nameText.isValid()) {
            return "Hace falta tu nombre";
        }
        if (!userText.isValid()) {
            return "Hace falta un nombre de usuario"
        }
        if (!passwordText.isValid()) {
            return "Hace falta una contraseña"
        }
        if (nameText.getText().length > 10) {
            return "Tu nombre no puede tener más 10 caracteres"
        }
        if (userText.getText().length > 16 || passwordText.getText().length > 16) {
            return "Usuario y contraseña no pueden tener más de 16 caracteres"
        }
        if (genderGroup.getIndexSelButton() === -1) {
            return "Hace falta que selecciones tu género"
        }
        return null;
    }

    createGenderCheckbox(x, y, scale, iconSprite) {
        let container = this.add.container(x, y);
        let icon = this.add.image(0, 0, iconSprite);
        container.add(icon);

        let checkBoxParams = {
            offsetX: -50,
            offsetY: -50,
            scale: 0.3
        }

        // Modificar el area de colision para que coincida con el icono
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

    createTextInputSet(x, y, scale, sideText, defaultText) {
        let container = this.add.container(x, y);

        let style = {
            fontFamily: 'adventpro-regular',
            fontSize: '55px',
            fontStyle: 'normal',
            color: '#FFFFFF'
        }

        let text = this.add.text(-10, 0, sideText, style);
        text.setOrigin(1, 0.5);
        container.add(text);

        let textInput = new TextInput(this, 0, 0, 1, defaultText, 23, { R: 200, G: 200, B: 200 },
            this.gameManager.inputBox.fillName, this.gameManager.inputBox.edgeName, 'adventpro-regular',
            {
                area: new Phaser.Geom.Rectangle(this.gameManager.inputBox.offset, this.gameManager.inputBox.offset,
                    this.gameManager.inputBox.width, this.gameManager.inputBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            });
        container.add(textInput);

        container.setScale(scale);

        return textInput;
    }
}