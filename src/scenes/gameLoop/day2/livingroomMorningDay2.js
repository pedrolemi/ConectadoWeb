import LivingroomBase from "../baseScenarios/livingroomBase.js";
import Character from "../../../gameObjects/character.js";

export default class LivingroomMorningDay2 extends LivingroomBase {
    constructor() {
        super('LivingroomMorningDay2');
    }

    create(params) {
        super.create(params);

        this.bedroom = "BedroomMorningDay2";
        this.playground = "PlaygroundMorningDay2";

        let nodes = this.cache.json.get('livingroomMorningDay2');
        let otherDoorNode = super.readNodes(nodes, "day2\\livingroomMorningDay2", "door", true);

        // Se comprueba si se ha cogido la mochila. Si se ha cogido, se 
        // pone el dialogo de que los padres ya se han ido en la puerta
        if (this.gameManager.getValue("bagPicked")) {
            this.doorNode = otherDoorNode;
        }

        // Suscripcion al evento de coger la mochila por si no se 
        // coge antes de salir de la habitacion por primera vez
        this.dispatcher.addOnce("pickBag", this, (obj) => {
            this.doorNode = otherDoorNode;
        });

        // Evento que se llama una vez termina el dialogo de la puerta. Cambia directamente a la
        // escena del patio para no tener que quitar el nodo ni hacer click de nuevo en la puerta
        this.dispatcher.addOnce("leaveHome", this, (obj) => {
            let params = {
                camPos: "left"
            };
            this.gameManager.changeScene(this.playground, params);
        });
    }
}
