import PlaygroundBase from "../baseScenarios/playgroundBase.js";
import Character from "../../../gameObjects/character.js";

export default class PlaygroundMorningDay4 extends PlaygroundBase {
    constructor() {
        super('PlaygroundMorningDay4');
    }

    create(params) {
        super.create(params);

        this.home = "";
        this.stairs = "StairsMorningDay4";
        
        // Se pone a Alison independientemente de si se llega tarde o no
        let tr = {
            x: this.rightBound * 0.65,
            y: this.CANVAS_HEIGHT * 0.92,
            scale: 0.055
        };
        let alison = new Character(this, "Alison", tr, this.portraitTr, () => {
            this.dialogManager.setNode(alisonNode);
        });
        alison.setAnimation("IdleBase", true);
        this.portraits.set("Alison", alison.getPortrait());

        // Tablon de anuncios
        let bulletinBoard = this.add.rectangle(1221 * this.scale, 1027 * this.scale, 190 * this.scale, 161 * this.scale, 0xfff, 0).setOrigin(0, 0);
        bulletinBoard.setInteractive({ useHandCursor: true });
        bulletinBoard.on('pointerdown', () => {
            this.dialogManager.setNode(boardNode);
        })

        // Si no se llega tarde, y se establece el dialogo de la puerta para que no se pueda entrar hasta que se abran 
        if (!this.gameManager.getValue("isLate")) {
            this.phoneManager.setDayInfo("playgroundMorning");
            let nodes = this.cache.json.get('everydayDialog');
            this.doorNode = super.readNodes(nodes, "everydayDialog","playground.doorMorning", true);

            
            // Personajes
            tr = {
                x: this.rightBound * 0.83,
                y: this.CANVAS_HEIGHT * 1.05,
                scale: 0.1
            };
            let guille = new Character(this, "Guille", tr, this.portraitTr, () => {
                this.dialogManager.setNode(guilleNode);
            });
            guille.setScale(-tr.scale, tr.scale)
            guille.setAnimation("IdleBase", true);
            this.portraits.set("Guille", guille.getPortrait());

            tr = {
                x: this.rightBound * 0.9,
                y: this.CANVAS_HEIGHT * 1.07,
                scale: 0.1
            };
            let jose = new Character(this, "Jose", tr, this.portraitTr, () => {
                this.dialogManager.setNode(joseNode);
            });
            jose.setAnimation("IdleBase", true);
            this.portraits.set("Jose", jose.getPortrait());

            nodes = this.cache.json.get('playgroundMorningDay4');
            let guilleNode = super.readNodes(nodes, "day4\\playgroundMorningDay4", "guille", true);
            let joseNode = super.readNodes(nodes, "day4\\playgroundMorningDay4", "jose", true);

            // Evento llamado cuando suena la campana
            this.dispatcher.addOnce("openDoors", this, (obj) => {
                console.log(obj);

                // Cambia la hora del movil
                this.phoneManager.setDayInfo("classStart");

                // Se quita el dialogo que aparece al hacer click en las puertas
                this.doorNode = null;

                // Se hace fade out de todos los personajes de la escena
                let anim = this.tweens.add({
                    targets: [jose.char, alison.char, guille.char],
                    alpha: { from: 1, to: 0 },
                    duration: 1000,
                    repeat: 0,
                });

                // Una vez termina la animacion, se abren las puertas
                anim.on('complete', () => {
                    super.openDoors();
                })
            });
        }
        // Si no, se pone la hora de llegar tarde, se dejan las puertas abiertas, y se quita el dialogo de la puerta
        else {
            this.phoneManager.setDayInfo("playgroundMorningLate");
            super.openDoors();
            this.doorNode = null;
        }     

        let nodes = this.cache.json.get('playgroundMorningDay4');
        let alisonNode = super.readNodes(nodes, "day4\\playgroundMorningDay4", "alison", true);
        let boardNode = super.readNodes(nodes, "day4\\playgroundMorningDay4", "board", true);
        
        nodes = this.cache.json.get('everydayDialog');
        this.homeNode = super.readNodes(nodes, "everydayDialog", "playground.homeMorning", true);

        
        // Evento llamado cuando se termina de hablar con Alison y se llega tarde
        this.dispatcher.addOnce("alisonLeave", this, (obj) => {
            console.log(obj);

            // Se hace fade out de Alison
            this.tweens.add({
                targets: [alison.char],
                alpha: { from: 1, to: 0 },
                duration: 1000,
                repeat: 0,
            });
        });

    }
}
