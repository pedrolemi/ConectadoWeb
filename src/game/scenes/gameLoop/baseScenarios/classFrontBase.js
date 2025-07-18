import ConectadoBaseScene from "../../conectadoBaseScene.js";

export default class ClassFrontBase extends ConectadoBaseScene {
    /**
    * Escena base para el pasillo del colegio. Coloca los elementos que se mantienen igual todos los dias
    * @extends ConectadoBaseScene
    * @param {String} name - id de la escena
    */
    constructor(name) {
        super(name, "classFront");
    }

    create(params) {
        super.create(params);

        this.createBg("classFrontBg");
    }
}