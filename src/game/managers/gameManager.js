import Blackboard from "../../framework/utils/blackboard.js";
import Singleton from "../../framework/utils/singleton.js";
import SceneManager from "../../framework/managers/sceneManager.js";
import EventDispatcher from "../../framework/managers/eventDispatcher.js";

export default class GameManager extends Singleton {
    constructor() {
        super("GameManager");

        this.sceneManager = SceneManager.getInstance();
        this.dispatcher = EventDispatcher.getInstance();

        // Blackboard de variables de todo el juego
        this.blackboard = new Blackboard();

        this.ui = null;
    }

    init() {
        this.startLanguageMenu();
    }

    startLanguageMenu() {
        this.sceneManager.changeScene("LanguageMenu", null);
    }

    startMainMenu() {
        this.sceneManager.changeScene("MainMenu", null);
    }

    startLoginMenu() {
        // this.sceneManager.changeScene("LoginMenu", null, false);

        let params = {
            text: "Test",
            onComplete: () => {
                this.startCredits(false);
            },
            onCompleteDelay: 500
        };
        this.sceneManager.changeScene("TextOnlyScene", params, true);
    }

    startCredits(fromMainMenu = true) {
        let params = {
            fromMainMenu: fromMainMenu
        };
        this.sceneManager.changeScene("Credits", params, !fromMainMenu);
    }

    startGame() {
        if (this.ui == null) {
            this.sceneManager.runInParalell("UI");
            this.ui = this.sceneManager.getScene("UI");
        }

    }
}