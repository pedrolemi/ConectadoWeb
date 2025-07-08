import ClassFrontBase from "../baseScenarios/classFrontBase.js";
import Character from "../../../gameObjects/character.js";

export default class ClassFrontMorningDay1 extends ClassFrontBase {
    constructor() {
        super('ClassFrontMorningDay1');
    }

    create(params) {
        super.create(params);

        let teacher = this.add.image(this.portraitTr.x, this.portraitTr.y + 20, 'teacherChar').setOrigin(0.5, 1).setScale(this.portraitTr.scale);
        this.portraits.set("teacher", teacher);

        // Si no se ha llegado tarde, solo se coloca a Ana en clase
        if (!this.gameManager.getValue("isLate")) {
            let tr = {
                x: 650,
                y: this.CANVAS_HEIGHT * 0.86,
                scale: 0.1
            };
            let ana = new Character(this, "Ana", tr, this.portraitTr, () => {
                this.dialogManager.setNode(anaNode);
            });
            ana.setDepth(this.row4Tables.depth);
            ana.setAnimation("IdleBase", true);
            this.portraits.set("Ana", ana.getPortrait());

            let nodes = this.cache.json.get('classFrontMorningDay1');
            let anaNode = super.readNodes(nodes, "day1\\classFrontMorningDay1", "ana", true);
        }
        // Si no, se colocan mas alumnos en la clase y se pone directamente el nodo del profesor
        else {
            let tr = {
                x: 160,
                y: this.CANVAS_HEIGHT * 0.51,
                scale: this.scale * 1.4
            };
            this.add.image(tr.x, tr.y, this.atlasName, 'frontChar3').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row1Chairs.depth);

            tr = {
                x: 680,
                y: this.CANVAS_HEIGHT * 0.55,
                scale: this.scale * 1.4
            };
            this.add.image(tr.x, tr.y, this.atlasName, 'frontChar2').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row1Chairs.depth);

            tr = {
                x: 1150,
                y: this.CANVAS_HEIGHT * 0.55,
                scale: this.scale * 1.4
            };
            this.add.image(tr.x, tr.y, this.atlasName, 'frontChar1').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row1Chairs.depth);


            tr = {
                x: 280,
                y: this.CANVAS_HEIGHT * 0.54,
                scale: this.scale * 1
            };
            this.add.image(tr.x, tr.y, this.atlasName, 'frontChar8').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row2Chairs.depth);

            tr = {
                x: 720,
                y: this.CANVAS_HEIGHT * 0.54,
                scale: this.scale * 1
            };
            this.add.image(tr.x, tr.y, this.atlasName, 'frontChar10').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row2Chairs.depth);

            tr = {
                x: 1060,
                y: this.CANVAS_HEIGHT * 0.54,
                scale: this.scale * 1.1
            };
            this.add.image(tr.x, tr.y, this.atlasName, 'frontChar11').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row2Chairs.depth);


            tr = {
                x: 1560,
                y: this.CANVAS_HEIGHT * 0.52,
                scale: this.scale * 0.9
            };
            this.add.image(tr.x, tr.y, this.atlasName, 'frontChar7').setOrigin(0, 0).setScale(-tr.scale, tr.scale).setDepth(this.row3Chairs.depth);

            tr = {
                x: 1030,
                y: this.CANVAS_HEIGHT * 0.52,
                scale: this.scale * 0.8
            };
            this.add.image(tr.x, tr.y, this.atlasName, 'frontChar5').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row3Chairs.depth);


            tr = {
                x: 510,
                y: this.CANVAS_HEIGHT * 0.49,
                scale: this.scale * 0.76
            };
            this.add.image(tr.x, tr.y, this.atlasName, 'frontChar9').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row4Chairs.depth);


            let nodes = this.cache.json.get('classFrontMorningDay1');
            let teacherNode = super.readNodes(nodes, "day1\\classFrontMorningDay1", "teacher", true);
            setTimeout(() => {
                this.dialogManager.setNode(teacherNode);                
            }, 50);
        }


        // Evento llamado cuando terminan los dialogos y empieza la clase
        this.dispatcher.addOnce("startClass", this, (obj) => {
            let sceneName = 'TextOnlyScene';

            // Se obtiene el texto de la escena de transicion del archivo de traducciones 
            let text = this.i18next.t("day1.startClass", { ns: "transitionScenes", returnObjects: true });
            if (this.gameManager.getValue("isLate")) {
                text = this.i18next.t("day1.startClassLate", { ns: "transitionScenes", returnObjects: true });
            }

            let params = {
                text: text,
                onComplete: () => {
                    this.gameManager.changeScene('ClassBackMorningDay1');
                },
                onCompleteDelay: 500
            };

            // Se cambia a la escena de transicion
            this.gameManager.changeScene(sceneName, params);
        });
    }
}
