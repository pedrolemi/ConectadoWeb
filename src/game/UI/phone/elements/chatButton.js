import InteractiveContainer from "../../../../framework/UI/interactiveContainer.js";
import TextArea from "../../../../framework/UI/textArea.js";
import { tintAnimation } from "../../../../framework/utils/graphics.js";

export default class ChatButton extends InteractiveContainer {
    constructor(scene, x = 0, y = 0, textConfig, icon, name) {
        super(scene, x, y);

        let bg = scene.add.image(0, 0, "phoneElements", "chatButton").setScale(0.6);
        this.add(bg);

        let pfp = scene.add.image(bg.x - bg.displayWidth / 2, 0, "avatars", icon)
        pfp.setScale((bg.displayHeight / pfp.displayHeight) * 0.8);
        pfp.x += pfp.displayWidth * 0.6;
        this.add(pfp);

        let nameText = new TextArea(scene, pfp.x + pfp.displayWidth * 0.7, 0, bg.displayWidth - pfp.displayWidth, bg.displayHeight, name, textConfig, 0, 0.5);
        nameText.adjustFontSize();
        this.add(nameText);

        // this.calculateRectangleSize();
        this.setInteractive();
        this.on("pointerdown", (pointer) => {
            pointer.event.stopPropagation();
        });

        tintAnimation(this, this.list, () => {
            console.log(name)
        }, true, false, 0xffffff, 0xc9c9c9);
    }
}