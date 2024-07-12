import ChatScreen from "./chatScreen.js";

export default class Chat1Screen extends ChatScreen {
    constructor(scene, phone, prevScreen, name, icon) {
        super(scene, phone, prevScreen, name, icon);

        let opts = this.i18next.t("textMessages", { ns: "phone", returnObjects: true });
        this.options = opts.chat1.options;
    }

    // Llama al metodo clearNotifications de la clase base
    clearNotifications() {
        super.clearNotifications();
    }

    // Llama al metodo generateNotifications de la clase base
    generateNotifications(amount) {
        super.generateNotifications(amount);
    }
}