import GameManager from '../../managers/gameManager.js'
import Button from '../../UI/button.js'
import Counter from '../../UI/counter.js'

export default class TitleMenu extends Phaser.Scene {
    /**
     * Pantalla principal
     * @extends Phaser.Scene
     */
    constructor() {
        super({ key: 'TitleMenu' });
    }

    create() {
        const CANVAS_WIDTH = this.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.sys.game.canvas.height;

        let gameManager = GameManager.getInstance();
        let i18next = gameManager.i18next;
        let namespace = 'menus\\titleMenu';

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
        let playTranslation = i18next.t("playButton", { ns: namespace });
        new Button(this, CANVAS_WIDTH / 2, 2 * CANVAS_HEIGHT / 3 - offset - 10, 0.9,
            () => {
                gameManager.startLoginMenu();
            },
            gameManager.textBox.fillName, { R: 255, G: 255, B: 255 }, { R: 64, G: 142, B: 134 }, { R: 200, G: 200, B: 200 },
            playTranslation, { font: 'kimberley', size: 57, style: 'normal', color: '#004E46' }, gameManager.textBox.edgeName,
            {
                // La textura generada con el objeto grafico es un pelin mas grande que el dibujo en si. Por lo tanto,
                // si la caja de colision por defecto es un pelin mas grande. Es por eso que se pasa una que se ajuste
                // a las medidas reales
                area: new Phaser.Geom.Rectangle(gameManager.textBox.offset, gameManager.textBox.offset, gameManager.textBox.width, gameManager.textBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            }
        );

        // Boton de creditos
        let creditsTranslation = i18next.t("creditsButton", { ns: namespace });
        new Button(this, CANVAS_WIDTH / 2, 2 * CANVAS_HEIGHT / 3 + offset, 0.9,
            () => {
                gameManager.changeScene("CreditsScene");
            },
            gameManager.textBox.fillName, { R: 255, G: 255, B: 255 }, { R: 64, G: 142, B: 134 }, { R: 200, G: 200, B: 200 },
            creditsTranslation, { font: 'kimberley', size: 57, style: 'normal', color: '#004E46' }, gameManager.textBox.edgeName,
            {
                area: new Phaser.Geom.Rectangle(gameManager.textBox.offset, gameManager.textBox.offset, gameManager.textBox.width, gameManager.textBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            }
        );

        // Boton de salir
        let exitTranslation = i18next.t("exitText", { ns: namespace });
        let exitButton = new Button(this, 100, 3 * CANVAS_HEIGHT / 4 + 10, 0.5,
            () => {
                gameManager.startLangMenu();
            },
            'powerOff', { R: 64, G: 142, B: 134 }, { R: 0, G: 104, B: 93 }, { R: 200, G: 200, B: 200 }
        );

        // Texto que esta al lado del boton de salir
        let exitTextStyle = { ...gameManager.textConfig };
        exitTextStyle.fontFamily = 'kimberley';
        exitTextStyle.fontSize = '40px';
        exitTextStyle.color = '#004E46';

        this.add.text(exitButton.x + 60, exitButton.y, exitTranslation, exitTextStyle).setOrigin(0, 0.5);

        // Se obtiene la version del juego (especificada en los parametros de configuracion de game)
        let gameVersion = this.sys.game.config.gameVersion;
        let gameVersionTextStyle = { ...gameManager.textConfig };
        gameVersionTextStyle.fontFamily = 'AUdimat-regular';
        gameVersionTextStyle.fontSize = '22px';
        gameVersionTextStyle.color = '#323232';
        this.add.text(CANVAS_WIDTH - 55, 3 * CANVAS_HEIGHT / 4 + 40, "V " + gameVersion, gameVersionTextStyle).setOrigin(1, 0.5);

        // Logo
        offset = -20;
        let logo = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3 + offset, 'logoWT');
        logo.setScale(1.1);

        // Contador con la explosion
        // (Crear el ultimo para que las particulas aparezcan por delante)
        new Counter(this, 2 * CANVAS_WIDTH / 3 + 20, CANVAS_HEIGHT / 4 + 30 + offset, 0.4,
            gameManager.roundedSquare.fillName, gameManager.roundedSquare.edgeName,
            gameManager.circleParticle.name, 'gidolinya-regular', 100, 3000, 1.8, 0xFF0808);
    }
}