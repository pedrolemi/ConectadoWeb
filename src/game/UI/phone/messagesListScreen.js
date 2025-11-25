import TextArea from "../../../framework/UI/textArea.js";
import BaseScreen from "./baseScreen.js";
import ChatButton from "./elements/chatButton.js";
// import ChatListView from "./elements/chatListView.js";

export default class MessagesListScreen extends BaseScreen {
    /**
    * Clase para la pantalla de "ajustes" del movil (para salir a la pantalla de inicio)
    * @extends BaseScreen 
    * @param {BaseScene} scene - escena en la que esta el movil (idealmente la UI)
    * @param {Phone} phone - movil
    * @param {BaseScreen} prevScreen - pantalla a la que se ira desde esta al pulsar el boton de volver
    */
    constructor(scene, phone, prevScreen) {
        super(scene, phone, "messagesBg", prevScreen);

        let textConfig = { ... this.DEFAULT_TEXT_CONFIG };
        textConfig.fontFamily = "Arial";
        textConfig.fontStyle = 'bold';
        textConfig.color = "#0";

        this.chatTextConfig = { ... textConfig }
        this.chatTextConfig.fontSize = 25;
        this.chatTextConfig.fontStyle = 'normal';


        // Texto del titulo de la pantalla
        let title = new TextArea(scene, this.BG_X, this.BG_Y * 0.365, this.bg.displayWidth, this.bg.displayHeight,
            this.localizationManager.translate("textMessages.title", this.namespace), textConfig);
        title.adjustFontSize();

        this.add(title);
        
        let CHAT_LIST_X = 398;
        let CHAT_LIST_W = 330;

        // this.chatsList = new ChatListView(scene, phone, this, this.BG_X - this.bg.displayWidth / 2, 181, CHAT_LIST_W, 513, 85, 0, 0, 0, 0);
        // // , 55, this.bg.displayWidth / 2, 0, 35, 10);
        // this.add(this.chatsList);

        // this.createChatButton("Alison", "Alison");
        // this.createChatButton("Maria", "Maria");
        // this.createChatButton("Guille", "Guille");
        // this.createChatButton("Alex", "Alex");
        // this.createChatButton("Jose", "Jose");
        // this.createChatButton("Ana", "Ana");
    }

    // createChatButton(icon, name) {
    //     let chat = new ChatButton(this.scene, 0, 0, this.chatTextConfig, icon, name);
    //     this.chatsList.addToEnd(chat);
    // }
}