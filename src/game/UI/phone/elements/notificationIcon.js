import TextArea from "../../../../framework/UI/textArea.js";
import { createRectTexture } from "../../../../framework/utils/graphics.js";

export default class NotificationIcon extends Phaser.GameObjects.Container {
    /**
    * TODO: Documentar
    * @param {*} scene 
    * @param {*} x 
    * @param {*} y 
    */
    constructor(scene, x, y) {
        super(scene, x, y);

        scene.add.existing(this);
        
        const W = 30;
        const H = 30;
        const BG_COLOR = 0xf55d5d;

        this.notifications = 0;

        createRectTexture(scene, "notification", W, H, 0xf55d5d, 1, 1, 0x0, 1, 15);

        // Configuracion de texto para las notificaciones
        let textConfig = { 
            fontFamily: "Arial",
            fontSize: 20,
            fontStyle: "bold",
            color: "#ffffff",
            align: "center",
        };
        let bg = scene.add.image(0, 0, "notification");

        this.text = new TextArea(scene, 0, 0, W, H, this.notifications, textConfig);

        this.add(bg);
        this.add(this.text);
    }
}