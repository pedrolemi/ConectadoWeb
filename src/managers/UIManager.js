import DialogManager from "./dialogManager.js";
import PhoneManager from "../UI/phone/phoneManager.js";

export default class UIManager extends Phaser.Scene {
    constructor(scene) {
        super({ key: 'UIManager' });
    }

    create() {
        this.dialogManager = new DialogManager(this);
        this.phoneManager = new PhoneManager(this)
    }

    getDialogManager() {
        return this.dialogManager;
    }

    getPhoneManager() {
        return this.phoneManager;
    }
}