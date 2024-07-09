export default class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, scale, fn, fill, normalCol, highlightedCol, pressedCol, text, fontParams, edge, hitArea) {
        super(scene, x, y);
        this.scene.add.existing(this);

        let fillImg = this.scene.add.image(0, 0, fill);

        let nCol = Phaser.Display.Color.GetColor(normalCol.R, normalCol.G, normalCol.B);
        nCol = Phaser.Display.Color.IntegerToRGB(nCol);
        let hCol = Phaser.Display.Color.GetColor(highlightedCol.R, highlightedCol.G, highlightedCol.B);
        hCol = Phaser.Display.Color.IntegerToRGB(hCol);
        let pCol = Phaser.Display.Color.GetColor(pressedCol.R, pressedCol.G, pressedCol.B);
        pCol = Phaser.Display.Color.IntegerToRGB(pCol);

        if (normalCol) {
            fillImg.setTint(Phaser.Display.Color.GetColor(nCol.r, nCol.g, nCol.b));
        }
        if (hitArea) {
            fillImg.setInteractive(hitArea.area, hitArea.callback);
        }
        else {
            fillImg.setInteractive();
        }
        //this.scene.input.enableDebug(fillImg, '0xffff00');

        let tintFadeTime = 25;


        if (highlightedCol) {
            fillImg.on('pointerover', () => {
                scene.tweens.addCounter({
                    targets: [fillImg],
                    from: 0,
                    to: 100,
                    onUpdate: (tween) => {
                        const value = tween.getValue();
                        let col = Phaser.Display.Color.Interpolate.ColorWithColor(nCol, hCol, 100, value);
                        let colourInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                        fillImg.setTint(colourInt);
                    },
                    duration: tintFadeTime,
                    repeat: 0,
                });
            });
        }
        if (normalCol) {
            fillImg.on('pointerout', () => {
                scene.tweens.addCounter({
                    targets: [fillImg],
                    from: 0,
                    to: 100,
                    onUpdate: (tween) => {
                        const value = tween.getValue();
                        let col = Phaser.Display.Color.Interpolate.ColorWithColor(hCol, nCol, 100, value);
                        let colourInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                        fillImg.setTint(colourInt);
                    },
                    duration: tintFadeTime,
                    repeat: 0,
                });
            });
        }

        fillImg.on('pointerdown', (pointer) => {
            //fillImg.disableInteractive();
            if (pressedCol) {
                let down = scene.tweens.addCounter({
                    targets: [fillImg],
                    from: 0,
                    to: 100,
                    onUpdate: (tween) => {
                        const value = tween.getValue();
                        let col = Phaser.Display.Color.Interpolate.ColorWithColor(hCol, pCol, 100, value);
                        let colourInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                        fillImg.setTint(colourInt);
                    },
                    duration: tintFadeTime,
                    repeat: 0,
                });
                down.on('complete', () => {
                    fn();
                });
            }
            else {
                fn();
            }
        });

        this.add(fillImg);

        if (edge) {
            let edgeImg = this.scene.add.image(0, 0, edge);
            this.add(edgeImg);
        }

        if (text) {
            let style = {
                fontFamily: fontParams.font,
                fontSize: fontParams.size + 'px',
                fontStyle: fontParams.style,
                color: fontParams.color
            }

            let buttonText = this.scene.add.text(0, 0, text, style);
            buttonText.setOrigin(0.5);
            this.add(buttonText);
        }

        this.setScale(scale);
    }
}