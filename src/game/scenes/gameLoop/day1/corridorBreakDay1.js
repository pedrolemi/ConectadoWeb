import CorridorBase from "../baseScenarios/corridorBase.js";
import ConectadoEventNames from "../../../eventNames.js";

export default class CorridorBreakDay1 extends CorridorBase {
    constructor() {
        super("CorridorBreakDay1");
    }

    create(params) {
        super.create(params);
        
        this.stairsSceneName = "StairsBreakDay1";
        this.classSceneName = "PlaygroundAfternoonDay1";

        let namespace = "day1\\corridorBreakDay1";

        let nodes = this.cache.json.get("corridorBreakDay1");
        
        // Cambia la hora del movil
        this.dispatcher.dispatch(ConectadoEventNames.changeHour, "midBreak");

        // Se bloquea la puerta de clase para que no se pueda interactuar con ella 
        this.classDoorClosed.disableInteractive();
        this.classNode = this.localizationManager.readNodes(this, this.everydayNodes, "everydayDialog", "corridor.class");

        // Maria
        let mariaNode = this.localizationManager.readNodes(this, nodes, namespace, "maria");
        let maria = this.createSpineCharacter(380, this.CANVAS_HEIGHT * 0.65, "Maria", () => {
            this.localizationManager.setNode(mariaNode);
        }, 0.051, "IdleBase");
        
        // Alison
        let alisonNode = this.localizationManager.readNodes(this, nodes, namespace, "alison");
        let alison = this.createSpineCharacter(180, this.CANVAS_HEIGHT * 0.84, "Alison", () => {
            this.localizationManager.setNode(alisonNode);
        }, 0.105, "IdleBase", "Alison", this.TOGGLES_DEPTH);
        alison.setScale(-alison.scaleX, alison.scaleY);
        alison.setVisible(false);


        // TODO: MENSAJE DE TEXTO

        // Al salir a las escaleras, aparece Alison y se desbloquea la puerta
        this.stairsDoor.once("pointerdown", () => {
            alison.setVisible(true);
            this.classDoorClosed.setInteractive();
        });

        // Evento que se llama cuando se le devuelve el pendiente a Alison. La hace desaparecer con una animacion
        this.dispatcher.addOnce("alisonEnter", this, () => {
            alison.fade(false, 1000);
        });
    }

}