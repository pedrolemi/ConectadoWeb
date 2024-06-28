import BaseScene from './baseScene.js';

export default class Test extends BaseScene {
    constructor() {
        super('Test');

    }
    preload() {
        // Precarga la imagen del fondo
        this.load.image('bg', 'assets/patio.png');
        this.load.image('mom', 'assets/mom.png');
        this.load.image('dad', 'assets/dad.png');
    }

    create() {
        super.create();
        
        // Pone una imagen de fondo con las dimensiones del canvas
        let img = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        let scale = this.sys.game.canvas.height / img.height;
        img.setScale(scale);

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
    }


}
