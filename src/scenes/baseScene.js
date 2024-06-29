export default class BaseScene extends Phaser.Scene {
    constructor(name) {
        super({ key: name });
    }

    create() {
        this.dialogManager = this.scene.get('DialogManager');
        this.portraits = new Map();

        this.portraitX = 110;
        this.portraitY = 1000;
        this.portraitScale = 0.1;
    }

    changeScene(scene) {
        this.scene.start(scene);
        this.dialogManager.changeScene(scene);
    }
}