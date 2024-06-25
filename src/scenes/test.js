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
        let img = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        img.setScale(1);
        img.setScale(this.sys.game.canvas.width / img.width, this.sys.game.canvas.height / img.height);

        
    }
    
    


}
