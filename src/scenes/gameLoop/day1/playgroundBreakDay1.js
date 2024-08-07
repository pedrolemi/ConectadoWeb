import PlaygroundBase from "../baseScenarios/playgroundBase.js";
import Character from "../../../gameObjects/character.js";

export default class PlaygroundBreakDay1 extends PlaygroundBase {
    constructor() {
        super('PlaygroundBreakDay1');
    }

    create(params) {
        super.create(params);

        this.home = "";
        this.stairs = "StairsBreakDay1";
        
        // Se abren las puertas 
        super.openDoors();
        this.doorNode = null;

        // Personajes
        let tr = {
            x: 280,
            y: this.CANVAS_HEIGHT * 0.92,
            scale: 0.062
        };
        let ana = new Character(this, "Ana", tr, this.portraitTr, () => {
            this.dialogManager.setNode(anaNode);
        });
        ana.setScale( -tr.scale, tr.scale);
        ana.setAnimation("IdleBase", true);
        this.portraits.set("Ana", ana.getPortrait());

        tr = {
            x: this.rightBound * 0.34,
            y: this.CANVAS_HEIGHT * 1.17,
            scale: 0.1
        };
        let guille = new Character(this, "Guille", tr, this.portraitTr, () => {
            this.dialogManager.setNode(guilleNode);
        });
        guille.setScale( -tr.scale, tr.scale);
        guille.setAnimation("IdleBase", true);
        this.portraits.set("Guille", guille.getPortrait());


        // Pendiente con sus animaciones
        tr = {
            x: this.rightBound * 0.88,
            y: this.CANVAS_HEIGHT * 0.92,
            scale: 0.5
        };
        let earring = this.add.image(tr.x, tr.y, 'earring').setScale(tr.scale);
        // La rotacion se tiene que hacer con un twen de contador
        this.tweens.addCounter({
            targets: [earring],
            duration: 500,
            repeat: -1,
            onUpdate: (tween) => {
                earring.rotation += 0.005;
            },
        });
        this.tweens.add({
            targets: [earring],
            scale: tr.scale - 0.2,
            duration: 500,
            repeat: -1,
            yoyo: true,
        });
        earring.setInteractive();
        earring.on('pointerdown', () => {
            this.dialogManager.setNode(earringNode);
        });

        let nodes = this.cache.json.get('playgroundBreakDay1');
        let anaNode = super.readNodes(nodes, "day1\\playgroundBreakDay1", "ana", true);
        let guilleNode = super.readNodes(nodes, "day1\\playgroundBreakDay1", "guille", true);
        let earringNode = super.readNodes(nodes, "day1\\playgroundBreakDay1", "earring", true);
        
        nodes = this.cache.json.get('everydayDialog');
        this.homeNode = super.readNodes(nodes, "everydayDialog", "playground.homeBreak", true);



        // Evento que se llama al recoger el pendiente. Lo hace desaparecer con una
        // animacion (la variable de coger el pendiente la cambia el propio evento)
        this.dispatcher.addOnce("pickEarring", this, (obj) => {
            earring.disableInteractive();
            let anim = this.tweens.add({
                targets: [earring],
                alpha: { from: 1, to: 0 },
                duration: 500,
                repeat: 0,
            });
        });
        
    }
}
