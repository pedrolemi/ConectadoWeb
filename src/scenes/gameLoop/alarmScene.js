import BaseScene from './baseScene.js';

export default class AlarmScene extends BaseScene {
    /**
     * Escena para las transiciones en las que solo hay texto,  
     * @extends Phaser.Scene
     * @param {Object} params - parametros de la escena. Debe contener day y nextScene
     * 
     * IMPORTANTE: Esta escena es general para todos los dias, pero a diferencia de la escena de 
     * solo texto, esta escena solo deberia cambiar a la habitacion de por la manana cada dia, por 
     * lo que no hace falta pasar parametros adicionales y se puede cambiar de escena directamente 
     * llamando al changeScene del gameManager en lugar de tener que pasar un callback
     */
    constructor() {
        super('AlarmScene');
    }

    // Metodo que se llama al terminar de crear la escena. 
    onCreate(params) {
        super.onCreate(params);

        this.phoneManager.openEyesAnimation();
        this.phoneManager.phone.toAlarmScreen();
    }

    create(params) {
        super.create();

        let days = this.i18next.t("clock.days", { ns: "phoneInfo", returnObjects: true });
        let day = days[this.gameManager.day - 1];

        // Cambia el dia y la hora del telefono
        let hour = this.i18next.t("clock.alarmHour", { ns: "phoneInfo", returnObjects: true });
        this.phoneManager.phone.setDayInfo(hour, day);

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
            let params = {
                camPos: "right"
            }
            this.gameManager.changeScene('BedroomMorningDay' + this.gameManager.day, params);
        });

    }

    update(t, dt) {
        if (!this.phoneManager.toggling && this.phoneManager.phone.visible) {
            super.update(t, dt);
            this.UIManager.cameras.main.scrollX = this.cameras.main.scrollX;
        }

    }
}