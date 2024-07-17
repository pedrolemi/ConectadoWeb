import GameManager from "../../managers/gameManager.js";

export default class BaseScreen extends Phaser.GameObjects.Container {
    /**
     * Pantalla base para las distintas pantallas del telefono
     * @extends Phaser.GameObjects.Container
     * @param {Phaser.Scene} scene - escena a la que pertenece (UIManager)
     * @param {Phone} phone - telefono
     * @param {String} bgImage - id de la imagen de fondo
     * @param {BaseScreen} prevScreen - pantalla anterior
     */
    constructor(scene, phone, bgImage, prevScreen) {
        super(scene, 0, 0);
        this.scene = scene;
        this.phone = phone;

        this.gameManager = GameManager.getInstance();
        this.i18next = this.gameManager.i18next;

        this.prevScreen = prevScreen;

        // Configuracion de las posiciones y dimensiones
        this.BG_X = this.phone.PHONE_X + 150;
        this.BG_Y = this.scene.CANVAS_HEIGHT / 2 + 6;

        this.BUTTON_Y = this.scene.CANVAS_HEIGHT * 0.85 + 3;
        this.BUTTON_SCALE = 0.34;


        // Se ponen las imagenes en la pantalla
        this.bg = scene.add.image(this.BG_X, this.BG_Y, bgImage);
        this.returnButton = scene.add.image(this.BG_X - this.BG_X / 6, this.BUTTON_Y, 'returnButton').setScale(this.BUTTON_SCALE);
        this.homeButton = scene.add.image(this.BG_X, this.BUTTON_Y, 'homeButton').setScale(this.BUTTON_SCALE);
        this.uselessButton = scene.add.image(this.BG_X + this.BG_X / 6, this.BUTTON_Y, 'uselessButton').setScale(this.BUTTON_SCALE);

        // Se anaden las imagenes a la escena
        this.add(this.bg);
        this.add(this.returnButton);
        this.add(this.homeButton);
        this.add(this.uselessButton);

        this.sendToBack(this.bg);

        // Se anima y se da funcionalidad a los botones
        this.animateButton(this.returnButton, () => { phone.toPrevScreen(); });
        this.animateButton(this.homeButton, () => { phone.toMainScreen(); });
        this.animateButton(this.uselessButton);

        this.bg.setInteractive();
    }

    /**
     * Anade al boton la animacion y la funcion a la que debe llamar
     * @param {Phaser.Image} button - imagen que animar
     * @param {Function} onClick - funcion a la que llama el boton al pulsarlo
     */
    animateButton(button, onClick) {
        // Se hace interactivo
        button.setInteractive();
        let originalScale = button.scale

        // Al pasar el raton por encima, el icono se hace mas grande,
        // y al sacarlo, el icono vuelve a su escala original
        button.on('pointerover', () => {
            this.scene.tweens.add({
                targets: [button],
                scale: originalScale * 1.1,
                duration: 0,
                repeat: 0,
            });
        });
        button.on('pointerout', () => {
            this.scene.tweens.add({
                targets: [button],
                scale: originalScale,
                duration: 0,
                repeat: 0,
            });
        });

        // Al hacer click, se hace mas pequeno y vuelve a 
        // ponerse como estaba originalmente (efecto yoyo)
        button.on('pointerdown', (pointer) => {
            let anim = this.scene.tweens.add({
                targets: [button],
                scale: originalScale,
                duration: 20,
                repeat: 0,
                yoyo: true
            });

            // Si la funcion onClick es valida y se ha hecho la 
            // animacion, al terminar la animacion llama a la funcion
            if (anim && onClick !== null && typeof onClick === 'function') {
                anim.on('complete', () => {
                    onClick();
                });
            }
        });
    }


}