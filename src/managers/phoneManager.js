import Phone from '../UI/phone/phone.js';

export default class PhoneManager {
    constructor(scene) {
        this.scene = scene;
        this.phone = new Phone(scene, this);

        this.CANVAS_WIDTH = scene.sys.game.canvas.width
        this.CANVAS_HEIGHT = scene.sys.game.canvas.height;
        let OFFSET = 80;
        let ICON_SCALE = 0.3;
        this.TOGGLE_SPEED = 600;

        this.icon = scene.add.image(this.CANVAS_WIDTH - OFFSET, this.CANVAS_HEIGHT - OFFSET, 'phoneIcon').setScale(ICON_SCALE);
        this.icon.setInteractive();
        this.icon.setDepth(this.phone.depth - 1)

        this.bgBlock = scene.add.rectangle(0, 0,this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0xfff, 0).setOrigin(0,0);
        this.bgBlock.setInteractive();
        this.bgBlock.setDepth(this.icon.depth - 1); 

        this.icon.on('pointerover', () => {
            if (!this.scene.getDialogManager().isTalking()) {
                scene.tweens.add({
                    targets: [this.icon],
                    scale: ICON_SCALE * 1.1,
                    duration: 0,
                    repeat: 0,
                });
            }
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
            if (!this.scene.getDialogManager().isTalking()) { 
                this.togglePhone();
                scene.tweens.add({
                    targets: [this.icon],
                    scale: ICON_SCALE,
                    duration: 20,
                    repeat: 0,
                    yoyo: true
                });
            }
        });
        
        this.toggling = false;
        
        // this.togglePhone();
        // this.toggling = false;
        // this.phone.visible = false;
        // this.bgBlock.disableInteractive();
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
                    this.bgBlock.disableInteractive();
                });
            }
            else {
                this.phone.visible = true;
                this.phone.toMainScreen();
                this.bgBlock.setInteractive();
                
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

    setDayInfo(hour, dayText) {
        this.phone.setDayInfo(hour, dayText);
    }

}