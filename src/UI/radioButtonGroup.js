export default class RadioButtonGroup {
    constructor(radioButtons) {
        this.radioButtons = radioButtons;
        this.selectedButton = null;
        this.buttonsMap = new Map();

        let cont = 0;
        this.radioButtons.forEach(button => {
            button.setGroup(this);
            button.setChecked(false);
            this.buttonsMap.set(button, cont);
            ++cont;
        })
    }

    checkButton(button) {
        this.selectedButton = button;
        this.radioButtons.forEach(button => {
            if (button != this.selectedButton) {
                button.setChecked(false);
            }
        });
    }

    getIndexSelButton() {
        if (this.selectedButton) {
            if (this.buttonsMap.has(this.selectedButton)) {
                return this.buttonsMap.get(this.selectedButton);
            }
        }
        return -1;
    }
}