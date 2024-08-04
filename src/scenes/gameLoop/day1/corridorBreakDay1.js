import CorridorBase from "../baseScenarios/corridorBase.js";
import Character from "../../../gameObjects/character.js";

export default class CorridorBreakDay1 extends CorridorBase {
    constructor() {
        super('CorridorBreakDay1');
    }

    create(params) {
        super.create(params);

        this.stairs = "StairsBreakDay1";
        this.class = "PlaygroundAfternoonDay1";
        this.classChangeParams = {
            camPos: "right"
        };
        
        // Cambia la hora del movil
        this.phoneManager.setDayInfo("midBreak");
        

        // Personajes
        let tr = {
            x: 380,
            y: this.CANVAS_HEIGHT * 0.65,
            scale: 0.051
        };
        let maria = new Character(this, "Maria", tr, this.portraitTr, () => {
            this.dialogManager.setNode(mariaNode);
        });
        maria.setAnimation("IdleBase", true);
        this.portraits.set("Maria", maria.getPortrait());
        
        tr = {
            x: 180,
            y: this.CANVAS_HEIGHT * 0.84,
            scale: 0.105
        };
        let alison = new Character(this, "Alison", tr, this.portraitTr, () => {
            this.dialogManager.setNode(alisonNode);
        });
        alison.setScale(-tr.scale, tr.scale);
        alison.setAnimation("IdleBase", true);
        this.portraits.set("Alison", alison.getPortrait());
        alison.char.visible = false;

        let nodes = this.cache.json.get('corridorBreakDay1');
        let mariaNode = super.readNodes(nodes, "day1\\corridorBreakDay1", "maria", true);
        let alisonNode = super.readNodes(nodes, "day1\\corridorBreakDay1", "alison", true);
        let phoneNode = super.readNodes(nodes, "day1\\corridorBreakDay1", "phone", true);

        nodes = this.cache.json.get('everydayDialog');
        this.classNode = super.readNodes(nodes, "everydayDialog", "corridor.class", true);
        
        let chatName = this.i18next.t("textMessages.chat1", { ns: "phoneInfo", returnObjects: true });
        this.phoneManager.phone.addChat(chatName, "Alison");
        this.phoneManager.phone.setChatNode(chatName, phoneNode);


        // Al salir a las escaleras, aparece Alison
        this.stairsDoor.once('pointerdown', () => {
            alison.char.visible = true;
        });
        
        // Evento que se llama cuando se le devuelve el pendiente a Alison. La hace desaparecer con una animacion
        this.dispatcher.addOnce("alisonEnter", this, (obj) => {
            console.log(obj);

            let anim = this.tweens.add({
                targets: [alison.char],
                alpha: { from: 1, to: 0 },
                duration: 1000,
                repeat: 0,
            });
        });
        
    }

    
}
