export default class Character extends SpinePlugin.SpineGameObject {
    /**
    * Clase base para los personajes con animaciones esqueletales 
    * @extends SpinePlugin.SpineGameObject
    * @param {Phaser.Scene} scene 
    * @param {Number} x - posicion x del centro de la animacion
    * @param {Number} y - posicion y del punto inferior de la animacion
    * @param {String} key - id con el que se carga la animacion al llamar a load.spine
    * @param {Function} onClick - funcion a llamar al pulsar sobre el personaje
    * @param {String} animationName - nombre de la animacion a reproducir
    * @param {Number} animationSpeed - multiplicador de la velocidad con la que reproducir la animacion 
    * @param {Boolean} loop - true si se quiere loopear la animacion, false en caso contrario
    */
    constructor(scene, x, y, key, onClick, animationName = "Idle01", animationSpeed = 0.6, loop = true) {
        super(scene, scene.spine, x, y, key, animationName, loop);
        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        
        this.key = key;
        
        this.setAnimationSpeed(animationSpeed);
        this.setAnimation(animationName, loop);

        if (onClick != null) {
            scene.setInteractive(key, this, onClick);
        }
    }

    /**
    * Cambiar la animacion que reproduce el personaje
    * @param {String} animationName - nombre de la animacion a reproducir
    * @param {Boolean} loop - true si se quiere loopear, false en caso contrario (opcional)
    */
    setAnimation(animationName, loop = true) {
        if (animationName != this.getCurrentAnimationName) {
            super.setAnimation(0, animationName, loop);
        }
    }
    /**
    * Obtener el nombre de la animacion que se esta reproduciendo
    * @returns {String} - nombre de la animacion actual
    */
    getCurrentAnimationName() {
        return (this.getCurrentAnimation() == null) ? null : this.getCurrentAnimation().name;
    }
    
    /**
    * Cambiar si la animacion actual se reproduce en loop
    * @param {Boolean} loop - true si se quiere loopear la animacion, false en caso contrario
    */
    setLoop(loop) {
        this.state.getCurrent(0).loop = loop;
    }
    /**
    * Comprobar si la animacion actual esta loopeada
    * @returns {Boolean} - true si la animacion actual esta loopeada, false en caso contrario
    */
    isLooping() {
        return this.state.getCurrent(0).loop;
    }

    /**
    * Cambiar la velocidad de la animacion actual
    * @param {Number} speed - multiplicador de la velocidad con la que reproducir la animacion 
    */
    setAnimationSpeed(speed) {
        this.state.timeScale = speed;
    }

    /**
    * Clonar el personaje en otra escena (o en la misma) con la animacion sincronizada
    * @param {Phaser.Scene} scene - escena en la que clonar el personaje 
    * @returns {Character} - clon del Character desde el que se llama al metodo 
    */
    clone(scene) {
        let clone = new Character(scene, this.x, this.y, this.key, null, this.getCurrentAnimationName(), this.state.timeScale, this.isLooping());
        clone.syncAnimation(this);
        return clone; 
    }

    /**
    * Sincronizar la animacion actual para que vaya a la par que otro Character indicado
    * @param {Character} originalChar - personaje con el que sincronizar las animaciones
    */
    syncAnimation(originalChar) {
        if (this.key == originalChar.key) {
            const currentTrack = this.state.getCurrent(0);
            if (currentTrack != null) {
                currentTrack.trackLast = originalChar.state.getCurrent(0).trackTime;
                currentTrack.trackTime = originalChar.state.getCurrent(0).trackTime ;
                currentTrack.nextAnimationLast = originalChar.state.getCurrent(0).nextAnimationLast;
                currentTrack.nextTrackLast = originalChar.state.getCurrent(0).nextTrackLast;
            }
        }
    }
}