import GameManager from '../managers/gameManager.js'
import CheckBox from '../UI/checkbox.js'
import RadioButtonGroup from '../UI/radioButtonGroup.js'
import TextInput from '../UI/textInput.js'
import Button from '../UI/button.js'
import Counter from '../UI/counter.js'

export default class MenuText extends Phaser.Scene {
    constructor(){
        super({key: 'MenuTest'});
    }

    create(){
        const CANVAS_WIDTH = this.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.sys.game.canvas.height;

        // GENERAR TEXTURAS
        let circleParticle = {
            name: 'circleParticle',
            radius: 50,
            color: 0xFF0808
        }
        // (x, y, width, height)
        let rt = this.add.renderTexture(circleParticle.radius, circleParticle.radius, circleParticle.radius * 2, circleParticle.radius * 2);
        let circle = this.add.circle(0, 0, circleParticle.radius, circleParticle.color);
        rt.draw(circle, circleParticle.radius, circleParticle.radius);
        rt.saveTexture(circleParticle.name);
        circle.destroy();

        this.graphics = this.add.graphics();

        let roundedSquare = {
            fillName: 'fillSquare',
            edgeName: 'edgeSquare',
            width: 100,
            height: 100,
            radius: 10,
            fillColor: 0xffffff,
            edgeColor: 0x000000,
            edgeWith: 1,
            offset: 10
        }
        this.generateBox(roundedSquare);

        let textBox = {
            fillName: 'fillText',
            edgeName: 'edgeText',
            width: 335,
            height: 80,
            radius: 10,
            fillColor: 0xffffff,
            edgeColor: 0x000000,
            edgeWith: 1,
            offset: 10
        }

        this.generateBox(textBox);

        // OBJETOS
        // Fondo escalado en cuanto al canvas
        let bg = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'basePC');
        let scale = CANVAS_WIDTH / bg.width;
        bg.setScale(scale);

        this.add.rectangle(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, CANVAS_HEIGHT / 1.2, 0xFFFFFF).setOrigin(0.5, 0);

        // Pantalla del ordenador con el tam del canvas
        let screen = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'PCscreen');
        screen.setDisplaySize(CANVAS_WIDTH, CANVAS_HEIGHT);

        // Boton de jugar
        let offset = 50;
        new Button(this, CANVAS_WIDTH / 2, 2 * CANVAS_HEIGHT / 3 - offset - 10, 0.9, () => {
            console.log("jugarrr");
        }, 
        'fillText', {R: 255, G: 255, B: 255}, {R: 64, G: 142, B: 134}, {R: 200, G: 200, B: 200},
        "Jugar", {font: 'kimberley_bl', size: 57, color: '#004E46'}, 'edgeText', 
        {
            area: new Phaser.Geom.Rectangle(textBox.offset, textBox.offset, textBox.width, textBox.height),
            callback: Phaser.Geom.Rectangle.Contains
        });

        // Botón de créditos
        new Button(this, CANVAS_WIDTH / 2, 2 * CANVAS_HEIGHT / 3 + offset, 0.9, () => {
            console.log("creditosss");
        }, 
        'fillText', {R: 255, G: 255, B: 255}, {R: 64, G: 142, B: 134}, {R: 200, G: 200, B: 200},
        "Créditos", {font: 'kimberley_bl', size: 57, color: '#004E46'}, 'edgeText', 
        {
            area: new Phaser.Geom.Rectangle(textBox.offset, textBox.offset, textBox.width, textBox.height),
            callback: Phaser.Geom.Rectangle.Contains
        });

        // Boton de salir
        let exitButton = new Button(this, 100, 3 * CANVAS_HEIGHT / 4 + 10, 0.5, () => {
            console.log("fin de juego");
        },
        'powerOff', {R: 64, G: 142, B: 134}, {R: 0, G: 104, B: 93}, {R: 200, G: 200, B: 200});

        this.add.text(exitButton.x + 60, exitButton.y, "Salir", {
            fontFamily: 'kimberley_bl', 
            fontSize: '40px', 
            fontStyle: 'normal', 
            color: '#004E46'
        }).setOrigin(0, 0.5);

        this.add.text(CANVAS_WIDTH - 80, 3 * CANVAS_HEIGHT / 4 + 40, "V 1.7.0", {
            fontFamily: 'AUdimat-Regular', 
            fontSize: '22px', 
            fontStyle: 'normal', 
            color: '#323232'
        }).setOrigin(0.5, 0.5);

        // Logo
        offset = -20;
        let logo = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3 + offset, 'logoWT');
        logo.setScale(1.1);

        // Contador con la explosion
        // (Crear el ultimo para que las particulas aparezcan por delante)
        new Counter(this, 2 * CANVAS_WIDTH / 3 + 20, CANVAS_HEIGHT / 4 + 30 + offset, 0.4, 
            'fillSquare', 'edgeSquare', 'circleParticle', 'Gidolinya-Regular', 100,
            1000, 3000, 1.15, 0xFF0808);

        /*
        PRUEBAS DE LA OTRA ESCENA
        let checkBoxes = [];
        checkBoxes.push(new CheckBox(this, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 1, '#ffffff', {R: 200, G: 200, B: 200},
            'fillSquare', 'edgeSquare',
            {
                area: new Phaser.Geom.Rectangle(roundedSquare.offset, roundedSquare.offset, roundedSquare.width, roundedSquare.height),
                callback: Phaser.Geom.Rectangle.Contains
            }));

        checkBoxes.push(new CheckBox(this, CANVAS_WIDTH / 2 + 200, CANVAS_HEIGHT / 2, 1, '#ffffff', {R: 200, G: 200, B: 200},
            'fillSquare', 'edgeSquare',
            {
                area: new Phaser.Geom.Rectangle(roundedSquare.offset, roundedSquare.offset, roundedSquare.width, roundedSquare.height),
                callback: Phaser.Geom.Rectangle.Contains
            }));

        new RadioButtonGroup(this, 0, 0, checkBoxes);

        let inputBox = {
            fillName: 'fillInput',
            edgeName: 'edgeInput',
            width: 420,
            height: 100,
            radius: 10,
            fillColor: 0xffffff,
            edgeColor: 0x000000,
            edgeWith: 3,
            offset: 10
        }

        this.generateBox(inputBox);

        new TextInput(this, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 1, "Nombre de Usuario", 23, {R: 200, G: 200, B: 200},
            'fillInput', 'edgeInput', 'Gidolinya-Regular',
            {
                area: new Phaser.Geom.Rectangle(inputBox.offset, inputBox.offset, inputBox.width, inputBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            });

        new TextInput(this, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 200, 1, "Hola Juan", 23, {R: 200, G: 200, B: 200},
            'fillInput', 'edgeInput', 'Gidolinya-Regular',
            {
                area: new Phaser.Geom.Rectangle(inputBox.offset, inputBox.offset, inputBox.width, inputBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            });
        */

        rt.destroy();
        this.graphics.destroy();
    }

    generateBox(boxParams){
        // parte interior
        this.graphics.fillStyle(boxParams.fillColor, 1);
        this.graphics.fillRoundedRect(boxParams.offset, boxParams.offset, boxParams.width, boxParams.height, boxParams.radius);
        this.graphics.generateTexture(boxParams.fillName, boxParams.width + boxParams.offset * 2, boxParams.height + boxParams.offset * 2);
        this.graphics.clear();

        // borde
        this.graphics.lineStyle(boxParams.edgeWith, boxParams.edgeColor, 1);
        this.graphics.strokeRoundedRect(boxParams.offset, boxParams.offset, boxParams.width, boxParams.height, boxParams.radius);
        this.graphics.generateTexture(boxParams.edgeName, boxParams.width + boxParams.offset * 2, boxParams.height + boxParams.offset * 2);
        this.graphics.clear();
    }
}