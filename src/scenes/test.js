import BaseScene from './baseScene.js';

export default class Test extends BaseScene {
    constructor() {
        super('Test');
    }
    
    create() {
        super.create();
        
        // Pone una imagen de fondo con las dimensiones del canvas
        let bg = this.add.image(this.sys.game.canvas.width / 2, 0, 'bg').setOrigin(0.5, 0);
        let scale = this.sys.game.canvas.height / bg.height;
        bg.setScale(scale);

        bg.setInteractive();
        bg.on('pointerdown', (pointer) => {
            this.dialogManager.textbox.activate(false);
            this.dialogManager.activateOptions(false);
        });

        let mom = this.add.image(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 'mom').setOrigin(0.5, 0.5);
        mom.setScale(0.2);
        mom.x = mom.x - mom.displayWidth;
        mom.setInteractive();
        mom.on('pointerdown', (pointer) => {
            this.dialogManager.test2();
            
        });

        let dad = this.add.image(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 'dad').setOrigin(0.5, 0.5);
        dad.setScale(0.2);
        dad.x = dad.x + dad.displayWidth;
        dad.setInteractive();
        dad.on('pointerdown', (pointer) => {
            this.dialogManager.test1();
            
        });

        this.characters = [mom, dad];

        
        this.portraitCamera.startFollow(dad, false, 0, 0, 0, 0);
    }


}
