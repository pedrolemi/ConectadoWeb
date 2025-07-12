import { setInteractive } from "../../framework/utils/misc.js";

export default class Phone extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0);

        scene.add.existing(this);

        this.scene = scene;
        this.dispatcher = scene.dispatcher;
        
        // scene.add.rectangle(0, 0, scene.CANVAS_WIDTH / 2, scene.CANVAS_HEIGHT, 0x000, 0.4).setOrigin(0, 0);
        
        // Fondo
        this.bgBlock = scene.add.rectangle(0, 0, scene.CANVAS_WIDTH, scene.CANVAS_HEIGHT, 0x000, 0).setOrigin(0, 0);
        setInteractive(this.bgBlock);
        this.bgBlock.setInteractive();
        // Al pulsar el fondo, se muestra/oculta el telefono
        this.bgBlock.on("pointerdown", () => {
            this.toggle();
        });

        // Forma personalizada de la silueta de la mano para evitar que se guarde
        // el telefono si se hace click fuera dentro de la zona de la mano
        let graphics = scene.add.graphics(0, 0);
        let polygon = new Phaser.Geom.Polygon([
            358, 282,
            245, 403,
            228, 705,
            -200, 1050,
            579, 1050,
            847, 558,
            800, 262
        ]);
        // graphics.lineStyle(5, 0xFF00FF, 1.0).fillStyle(0xFFFFFF, 1.0).fillPoints(polygon.points, true);
        graphics.generateTexture("hand", graphics.displayWidth, graphics.displayHeight);
        let hand = scene.add.image(0, 0, "hand").setOrigin(0, 0);
        this.add(hand);
        hand.setInteractive(polygon, Phaser.Geom.Polygon.Contains);
        graphics.destroy();
        
        
        // Configuracion de las posiciones y dimensiones
        this.PHONE_X = 405;
        this.PHONE_Y = 800;
        this.HIDDEN_X = -815;
        this.HIDDEN_Y = 780;

        this.ALARM_OFFSET_X = 115;
        this.ALARM_OFFSET_Y = 150;
        this.ALARM_SCALE = 0.8;

        this.TOGGLE_SPEED = 700;
        this.toggleAnim = null;


        // Se crean las imagenes y diferentes pantallas
        this.phone = scene.add.image(this.PHONE_X, this.PHONE_Y, "phone");

        this.add(this.phone);

        let bounds = this.getBounds();
        this.setSize(bounds.width, bounds.height);

        this.activate(false, 0);
    }

    setAlarm() {
        this.x += this.ALARM_OFFSET_X;
        this.y += this.ALARM_OFFSET_Y;
        this.setScale(this.ALARM_SCALE);
    }

    disableAlarm() {
        this.x -= this.ALARM_OFFSET_X;
        this.y -= this.ALARM_OFFSET_Y;
        this.setScale(1);
    }

    /**
    * Muestra/oculta el telefono segun su estado actual
    * @param {Number} speed - velocidad en ms que durara la animacion (opcional)
    */
    toggle(speed) {
        this.activate(!this.visible, speed);
    }

    /**
    * Muestra/oculta el telefono con una animacion
    * @param {Boolean} active - true si se va a mostrar el telefono, false en caso contrario
    * @param {Number} speed - velocidad en ms que durara la animacion (opcional)
    */
    activate(active, speed) {
        speed = (speed == null) ? this.TOGGLE_SPEED : speed;

        // Si no hay una animacion reproduciendose
        if (this.toggleAnim == null) {
            // Si esta oculto y se quiere activar
            if (!this.visible && active) {
                this.bgBlock.setInteractive();
                this.setVisible(true);
                
                let xAnim = { from: this.HIDDEN_X, to: 0 };
                let yAnim = { from: this.HIDDEN_Y, to: 0 };

                // Si esta en la pantalla de alarma, se ajusta la animacion
                if (this.scale == this.ALARM_SCALE) {
                    xAnim = { from: this.HIDDEN_X, to: this.ALARM_OFFSET_X };
                    yAnim = { from: this.HIDDEN_Y, to: this.ALARM_OFFSET_Y };
                }

                // Se mueve hacia abajo a la izquierda
                this.toggleAnim = this.scene.tweens.add({
                    targets: this,
                    x: xAnim,
                    y: yAnim,
                    duration: speed,
                    repeat: 0
                });

                this.toggleAnim.on("complete", () => {
                    this.toggleAnim = null;
                })
            }
            // Si esta visible y se quiere desactivar
            else if (this.visible && !active) {
                if (speed == 0) {
                    this.setVisible(false);
                }

                let xAnim = { from: 0, to: this.HIDDEN_X };
                let yAnim = { from: 0, to: this.HIDDEN_Y };

                // Si esta en la pantalla de alarma, se ajusta la animacion
                if (this.scale == this.ALARM_SCALE) {
                    xAnim = { from: this.ALARM_OFFSET_X, to: this.HIDDEN_X };
                    yAnim = { from: this.ALARM_OFFSET_Y, to: this.HIDDEN_Y };
                }

                // Se mueve hacia arriba a la derecha
                this.toggleAnim = this.scene.tweens.add({
                    targets: this,
                    x: xAnim,
                    y: yAnim,
                    duration: speed,
                    repeat: 0
                });

                this.toggleAnim.on("complete", () => {
                    this.bgBlock.disableInteractive();
                    this.setVisible(false);
                    this.toggleAnim = null;
                })
            }
        }
    }
}