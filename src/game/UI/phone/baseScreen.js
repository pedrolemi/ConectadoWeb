export default class BaseScreen extends Phaser.GameObjects.Container {
    /**
    * Clase base para las pantallas del movil
    * @extends Phaser.GameObjects.Container
    * @param {BaseScene} scene - escena en la que esta el movil (idealmente la UI)
    * @param {Phone} phone - movil
    * @param {String} bgImage - id de la imagen a usar para el fondo
    * @param {BaseScreen} prevScreen - pantalla a la que se ira desde esta al pulsar el boton de volver
    */
    constructor(scene, phone, bgImage, prevScreen) {
        super(scene, 0, 0);

        scene.add.existing(this);
        this.namespace = "phoneInfo";

        this.scene = scene;
        this.phone = phone;

        this.dispatcher = scene.dispatcher;
        this.localizationManager = scene.localizationManager;

        this.prevScreen = prevScreen;

        this.BG_X = scene.CANVAS_WIDTH / 2;
        this.BG_Y = scene.CANVAS_HEIGHT / 2 + 6;

        this.prevScreen = prevScreen;

        this.bg = scene.add.image(this.BG_X, this.BG_Y, "phoneElements", bgImage);
        this.add(this.bg);
        this.bg.setInteractive();

        this.DEFAULT_TEXT_CONFIG = {
            fontFamily: "gidole-regular",
            fontSize: 40,
            fontStyle: "normal",
            color: "#ffffff",
            align: "center",
        };

        phone.add(this);
    }
}