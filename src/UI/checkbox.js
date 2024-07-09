export default class CheckBox extends Phaser.GameObjects.Container {
    constructor(scene, x, y, scale, tickColor, pressedColor, fill, edge, hitArea) {
        super(scene, x, y);

        this.scene.add.existing(this);

        this.checked = false;

        // si es distinto de null pertenece a algun grupo
        // Entonces, funciona como un radio button
        this.group = null;

        let fillImg = this.scene.add.image(0, 0, fill);
        this.add(fillImg);

        if (hitArea) {
            fillImg.setInteractive(hitArea.area, hitArea.callback);
        }
        else {
            fillImg.setInteractive();
        }

        //this.scene.input.enableDebug(fillImg, '0xffff00');

        let nCol = Phaser.Display.Color.HexStringToColor('#ffffff');
        let pCol = Phaser.Display.Color.GetColor(pressedColor.R, pressedColor.G, pressedColor.B);
        pCol = Phaser.Display.Color.IntegerToRGB(pCol);

        fillImg.on('pointerdown', () => {
            let down = scene.tweens.addCounter({
                targets: fillImg,
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(nCol, pCol, 100, value);
                    let colourInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    fillImg.setTint(colourInt);
                },
                duration: 80,
                repeat: 0,
                yoyo: true
            });
            down.on('complete', () => {
                if (this.group) {
                    this.group.checkButton(this);
                    this.setChecked(true);
                }
                else {
                    this.toggleChecked();
                }
            });
        });

        if (edge) {
            let edgeImg = this.scene.add.image(0, 0, edge);
            this.add(edgeImg);
        }

        let style = {
            fontFamily: 'Arial',
            fontSize: '75px',
            fontStyle: 'bold',
            color: tickColor
        }
        this.tickText = this.scene.add.text(0, 0, '✓', style).setOrigin(0.5).setVisible(false);
        this.add(this.tickText);

        this.setScale(scale);
    }

    setChecked(checked) {
        this.checked = checked;
        this.tickText.setVisible(this.checked);
    }

    toggleChecked() {
        this.checked = !this.checked;
        this.tickText.setVisible(this.checked);
    }

    setGroup(group) {
        if (!this.group) {
            this.group = group;
        }
    }
}