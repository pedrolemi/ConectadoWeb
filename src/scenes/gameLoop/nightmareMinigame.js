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

        this.portraitOffset = {
            x: 0,
            y: 63,
            scale: 1.6
        }

        // Archivo con la estructura del dialogo (a partir del dia)
        this.file = this.cache.json.get('nightmareDay' + this.day);
        // Namespace con los textos localizados (a partir del dia)
        this.ns = 'day' + this.day + '\\nightmareDay' + this.day;

        // Se crea la sombra, su retrato y los nodos con sus dialogos
        this.shadow = this.createShadow();


        // Se hace un fade in de la camara y cuando termina, se pone inicia el dialogo
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, (cam, effect) => {
            setTimeout(() => {
                // Se inicia el dialogo introductorio de la sombra
                this.dialogManager.setNode(this.shadow.intro);
            }, 500);
        });


        // Se produce este evento despues de la introduccion
        let introEvent = 'startNightmare' + this.day;
        this.dispatcher.add(introEvent, this, () => {
            // Desparece la sombra
            this.shadow.char.setVisible(false);
            // Se inicia el minijuego
            this.onMinigameStarts();
        })

        // Se produce este evento despues del monologo final
        let outroEvent = 'finishNightmare' + this.day;
        this.dispatcher.add(outroEvent, this, () => {
            console.log("cambio de escena");

            // Se hace un fade out de la camara y cuando termina, se cambia a la escena de la alarma
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                setTimeout(() => {
                    // Se puede volver a usar el telefono
                    this.phoneManager.activate(true);
                    this.gameManager.changeScene("AlarmScene");
                }, 500);
            });
        });
    }

    /**
     * Lee y conecta los nodos a partir del nombre dado usando el namespace y el archivo de la pesadilla correspondiente
     */
    readNodes(objectName) {
        return super.readNodes(this.file, this.ns, objectName, true);
    }

    /**
     * Se encarga de crear el personaje, el retrato y los dialogos de la sombra
     * @returns {Object} - personaje, retrato y dialogos de la sombra
     */
    createShadow() {
        let blackColor = '#000000';
        let charName = 'shadow';

        // Por defecto esta colocado en la izquierda mirando hacia la derecha
        // Sombra
        let offset = 40;

        let tr = {
            x: offset,
            y: offset,
            scale: 0.48
        }
        let shadow = this.createCharFromImage(tr, 'Alex', null, charName);

        shadow.char.setOrigin(0).setDepth(1);
        //shadow.char.setVisible(false);

        shadow.char.setTint(blackColor);
        shadow.portrait.setTint(blackColor);

        // Se va a colocar en la derecha mirando hacia la izquierda
        if (this.left !== undefined && this.left === false) {
            shadow.char.x = this.CANVAS_WIDTH - offset;
            // Se rota la imagen (tb afecta a la pos del origen)
            shadow.char.flipX = true;
            shadow.portrait.flipX = true;
        }

        shadow.intro = this.readNodes(charName + '.introduction');
        shadow.outro = this.readNodes(charName + '.outro');

        return shadow;
    }

    /**
     * 
     * @param {Object} tr - posicion y escala del personaje 
     * @param {String} sprite - id del personaje
     * @param {Object} portraitOffset - desplazamiento de la posicion y la escala respecto a la por defecto
     *                                  (opcional, sino se usa la por defecto)
     * @param {String} portraitName - nombre con el guardar el retrato del personaje (opcional, sino se usa el id del personaje) 
     * @returns {Object} - personaje y retrato
     */
    createCharFromImage(tr, charId, portraitOffset, portraitName) {
        let char = this.add.image(tr.x, tr.y, 'characters', charId);
        char.setScale(tr.scale);

        // Si no se ha indicado ningun offset, se usa el por defecto
        if (!portraitOffset) {
            portraitOffset = this.portraitOffset;
        }
        let portrait = this.add.image(this.portraitTr.x + portraitOffset.x, this.portraitTr.y + portraitOffset.y, 'characters', charId);
        // Se situa en este origen porque es el unico que tienen las animaciones esqueletales
        portrait.setOrigin(0.5, 1);
        portrait.setScale(this.portraitTr.scale * portraitOffset.scale);
        let name = charId;
        // Si se indica un nombre para el retrato, se usa ese
        if (portraitName) {
            name = portraitName;
        }
        this.portraits.set(name, portrait);

        return { char: char, portrait: portrait }
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
        this.dialogManager.setNode(this.shadow.outro);
    }
}