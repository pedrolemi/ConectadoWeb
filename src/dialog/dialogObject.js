export default class DialogObject {
    /**
    * Clase base para los elementos de dialogo, con metodos 
    * para crear texto o activar/desactivar el objeto
    * @extends Phaser.GameObjects.Container 
    * @param {Phaser.Scene} scene - escena a la que pertenece
    */
    constructor(scene) {
        this.scene = scene;

        // Configuracion de texto por defecto
        this.textConfig = {
            font: 'Arial',          // Fuente (tiene que estar precargada en el html o el css)
            size: 25,               // Tamano de la fuente del dialogo
            style: 'bold',          // Estilo de la fuente
            bgColor: null,          // Color del fondo del texto
            color: '#fff',          // Color del texto
            borderColor: '#000',    // Color del borde del texto
            borderSize: 5,          // Grosor del borde del texto 
            align: 'left'           // Alineacion del texto ('left', 'center', 'right', 'justify')
        }

        // Configuracion de las animaciones
        this.animConfig = {
            fadeTime: 100,
            fadeEase: 'linear'
        }
    }

    /**
    * Crea el texto que se muestra por pantalla
    * @param {string} text - texto a escribir
    * @return {string} - texto creado por la funcion
    */
    createText(x, y, text, config, maxWidth,) {
        // Crea el texto en la escena y lo devuelve
        let textObj = this.scene.make.text({
            x, y, text,
            style: {
                fontFamily: config.font,
                fontSize: config.size + 'px',
                fontStyle: config.style,
                backgroundColor: config.bgColor,
                color: config.color,
                stroke: config.borderColor,
                strokeThickness: config.borderSize,
                align: config.align,
                wordWrap: {
                    width: maxWidth,
                    useAdvancedWrap: true
                },
            }
        });

        return textObj;
    }

    /**
    * Activa o desactiva los objetos indicados
    * @param {boolean} active - si se va a activar el objeto
    * @param {Array} objects - array de objetos a activar/desactivar
    * @param {function} onComplete - funcion a la que llamar cuando acabe la animacion
    * @param {number} delay - tiempo en ms que tarda en llamarse a onComplete
    */
    activate(active, objects, onComplete, delay) {
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