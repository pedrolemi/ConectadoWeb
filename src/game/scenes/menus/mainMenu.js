import ConectadoBaseScene from "../conectadoBaseScene.js";
import Button from "../../../framework/UI/button.js"
import { createCircleTexture, createRectTexture } from "../../../framework/utils/graphics.js";
import TextArea from "../../../framework/UI/textArea.js";


export default class MainMenu extends ConectadoBaseScene {
    /**
    * Pantalla principal
    * @extends BaseScene
    */
    constructor() {
        super("MainMenu");
    }

    create() {
        super.create();

        // Fondo escalado en cuanto al canvas
        let bg = this.add.image(0, 0, "basePC").setOrigin(0, 0);
        let scale = this.CANVAS_WIDTH / bg.width;
        bg.setScale(scale);

        this.add.rectangle(this.CANVAS_WIDTH / 2, 10, this.CANVAS_WIDTH - 20, this.CANVAS_HEIGHT / 1.2, 0xFFFFFF).setOrigin(0.5, 0);

        // Pantalla del ordenador con el tam del canvas
        let screen = this.add.image(0, 0, "PCscreen").setOrigin(0, 0);
        screen.setDisplaySize(this.CANVAS_WIDTH, this.CANVAS_HEIGHT);


        this.TEXT_CONFIG = {
            fontFamily: "kimberley",
            fontSize: 57,
            fontStyle: "normal",
            color: "#004E46",
            align: "center",
        };
        let BUTTON_START_Y = 2 * this.CANVAS_HEIGHT / 3;


        let namespace = "menus\\titleMenu";


        // Boton de jugar
        let offset = 50;
        let playButton = this.createMainMenuButtons(BUTTON_START_Y - offset - 10, this.localizationManager.translate("playButton", namespace), () => {
            this.gameManager.startLoginMenu();
        });

        // Boton de creditos
        let creditsButton = this.createMainMenuButtons(BUTTON_START_Y + offset, this.localizationManager.translate("creditsButton", namespace), () => {
            this.gameManager.startCredits();
        });
        
        
        // Boton de salir
        let exitTextConfig = { ...this.TEXT_CONFIG };
        exitTextConfig.fontSize = '40px';
        exitTextConfig.color = '#004E46';
        let exitButton = new Button(this, 100, 3 * this.CANVAS_HEIGHT / 4 + 10, 220, 64);
        exitButton.createImgButton(this.localizationManager.translate("exitText", namespace), exitTextConfig, () => {
            this.gameManager.startLanguageMenu();
        }, "powerOff", 0.5, 0.5, 0.5, 0.5, 1, 0, 0, 160, 35, 0, 0.5, 0, 0, 0x408e86, 0x00685d, 0xc8c8c8);
        exitButton.image.setTint(0x00685d);

        // Logo
        offset = -20;
        let logo = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 3 + offset, "logoWT");
        logo.setScale(1.1);

        // Contador con la explosion
        this.createCounter(offset);
    }
    
    createMainMenuButtons(y, text, callback) {
        let BUTTON_X = this.CANVAS_WIDTH / 2;
        let BUTTON_W = 300;
        let BUTTON_H = 75;

        let button = new Button(this, BUTTON_X, y, BUTTON_W, BUTTON_H);
        button.createRectButton(text, this.TEXT_CONFIG, callback, "menuButton", 15, 0xFFFFFF, 1, 1, 0x0, 1, 10, 10, 0, 0, 0.5, 0.5, 0.5, 0.5, 0xffffff, 0x408e86, 0xc8c8c8);
        
        return button;
    }

    createCounter(offset) {
        this.elapsedTime = 0;
        this.WAIT_TIMER = 3000;
        this.COUNTER_LIMIT = 100;
        this.COUNTER_INCREASE_SPEED = 1.8;
        this.counterNumber = 0;
        
        let counterTextConfig = {
            fontFamily: "gidolinya-regular",
            fontSize: 35,
            fontStyle: "normal",
            color: "#FFFFFF",
            align: "center",
        };

        this.counter = this.add.container(2 * this.CANVAS_WIDTH / 3 + 20, this.CANVAS_HEIGHT / 4 + 30 + offset);

        createRectTexture(this, "counterTexture", 40, 40, 0xFF0808, 1, 0.5, 0x0, 1, 15);
        this.counterRect = this.add.image(0, 0, "counterTexture");

        this.counterText = new TextArea(this, 0, 0, this.counterRect.displayWidth, this.counterRect.displayHeight, this.COUNTER_LIMIT - 1, counterTextConfig).setOrigin(0.5, 0.5);
        this.counterText.adjustFontSize();

        // Se crea el emisor de particula que funciona en modo explosion
        // Es decir, emite particulas de golpe al realizar una llamada a una funcion
        createCircleTexture(this, "particleTexture", 10, 0xFF0808, 1, 1, 0x0, 1);
        this.emitter = this.add.particles(0, 0, "particleTexture", {
            lifespan: 3000,                     // duracion de cada particula
            speed: { min: 750, max: 1000 },     // velocidad de cada particula en x, y. Valor aleatorio entre los dos especificados
            scale: { start: 0.7, end: 0 },      // las particulas vas reduciendo su tam hasta desaparecer
            frequency: -1,                      // modo explosion
            quantity: 22                        // particulas generadas cada vez
        })
        
        this.counter.add(this.counterRect);
        this.counter.add(this.counterText);
        this.counter.add(this.emitter)
    }

    update(t, dt) {
        super.update(t, dt);
        this.elapsedTime += dt;

        // Mientras el numero de particulas es menor que el permitido, sigue aumentado el contador
        if (this.counterNumber < this.COUNTER_LIMIT) {
            // El contador responde a una funcion exponencial del modo dt^x, siendo x = increase
            this.counterNumber = Math.pow(this.elapsedTime / 1000, this.COUNTER_INCREASE_SPEED);
            // Se aproxima al mayor
            this.counterNumber = Math.ceil(this.counterNumber);

            // Si no ha llegado al limite, se actualiza
            if (this.counterNumber < this.COUNTER_LIMIT) {
                this.counterText.setText(this.counterNumber);
            }
            // En caso contrario, desaparece el contador y se produce la explosion
            else {
                this.elapsedTime = 0;
                this.makeVisible(false);
                this.emitter.explode();
            }
        }
        // Timer para hacer que vuelve a aparecer el contador
        else if (this.elapsedTime > this.WAIT_TIMER) {
            this.elapsedTime = 0;
            this.counterNumber = 0;
            this.counterText.setText(this.counterNumber);
            this.makeVisible(true);
        }
    }

    makeVisible(enable) {
        this.counterRect.setVisible(enable);
        this.counterText.setVisible(enable);
    }
}