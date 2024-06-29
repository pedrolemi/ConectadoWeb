export default class Character {
    /**
    * Clase para un personaje y su retrato 
    * @param {Phaser.Scene} scene - escena a la que pertenece
    * @param {string} key - identifica al personaje y sus respectivas animaciones
    * @param {object} trans - posicion y escala del personaje
    * @param {object} portraitTrans - posicion y escala del retrato
    * @param {object} dialogContext - contexto de la funcion del dialogo
    * @param {function} dialog - funcion con el dialogo que reproduce el personaje
    */
    constructor(scene, key, trans, portraitTrans, dialogContext, dialog){
        this.scene = scene;

        this.anims = [];

        // se crear el personaje y sus animaciones esqueletales de Spine
        this.char = this.scene.add.spine(trans.x, trans.y, key);
        this.char.setScale(trans.scale);
        this.char.setInteractive();
        this.anims.push(this.char);

        // Prueba
        this.char.on('pointerdown', () => {
            // llamar a la funcion con el contexto adecuado
            // en caso de no especificar el contexto se llamaria con this
            dialog.call(dialogContext);
        });

        // se crea el retrato y sus animaciones esquelates de Spine
        // el retrato se almacena en un contenedor especial para objetos de tipo Spine
        // para poder disponer de una mascara
        this.portrait = this.scene.add.spineContainer();
        this.maxSize = 1;
        this.imgPortrait = this.scene.add.spine(0, 0, key);
        this.portrait.setPosition(portraitTrans.x, portraitTrans.y);
        this.portrait.setScale(portraitTrans.scale);
        this.portrait.add(this.imgPortrait);
        this.anims.push(this.imgPortrait);
    }

    setAnimation(name, loop){
        // cambiar la animacion tanto del personaje como del retrato
        this.anims.forEach((anim) => {
            anim.setAnimation(0, name, loop);
        });
    }

    getPortrait() {
        return this.portrait;
    }
    
    setPosition(x, y){
        this.char.setPosition(x, y);
    }

    setScale(scale){
        this.char.setScale(scale);
    }

    setActive(enable){
        this.char.setVisible(enable);
        this.char.setInteractive(enable);
    }
}