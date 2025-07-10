import BaseScene from "../../framework/scenes/baseScene.js"
import DialogManager from "./../managers/dialogManager.js";
import GameManager from "./../managers/gameManager.js";

export default class ConectadoBaseScene extends BaseScene {
    constructor(name) {
        super(name);
    }

    create(params) {
        super.create();

        this.gameManager = GameManager.getInstance();
        this.dialogManager = DialogManager.getInstance();
    }
}