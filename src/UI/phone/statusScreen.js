import BaseScreen from "./baseScreen.js";
import StatusBar from "./statusBar.js";

export default class StatusScreen extends BaseScreen {
    constructor(scene, phone, bgImage, prevScreen) {
        super(scene, phone, bgImage, prevScreen);
        
        new StatusBar(scene, this, phone.BG_X, phone.BG_Y / 2.05, 170, 30);
    }
}