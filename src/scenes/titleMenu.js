import GameManager from '../managers/gameManager.js'
import Button from '../UI/button.js'
import Counter from '../UI/counter.js'

export default class TitleMenu extends Phaser.Scene {
    constructor(){
        super({key: 'TitleMenu'});
    }

    create(){
        const CANVAS_WIDTH = this.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.sys.game.canvas.height;

        let gameManager = GameManager.getInstance();

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
        gameManager.textBox.fillName, {R: 255, G: 255, B: 255}, {R: 64, G: 142, B: 134}, {R: 200, G: 200, B: 200},
        "Jugar", {font: 'kimberley_bl', size: 57, style: 'nomral', color: '#004E46'}, gameManager.textBox.edgeName, 
        {
            area: new Phaser.Geom.Rectangle(gameManager.textBox.offset, gameManager.textBox.offset, 
                gameManager.textBox.width, gameManager.textBox.height),
            callback: Phaser.Geom.Rectangle.Contains
        });

        // Botón de créditos
        new Button(this, CANVAS_WIDTH / 2, 2 * CANVAS_HEIGHT / 3 + offset, 0.9, () => {
            console.log("creditosss");
        }, 
        gameManager.textBox.fillName, {R: 255, G: 255, B: 255}, {R: 64, G: 142, B: 134}, {R: 200, G: 200, B: 200},
        "Créditos", {font: 'kimberley_bl', size: 57, style: 'normal', color: '#004E46'}, gameManager.textBox.edgeName, 
        {
            area: new Phaser.Geom.Rectangle(gameManager.textBox.offset, gameManager.textBox.offset, 
                gameManager.textBox.width, gameManager.textBox.height),
            callback: Phaser.Geom.Rectangle.Contains
        });

        // Boton de salir
        let exitButton = new Button(this, 100, 3 * CANVAS_HEIGHT / 4 + 10, 0.5, () => {
            this.scene.start("LanguageMenu");
            //gameManager.startLangMenu();
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
            gameManager.roundedSquare.fillName, gameManager.roundedSquare.edgeName, 
            gameManager.circleParticle.name, 'Gidolinya-Regular', 100, 3000, 1.8, 0xFF0808);

        /*
        new TextInput(this, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 200, 1, "Hola Juan", 23, {R: 200, G: 200, B: 200},
            'fillInput', 'edgeInput', 'Gidolinya-Regular',
            {
                area: new Phaser.Geom.Rectangle(inputBox.offset, inputBox.offset, inputBox.width, inputBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            });
        */
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