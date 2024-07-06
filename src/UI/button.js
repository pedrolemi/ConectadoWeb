import GameManager from "../managers/gameManager.js";

export default class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, scale, fn, fill, normalCol, highlightedCol, pressedCol, text, fontParams, edge, hitArea){
        super(scene, x, y);

        this.scene.add.existing(this);

        let gameManager = GameManager.getInstance();

        let fillImg = this.scene.add.image(0, 0, fill);
        gameManager.tintrgb.add(fillImg);
        if(normalCol){
            fillImg.tintR = normalCol.R;
            fillImg.tintG = normalCol.G;
            fillImg.tintB = normalCol.B;
        }
        if(hitArea){
            fillImg.setInteractive(hitArea.area, hitArea.callback);
        }
        else{
            fillImg.setInteractive();
        }
        //this.scene.input.enableDebug(fillImg, '0xffff00');

        let tintFadeTime = 15;

        if(highlightedCol){
            fillImg.on('pointerover', () => {
                this.scene.tweens.add({
                    targets: fillImg,
                    tintR: highlightedCol.R,
                    tintG: highlightedCol.G,
                    tintB: highlightedCol.B,
                    duration: tintFadeTime,
                    repeat: 0,
                });
            });
        }

        if(normalCol){
            fillImg.on('pointerout', () => {
                scene.tweens.add({
                    targets: fillImg,
                    tintR: normalCol.R,
                    tintG: normalCol.G,
                    tintB: normalCol.B,
                    duration: tintFadeTime,
                    repeat: 0,
                });
            });
        }

        fillImg.on('pointerdown', (pointer) => {
            fillImg.disableInteractive();
            if(pressedCol){
                let down = scene.tweens.add({
                    targets: fillImg,
                    tintR: pressedCol.R,
                    tintG: pressedCol.G,
                    tintB: pressedCol.B,
                    duration: tintFadeTime,
                    repeat: 0,
                });
                down.on('complete', () => {
                    fn();
                });
            }
            else{
                fn();
            }
        });

        this.add(fillImg);
        
        if(edge){
            let edgeImg = this.scene.add.image(0, 0, edge);
            this.add(edgeImg);
        }

        if(text){
            let style = {
                fontFamily: fontParams.font, 
                fontSize: fontParams.size + 'px',
                fontStyle: 'normal', 
                color: fontParams.color
            }

            let buttonText = this.scene.add.text(0, 0, text, style);
            buttonText.setOrigin(0.5);
            this.add(buttonText);
        }

        this.setScale(scale);
    }
}