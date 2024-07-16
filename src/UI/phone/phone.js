import AlarmScreen from "./alarmScreen.js";
import MainScreen from "./mainScreen.js";
import StatusScreen from "./statusScreen.js";
import MessagesScreen from "./messagesScreen.js";
import SettingsScreen from "./settingsScreen.js";

export default class Phone extends Phaser.GameObjects.Container {
    constructor(scene, phoneManager) {
        super(scene, 0, 0);
        this.scene = scene;
        this.phoneManager = phoneManager;

        // Configuracion de las posiciones y dimensiones
        this.PHONE_X = 415;
        this.PHONE_Y = 800;

        // Se crean las imagenes y diferentes pantallas
        this.phone = scene.add.image(this.PHONE_X, this.PHONE_Y, 'phone')
        this.alarmScreen = new AlarmScreen(scene, this, null);
        this.mainScreen = new MainScreen(scene, this, null);
        this.statusScreen = new StatusScreen(scene, this, this.mainScreen);
        this.messagesScreen = new MessagesScreen(scene, this, this.mainScreen);
        this.settingsScreen = new SettingsScreen(scene, this, this.mainScreen);

        // Se anaden las pantallas a un array para poder iterar sobre ellas mas rapidamente
        let screens = [
            this.alarmScreen,
            this.mainScreen,
            this.statusScreen,
            this.messagesScreen,
            this.settingsScreen
        ]

        // Se crea el mapa que guardara las pantallas de chat
        this.chats = new Map();

        // Se anade la imagen del telefono y las pantallas a la escena
        this.add(this.phone);
        screens.forEach((screen) => {
            this.add(screen);
            screen.visible = false;
        });

        // Se pone la imagen del telefono por encima de todo
        this.bringToTop(this.phone);

        this.currScreen = null;

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

    /**
     * Cambia a la pantalla del chat indicado
     * @param {String} chat - id del chat
     */
    toChatScreen(chat) {
        if (this.chats.has(chat)) {
            this.changeScreen(this.chats.get(chat));
            this.chats.get(chat).clearNotifications();
        }
    }

    // Cambia a la pantalla de ajustes
    toSettingsScreen() {
        this.changeScreen(this.settingsScreen);
    }

    /**
     * Muestra en la pantalla de mensajes el chat indicado
     * @param {String} name - nombre del contacto
     * @param {String} icon - id de la imagen con la foto de perfil del contacto
     */
    addChat(name, icon) {
        this.messagesScreen.addChat(name, icon);
    }


    /**
     * Cambia la hora y el dia de las pantallas de alarma y principal
     * @param {String} hour - hora
     * @param {String} dayText - informacion del dia
     */
    setDayInfo(hour, dayText) {
        this.alarmScreen.setDayInfo(hour, dayText);
        this.mainScreen.setDayInfo(hour, dayText);
    }

    /**
     * Cambia la cantidad de notificaciones de la pantalla principal
     * @param {Number} amount - cantidad de notificaciones
     */
    setNotifications(amount) {
        this.mainScreen.setNotifications(amount);
    }

    /**
     * Cambia el nodo de dialogo en el chat indicado
     * 
     * IMPORTANTE: Antes de poder llamar a este metodo, se tiene que haber
     * llamado al metodo addChat para que chatScreen tenga el metodo setNode
     * 
     * @param {String} chat - id del chat en el que anadir el mensaje 
     * @param {DialogNode} node - nodo de dialogo que se va a reproducir
     */
    setChatNode(chat, node) {
        if (this.chats.has(chat)) {
            this.chats.get(chat).setNode(node);
        }
    }

    /**
     * Anade el mensaje al chat indicado
     * @param {String} chat - id del chat en el que anadir el mensaje 
     * @param {String} text - texto del mensaje
     * @param {String} character - id del personaje que envia el mensaje
     * @param {String} name - nombre del personaje que envia el mensaje
     */
    addMessage(chat, text, character, name) {
        if (this.chats.has(chat)) {
            this.chats.get(chat).addMessage(text, character, name);
        }
    }
}