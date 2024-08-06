import NightmareBase from '../nightmareBase.js';

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

        this.bg.setTint(Phaser.Display.Color.GetColor(51, 51, 51));

        // Minimo dos colores
        this.colors = [0x2B47FF, 0x29B8FF, 0x41DDB0, 0x24B6FF];
        this.elapsedTime = 0;
        this.maxTime = 3000;
        this.timeToChangeColor = this.maxTime / this.colors.length;

        for (let i = 0; i < this.colors.length; ++i) {
            this.colors[i] = Phaser.Display.Color.ValueToColor(this.colors[i]);
        }

        // Se interpola entre el color anterior a lastIndex y el que corresponde con lastIndex
        this.lastIndex = 1;
        this.selectedColors = {
            first: this.colors[this.lastIndex - 1],
            second: this.colors[this.lastIndex]
        }

        let portal = this.add.container(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2);
        portal.setScale(0.7);

        this.bgEmitter = this.add.particles(0, 0, 'defaultParticle', {
            alpha: { start: 1, end: 0 },
            angle: { min: 0, max: 360 },
            blendMode: Phaser.BlendModes.SCREEN,
            frequency: 50,
            lifespan: { min: 2000, max: this.maxTime },
            maxAliveParticles: 500,
            quantity: 5,
            scale: 0.35,
            speed: 100
        });
        this.bgEmitter.setParticleTint(this.selectedColors.first.color);
        portal.add(this.bgEmitter);

        let centerEmitter = this.add.particles(0, 0, 'defaultParticle', {
            alpha: { start: 1, end: 0 },
            angle: { min: 0, max: 360 },
            blendMode: Phaser.BlendModes.NORMAL,
            lifespan: 1500,
            maxAliveParticles: 250,
            scale: 0.3,
            speed: 60,
            tint: 0x2B47FF
        });
        portal.add(centerEmitter);


        // TODO
        // Se hace un fade in de la camara y cuando termina, se pone inicia el dialogo
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, (cam, effect) => {
            setTimeout(() => {
                // this.dialogManager.setNode(nodeName);
            }, 500);
        });
        this.dispatcher.add("eventName", this, () => {
            // Se hace un fade out de la camara y cuando termina, se cambia a la escena de fin
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                setTimeout(() => {
                    // this.gameManager.changeScene("sceneName");
                }, 500);
            });
        });
    }

    update(t, dt) {
        this.elapsedTime += dt;

        this.elapsedTime = Math.min(this.elapsedTime, this.timeToChangeColor);

        let col = Phaser.Display.Color.Interpolate.ColorWithColor(this.selectedColors.first, this.selectedColors.second, this.timeToChangeColor, this.elapsedTime);
        col = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
        this.bgEmitter.setParticleTint(col);

        if (this.elapsedTime >= this.timeToChangeColor) {
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