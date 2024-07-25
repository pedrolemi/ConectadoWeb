import PlaygroundBase from "../playgroundBase.js";
import Character from "../../../gameObjects/character.js"

export default class PlaygroundMorningDay1 extends PlaygroundBase {
    constructor() {
        super('PlaygroundMorningDay1');
    }

    create(params) {
        super.create(params);

        this.home = "LivingroomMorningDay1";
        this.stairs = "StairsMorningDay1";

        // Si se llega tarde, se abren las puertas y no se colocan personajes en el fondo
        if (this.gameManager.getValue(this.gameManager.isLate)) {
            super.openDoors();
        }
        else {

            let tr = {
                x: 280,
                y: this.CANVAS_HEIGHT * 0.95,
                scale: 0.065
            };
            let jose = new Character(this, "Jose", tr, this.portraitTr, () => {
                this.dialogManager.setNode(joseNode);
            });
            jose.setScale( -tr.scale, tr.scale);
            jose.setAnimation("IdleBase", true);
            this.portraits.set("Jose", jose.getPortrait());
    
            tr = {
                x: this.rightBound * 0.65,
                y: this.CANVAS_HEIGHT * 0.92,
                scale: 0.055
            };
            let alison = new Character(this, "Alison", tr, this.portraitTr, () => {
                this.dialogManager.setNode(alisonNode);
            });
            alison.setAnimation("IdleBase", true);
            this.portraits.set("Alison", alison.getPortrait());
    

            tr = {
                x: this.rightBound * 0.96,
                y: this.CANVAS_HEIGHT * 1.25,
                scale: 0.2
            };
            let guille = new Character(this, "Guille", tr, this.portraitTr, () => {
                this.dialogManager.setNode(guilleNode);
            });
            guille.setAnimation("IdleBase", true);
            this.portraits.set("Guille", guille.getPortrait());


            let nodes = this.cache.json.get('playgroundMorningDay1');
            let joseNode = super.readNodes(nodes, "day1\\playgroundMorningDay1", "jose", true);
            let alisonNode = super.readNodes(nodes, "day1\\playgroundMorningDay1", "alison", true);
            let guilleNode = super.readNodes(nodes, "day1\\playgroundMorningDay1", "guille", true);;
            
            nodes = this.cache.json.get('everydayDialog');
            this.homeNode = super.readNodes(nodes, "everydayDialog", "playground.homeMorning", true);

            this.dispatcher.addOnce("openDoors", this, (obj) => {
                console.log(obj);
                let anim = this.tweens.add({
                    targets: [jose.char, alison.char, guille.char],
                    alpha: { from: 1, to: 0 },
                    duration: 1000,
                    repeat: 0,
                });
                anim.on('complete', () => {
                    super.openDoors();
                })
            });
        }


        
        
    }
}
