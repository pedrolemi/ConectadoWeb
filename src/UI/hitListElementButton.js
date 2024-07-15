import HitListElement from './hitListElement.js';

export default class HitListElementButton extends HitListElement {
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