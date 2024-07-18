import HitListElement from './hitListElement.js';

export default class HitListElementButton extends HitListElement {
    /**
     * Boton formado a partir de una imagen y texto que tiene como area de colision un HitListElementna
     * Por lo tanto, es un boton que se puede usar en una ListView
     * @param {Phaser.scene} scene 
     * @param {Object} renderObject - imagen para el boton y que corresponde con el area de colision
     *                                  Importante
     * @param {Color} normalCol - color de la imagen cuando no se esta interactuando con ella
     * @param {Color} highlightedCol - color de la imagen cuando se pasa el raton por encima
     * @param {Color} pressedCol - color de la imagen cuando se hace clic sobre ella
     * @param {*} fn - funcion que se ejecuta al clicar sobre el boton
     * @extends HitListElement
     */
    constructor(scene, renderObject, normalCol, highlightedCol, pressedCol, fn) {
        super(scene, renderObject);

        let nCol = Phaser.Display.Color.GetColor(normalCol.R, normalCol.G, normalCol.B);
        nCol = Phaser.Display.Color.IntegerToRGB(nCol);
        let hCol = Phaser.Display.Color.GetColor(highlightedCol.R, highlightedCol.G, highlightedCol.B);
        hCol = Phaser.Display.Color.IntegerToRGB(hCol);
        let pCol = Phaser.Display.Color.GetColor(pressedCol.R, pressedCol.G, pressedCol.B);
        pCol = Phaser.Display.Color.IntegerToRGB(pCol);

        let tintFadeTime = 25;

        this.on('pointerover', () => {
            this.scene.tweens.addCounter({
                targets: [renderObject],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(nCol, hCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    renderObject.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        this.on('pointerout', () => {
            this.scene.tweens.addCounter({
                targets: [renderObject],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(hCol, nCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    renderObject.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        this.on('pointerdown', (pointer) => {
            this.disableInteractive();
            let down = this.scene.tweens.addCounter({
                targets: [renderObject],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(hCol, pCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    renderObject.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
                yoyo: true,
            });
            down.on('complete', () => {
                this.setInteractive();
                fn();
            });
        });
    }
}