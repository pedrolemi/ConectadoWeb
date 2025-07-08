import NightmareBase from '../baseScenarios/nightmareBase.js';

export default class NightmareDay5 extends NightmareBase {
    /**
     * Pesadilla que aparece el dia 5
     * Se trata de un monologo a modo de final, que varia dependiendo de las elecciones del jugador
     * Hay 3 finales posibles
     */
    constructor() {
        super(5);
    }

    create(params) {
        super.create(params);

        // Se oscure el fondo
        this.bg.setTint(Phaser.Display.Color.GetColor(51, 51, 51));

        // Colores que va a ir tomando el portal
        this.colors = [0x2B47FF, 0x29B8FF, 0x41DDB0, 0x24B6FF];
        this.elapsedTime = 0;
        // Tiempo maximo de vida de las particula
        this.maxTime = 3000;
        // En funcion del tiempo de vida maximo y el numero de colores, se calcula cada cuanto cambiar el color de las particulas
        this.timeToChangeColor = this.maxTime / this.colors.length;

        for (let i = 0; i < this.colors.length; ++i) {
            // Se convierten todos los colores a enteros
            this.colors[i] = Phaser.Display.Color.ValueToColor(this.colors[i]);
        }

        // Se interpola entre el color anterior a lastIndex y el que corresponde con lastIndex
        this.lastIndex = 1;
        // Colores seleccionados
        this.selectedColors = {
            first: this.colors[this.lastIndex - 1],
            second: this.colors[this.lastIndex]
        }

        // Se crea el portal, el cual esta formado por sistemas de particulas
        let portal = this.add.container(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2.75);
        portal.setScale(0.85);

        // Fondo del portal
        this.bgEmitter = this.add.particles(0, 0, 'defaultParticle', {
            alpha: { start: 1, end: 0 },
            angle: { min: 0, max: 360 },
            blendMode: Phaser.BlendModes.SCREEN,        // los pixeles se invierten, se multiplican y luego, se vuelve a invertir (dibujo mas claro)
            frequency: 50,                              // cada cuanto tiempo se produce una emision de particulas
            lifespan: { min: 2000, max: this.maxTime }, // vida de cada particulas
            maxAliveParticles: 500,
            quantity: 5,                                // cuantas particulas se crean en cada emision
            scale: 0.35,
            speed: 100
        });
        this.bgEmitter.setParticleTint(this.selectedColors.first.color);
        portal.add(this.bgEmitter);

        // Centro del portal
        let centerEmitter = this.add.particles(0, 0, 'defaultParticle', {
            alpha: { start: 1, end: 0 },
            angle: { min: 0, max: 360 },
            blendMode: Phaser.BlendModes.NORMAL,
            lifespan: 1500,
            maxAliveParticles: 250,
            scale: 0.3,
            speed: 60,
            tint: this.colors[0].color
        });
        portal.add(centerEmitter);

        // IMPORTANTE: CAMBIAR LA CONFIGURACION ANTES DE LEER Y SETEAR EL NODO PARA QUE SE AJUSTE EL TEXTO CORRECTAMENTE      
        let dialogTextBox = this.dialogManager.textbox;
        let fontFamily = 'caladea-regular';
        dialogTextBox.normalTextConfig.fontFamily = fontFamily;
        dialogTextBox.normalTextConfig.fontSize = '30px';
        dialogTextBox.nameTextConfig.fontFamily = fontFamily;

        let node = this.readNodes("");

        // Se hace un fade in de la camara y cuando termina, se inicia el dialogo
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, (cam, effect) => {
            setTimeout(() => {
                this.dialogManager.setNode(node);
            }, 500);
        });

        // Ha terminado el monologo del portal
        this.dispatcher.addOnce("endGame", this, () => {
            // Se hace un fade out de la camara y cuando termina, se cambia a la escena de fin
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                setTimeout(() => {
                    let sceneName = 'TextOnlyScene';

                    // Se obtiene el texto de la escena de transicion del archivo de traducciones 
                    let text = this.i18next.t("day5.end", { ns: "transitionScenes" });

                    let textConfig = { ...this.gameManager.textConfig };
                    textConfig.fontFamily = 'kimberley';
                    textConfig.fontSize = '200px';
                    textConfig.align = 'center';

                    let params = {
                        text: text,
                        textConfig: textConfig,

                        onComplete: () => {
                            this.gameManager.ProgressedGame();
                            this.gameManager.startCreditsScene(true);
                        },
                        onCompleteDelay: 250
                    };

                    // Se cambia a la escena de transicion
                    this.gameManager.changeScene(sceneName, params);
                }, 500);
            });
        });
    }

    update(t, dt) {
        // Se van cambiando el color del fondo del portal entre los escogidos y los que se encuentran en medio
        this.elapsedTime += dt;

        this.elapsedTime = Math.min(this.elapsedTime, this.timeToChangeColor);

        // Se calcula el color intermedio en funcion del tiempo que tiene que pasar para cambiar de color y el tiempo que ha pasado
        let col = Phaser.Display.Color.Interpolate.ColorWithColor(this.selectedColors.first, this.selectedColors.second, this.timeToChangeColor, this.elapsedTime);
        col = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
        // Se cambia el color del fondo al color intermedio calculado anteriormente
        this.bgEmitter.setParticleTint(col);

        if (this.elapsedTime >= this.timeToChangeColor) {
            // Se cambian los colores entre los que se interpolan
            this.elapsedTime = 0;

            this.selectedColors.first = this.selectedColors.second;
            ++this.lastIndex;
            if (this.lastIndex >= this.colors.length) {
                this.lastIndex = 0;
            }
            this.selectedColors.second = this.colors[this.lastIndex];
        }
    }
}