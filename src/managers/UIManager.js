import DialogManager from "./dialogManager.js";
import PhoneManager from "../UI/phone/phoneManager.js";

export default class UIManager extends Phaser.Scene {
    constructor(scene) {
        super({ key: 'UIManager' });
    }

    create() {
        // Configuracion de texto por defecto
        this.textConfig = {
            fontFamily: 'Arial',          // Fuente (tiene que estar precargada en el html o el css)
            fontSize: 25 + 'px',               // Tamano de la fuente del dialogo
            fontStyle: 'bold',          // Estilo de la fuente
            backgroundColor: null,          // Color del fondo del texto
            color: '#fff',          // Color del texto
            stroke: '#000',    // Color del borde del texto
            strokeThickness: 5,          // Grosor del borde del texto 
            align: 'left',           // Alineacion del texto ('left', 'center', 'right', 'justify')
            wordWrap: null,
        }


        this.phoneManager = new PhoneManager(this)
        this.dialogManager = new DialogManager(this);

    }

    getDialogManager() {
        return this.dialogManager;
    }

    getPhoneManager() {
        return this.phoneManager;
    }

    /**
    * Crea el texto que se muestra por pantalla
    * @param {string} text - texto a escribir
    * @return {string} - texto creado por la funcion
    */
    createText(x, y, text, config) {
        if (!config) {
            config = this.textConfig;
        }
        // Crea el texto en la escena y lo devuelve
        let textObj = this.make.text({
            x, y, text, 
            style: {
                fontFamily: config.fontFamily,
                fontSize: config.fontSize,
                fontStyle: config.fontStyle,
                backgroundColor: config.backgroundColor,
                color: config.color,
                stroke: config.stroke,
                strokeThickness: config.strokeThickness,
                align: config.align,
                wordWrap: config.wordWrap
            }
        });

        return textObj;
    }

}