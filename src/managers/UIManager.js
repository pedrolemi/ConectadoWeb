import DialogManager from "./dialogManager.js";

export default class UIManager extends Phaser.Scene {
    constructor(scene) {
        super({ key: 'UIManager' });
    }

    create() {
        this.dialogManager = new DialogManager(this);
        
    }

    getDialogManager() {
        return this.dialogManager;
    }

}