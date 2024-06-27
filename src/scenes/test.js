export default class Test extends Phaser.Scene {
    constructor() {
        super({ key: 'Test' });
    }

    preload() {
        // Precarga la imagen del fondo
        this.load.image('bg', 'assets/patio.png');
        this.load.image('mom', 'assets/mom.png');
        this.load.image('dad', 'assets/dad.png');
    }

    create() {
        // Pone una imagen de fondo con las dimensiones del canvas
        let img = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        let scale = this.sys.game.canvas.height / img.height;
        img.setScale(scale);

        // Ejecuta otra escena al mismo tiempo que esta
        this.scene.launch('DialogManager');

        // Para probar. Hacer click en el fondo hace que se abra el dialogo
        this.dialogManager = this.scene.get('DialogManager');

        // img.setInteractive();
        
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

        this.chars = [mom, dad];


        
    }


}
