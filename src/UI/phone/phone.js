import AlarmScreen from "./alarmScreen.js";
import MainScreen from "./mainScreen.js";
import StatusScreen from "./statusScreen.js";
import MessagesScreen from "./messagesScreen.js";
import Chat1Screen from "./chat1Screen.js";
import SettingsScreen from "./settingsScreen.js";

export default class Phone extends Phaser.GameObjects.Container {
    constructor(scene, phoneManager) {
        super(scene, 0, 0);
        this.scene = scene;
        this.phoneManager = phoneManager;

        // Configuracion de las posiciones y dimensiones
        this.CANVAS_WIDTH = scene.sys.game.canvas.width
        this.CANVAS_HEIGHT = scene.sys.game.canvas.height;

        this.PHONE_X = 450;
        this.PHONE_Y = 800;

        this.BG_X = this.CANVAS_WIDTH / 2 + 36;
        this.BG_Y = this.CANVAS_HEIGHT / 2 + 6;


        // Se crean las imagenes y diferentes pantallas
        this.phone = scene.add.image(this.PHONE_X, this.PHONE_Y, 'phone');
        this.alarmScreen = new AlarmScreen(scene, this, null);
        this.mainScreen = new MainScreen(scene, this, null);
        this.statusScreen = new StatusScreen(scene, this, this.mainScreen);
        this.messagesScreen = new MessagesScreen(scene, this, this.mainScreen);
        this.chat1Screen = new Phaser.GameObjects.Container(scene, 0, 0);;
        this.chat2Screen = new Phaser.GameObjects.Container(scene, 0, 0);
        this.settingsScreen = new SettingsScreen(scene, this, this.mainScreen);

        // Se anaden las pantallas a un array para poder iterar sobre ellas mas rapidamente
        let screens = [
            this.alarmScreen,
            this.mainScreen,
            this.statusScreen,
            this.messagesScreen,
            this.chat1Screen,
            this.settingsScreen
        ]

        // Se anade la imagen del telefono y las pantallas a la escena
        this.add(this.phone);
        screens.forEach((screen) => {
            this.add(screen);
            screen.visible = false;
        });

        // Se pone la imagen del telefono por encima de todo
        this.bringToTop(this.phone);

        this.currScreen = null;
        this.toMainScreen();

        scene.add.existing(this);
    }

    /**
     * Metodo para obtener las dimensiones de la imagen del telefono
     * @returns - objeto con la posicion, origen y escala de la imagen del telefono
     */
    getPhoneTransform() {
        return {
            x: this.phone.x,
            y: this.phone.y,
            originX: this.phone.originX,
            originY: this.phone.originY,
            scaleX: this.phone.scaleX,
            scaleY: this.phone.scaleY
        }
    }

    /**
     * Cambia a la pantalla indicada
     * @param {BaseScreen} nextScreen - pantalla a la que se va a cambiar
     */
    changeScreen(nextScreen) {
        // Si la pantalla actual no es la misma que la siguiente
        if (this.currScreen !== nextScreen) {
            // Si hay una pantalla actual, la oculta
            if (this.currScreen) {
                this.currScreen.visible = false;
            }

            // Hace que la pantalla actual sea a la que se va a cambiar
            this.currScreen = nextScreen;

            // Muestra la pantalla actual
            this.currScreen.visible = true;
        }

    }


    // Pasa a la pantalla anterior
    toPrevScreen() {
        // Si la pantalla actual es la pantalla principal, se guarda el movil
        if (this.currScreen === this.mainScreen) {
            this.phoneManager.togglePhone();
        }
        // Si no, si la pantalla actual tiene pantalla anterior, se cambia a esa pantalla
        else if (this.currScreen.prevScreen) {
            this.changeScreen(this.currScreen.prevScreen);
        }
    }

    // Cambia a la pantalla de la alarma
    toAlarmScreen() {
        this.changeScreen(this.alarmScreen);
    }

    // Cambia a la pantalla principal
    toMainScreen() {
        this.changeScreen(this.mainScreen);
    }

    // Cambia a la pantalla de estado
    toStatusScreen() {
        this.changeScreen(this.statusScreen);
    }

    // Cambia a la pantalla de mensajes
    toMsgScreen() {
        this.changeScreen(this.messagesScreen);
    }

    // Cambia a la pantalla del chat1
    toChat1Screen() {
        this.changeScreen(this.chat1Screen);
    }
    // Cambia a la pantalla del chat 2
    toChat2Screen() {
        this.changeScreen(this.chat2Screen);
    }

    // Cambia a la pantalla de ajustes
    toSettingsScreen() {
        this.changeScreen(this.settingsScreen);
    }


    // Muestra en la pantalla de mensajes los chats 1 y 2
    showChat1() {
        this.messagesScreen.showChat1();
    }
    showChat2() {
        this.messagesScreen.showChat2();
    }

    
    // Cambia la hora y el dia de las pantallas de alarma y principal
    setDayInfo(hour, dayText) {
        this.alarmScreen.setDayInfo(hour, dayText);
        this.mainScreen.setDayInfo(hour, dayText);
    }

    // Cambia la cantidad de notificaciones de la pantalla principal
    setNotifications(amount) {
        this.mainScreen.setNotifications(amount);
    }
}