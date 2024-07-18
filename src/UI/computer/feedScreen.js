import GameManager from "../../managers/gameManager.js";
export default class FeedScreen extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);

        const CANVAS_WIDTH = this.scene.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.scene.sys.game.canvas.height;

        let gameManager = GameManager.getInstance();
        let infoTextStyle = { ...gameManager.textConfig };
        infoTextStyle.fontFamily = 'AUdimat-regular';
        infoTextStyle.backgroundColor = 'rgba(66, 119, 142, 1)';
        infoTextStyle.padding = {
            left: 40,
            top: 7
        }
        let aux = "Este es tu tablón, mira lo que tus amigos han compartido"
        let infoText = this.scene.add.text(3.05 * CANVAS_WIDTH / 5, CANVAS_HEIGHT / 8, aux, infoTextStyle);
        infoText.setOrigin(0.5, 0);
        this.add(infoText);
    }
}