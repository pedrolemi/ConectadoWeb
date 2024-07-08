import Phone from "./phone.js";

export default class PhoneManager {
    constructor(scene) {
        this.scene = scene;
        this.phone = new Phone(scene);

        this.CANVAS_WIDTH = scene.sys.game.canvas.width
        this.CANVAS_HEIGHT = scene.sys.game.canvas.height;
        let OFFSET = 80;
        let ICON_SCALE = 0.3;
        this.TOGGLE_SPEED = 1000;

        this.toggling = false;

        this.icon = scene.add.image(this.CANVAS_WIDTH - OFFSET, this.CANVAS_HEIGHT - OFFSET, 'phoneIcon').setScale(ICON_SCALE);
        this.icon.setInteractive();

        this.icon.on('pointerover', () => {
            scene.tweens.add({
                targets: [this.icon],
                scale: ICON_SCALE * 1.1,
                duration: 0,
                repeat: 0,
            });
        });
        this.icon.on('pointerout', () => {
            scene.tweens.add({
                targets: [this.icon],
                scale: ICON_SCALE,
                duration: 0,
                repeat: 0,
            });
        });

        this.icon.on('pointerdown', (pointer) => {
            this.togglePhone();
            scene.tweens.add({
                targets: [this.icon],
                scale: ICON_SCALE,
                duration: 20,
                repeat: 0,
                yoyo: true
            });
        });
        
    }


    togglePhone() {
        if (!this.toggling) {
            this.toggling = true;
            if (this.phone.visible) {
                let deactivate = this.scene.tweens.add({
                    targets: [this.phone],
                    x: - this.CANVAS_WIDTH * 0.75,
                    y: this.CANVAS_HEIGHT,
                    duration: this.TOGGLE_SPEED,
                    repeat: 0,
                });
                deactivate.on('complete', () => {
                    this.phone.visible = false;
                    this.toggling = false;
                });
            }
            else {
                this.phone.visible = true;
                this.phone.toMainScreen();
                
                let activate = this.scene.tweens.add({
                    targets: [this.phone],
                    x: 0,
                    y: 0,
                    duration: this.TOGGLE_SPEED,
                    visible: true,
                    repeat: 0,
                });
                activate.on('complete', () => {
                    this.toggling = false;
                });
            }
        }

    }

}