export default class ChairWithGum extends Phaser.GameObjects.Container {
    /**
     * Silla con un chicle pegado con colisiones
     * Se usa en el minijuego del segundo dia: cuando una bola de chicle colisiona con una silla aparece un chicle pegado
     * @param {Phaser.Scene} scene - escena la que pertenecen
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} scale 
     */
    constructor(scene, x, y, scale) {
        super(scene, x, y);

        this.scene.add.existing(this);

        this.setScale(scale).setDepth(1);

        // Silla
        let chair = this.scene.add.image(0, 0, 'nightmaresElements', 'chair');
        this.add(chair);

        // Chicle pegado (inicialmente invisible)
        this.gum = this.scene.add.image(0, 0, 'nightmaresElements', 'gumChair');
        this.gumScale = 0.38;
        this.gum.setScale(this.gumScale);
        this.gum.setVisible(false);
        this.add(this.gum);

        // Collider del objeto (ocupa solo el asietno de la silla)
        this.scene.physics.add.existing(this);
        // Tam del collider (respecto a la silla)
        let bodyWidth = chair.displayWidth / 1.2;
        let bodyHeight = chair.displayHeight / 4;
        // Centros del collider
        let bodyCenter = {
            x: -bodyWidth / 2,
            y: -bodyHeight / 2
        }
        // Se setea el tam del collider
        this.body.setSize(bodyWidth, bodyHeight);
        // Se setea la posicion del collider
        this.body.setOffset(bodyCenter.x, 0.8 * bodyCenter.y);
        // El objeto no se mueve al ser golpeado por otro objeto con fisicas
        this.body.setImmovable(true);

        // Ancho del objeto (para poder colocar una hilera directamente)
        this.w = chair.displayWidth * scale;
        // Si se le ha pegado un chicle o no
        this.stickedGum = false;
    }

    stickGum() {
        this.stickedGum = true;
        this.gum.setVisible(true);
    }

    /**
     * Clonar el objeto (para poder colocar una hilera directamnete)
     * @returns {ChairWithGum} - copia del objeto
     */
    clone() {
        return new ChairWithGum(this.scene, this.x, this.y, this.scale);
    }

    /**
     * Cambiar la posicion, escala y orientacion del chicle pegado
     */
    moveGum(gumOffset) {
        this.gum.x += gumOffset.x;
        this.gum.y += gumOffset.y;
        this.gum.setScale(this.gumScale * gumOffset.scale);
        this.gum.flipX = gumOffset.left;
    }
}