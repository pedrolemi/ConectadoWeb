export default class FeedTab extends Phaser.GameObjects.Group {
    /**
     * Pestana donde aparecen los posts de los amigos del personaje
     * @param {SocialNetworkScreen} socialNetScreen - pantalla de la red social 
     */
    constructor(socialNetScreen) {
        super(socialNetScreen.scene);

        // Mensaje informativo que aparece arriba
        let infoTextStyle = { ...this.scene.gameManager.textConfig };
        infoTextStyle.fontFamily = 'AUdimat-regular';
        infoTextStyle.backgroundColor = 'rgba(66, 119, 142, 1)';
        infoTextStyle.padding = {
            left: 40,
            top: 7
        }
        let aux = "Este es tu tablón, mira lo que tus amigos han compartido"
        let infoText = this.scene.add.text(3.05 * this.scene.CANVAS_WIDTH / 5, this.scene.CANVAS_HEIGHT / 8, aux, infoTextStyle);
        infoText.setOrigin(0.5, 0);
        this.add(infoText);
    }
}