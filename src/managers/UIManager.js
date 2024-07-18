import GameManager from "./gameManager.js";
import DialogManager from "./dialogManager.js";
import PhoneManager from "./phoneManager.js";

export default class UIManager extends Phaser.Scene {
    /**
    * Gestor de la interfaz. Contiene el PhoneManager y el DialogManager.
    * Tambien se encarga de la creacion de textos
    * @extends Phaser.Scene
    */
    constructor(scene) {
        super({ key: 'UIManager' });
    }

    create() {
        this.CANVAS_WIDTH = this.sys.game.canvas.width
        this.CANVAS_HEIGHT = this.sys.game.canvas.height;

        this.gameManager = GameManager.getInstance();
        this.phoneManager = new PhoneManager(this);
        this.dialogManager = new DialogManager(this);
    }
}