import ConectadoBaseScene from "../../conectadoBaseScene.js";
import ConectadoEventNames from "../../../eventNames.js";

export default class NightmareBase extends ConectadoBaseScene {
    /**
    * Escena base para las pesadillas. Coloca los elementos que se mantienen igual todos los dias
    * @extends ConectadoBaseScene
    * @param {Number} day - numero de dia (a partir de el se configura el nombre de la escena y se obtienen los dialogos)
    */
    constructor(day) {
        super("NightmareDay" + day, "nightmaresElements");

        this.day = day;
    }

    create(params) {
        super.create(params);
        
        this.createBg("nightmaresBg", this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, 0.5, 0.5);
        
        // No se puede hacer scroll
        this.CAMERA_SPEED = 0;

        // Archivo con la estructura del dialogo (a partir del dia)
        this.nodes = this.cache.json.get("nightmareDay" + this.day);
        // Namespace con los textos localizados (a partir del dia)
        this.namespace = "day" + this.day + "\\nightmareDay" + this.day;
        
        
        this.dispatcher.dispatch(ConectadoEventNames.startNightmare, null);
    }
}