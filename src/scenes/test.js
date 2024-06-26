export default class Test extends Phaser.Scene {
    constructor() {
        super({ key: 'Test' });
    }

    preload() {
        // Precarga la imagen del fondo
        this.load.image('bg', 'assets/patio.png');
    }

    create() {
        // Pone una imagen de fondo con las dimensiones del canvas
        var img = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        var scale = this.sys.game.canvas.height / img.height;
        img.setScale(scale);

        // Ejecuta otra escena al mismo tiempo que esta
        this.scene.launch('DialogManager');

        // Para probar. Hacer click en el fondo hace que se abra el dialogo
        var dialogManager = this.scene.get('DialogManager');
        img.setInteractive();
        img.on('pointerdown', function (pointer) {
            dialogManager.test();
        });
        
    }
    
    


}
