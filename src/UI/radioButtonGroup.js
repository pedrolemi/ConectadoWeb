export default class RadioButtonGroup {
    /**
     * Clase que permite crear un conjunto de radio buttons a partir de checkboxes
     * @param {Array} - array con las checkboxes que constituyen este grupo
     */
    constructor(radioButtons) {
        this.radioButtons = radioButtons;
        this.selectedButton = null;
        // Se utiliza un map para asignar a cada boton un indice
        // Se hace de esta manera para que sea mas indicar indicar cual es el que ha sido seleccionado
        this.buttonsMap = new Map();

        let cont = 0;
        this.radioButtons.forEach(button => {
            // Se establece el grupo al que pertence cada checkbox
            button.setGroup(this);
            // Se quita el check por si acaso
            button.setChecked(false);
            // Se guarda cada checkbox con un indice relacionado
            this.buttonsMap.set(button, cont);
            ++cont;
        })
    }

    /**
     * Activar el boton del grupo indicado y desactivar el resto
     * @param {CheckBox} - boton que se va a activar
     */
    checkButton(button) {
        this.selectedButton = button;
        this.radioButtons.forEach(button => {
            if (button != this.selectedButton) {
                button.setChecked(false);
            }
        });
    }

    /**
     * Obtener el boton seleccionado. Aunque se devuelve un indice, se puede acceder facilmente
     * al boton original usando este indice en el array de checkboxes
     * @returns indice del boton que se ha pulsado
     */
    getIndexSelButton() {
        if (this.selectedButton) {
            if (this.buttonsMap.has(this.selectedButton)) {
                return this.buttonsMap.get(this.selectedButton);
            }
        }
        return -1;
    }
}