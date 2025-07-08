import BaseBootScene from "../../framework/scenes/baseBootScene.js";

export default class BootScene extends BaseBootScene {
    preload() {
        super.preload();

        this.load.image("basePC", "assets/UI/computer/backgrounds/basePCsq.png");
        this.load.image("PCscreen", "assets/UI/computer/backgrounds/screenWithoutBlack.png");
    }
}