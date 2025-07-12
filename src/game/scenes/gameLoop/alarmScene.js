import ConectadoBaseScene from "../conectadoBaseScene.js";

export default class AlarmScene extends ConectadoBaseScene {
    constructor(name) {
        super("AlarmScene");
    }

    create(params) {
        super.create();

        // Reinicia la variable de llegar tarde y de haber cogido la mochila
        this.gameManager.blackboard.set("isLate", false);
        this.gameManager.blackboard.set("bagPicked", false);

        // Actualiza el dia en el gameManager y cambia el dia y la hora del telefono
        this.gameManager.day++;


        // Pone la imagen de fondo con las dimensiones del canvas
        this.bg = this.add.image(0, 0, "bedroomCeiling").setOrigin(0.5, 0);
        this.bgScale = this.CANVAS_HEIGHT / this.bg.height;
        this.bg.setScale(this.bgScale);

        // Centra la imagen de fondo
        this.bg.x += this.CANVAS_WIDTH / 2;
        this.leftBound = this.bg.x - this.bg.displayWidth / 2;
        this.rightBound = this.bg.x + this.bg.displayWidth / 2;

        // this.dispatcher.add(this.phoneManager.wakeUpEvent, this, (obj) => {
        //     let params = {
        //         camPos: "right"
        //     }
        //     this.gameManager.changeScene("BedroomMorningDay" + this.gameManager.day, params);
        // });
    }
}