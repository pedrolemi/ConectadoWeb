export default class Character {
    /**
    * Clase para un personaje y su retrato 
    * @param {Phaser.Scene} scene - escena a la que pertenece
    * @param {String} key - identifica al personaje y sus respectivas animaciones
    * @param {Object} trans - posicion y escala del personaje
    * @param {Object} portraitTrans - posicion y escala del retrato
    * @param {Object} dialogContext - contexto de la funcion del dialogo
    * @param {Function} dialog - funcion con el dialogo que reproduce el personaje
    */
    constructor(scene, key, trans, portraitTrans, dialog) {
        this.scene = scene;

        this.anims = [];

        // Se crea el personaje y sus animaciones esqueletales de Spine
        // Nota: el origen es (0.5, 1). No se puede modificar
        this.char = this.scene.add.spine(trans.x, trans.y, key);
        this.char.setScale(trans.scale);
        this.char.setInteractive({ useHandCursor: true });
        this.anims.push(this.char);

        this.dialog = dialog;
        this.char.on('pointerdown', () => {
            this.dialog();
        });

        // Se crea el retrato y sus animaciones esquelates de Spine
        // El retrato se almacena en un contenedor especial para objetos de tipo Spine
        // para poder ponerle una mascara
        this.portrait = this.scene.add.spineContainer();
        this.maxSize = 1;
        this.imgPortrait = this.scene.add.spine(0, 0, key);
        this.portrait.setPosition(portraitTrans.x, portraitTrans.y);
        this.portrait.setScale(portraitTrans.scale);
        this.portrait.add(this.imgPortrait);
        this.anims.push(this.imgPortrait);
    }

    setAnimation(name, loop) {
        // cambiar la animacion tanto del personaje como del retrato
        this.anims.forEach((anim) => {
            anim.setAnimation(0, name, loop);
        });
    }

    getPortrait() {
        return this.portrait;
    }

    setPosition(x, y) {
        this.char.setPosition(x, y);
    }

    setScale(scaleX, scaleY) {
        if (!scaleY) {
            scaleY = scaleX;
        }
        this.char.setScale(scaleX, scaleY);
    }

    setActive(enable) {
        this.char.setVisible(enable);
        if (enable) {
            this.char.setInteractive();
        }
        else {
            this.char.disableInteractive();
        }
    }

    setDepth(depth) {
        this.char.setDepth(depth);
    }

    changeDialog(dialog) {
        this.dialog = dialog;
    }
}