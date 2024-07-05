export default class Phone extends Phaser.GameObjects.Container  {
    constructor(scene) {
        super(scene, 0, 0);
        this.scene = scene;

        this.CANVAS_WIDTH = scene.sys.game.canvas.width
        this.CANVAS_HEIGHT = scene.sys.game.canvas.height;

        this.PHONE_X = 450;
        this.PHONE_Y = 800;

        this.BG_X = this.CANVAS_WIDTH / 2 + 36;
        this.BG_Y = this.CANVAS_HEIGHT / 2 + 6;

        this.phone = scene.add.image(this.PHONE_X, this.PHONE_Y, 'phone');
        this.add(this.phone);

        this.bgs = [
            scene.add.image(this.BG_X, this.BG_Y, 'alarmBg'),
            // scene.add.image(this.BG_X, this.BG_Y, 'mainScreenBg'),
            // scene.add.image(this.BG_X, this.BG_Y, 'statusBG'),
            // scene.add.image(this.BG_X, this.BG_Y, 'messagesBg'),
            scene.add.image(this.BG_X, this.BG_Y, 'chatBG'),
        ]
        
        this.bgs.forEach((bg) => {
            this.add(bg);
            // bg.visible = false;
        });
        
        this.bringToTop(this.phone);
        this.scene.add.existing(this);
    }

    getPhoneTransform() {
        return {
            x: this.phone.x,
            y: this.phone.y,
            originX: this.phone.originX,
            originY: this.phone.originY,
            scaleX: this.phone.scaleX,
            scaleY: this.phone.scaleY
        }
    }

    
}