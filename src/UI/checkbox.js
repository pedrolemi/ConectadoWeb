import GameManager from '../managers/gameManager.js'

export default class CheckBox extends Phaser.GameObjects.Container {
    constructor(scene, x, y, scale, tickColor, pressedColor, fill, edge, hitArea){
        super(scene, x, y);

        this.scene.add.existing(this);

        this.checked = false;

        // si es distinto de null pertenece a algun grupo
        // Entonces, funciona como un radio button
        this.group = null;

        let gameManager = GameManager.getInstance();

        let fillImg = this.scene.add.image(0, 0, fill);
        gameManager.tintrgb.add(fillImg);
        this.add(fillImg);

        if(hitArea){
            fillImg.setInteractive(hitArea.area, hitArea.callback);
        }
        else{
            fillImg.setInteractive();
        }
        //this.scene.input.enableDebug(fillImg, '0xffff00');
        fillImg.on('pointerdown', () => {
            let down = scene.tweens.add({
                targets: fillImg,
                tintR: pressedColor.R,
                tintG: pressedColor.G,
                tintB: pressedColor.B,
                duration: 80,
                repeat: 0,
                yoyo: true
            });
            down.on('complete', () => {
                if(this.group){
                    this.group.checkButton(this);
                    this.setChecked(true);
                }
                else{
                    this.toggleChecked();
                }
            });
        });

        if(edge){
            let edgeImg = this.scene.add.image(0, 0, edge);
            this.add(edgeImg);
        }

        let style = {
            fontFamily: 'Arial', 
            fontSize: '75px',
            fontStyle: 'bold', 
            color: tickColor
        }
        this.tickText = this.scene.add.text(0, 0, '✓', style).setOrigin(0.5).setVisible(false);
        this.add(this.tickText);

        this.setScale(scale);
    }

    setChecked(checked){
        this.checked = checked;
        this.tickText.setVisible(this.checked);
    }

    toggleChecked(){
        this.checked = !this.checked;
        this.tickText.setVisible(this.checked);
    }

    setGroup(group){
        if(!this.group){
            this.group = group;
        }
    }
}