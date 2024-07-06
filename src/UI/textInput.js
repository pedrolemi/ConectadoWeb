import GameManager from "../managers/gameManager.js";

export default class TextInput extends Phaser.GameObjects.Container {
    constructor(scene, x, y, scale, defaultText, offset, pressedColor, fill, edge, font, hitArea){
        super(scene, x, y);

        this.scene.add.existing(this);

        let gameManager = GameManager.getInstance();

        this.fillImg = this.scene.add.image(0, 0, fill);
        gameManager.tintrgb.add(this.fillImg);
        this.fillImg.setOrigin(0, 0.5);
        if(hitArea){
            this.fillImg.setInteractive(hitArea.area, hitArea.callback);
        }
        else{
            this.fillImg.setInteractive();
        }
        this.scene.input.enableDebug(this.fillImg, '0xffff00');
        this.add(this.fillImg);

        if(edge){
            let edgeImg = this.scene.add.image(0, 0, edge);
            edgeImg.setOrigin(0, 0.5);
            this.add(edgeImg);
        }

        if(!font){
            font = 'Arial';
        }
        let style = {
            fontFamily: font, 
            fontSize: '40px',
            fontStyle: 'normal',
            color: '#000000'
        }
        
        this.offset = offset;

        this.defaultTextAlpha = 0.3;
        this.defaultText = defaultText;

        this.currentText = this.defaultText;

        this.text = this.scene.add.text(this.offset, 0, this.currentText, style);
        this.text.setAlpha(this.defaultTextAlpha).setOrigin(0, 0.5).setFontStyle('italic');
        this.add(this.text);

        this.isEnteringName = false;

        this.cursor = this.scene.add.text(0, 0, '|', style);
        this.cursor.setAlpha(0).setOrigin(0, 0.5);
        this.add(this.cursor);

        this.cursorTween = this.scene.tweens.add({
            targets: this.cursor,
            alpha: 1,
            duration: 300,
            hold: 600,
            yoyo: true,
            repeat: -1,
            paused: true
        });

        this.fillImg.on('pointerup', () => {
            if(!this.isEnteringName){
                if(this.currentText === this.defaultText){
                    this.currentText = "";
                    this.setText(this.currentText);
                    this.text.setAlpha(1).setFontStyle('normal');
                }

                this.cursor.setAlpha(0);
                this.cursorTween.resume();

                let down = scene.tweens.add({
                    targets: this.fillImg,
                    tintR: pressedColor.R,
                    tintG: pressedColor.G,
                    tintB: pressedColor.B,
                    duration: 140,
                    repeat: 0,
                    yoyo: true
                });

                down.on('complete', () => {
                    this.isEnteringName = true;

                    setTimeout(() => {
                        this.deactiveInput();
                    }, 200);
                });
            }
        })

        this.scene.input.keyboard.on('keydown', (event) => {
            if (this.isEnteringName) {
                let hasChanged = false;
                if (event.keyCode === 8 && this.currentText.length > 0) {
                    hasChanged = true;
                    this.currentText = this.currentText.slice(0, -1);
                } 
                else if (event.key.length === 1 && event.key.match(/[a-zA-Z0-9\s]/)) {
                    hasChanged = true;
                    this.currentText += event.key;
                }

                if(hasChanged){
                    this.setText(this.currentText);
                    let cont = 1;
                    while(this.text.width >= this.fillImg.displayWidth - this.offset * 2){
                        let aux = this.currentText.slice(-(this.currentText.length - cont));
                        this.setText(aux);
                        ++cont;
                    }
                    /*
                    if (this.currentText.length > this.maxTextLength) {
                        let aux = this.currentText.slice(-this.maxTextLength);
                        this.setText(aux);
                    }
                    else{
                        this.setText(this.currentText);
                    }
                    */
                }
            }    
        });

        this.setScale(scale);
    }

    deactiveInput() {
        this.scene.input.off('pointerup');
        this.scene.input.once('pointerup', () => {
            if(this.isEnteringName){
                this.isEnteringName = false;
                
                if(!this.currentText){
                    this.currentText = this.defaultText;
                    this.setText(this.defaultText);
                    this.text.setAlpha(this.defaultTextAlpha).setFontStyle('italic');
                }
                
                this.cursor.setAlpha(0);
                this.cursorTween.pause();
            }
        })
    }

    setText(text){
        this.text.setText(text);
        this.cursor.x = this.text.x + this.text.width - 4;
    }

    getText(){
        return this.currentText;
    }
}