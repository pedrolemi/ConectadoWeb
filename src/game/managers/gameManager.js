import Singleton from "../../framework/utils/singleton.js";
import SceneManager from "../../framework/managers/sceneManager.js";
import EventDispatcher from "../../framework/managers/eventDispatcher.js";
import LocalizationManager from "../../framework/managers/localizationManager.js";
import Blackboard from "../../framework/utils/blackboard.js";

export default class GameManager extends Singleton {
    constructor() {
        super("GameManager");

        this.sceneManager = SceneManager.getInstance();
        this.dispatcher = EventDispatcher.getInstance();
        this.localizationManager = LocalizationManager.getInstance();

        // Blackboard de variables de todo el juego
        this.blackboard = new Blackboard();

        this.ui = null;

        this.day = 1;
    }

    init() {
        this.localizationManager.subscribeBlackboard(this.blackboard);
        this.startLanguageMenu();
    }

    changeScene(sceneKey, params = null, anim = false, canReturn = false) {
        this.sceneManager.changeScene(sceneKey, params, anim, canReturn);
    }

    startLanguageMenu() {
        this.changeScene("LanguageMenu", null);
    }

    startMainMenu() {
        this.changeScene("MainMenu", null);
    }

    startLoginMenu() {
        // this.changeScene("LoginMenu", null, false);

        // TEST
        this.startGame();
    }

    startCredits(fromMainMenu = true) {
        let params = {
            fromMainMenu: fromMainMenu
        };
        this.changeScene("Credits", params, !fromMainMenu);
    }

    startGame() {
        this.blackboard.clear();
        this.dispatcher.removeAll();

        if (this.ui == null) {
            this.sceneManager.runInParalell("UI");
            this.ui = this.sceneManager.getScene("UI");
        }
        else {
            this.ui.shutdown();
            this.sceneManager.restartScene("UI");
        }
        
        this.day = 0;

        // let params = {
        //     text: this.localizationManager.translate("day1.start", "transitionScenes"),
        //     onComplete: () => {
        //         this.changeScene("AlarmScene", null, true);
        //     }
        // };
        // this.changeScene("TextOnlyScene", params, true);

        this.changeScene("AlarmScene", null, true);

    }

   
}