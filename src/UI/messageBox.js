export default class messageBox extends Phaser.GameObjects.Container {
    /**
     * Contenedor para las burbujas de mensajes
     * @extends {Phaser.GameObjects.Container}
     * @param {Phaser.Scene} scene - escena a la que pertenece (UIManager)
     * @param {String} text - texto a escribir en el mensaje
     * @param {String} character - personaje que escribe el mensaje
     * @param {Number} type - tipo de mensaje (0 = mensaje de chat, 1 = comentario de la red social)
     * @param {Number} maxWidth - anchura maxima que puede tener la burbuja de dialogo
     * 
     */
    constructor(scene, msgText, character, name, type, maxWidth) {
        super(scene, 0, 0);

        let BOX_PADDING = 10;
        let TEXT_PADDING = 20;

        let img = "myBubble";
        let leftWidth = 25;
        let rightWidth = 53;
        let topHeight = 25;
        let bottomHeigth = 44;
        let heightMultiplier = 3;

        if (( character !== "player" && character  && type === 0) || type === 1) {
            if (type === 0) {
                img = "othersBubble";
                leftWidth = 50;
                rightWidth = 65;
                topHeight = 25;
                bottomHeigth = 44;
            }
            else {
                img = "commentBubble";
                leftWidth = 50;
                rightWidth = 65;
                topHeight = 25;
                bottomHeigth = 36;
            }
            heightMultiplier = 4;
        }


        // Configuracion de texto para la el texto de el titulo
        let textConfig = { ...scene.textConfig };
        textConfig.fontFamily = 'roboto';
        textConfig.style = 'normal';
        textConfig.fontSize = 15 + 'px';
        textConfig.color = '#000';
        textConfig.wordWrap = {
            width: maxWidth - (BOX_PADDING * 2 + TEXT_PADDING * 3),
            useAdvancedWrap: true
        }

        textConfig.strokeThickness = 0;
        let text = scene.createText(0, - TEXT_PADDING / 3, msgText, textConfig).setOrigin(0.5, 0.5);
        let nameText = scene.createText(0, - TEXT_PADDING / 3, name, textConfig).setOrigin(0.5, 0.5);

        let boxImg = scene.add.image(0, 0, img);
        let boxWidth = Math.max(text.displayWidth + TEXT_PADDING * 3, nameText.displayWidth + TEXT_PADDING * 3, boxImg.displayWidth)
        boxImg.destroy();


        let box = scene.add.nineslice(
            0, 0, img, "", boxWidth, text.displayHeight + TEXT_PADDING * heightMultiplier, leftWidth, rightWidth, topHeight, bottomHeigth
        ).setOrigin(0.5, 0.5);

        if (type === 1) {

        }
        else {
            if (character === "player" || !character) {
                box.x = box.x + (maxWidth / 2) - (box.displayWidth / 2) - BOX_PADDING;
                text.x = box.x - TEXT_PADDING / 2;
            }
            else {
                box.x = box.x - (maxWidth / 2) + (box.displayWidth / 2) + BOX_PADDING;
                text.x = box.x + TEXT_PADDING / 2;
                text.y += TEXT_PADDING;
                nameText.x = text.x;
            }
        }
        box.y += box.displayHeight / 2 + BOX_PADDING;
        text.y += box.displayHeight / 2 + BOX_PADDING;

        console.log(nameText);


        this.add(text);
        this.add(nameText);
        this.add(box);
        this.bringToTop(text);
        this.bringToTop(nameText);

        this.h = box.displayHeight + BOX_PADDING;

        scene.add.existing(this);
    }
}