export default class BaseScreen extends Phaser.GameObjects.Container {
    constructor(scene, phone, bgImage, prevScreen) {
        super(scene, 0, 0);
        this.scene = scene;
        this.phone = phone;

        this.prevScreen = prevScreen;

        // Configuracion de las posiciones y dimensiones
        this.CANVAS_WIDTH = scene.sys.game.canvas.width
        this.CANVAS_HEIGHT = scene.sys.game.canvas.height;

        this.BG_X = this.CANVAS_WIDTH / 2 + 36;
        this.BG_Y = this.CANVAS_HEIGHT / 2 + 6;

        this.BUTTON_Y = this.CANVAS_HEIGHT * 0.85 + 3;
        this.BUTTON_SCALE = 0.34;


        // Se ponen las imagenes en la pantalla
        let bg = scene.add.image(this.BG_X, this.BG_Y, bgImage);
        let returnButton = scene.add.image(this.BG_X - this.BG_X / 6, this.BUTTON_Y, 'returnButton').setScale(this.BUTTON_SCALE);
        let homeButton = scene.add.image(this.BG_X, this.BUTTON_Y, 'homeButton').setScale(this.BUTTON_SCALE);
        let uselessButton = scene.add.image(this.BG_X + this.BG_X / 6, this.BUTTON_Y, 'uselessButton').setScale(this.BUTTON_SCALE);

        // Se anaden las imagenes a la escena
        this.add(bg);
        this.add(returnButton);
        this.add(homeButton);
        this.add(uselessButton);

        this.sendToBack(bg);

        // Se anima y se da funcionalidad a los botones
        this.animateButton(returnButton, () => { phone.toPrevScreen(); });
        this.animateButton(homeButton, () => { phone.toMainScreen(); });
        this.animateButton(uselessButton);

        bg.setInteractive();
    }


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