import GameManager from '../managers/gameManager.js'

export default class Counter extends Phaser.GameObjects.Container {
    constructor(scene, x, y, scale, fill, edge, particle, font, limit, waitTimer, increase, fillColor){
        super(scene, x, y);

        this.scene.add.existing(this);

        this.elapsedTime = 0;
        this.waitTimer = waitTimer;
        this.limit = limit;
        this.increase = increase;

        let gameManager = GameManager.getInstance();
        this.fillImg = this.scene.add.image(0, 0, fill);
        if(fillColor){
            gameManager.tintrgb.add(this.fillImg, fillColor);
        }
        this.add(this.fillImg);

        this.edgeImg = this.scene.add.image(0, 0, edge);
        this.add(this.edgeImg);
        
        let style = {
            fontFamily: font, 
            fontSize: '90px',
            fontStyle: 'normal', 
            color: '#ffffff'
        }

        this.cont = 0;
        this.text = this.scene.add.text(0, 0, this.cont, style);
        this.text.setOrigin(0.5);
        this.add(this.text);

        this.emitter = this.scene.add.particles(0, 0, particle, {
            lifespan: 3000,
            speed: { min: 750, max: 1000 },
            scale: { start: 0.4, end: 0 },
            frequency: -1,
            quantity: 22
        });

        this.add(this.emitter);

        this.addToUpdateList()
        this.setScale(scale);
    }

    preUpdate(t, dt) {
        this.elapsedTime += dt;
        
        if(this.cont < this.limit){
            this.cont = Math.pow(this.elapsedTime / 1000, this.increase);
            this.cont = Math.ceil(this.cont);

            if(this.cont < this.limit){
                this.text.setText(this.cont);
            }
            else{
                this.elapsedTime = 0;
                this.makeVisible(false);
                this.emitter.explode();
            }
        }
        else if (this.elapsedTime > this.waitTimer) {
            this.elapsedTime = 0;
            this.cont = 0;
            this.text.setText(this.cont);
            this.makeVisible(true);
        }
    }

    makeVisible(enable){
        this.fillImg.setVisible(enable);
        this.edgeImg.setVisible(enable);
        this.text.setVisible(enable);
    }
}