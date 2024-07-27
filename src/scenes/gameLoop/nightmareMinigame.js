import NightmareBase from './nightmareBase.js'

export default class NightmareMinigame extends NightmareBase {
    /**
     * Clase base para todas las pesadillas que funcionan como minijuegos, es decir,
     * para las de los cuatro primeros dias
     * Se encarga de todo lo relativo a la sombra y tiene metodos para el flujo del minijuego
     * @param {Number} day - numero de dia, a partir de el se configura el nombre de la escena y se obtienen todos los dialogos 
     * @param {Boolean} left - indica si la sombra debe colocarse en la izquierda (true) o en la derecha (false) 
     */
    constructor(day, left) {
        super('NightmareDay' + day);

        this.day = day;
        this.left = left;
    }

    create(params) {
        super.create(params);

        // Se crea la sombra y su retrato
        this.shadow = this.createShadow();

        // Se obtiene el nombre de la escena a la que transicionar
        this.changeToScene = 'BedroomMorningDay' + this.day;

        // Archivo con la estructura del dialogo (a partir del dia)
        let file = this.cache.json.get('nightmareDay' + this.day);
        // Namespace con los textos localizados (a partir del dia)
        let ns = 'day' + this.day + '\\nightmareDay' + this.day;

        // Texto introductoria de la sombra
        let introNode = this.readNodes(file, ns, 'shadow.introduction', true);
        // Texto final de la sombra
        this.outroNode = this.readNodes(file, ns, 'shadow.outro', true);

        // Se inicia el dialogo introductorio de la sombra
        this.dialogManager.setNode(introNode);

        // Se produce este evento despues de la introduccion
        let introEvent = 'startNightmare' + this.day;
        this.dispatcher.add(introEvent, this, () => {
            // Desparece la sombra
            this.shadow.setVisible(false);
            // Se inicia el minijuego
            this.onMinigameStarts();
        })

        // Se produce este evento despues del monologo final
        let outroEvent = 'finishNightmare' + this.day;
        this.dispatcher.add(outroEvent, this, () => {
            // Se puede volver a usar el telefono
            this.phoneManager.activate(true);
            console.log("cambio de escena");
            //this.gameManager.changeScene(this.changeToScene, params, false);
        });
    }

    createShadow() {
        let blackColor = '#000000';
        let charScale = 0.48;

        // Por defecto esta colocado en la izquierda mirando hacia la derecha
        // Sombra
        let offset = 40;
        let char = this.add.image(offset, offset, 'characters', 'Alex');
        char.setOrigin(0).setScale(charScale);
        char.setTint(blackColor);
        char.setDepth(1);

        // Retrato de la sombra
        let shadowPortrait = this.add.image(this.portraitTr.x, this.portraitTr.y + 63, 'characters', 'Alex');
        shadowPortrait.setOrigin(0.5, 1).setScale(this.portraitTr.scale * 1.6);
        shadowPortrait.setTint(blackColor);
        this.portraits.set("shadow", shadowPortrait);

        // Se va a colocar en la derecha mirando hacia la izquierda
        if (this.left !== undefined && this.left === false) {
            char.x = this.CANVAS_WIDTH - offset;
            char.y = offset;
            // Se rota la imagen (tb afecta a la pos del origen)
            char.flipX = true;
            shadowPortrait.flipX = true;
        }

        return char;
    }

    /**
     * Metodo abstracto
     * Hay que sobrescribirlo con la logica del minijuego
     */
    onMinigameStarts() {
        throw new Error('You have to implement the method onMinigameStarts!');
    }

    /**
     * Hay que llamarlo una vez se ha terminado el minijuego
     */
    onMinigameFinishes() {
        // Se inicia el dialogo con el texto final de la sombra
        this.dialogManager.setNode(this.outroNode);
    }
}