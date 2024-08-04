import PlaygroundBase from "../baseScenarios/playgroundBase.js";
import Character from "../../../gameObjects/character.js";

export default class PlaygroundMorningDay3 extends PlaygroundBase {
    constructor() {
        super('PlaygroundMorningDay3');
    }

    create(params) {
        super.create(params);

        this.home = "";
        this.stairs = "StairsMorningDay3";

        
        // Si no se llega tarde, y se establece el dialogo de la puerta para que no se pueda entrar hasta que se abran 
        if (!this.gameManager.getValue("isLate")) {
            this.phoneManager.setDayInfo("playgroundMorning");
            let nodes = this.cache.json.get('everydayDialog');
            this.doorNode = super.readNodes(nodes, "everydayDialog","playground.doorMorning", true);
        }
        // Si no, se pone la hora de llegar tarde, se dejan las puertas abiertas, y se quita el dialogo de la puerta
        else {
            this.phoneManager.setDayInfo("playgroundMorningLate");
            super.openDoors();
            this.doorNode = null;
        }     


        // Personajes
        let tr = {
            x: this.rightBound * 0.5,
            y: this.CANVAS_HEIGHT * 1.05,
            scale: 0.1
        };
        let alex = new Character(this, "Alex_front", tr, this.portraitTr, () => {
            this.dialogManager.setNode(groupNode);
        });
        alex.setAnimation("IdleBase", true);
        this.portraits.set("Alex", alex.getPortrait());

        tr = {
            x: this.rightBound * 0.53,
            y: this.CANVAS_HEIGHT * 1.02,
            scale: 0.087
        };
        let ana = new Character(this, "Ana", tr, this.portraitTr, () => {
            this.dialogManager.setNode(groupNode);
        });
        ana.setAnimation("IdleBase", true);
        this.portraits.set("Ana", ana.getPortrait());

        alex.setDepth(ana.char.depth + 1);

        tr = {
            x: this.rightBound * 0.57,
            y: this.CANVAS_HEIGHT * 1.01,
            scale: 0.09
        };
        let jose = new Character(this, "Jose", tr, this.portraitTr, () => {
            this.dialogManager.setNode(groupNode);
        });
        jose.setAnimation("IdleBase", true);
        this.portraits.set("Jose", jose.getPortrait());

        tr = {
            x: this.rightBound * 0.61,
            y: this.CANVAS_HEIGHT * 1.03,
            scale: 0.1
        };
        let guille = new Character(this, "Guille", tr, this.portraitTr, () => {
            this.dialogManager.setNode(groupNode);
        });
        guille.setAnimation("IdleBase", true);
        this.portraits.set("Guille", guille.getPortrait());


        let nodes = this.cache.json.get('playgroundMorningDay3');
        let groupNode = super.readNodes(nodes, "day3\\playgroundMorningDay3", "group", true);
        
        nodes = this.cache.json.get('everydayDialog');
        this.homeNode = super.readNodes(nodes, "everydayDialog", "playground.homeMorning", true);
        let boardNode = super.readNodes(nodes, "everydayDialog", "board", true);


        // Foto
        let blackBG = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0x000, 0.9).setOrigin(0, 0);

        let img = "photoGum";
        if (this.gameManager.getValue("gumWashed")) {
            img = "photoGumWashed";
        }
        let photo = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT * 0.4, "photos", img).setOrigin(0.5, 0.5);
        photo.setScale(1.2);
        let borderWidth = 20;
        let photoBorder = this.add.rectangle(photo.x, photo.y, photo.displayWidth + borderWidth, photo.displayHeight + borderWidth, 0xf2f2f2, 1).setOrigin(0.5, 0.5);

        this.photo = this.add.container(0, 0).setScrollFactor(0).setDepth(alex.char.depth + 1);
        this.photo.add(blackBG);
        this.photo.add(photoBorder);
        this.photo.add(photo);
        this.photo.visible = false;

        // Tablon de anuncios
        let bulletinBoard = this.add.rectangle(1221 * this.scale, 1027 * this.scale, 190 * this.scale, 161 * this.scale, 0xfff, 0).setOrigin(0, 0);
        bulletinBoard.setInteractive({ useHandCursor: true });
        bulletinBoard.on('pointerdown', () => {
            this.photo.visible = true;
            this.dialogManager.setNode(boardNode);
        })
        
        // Se baja la amistad de los personajes automaticamente
        this.gameManager.changeFriendship("Alex", -20);
        this.gameManager.changeFriendship("Ana", -20);
        this.gameManager.changeFriendship("Jose", -20);
        this.gameManager.changeFriendship("Guille", -10);

        
        // Evento llamado cuando suena la campana
        this.dispatcher.addOnce("openDoors", this, (obj) => {
            console.log(obj);

            // Cambia la hora del movil
            this.phoneManager.setDayInfo("classStart");

            // Se quita el dialogo que aparece al hacer click en las puertas
            this.doorNode = null;
            super.openDoors();
        });
        
        // Evento llamado cuando acaba el dialogo de ver la foto
        this.dispatcher.add("closePhoto", this, (obj) => {
            console.log(obj);

            // Oculta la foto
            this.photo.visible = false;
        });
        
    }
}
