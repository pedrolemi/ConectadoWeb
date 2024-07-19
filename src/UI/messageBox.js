export default class messageBox extends Phaser.GameObjects.Container {
    /**
     * Contenedor para las burbujas de mensajes
     * @extends Phaser.GameObjects.Container
     * @param {Phaser.Scene} scene - escena a la que pertenece (UIManager)
     * @param {String} text - texto a escribir en el mensaje
     * @param {String} character - personaje que escribe el mensaje
     * @param {Number} type - tipo de mensaje (0 = mensaje de chat, 1 = comentario de la red social)
     * @param {Number} maxWidth - anchura maxima que puede tener la burbuja de dialogo
     * 
     */
    constructor(scene, msgText, character, name, type, maxWidth) {
        super(scene, 0, 0);

        // Configuracion de margenes
        let BOX_PADDING = 10;
        let TEXT_PADDING = 20;

        // Configuracion de la burbuja de texto (por defecto, la del jugador)
        let img = "myBubble";
        let leftWidth = 25;
        let rightWidth = 53;
        let topHeight = 25;
        let bottomHeigth = 44;
        let heightMultiplier = 3;
        let charName = "";

        // Configuracion de la burbuja de texto si es un mensaje de chat y el personaje 
        // que escribe no es el jugador O si es un comentario de la red social
        if ((character !== "player" && character && type === 0) || type === 1) {
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

            heightMultiplier = 3.5;
            charName = name;
        }


        // Configuracion de texto para la el texto del mensaje
        let textConfig = { ...scene.gameManager.textConfig };
        textConfig.fontFamily = 'roboto';
        textConfig.fontSize = 15 + 'px';
        textConfig.fontStyle = 'bold';
        textConfig.color = '#000';
        textConfig.wordWrap = {
            width: maxWidth - (BOX_PADDING * 2 + TEXT_PADDING * 3),
            useAdvancedWrap: true
        }

        // Configuracion de texto para el nombre del contacto
        let nameTextConfig = { ...textConfig };
        nameTextConfig.color = '#5333bb';

        // Crea el texto y el nombre
        let text = this.scene.add.text(0, - TEXT_PADDING / 3, msgText, textConfig).setOrigin(0, 0.5);
        let nameText = this.scene.add.text(0, - TEXT_PADDING / 3, charName, nameTextConfig).setOrigin(0, 0.5);

        // Crea la imagen de la burbuja de texto para obtener su ancho y calcula el ancho que deberia tener la caja
        // (el ancho de lo que ocupe mas espacio entre el nombre, el texto, o la propia caja)
        let boxImg = scene.add.image(0, 0, img);
        let boxWidth = Math.max(text.displayWidth + TEXT_PADDING * 3, nameText.displayWidth + TEXT_PADDING * 3, boxImg.displayWidth)
        boxImg.destroy();

        // Crea la burbuja como un nineslice para que se redimensione de acuerdo al tamano del texto
        let box = scene.add.nineslice(
            0, 0, img, "", boxWidth, text.displayHeight + TEXT_PADDING * heightMultiplier, leftWidth, rightWidth, topHeight, bottomHeigth
        ).setOrigin(0.5, 0.5);

        // Mueve la burbuja a la izquierda o a la derecha dependiendo de de quien es la burbuja de texto
        if (character === "player" || !character) {
            box.x = box.x + (maxWidth / 2) - (box.displayWidth / 2) - BOX_PADDING;
            text.x = box.x - box.displayWidth / 2 + TEXT_PADDING;
        }
        else {
            box.x = box.x - (maxWidth / 2) + (box.displayWidth / 2) + BOX_PADDING;
            text.x = box.x - box.displayWidth / 2 + TEXT_PADDING * 2;
            text.y += TEXT_PADDING / 2;
        }

        // Mueve hacia abajo el mensaje (ya que posteriormente se anadira a una listView cuyos objetos
        // tienen que tener el origen en 0.5, 0 y el origen del no se puede cambiar)
        nameText.x = text.x;
        nameText.y = text.y + TEXT_PADDING * 1.5;
        box.y += box.displayHeight / 2 + BOX_PADDING;
        text.y += box.displayHeight / 2 + BOX_PADDING;

        this.add(text);
        this.add(nameText);
        this.add(box);
        this.bringToTop(text);
        this.bringToTop(nameText);

        this.h = box.displayHeight + BOX_PADDING;

        scene.add.existing(this);
    }
}