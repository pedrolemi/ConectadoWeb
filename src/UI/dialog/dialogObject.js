export default class DialogObject {
    /**
    * Clase base para los elementos de dialogo, con metodos 
    * para activar/desactivar el objeto y la configuracion por
    * defecto para el texto de los elementos de dialogo 
    * @param {Phaser.Scene} scene - escena a la que pertenece
    */
    constructor(scene) {
        this.scene = scene;

        // Configuracion de las animaciones
        this.animConfig = {
            fadeTime: 150,
            fadeEase: 'linear'
        }
    }

    /**
    * Activa o desactiva los objetos indicados
    * @param {Boolean} active - si se va a activar el objeto
    * @param {Array} objects - array de objetos a activar/desactivar
    * @param {Function} onComplete - funcion a la que llamar cuando acabe la animacion
    * @param {Number} delay - tiempo en ms que tarda en llamarse a onComplete
    */
    activate(active, objects, onComplete = { }, delay = 0) {
        let fade;
        
        // Si se va a activar
        if (active) {
            // Fuerza las opacidades de todos los objetos a 0
            objects.forEach((obj) => {
                obj.alpha = 0;
            });

            // Hace la animacion de fade in para todos los objetos
            fade = this.scene.tweens.add({
                targets: objects,
                alpha: { from: 0, to: 1 },
                ease: this.animConfig.fadeEase,
                duration: this.animConfig.fadeTime,
                repeat: 0,
            });
        }
        // Si se va a desactivar
        else {
            // Fuerza las opacidades de todos los objetos a 1
            objects.forEach((obj) => {
                obj.alpha = 1;
            });

            // Hace la animacion de fade out para todos los objetos
            fade = this.scene.tweens.add({
                targets: objects,
                alpha: { from: 1, to: 0 },
                ease: this.animConfig.fadeEase,
                duration: this.animConfig.fadeTime,
                repeat: 0,
            });
        }

        // Si se ha hecho la animacion y onComplete es una funcion valida, la ejecuta
        if (fade && onComplete !== null && typeof onComplete === 'function') {
            fade.on('complete', () => {
                setTimeout(() => {
                    onComplete();
                }, delay);
            });

        }

    }
}