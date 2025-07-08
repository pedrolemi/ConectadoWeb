import GameManager from '../../managers/gameManager.js';
import ListViewHit from './listViewHit.js'

export default class ListViewButton extends Phaser.GameObjects.Container {
    /**
     * Boton con un fondo escalable y con texto que utiliza como collider un ListViewHit
     * Por lo tanto, es un boton que se puede usar en una listview
     * @param {Phaser.scene} scene 
     * @param {Number} x - posicion x 
     * @param {Number} y - posicion y
     * @param {Number} scale - escala del boton entero
     * @param {Function} fn - funcion que se ejecuta al pulsar el boton 
     * @param {String} img - imagen para el fondo. Ademas, el collider tiene el tam de esta imagen
     * @param {Vector} imgScaleVec - escala del fondo
     * @param {Color} normalCol - color del fondo cuando no se esta interactuando con el boton
     * @param {Color} highlightedCol - color del fondo cuando se pasa el raton por encima 
     * @param {Color} pressedCol - color del fondo cuando se presiona el boton
     * @param {String} text - texto (opcional)
     * @param {Object} fontParams - configuracion del texto (opcional)
     */
    constructor(scene, x, y, scale, fn, img, imgScaleVec, normalCol, highlightedCol, pressedCol, text, fontParams) {
        super(scene, x, y);

        this.scene.add.existing(this);

        // Importante: tener todos los cambios de posicion y escala que afecten a la imagen hechos antes
        // de crear el ListViewHit para que el area de colision corresponda con el de la imagen correctamente

        this.setScale(scale);

        let gameManager = GameManager.getInstance();

        // Fondo
        // (importante que su origen sea 0.5, 0 para que el area de colision se ajuste correctamente)
        // La imagen pertenece a un atlas
        let image = null;
        if (img.hasOwnProperty('atlas')) {
            image = this.scene.add.image(0, 0, img.atlas, img.frame);
        }
        else {
            image = this.scene.add.image(0, 0, img);
        }
        image.setOrigin(0.5, 0).setScale(imgScaleVec.x, imgScaleVec.y);
        this.add(image);

        let nCol = Phaser.Display.Color.GetColor(normalCol.R, normalCol.G, normalCol.B);
        nCol = Phaser.Display.Color.IntegerToRGB(nCol);
        let hCol = Phaser.Display.Color.GetColor(highlightedCol.R, highlightedCol.G, highlightedCol.B);
        hCol = Phaser.Display.Color.IntegerToRGB(hCol);
        let pCol = Phaser.Display.Color.GetColor(pressedCol.R, pressedCol.G, pressedCol.B);
        pCol = Phaser.Display.Color.IntegerToRGB(pCol);

        // Texto
        if (text) {
            let style = { ...gameManager.textConfig };
            style.fontFamily = fontParams.font;
            style.fontSize = fontParams.size + 'px';
            style.fontStyle = fontParams.style;
            style.color = fontParams.color;

            // No importa el origen puesto que no tiene que ver con el collider
            // Se ajusta para que se coloque en el centro del fondo
            let buttonText = this.scene.add.text(0, image.displayHeight / 2, text, style);
            buttonText.setOrigin(0.5);
            this.add(buttonText);
        }

        this.w = image.displayWidth * imgScaleVec.x * scale;
        // Por si se usara directamente en la listview
        this.h = image.displayHeight * imgScaleVec.y * scale;

        // Collider
        this.hit = new ListViewHit(this.scene, image);

        // Animaciones
        let tintFadeTime = 25;

        this.hit.on('pointerover', () => {
            this.scene.tweens.addCounter({
                targets: [image],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(nCol, hCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    image.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        this.hit.on('pointerout', () => {
            this.scene.tweens.addCounter({
                targets: [image],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(hCol, nCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    image.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        this.hit.on('pointerdown', () => {
            this.hit.disableInteractive();
            let down = this.scene.tweens.addCounter({
                targets: [image],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(hCol, pCol, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    image.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
                yoyo: true,
            });
            down.on('complete', () => {
                this.hit.setInteractive();
                fn();
            });
        });
    }

    /**
     * Cambiar la visiblidad del objeto
     * Nota: se sobrescribe el metodo para que tb cambie la visiblidad de las areas de colision,
     * que pertenecen a la escena
     * @param {Boolean} visible - visible o invisible 
     */
    setVisible(visible) {
        super.setVisible(visible);
        this.hit.setVisible(visible);
    }

    /**
     * Destruir al objeto
     * Nota: se sobrescribe el metodo para que tb se destruyan las areas de colision,
     * que pertenecen a la escena
     */
    destroy() {
        super.destroy();
        this.hit.destroy();
    }
}