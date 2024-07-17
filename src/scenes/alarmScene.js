import BaseScene from './baseScene.js';

export default class AlarmScene extends BaseScene {
    /**
     * Escena para las transiciones en las que solo hay texto,  
     * @extends Phaser.Scene
     * @param {Object} params - parametros de la escena. Debe contener day y nextScene
     * 
     * IMPORTANTE: Esta escena es general para todos los dias, por lo que hay que indicar en los parametros
     * el dia que es y la escena a la que se cambiara una vez apagada la alarma. A diferencia de la escena
     * de solo texto, esta escena solo deberia cambiar a la habitacion de cada dia, por lo que no haria
     * falta pasar parametros adicionales y se podria cambiar directamente llamando al changeScene del gameManager
     */
    constructor() {
        super('AlarmScene');
    }

    // Metodo que se llama al terminar de crear la escena. 
    onCreate() {
        super.onCreate();
        this.phoneManager.openEyesAnimation();
        this.phoneManager.phone.toAlarmScreen();
    }

    create(params) {
        super.create();

        this.day = "";
        this.nextScene = "";
        if (params.day) {
            this.day = params.day;
        }
        if (params.nextScene) {
            this.nextScene = params.nextScene;
        }
        // Cambia el dia y la hora del telefono
        let hour = this.i18next.t("clock.alarmHour", { ns: "phoneInfo", returnObjects: true });
        this.phoneManager.phone.setDayInfo(hour, this.day);

        // Pone la imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(0, 0, 'bedroomCeiling').setOrigin(0.5, 0);
        let scale = this.CANVAS_HEIGHT / bg.height;
        bg.setScale(scale);

        // Centra la imagen de fondo
        bg.x += this.CANVAS_WIDTH / 2;
        this.leftBound = bg.x - bg.displayWidth / 2;
        this.rightBound = bg.x + bg.displayWidth / 2;


        // Anade los eventos a los que reaccionara: 
        //  - resetCam reinicia la posicion de la camara de esta escena y de la del UIManager 
        //  - wakeUpEvent se llama al apagar la alarma y se encarga de pasar a la siguiente escena
        this.dispatcher.add(this.phoneManager.resetCamEvent, this, (obj) => {
            this.cameras.main.scrollX = 0;
            this.UIManager.cameras.main.scrollX = 0;
        });
        this.dispatcher.add(this.phoneManager.wakeUpEvent, this, (obj) => {
            this.gameManager.changeScene(this.nextScene);
        });

    }

    update(t, dt) {
        if (!this.phoneManager.toggling && this.phoneManager.phone.visible) {
            super.update(t, dt);
            this.UIManager.cameras.main.scrollX = this.cameras.main.scrollX;
        }

    }
}