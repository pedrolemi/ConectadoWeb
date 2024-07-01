import FlagButton from '../flagButton.js'

export default class LanguageMenu extends Phaser.Scene {
    /**
    * Menu para elegir el idioma del juego
    * @extends Phaser.Scene
    */
    constructor() {
        super({key: 'LanguageMenu'});
    }

    create() {
        const CANVAS_WIDTH = this.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.sys.game.canvas.height;

        // Fondo escalado en cuanto al canvas
        let bg = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'basePC').setOrigin(0.5, 0.5);
        let scale = CANVAS_WIDTH / bg.width;
        bg.setScale(scale);

        this.add.rectangle(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, CANVAS_HEIGHT / 1.2, 0x2B9E9E).setOrigin(0.5, 0);

        // Pantalla del ordenador con el tam del canvas
        let screen = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'PCscreen').setOrigin(0.5, 0.5);
        screen.setDisplaySize(CANVAS_WIDTH, CANVAS_HEIGHT);

        let height = CANVAS_HEIGHT / 8;
        new FlagButton(this, 0, 3, height, 'ukFlag', 'en-UK');
        new FlagButton(this, 1, 3, height, 'spainFlag', 'es-Es');
        new FlagButton(this, 2, 3, height, 'frFlag', 'en-UK');
    }

    startGame(){
        // IMPORTANTE: HAY QUE LANZAR PRIMERO EL DIALOGMANAGER PARA QUE LOS 
        // RETRATOS DE LOS PERSONAJES SE PINTEN POR ENCIMA DE LA CAJA DE TEXTO
        this.scene.launch('DialogManager');
        this.scene.start('Test');
    }
}