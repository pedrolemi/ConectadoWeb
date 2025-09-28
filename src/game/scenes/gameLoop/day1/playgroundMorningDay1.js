import ConectadoBaseScene from "../../conectadoBaseScene.js";
import PlaygroundBase from "../baseScenarios/playgroundBase.js";
import ConectadoEventNames from "../../../eventNames.js";
import { fadeAnimation } from "../../../../framework/utils/graphics.js";

export default class PlaygroundMorningDay1 extends PlaygroundBase {
    constructor() {
        super("PlaygroundMorningDay1");
    }

    create(params) {
        super.create(params);

        this.stairsSceneName = "StairsMorningDay1";

        this.homeNode = this.localizationManager.readNodes(this, this.everydayNodes, "everydayDialog", "playground.homeMorning");

        let namespace = "day1\\playgroundMorningDay1";

        let nodes = this.cache.json.get("playgroundMorningDay1");

        // Si no se llega tarde, se colocan personajes de fondo
        if (!this.gameManager.blackboard.get("isLate")) {
            this.dispatcher.dispatch(ConectadoEventNames.changeHour, "playgroundMorning");

            let joseNode = this.localizationManager.readNodes(this, nodes, namespace, "jose");
            let jose = this.createSpineCharacter(280, this.CANVAS_HEIGHT * 0.95, "Jose", () => {
                this.localizationManager.setNode(joseNode);
            }, 0.065, "IdleBase", this.INTERACTABLES_DEPTH);

            let alisonNode = this.localizationManager.readNodes(this, nodes, namespace, "alison");
            let alison = this.createSpineCharacter(this.rightBound * 0.65, this.CANVAS_HEIGHT * 0.92, "Alison", () => {
                this.localizationManager.setNode(alisonNode);
            }, 0.055, "IdleBase", this.INTERACTABLES_DEPTH);

            let guilleNode = this.localizationManager.readNodes(this, nodes, namespace, "guille");
            let guille = this.createSpineCharacter(this.rightBound * 0.96, this.CANVAS_HEIGHT * 1.25, "Guille", () => {
                this.localizationManager.setNode(guilleNode);
            }, 0.2, "IdleBase", this.INTERACTABLES_DEPTH);


            // Evento llamado cuando suena la campana
            this.dispatcher.addOnce("openDoors", this, (obj) => {
                // Cambia la hora del movil
                this.dispatcher.dispatch(ConectadoEventNames.changeHour, "classStart");

                // Se quita el dialogo que aparece al hacer click en las puertas
                this.doorNode = null;

                jose.disableInteractive();
                alison.disableInteractive();
                guille.disableInteractive();

                let anim = fadeAnimation([jose, alison, guille], false, 1000);

                // Una vez termina la animacion, se abren las puertas
                anim.on('complete', () => {
                    super.openDoors();
                })
            });
        }
        // Si no, se pone la hora de llegar tarde y se dejan las puertas abiertas
        else {
            this.dispatcher.dispatch(ConectadoEventNames.changeHour, "playgroundMorningLate");
            super.openDoors();
        }
    }
}