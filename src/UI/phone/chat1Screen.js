import ChatScreen from "./chatScreen.js";

export default class Chat1Screen extends ChatScreen {
    constructor(scene, phone, prevScreen, name, icon) {
        super(scene, phone, prevScreen, name, icon);

    }

    // Llama al metodo clearNotifications de la clase base
    clearNotifications() {
        super.clearNotifications();
    }

    // Llama al metodo generateNotifications de la clase base
    generateNotifications(amount) {
        super.generateNotifications(amount);
    }

    // Llama al metodo setNode de la clase abase
    setNode(node) {
        super.setNode(node);
    }
}