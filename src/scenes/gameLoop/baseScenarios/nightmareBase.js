import BaseScene from "../baseScene.js";

export default class NightmareBase extends BaseScene {
    /**
     * Escena base para las pesadillas. Coloca los elementos que se mantienen igual todos los dias
     * @extends BaseScene
     * @param {Number} day - numero de dia (a partir de el se configura el nombre de la escena y se obtienen los dialogos)
     */
    constructor(day) {
        super('NightmareDay' + day, 'nightmaresElements');

        this.day = day;
    }

    create(params) {
        super.create(params);

        // Se oculta el telefono y el icono
        this.phoneManager.activate(false);

        // Se coloca la imagen del fondo centrada con el tam del canvas
        this.bg = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, 'nightmaresBg').setOrigin(0.5);
        this.scale = this.CANVAS_HEIGHT / this.bg.height;
        this.bg.setScale(this.scale);

        // No se puede hacer scroll
        this.rightBound = this.CANVAS_WIDTH;

        // Archivo con la estructura del dialogo (a partir del dia)
        this.file = this.cache.json.get('nightmareDay' + this.day);
        // Namespace con los textos localizados (a partir del dia)
        this.ns = 'day' + this.day + '\\nightmareDay' + this.day;
    }

    /**
    * Lee y conecta los nodos a partir del nombre dado usando el namespace y el archivo de la pesadilla correspondiente
    */
    readNodes(objectName) {
        return super.readNodes(this.file, this.ns, objectName, true);
    }
}