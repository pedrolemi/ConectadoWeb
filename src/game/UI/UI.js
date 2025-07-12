import BaseUI from "../../framework/UI/baseUI.js";
import ConectadoDialogBox from "./conectadoDialogBox.js";

export default class UI extends BaseUI {
    constructor() {
        super("UI", "UI");
    }

    init(params) {
        super.init(params);

        this.textConfig = {
            fontFamily: "lexend-variable",
            fontSize: 27,
            fontStyle: 600
        }
        this.optionBoxConfig = {
            boxSpacing: 10,
            textPaddingX: 70,
            textPaddingY: 10,
            textOffsetX: 0,
            textOffsetY: 0,
        }
        this.optionsTextConfig = { ... this.textConfig };
        this.optionsTextConfig.fontSize = 35;
        this.optionsTextConfig.align = "center";
        this.optionsTextConfig.wordWrap = {
            width: 1,
            useAdvancedWrap: true
        }
    }

    create(params) {
        super.create(params);

        this.textbox.destroy();
        this.textbox = new ConectadoDialogBox(this);
        
    }
}