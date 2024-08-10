import PlaygroundBase from "../baseScenarios/playgroundBase.js";

export default class PlaygroundAfternoonDay4 extends PlaygroundBase {
    constructor() {
        super('PlaygroundAfternoonDay4');
    }

    create(params) {
        super.create(params);

        this.home = "LivingroomAfternoonDay4";

        // Cambia la hora del movil
        this.phoneManager.setDayInfo("endClass");
        
        let nodes = this.cache.json.get('everydayDialog');
        this.doorNode = super.readNodes(nodes, "everydayDialog","playground.doorAfternoon", true);

        // Si no se han intercambiado contrasenas, sale el dialogo de la nota
        if (!this.gameManager.getValue("passwordExchanged")) {
            setTimeout(() => {
                nodes = this.cache.json.get('playgroundAfternoonDay4');
                let node = super.readNodes(nodes, "day4\\playgroundAfternoonDay4", "note", true);
                this.dialogManager.setNode(node);
            }, 100);

        }
    }
}
