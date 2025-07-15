import { setInteractive } from "../../../framework/utils/misc.js";
import { growAnimation } from "../../../framework/utils/graphics.js";
import BaseScreen from "./baseScreen.js";
import ConectadoEventNames from "../../eventNames.js";
import AlarmScreen from "./alarmScreen.js";

export default class Phone extends Phaser.GameObjects.Container {
    /**
    * Clase que gestiona la interaccion con el telefono
    * @param {BaseScene} scene - escena en la que esta el movil (idealmente la UI)
    */
    constructor(scene) {
        super(scene, 0, 0);

        scene.add.existing(this);

        this.scene = scene;
        this.dispatcher = scene.dispatcher;

        // scene.add.rectangle(0, 0, scene.CANVAS_WIDTH / 2, scene.CANVAS_HEIGHT, 0x000, 0.4).setOrigin(0, 0);
        
        // Fondo
        this.bgBlock = scene.add.zone(0, 0, scene.CANVAS_WIDTH, scene.CANVAS_HEIGHT).setOrigin(0, 0).setDepth(-1);
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
        this.PHONE_X = 413;
        this.PHONE_Y = 800;
        this.HIDDEN_X = -815;
        this.HIDDEN_Y = 780;

        this.ALARM_OFFSET_X = 115;
        this.ALARM_OFFSET_Y = 150;
        this.ALARM_SCALE = 0.8;

        this.TOGGLE_SPEED = 700;
        this.toggleAnim = null;

        this.phoneImage = scene.add.image(this.PHONE_X, this.PHONE_Y, "phone");


        // Pantallas de las aplicaciones
        this.screens = new Set([
            this.mainScreen = new BaseScreen(scene, this, "mainScreenBg", null),
            this.alarmScreen = new AlarmScreen(scene, this, this.mainScreen),
        ]);

        this.currentScreen = this.mainScreen;
        
        
        // Botones de interaccion
        let BUTTONS_START_X = this.PHONE_X - 14;
        let BUTTONS_Y = this.PHONE_Y - 78;
        let BUTTONS_BAR_WIDTH = 330;
        let BUTTONS_SPACING = 10;

        this.buttons = scene.add.container(BUTTONS_START_X, BUTTONS_Y);
        // this.add(scene.add.rectangle(BUTTONS_START_X, BUTTONS_Y, BUTTONS_BAR_WIDTH, 20, 0x0, 1).setOrigin(0, 0.5));
        
        this.createButton((BUTTONS_BAR_WIDTH / 4) - BUTTONS_SPACING, "returnButton", () => {
            this.toPrevScreen();
        });
        this.createButton((BUTTONS_BAR_WIDTH / 4) * 2, "homeButton", () => {
            this.goToScreen(this.mainScreen);
        });
        this.createButton((BUTTONS_BAR_WIDTH / 4) * 3 + BUTTONS_SPACING, "uselessButton", () => { });

        
        this.add(this.phoneImage);
        this.add(this.buttons);


        let bounds = this.getBounds();
        this.setSize(bounds.width, bounds.height);
        
        this.activate(false, 0);
    }

    createButton(x, img, onClick) {
        let BUTTONS_SCALE = 0.34;
        let button = this.scene.add.image(x, 0, "phoneElements", img).setOrigin(0.5, 0.5).setScale(BUTTONS_SCALE);
        growAnimation(button, button, onClick, true, 1.1, true, 50);
        this.buttons.add(button);
    }


    setAlarm() {
        this.x += this.ALARM_OFFSET_X;
        this.y += this.ALARM_OFFSET_Y;
        this.setScale(this.ALARM_SCALE);

        this.goToScreen(this.alarmScreen);
    }

    disableAlarm() {
        this.x -= this.ALARM_OFFSET_X;
        this.y -= this.ALARM_OFFSET_Y;
        this.setScale(1);

        this.goToScreen(this.mainScreen);
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
                    this.dispatcher.dispatch(ConectadoEventNames.phoneOpened, this);
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
                    this.dispatcher.dispatch(ConectadoEventNames.phoneClosed, this);
                })
            }
        }
    }

    /**
    * Anade una nueva pantalla
    * @param {BaseScreen} screen - pantalla que anadir al telefono
    */
    addNewScreen(screen) {
        this.screens.add(screen);

        // Se ponen mas adelante de todo la imagen del telefono y los botones inferiores
        this.bringToTop(this.phoneImage);
        this.bringToTop(this.buttons);
    }

    /**
    * Oculta la pantalla actual, la cambia por la indicada, y la muestra
    * @param {BaseScreen} screen - pantalla que anadir al telefono
    */
    goToScreen(screen) {
        // this.screens.forEach((screen) => {
        //     screen.setVisible(false);
        // });
        this.currentScreen.setVisible(false);
        this.buttons.setVisible(true);
        screen.setVisible(true);
        this.currentScreen = screen;
    }

    /**
    * Vuelve a la pantalla anterior a la pantalla actual. Si no
    * hay ninguna pantalla anterior, se oculta el telefono
    */
    toPrevScreen() {
        if (this.currentScreen.prevScreen != null) {
            this.goToScreen(this.currentScreen.prevScreen);
        }
        else {
            this.toggle();
        }
    }

    toMainScreen() {
        this.goToScreen(this.mainScreen);
    }
}