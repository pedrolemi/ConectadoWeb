import AlarmScreen from "./alarmScreen.js";
import MainScreen from "./mainScreen.js";
import StatusScreen from "./statusScreen.js";
import MessagesScreen from "./messagesScreen.js";
import ChatScreen from "./chatScreen.js";
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
        this.alarmScreen = new AlarmScreen(scene, this, 'alarmBg', null);
        this.mainScreen = new MainScreen(scene, this, 'mainScreenBg', null);
        this.statusScreen = new StatusScreen(scene, this, 'statusBG', this.mainScreen);
        this.messagesScreen = new MessagesScreen(scene, this, 'messagesBg', this.mainScreen);
        this.chatScreen = new ChatScreen(scene, this, 'chatBG', this.messagesScreen);
        this.settingsScreen = new SettingsScreen(scene, this, ' ', this.mainScreen);

        // Se anaden las pantallas a un array para poder iterar sobre ellas mas rapidamente
        let screens = [
            this.alarmScreen,
            this.mainScreen,
            this.statusScreen,
            this.messagesScreen,
            this.chatScreen,
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

        this.toStatusScreen();
        
        scene.add.existing(this);
    }

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

    changeScreen(nextScreen) {
        if (this.currScreen !== nextScreen) {
            if ( this.currScreen) {
                this.currScreen.visible = false;
            }
            this.currScreen = nextScreen;
            this.currScreen.visible = true;
        }
        
    }

    toPrevScreen() {
        if (this.currScreen === this.mainScreen) {
            this.phoneManager.togglePhone();
        }
        if (this.currScreen.prevScreen) {
            this.changeScreen(this.currScreen.prevScreen);
        }
    }


    toMainScreen() {
        this.changeScreen(this.mainScreen);
    }

    toStatusScreen() {
        this.changeScreen(this.statusScreen);
    }

    toMsgScreen() {
        this.changeScreen(this.messagesScreen);
    }

    toChatScreen() {
        this.changeScreen(this.chatScreen);
    }

    toSettingsScreen() {
        this.changeScreen(this.settingsScreen);
    }

    setDayInfo(hour, dayText) {
        this.mainScreen.setDayInfo(hour, dayText);
    }
}