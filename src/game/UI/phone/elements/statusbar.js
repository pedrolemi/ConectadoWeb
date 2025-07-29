import { createRectTexture } from "../../../../framework/utils/graphics.js";

export default class StatusBar {
    /**
    * Clase para el texto de la hora y el dia del movil
    * @param {BaseScene} scene - escena en la que esta el movil (idealmente la UI)
    * @param {BaseScreen} screen - pantalla del movil en la que esta la hora
    * @param {Number} x - posicion x del punto central de la barra
    * @param {Number} y - posicion y del punto central de la barra
    * @param {Number} w - ancho de la barra
    * @param {Number} h - alto de la barra
    * @param {String} character - nombre del personaje asociado a la barra
    * @param {String} barName - nombre de la textura de la barra (opcional)
    */
    constructor(scene, screen, x, y, w, h, character, barName = "statusBar",) {
        this.character = character;
        this.gameManager = scene.gameManager;

        const DEFAULT_FS_VALUE = 50;
        const BG_COLOR = 0xc0c0c0;
        this.MIN_VALUE_COLOR = 0xff0000;
        this.MAX_VALUE_COLOR = 0x00ff00;

        createRectTexture(scene, barName, w, h, 0xffffff, 1, 1, 0x0, 1, 25);

        // Se calcula la escala de la barra interior en base al padding
        const PADDING = w * 0.05;
        this.FILL_SCALE_X = (w - PADDING) / w;
        this.FILL_SCALE_Y = (h - PADDING) / h;

        let bg = scene.add.image(x, y, barName);
        bg.setTint(BG_COLOR);

        this.fill = scene.add.image(x - w / 2 + PADDING / 3, y, barName).setOrigin(0, 0.5);

        this.gameManager.blackboard.set(character + "FS", DEFAULT_FS_VALUE);
        this.updateBarColor();

        screen.add(bg);
        screen.add(this.fill);
    }

    /**
    * Actualiza el color de la barra segun su valor actual
    */
    updateBarColor() {
        let minHexColor = Phaser.Display.Color.ValueToColor(this.MIN_VALUE_COLOR);
        let maxHexColor = Phaser.Display.Color.ValueToColor(this.MAX_VALUE_COLOR);

        // Calcula el % de la barra relleno e interpola el color correspondiente a dicho % entre el color inicial y el final
        let scale = Phaser.Math.Clamp(this.gameManager.blackboard.get(this.character + "FS"), 0, 100);
        let col = Phaser.Display.Color.Interpolate.ColorWithColor(minHexColor, maxHexColor, 100, scale);
        let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);

        // Cambia el color y el tamano de la barra por los calculados
        this.fill.setTint(colInt);
        this.fill.setScale(scale / 100 * this.FILL_SCALE_X, this.FILL_SCALE_Y);
    }

    /**
    * Cambia el valor de la barra y actualiza su color
    * @param {Number} amount - cantidad que cambiar al valor de la barra 
    */
    updateValue(amount) {
        let value = this.gameManager.blackboard.get(this.character + "FS");
        value += amount;
        this.gameManager.blackboard.set(this.character + "FS", Phaser.Math.Clamp(value, 0, 100));

        this.updateBarColor();
    }
}