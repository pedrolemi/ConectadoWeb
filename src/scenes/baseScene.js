export default class BaseScene extends Phaser.Scene {
    constructor(name) {
        super({ key: name });
    }

    create() {
        this.dialogManager = this.scene.get('DialogManager');

        this.portraits = new Map();
        this.portraitX = 110;
        this.portraitY = 980;
        this.portraitScale = 0.1;
    }

    changeScene(scene) {
        this.dialogManager.clearPortraits();
        this.scene.start(scene);
    }
}