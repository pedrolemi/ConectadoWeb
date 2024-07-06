import GameManager from '../managers/gameManager.js'

export default class Counter extends Phaser.GameObjects.Container {
    constructor(scene, x, y, scale, fill, edge, particle, font, limit, updateTimer, waitTimer, timeIncrease, fillColor){
        super(scene, x, y);

        this.scene.add.existing(this);

        this.elapsedTime = 0;
        this.timeIncrease = timeIncrease;
        this.updateTimer = updateTimer;
        this.updateTimerAux = this.updateTimer; 
        this.waitTimer = waitTimer;
        this.limit = limit;

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

        this.cont = 1;
        this.text = this.scene.add.text(0, 0, this.cont, style);
        this.text.setOrigin(0.5);
        this.add(this.text);

        this.emitter = this.scene.add.particles(0, 0, particle, {
            lifespan: 4000,
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
        if(this.cont < this.limit){
            this.elapsedTime += dt;
            this.elapsedTime *= this.timeIncrease;

            if(this.elapsedTime > this.updateTimerAux){
                ++this.cont;              
                if(this.cont < this.limit){
                    this.text.setText(this.cont);
                    this.updateTimerAux += this.elapsedTime;
                }
                else{
                    this.elapsedTime = 0;
                    this.updateTimerAux = this.updateTimer;
                    this.makeVisible(false);
                    this.emitter.explode();
                }
            }
        }
        else{
            this.elapsedTime += dt;
            if(this.elapsedTime > this.waitTimer){
                this.elapsedTime = 0;
                this.cont = 1;
                this.text.setText(this.cont);
                this.makeVisible(true);
            }
        }
    }

    makeVisible(enable){
        this.fillImg.setVisible(enable);
        this.edgeImg.setVisible(enable);
        this.text.setVisible(enable);
    }
}