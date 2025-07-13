

export default class BaseScreen extends Phaser.GameObjects.Container {
    constructor(scene, phone, bgImage, prevScreen) {
        super(scene, 0, 0);

        scene.add.existing(this);

        this.scene = scene;
        this.phone = phone;
        this.localizationManager = scene.localizationManager;

        this.prevScreen = prevScreen;

        this.BG_X = scene.CANVAS_WIDTH / 2;
        this.BG_Y = scene.CANVAS_HEIGHT / 2 + 6;

        this.prevScreen = prevScreen;

        this.bg = scene.add.image(this.BG_X, this.BG_Y, "phoneElements", bgImage);
        this.add(this.bg);
        this.bg.setInteractive();

        phone.add(this);
        phone.sendToBack(this);
    }
}