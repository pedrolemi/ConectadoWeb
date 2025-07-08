import ClassFrontBase from "../baseScenarios/classFrontBase.js";

export default class ClassFrontMorningDay4 extends ClassFrontBase {
    constructor() {
        super('ClassFrontMorningDay4');
    }

    create(params) {
        super.create(params);

        let teacher = this.add.image(this.portraitTr.x, this.portraitTr.y + 20, 'teacherChar').setOrigin(0.5, 1).setScale(this.portraitTr.scale);
        this.portraits.set("teacher", teacher);

        // Si no se ha llegado tarde, pone el nodo de dialogo al interactuar con las mesas
        if (!this.gameManager.getValue("isLate")) {
            let nodes = this.cache.json.get('everydayDialog');
            this.tablesNode = super.readNodes(nodes, "everydayDialog", "class.table", true);
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
            this.add.image(tr.x, tr.y, this.atlasName, 'frontChar4').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row1Chairs.depth);


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
                x: 1200,
                y: this.CANVAS_HEIGHT * 0.52,
                scale: this.scale * 0.8
            };
            this.add.image(tr.x, tr.y, this.atlasName, 'frontChar12').setOrigin(0, 0).setScale(-tr.scale, tr.scale).setDepth(this.row3Chairs.depth);


            tr = {
                x: 510,
                y: this.CANVAS_HEIGHT * 0.49,
                scale: this.scale * 0.76
            };
            this.add.image(tr.x, tr.y, this.atlasName, 'frontChar9').setOrigin(0, 0).setScale(tr.scale).setDepth(this.row4Chairs.depth);


            let nodes = this.cache.json.get('everydayDialog');
            let teacherNode = super.readNodes(nodes, "everydayDialog", "class.late", true);
            setTimeout(() => {
                this.dialogManager.setNode(teacherNode);               
            }, 50);
        }


        // Evento llamado cuando terminan los dialogos y empieza la clase
        this.dispatcher.addOnce("startClass", this, (obj) => {
            let sceneName = 'TextOnlyScene';
            let nextScene = 'ClassBackBreakDay4'

            // Se obtiene el texto de la escena de transicion del archivo de traducciones 
            let text = this.i18next.t("day4.startClass", { ns: "transitionScenes", returnObjects: true });
            if (this.gameManager.getValue("passwordExchanged")) {
                text = this.i18next.t("day4.endDay", { ns: "transitionScenes", returnObjects: true });
                nextScene = 'PlaygroundAfternoonDay4'
            }

            let params = {
                text: text,
                onComplete: () => {
                    this.gameManager.changeScene(nextScene);
                },
                onCompleteDelay: 500
            };

            // Se cambia a la escena de transicion
            this.gameManager.changeScene(sceneName, params);
        });
    }
}
