import GameManager from "../managers/gameManager.js";

export default class Button extends Phaser.GameObjects.Container {
    /**
    * Clase que permite crear un boton personalizable con animaciones para las diferentes interacciones
    * @param {Phaser.Scene} scene - escena a la que pertenece
    * @param {Number} x - posicion x
    * @param {Number} y - posicion y
    * @param {Number} scale - escala del objeto
    * @param {Function} fn - funcion que se ejecuta cuando se clica en el boton
    * @param {String} fill - sprite que se usa para el relleno
    * @param {Color} normalCol - color RGB del boton cuando no se esta interactuando con el
    * @param {Color} highlightedCol - color RGB cuando se pasa el puntero por encima
    * @param {Color} pressedCol - color RGB del boton cuando se clica en el
    * @param {Text} text - texto que se escribe en el boton (opcional)
    * @param {Object} fontParams - distintos parametros (tipografia, tam, estilo, color) para personalizar el texto anterior (opcional)
    * @param {String} edge - sprite que se usa para el borde (opcional)
    * @param {String} hitArea - cambiar el area de colision (opcional)
    */
    constructor(scene, x, y, scale, fn, fill, normalCol, highlightedCol, pressedCol, text, fontParams, edge, hitArea) {
        super(scene, x, y);
        this.scene.add.existing(this);

        let gameManager = GameManager.getInstance();

        // La imagen pertenece a una atlas
        if (fill.hasOwnProperty('atlas')) {
            this.fillImg = this.scene.add.image(0, 0, fill.atlas, fill.frame);
        }
        // La imagen es independiente
        else {
            this.fillImg = this.scene.add.image(0, 0, fill);
        }

        this.nCol = Phaser.Display.Color.GetColor(normalCol.R, normalCol.G, normalCol.B);
        this.nCol = Phaser.Display.Color.IntegerToRGB(this.nCol);
        let hCol = Phaser.Display.Color.GetColor(highlightedCol.R, highlightedCol.G, highlightedCol.B);
        hCol = Phaser.Display.Color.IntegerToRGB(hCol);
        let pCol = Phaser.Display.Color.GetColor(pressedCol.R, pressedCol.G, pressedCol.B);
        pCol = Phaser.Display.Color.IntegerToRGB(pCol);

        this.fillImg.setTint(Phaser.Display.Color.GetColor(this.nCol.r, this.nCol.g, this.nCol.b));

        this.hitArea = null;
        if (hitArea) {
            this.hitArea = hitArea;
            this.fillImg.setInteractive(hitArea.area, hitArea.callback, { useHandCursor: true });
        }
        else {
            this.fillImg.setInteractive({ useHandCursor: true });
        }
        // dibujar el area de colision
        if (this.scene.sys.game.debug) {
            this.scene.input.enableDebug(this.fillImg, '0xffff00');
        }

        let tintFadeTime = 25;

        this.fillImg.on('pointerover', () => {
            scene.tweens.addCounter({
                targets: [this.fillImg],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(this.nCol, hCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.fillImg.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        this.fillImg.on('pointerout', () => {
            scene.tweens.addCounter({
                targets: [this.fillImg],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(hCol, this.nCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.fillImg.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        this.fillImg.on('pointerdown', () => {
            this.fillImg.disableInteractive();
            let down = scene.tweens.addCounter({
                targets: [this.fillImg],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(hCol, pCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.fillImg.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
                yoyo: true,
            });
            down.on('complete', () => {
                this.fillImg.setInteractive({ useHandCursor: true });
                fn();
            });
        });

        this.add(this.fillImg);

        if (edge) {
            let edgeImg = this.scene.add.image(0, 0, edge);
            this.add(edgeImg);
        }

        if (text) {
            let style = { ...gameManager.textConfig };
            style.fontFamily = fontParams.font;
            style.fontSize = fontParams.size + 'px';
            style.fontStyle = fontParams.style;
            style.color = fontParams.color;

            let buttonText = this.scene.add.text(0, 0, text, style);
            buttonText.setOrigin(0.5);
            this.add(buttonText);
        }

        this.setScale(scale);
    }

    setHitArea(hitArea) {
        this.fillImg.removeInteractive();
        this.hitArea = hitArea;
        this.fillImg.setInteractive(hitArea.area, hitArea.callback, { useHandCursor: true });
        if (this.scene.sys.game.debug) {
            this.scene.input.enableDebug(this.fillImg, '0xffff00');
        }
    }

    reset() {
        this.fillImg.setTint(Phaser.Display.Color.GetColor(this.nCol.r, this.nCol.g, this.nCol.b));
    }
}