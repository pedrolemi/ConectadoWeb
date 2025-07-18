import ConectadoBaseScene from "../../conectadoBaseScene.js";

export default class CorridorBase extends ConectadoBaseScene {
    /**
    * Escena base para el pasillo del colegio. Coloca los elementos que se mantienen igual todos los dias
    * @extends BaseScene
    * @param {String} name - id de la escena
    */
    constructor(name) {
        super(name);
    }

    create(params) {
        super.create(params);

        this.createBg("corridorBg");
    }
}