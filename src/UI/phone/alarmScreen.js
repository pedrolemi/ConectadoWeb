import BaseScreen from "./baseScreen.js";

export default class AlarmScreen extends BaseScreen {
    constructor(scene, phone, prevScreen) {
        super(scene, phone, 'alarmBg', prevScreen);

        // Quita los botones de la parte inferior
        this.remove(this.returnButton);
        this.remove(this.homeButton);
        this.remove(this.uselessButton);
        this.returnButton.destroy();
        this.homeButton.destroy();
        this.uselessButton.destroy();


        // Configuracion de texto para la el texto de ll titulo
        let textConfig = { ...scene.gameManager.textConfig };
        textConfig.fontFamily = 'gidole-regular';
        textConfig.fontSize = 40 + 'px';

        // Se coge el texto del archivo de traducciones y se pone en pantalla 
        let text = this.i18next.t("alarm.title", { ns: "phoneInfo" })
        let alarmText = this.scene.add.text(this.BG_X, this.BG_Y * 0.4, text, textConfig).setOrigin(0.5, 0.5);

        // Configuracion de texto para el reloj
        let hourTextConfig = { ...scene.gameManager.textConfig };
        hourTextConfig.fontFamily = 'gidole-regular';
        hourTextConfig.fontSize = 100 + 'px';

        let dayTextConfig = { ...scene.gameManager.textConfig };
        dayTextConfig.fontFamily = 'gidole-regular';

        // Crea el texto y lo anade a la escena
        this.hourText = this.scene.add.text(this.BG_X, this.BG_Y * 0.65, "", hourTextConfig).setOrigin(0.5, 0.5);
        this.dayText = this.scene.add.text(this.BG_X, this.BG_Y * 0.8, "", dayTextConfig).setOrigin(0.5, 0.5);

        // Se ponen la imagen del deslizable en la pantalla
        let scrollable = scene.add.image(this.BG_X, this.BG_Y * 1.18, 'homeButton').setScale(this.ICON_SCALE);
        scrollable.setInteractive({ draggable: true });

        // Limites de hasta donde se puede deslizar el icono
        let leftBound = this.BG_X - this.bg.displayWidth / 2 + scrollable.displayWidth / 2;
        let rightBound = this.BG_X + this.bg.displayWidth / 2 - scrollable.displayWidth / 2;

        // Bloquea el deslizamiento para que solo se pueda mover horizontalmente hasta los limites
        scrollable.on('drag', (pointer, dragX, dragY) => {
            dragX = Phaser.Math.Clamp(dragX, leftBound, rightBound);
            scrollable.x = dragX
        });

        // Cuando se deja de deslizar,
        scrollable.on('dragend', (pointer, dragX, dragY) => {
            // Si se ha deslizado hasta la izquierda, llama a la funcion para quedarse dormido 
            if (scrollable.x === leftBound) {
                phone.phoneManager.sleep();
            }
            // Si se ha deslizado hasta la derecha, llama a la funcion para despertarse
            else if (scrollable.x === rightBound) {
                phone.phoneManager.wakeUp();
            }

            // Se pone el icono de nuevo en su posicion original
            scrollable.x = this.BG_X;
        });

        this.add(alarmText);
        this.add(this.hourText)
        this.add(this.dayText);
        this.add(scrollable);
    }

    /**
     * Cambia el texto del dia y la hora
     * @param {String} hour - hora
     * @param {String} dayText - informacion del dia
     */
    setDayInfo(hour, dayText) {
        if (hour !== "") {
            this.hourText.setText(hour);
        }
        if (dayText !== "") {
            this.dayText.setText(dayText);
        }
    }

}