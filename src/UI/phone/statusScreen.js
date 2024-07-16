import BaseScreen from "./baseScreen.js";
import StatusBar from "./statusBar.js";

export default class StatusScreen extends BaseScreen {
    constructor(scene, phone, prevScreen) {
        super(scene, phone, 'statusBg', prevScreen);

        new StatusBar(scene, this, this.BG_X, this.BG_Y / 2.05, 170, 30);
    }
}