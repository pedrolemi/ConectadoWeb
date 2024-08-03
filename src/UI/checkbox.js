import GameManager from "../managers/gameManager.js";

export default class CheckBox extends Phaser.GameObjects.Container {
    /**
    * Clase que permite crear una checkbox o radiobutons si se unen varias checkboxes en un grupo
    * @param {Phaser.Scene} scene - escena a la que pertenece
    * @param {Number} x - posicion x
    * @param {Number} y - posicion y
    * @param {Number} scale - escala del objeto
    * @param {Color} tickColor - color hexadecimal del tick
    * @param {Color} pressedCol - color RGB de la checkbox que se utiliza en la animacion cuando se clica en ella
    * @param {String} fill - sprite que se usa para el relleno
    * @param {String} edge - sprite que se usa para el borde (opcional)
    * @param {String} hitArea - cambiar el area de colision (opcional)
    */
    constructor(scene, x, y, scale, tickColor, pressedColor, fill, edge, hitArea) {
        super(scene, x, y);

        this.scene.add.existing(this);

        let gameManager = GameManager.getInstance();

        // Indicar si la checkbox esta activada o no
        this.checked = false;

        // Si es distinto de null pertenece a algun grupo y funciona como un radio button
        this.group = null;

        let fillImg = this.scene.add.image(0, 0, fill);
        this.add(fillImg);

        if (hitArea) {
            fillImg.setInteractive({ useHandCursor: true }, hitArea.area, hitArea.callback);
        }
        else {
            fillImg.setInteractive({ useHandCursor: true },);
        }
        if (this.scene.sys.game.debug) {
            this.scene.input.enableDebug(fillImg, '0xffff00');
        }

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
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    fillImg.setTint(colInt);
                },
                duration: 80,
                repeat: 0,
                yoyo: true
            });
            down.on('complete', () => {
                if (this.group) {
                    // Si funciona como un radio button, se desactiva el resto del gruop
                    this.group.checkButton(this);
                    this.setChecked(true);
                }
                // Si funciona simplemente como una checkbox, se hace toggle
                else {
                    this.toggleChecked();
                }
            });
        });

        if (edge) {
            let edgeImg = this.scene.add.image(0, 0, edge);
            this.add(edgeImg);
        }

        let style = { ...gameManager.textConfig };
        style.fontSize = '75px';
        style.fontStyle = 'bold';
        style.color = tickColor;
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