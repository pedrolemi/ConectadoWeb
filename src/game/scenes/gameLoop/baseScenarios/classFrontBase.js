import ConectadoBaseScene from "../../conectadoBaseScene.js";
import { setInteractive } from "../../../../framework/utils/misc.js";

export default class ClassFrontBase extends ConectadoBaseScene {
    /**
    * Escena base para la parte delantera de la clase. Coloca los elementos que se mantienen igual todos los dias
    * @extends ConectadoBaseScene
    * @param {String} name - id de la escena
    */
    constructor(name) {
        super(name, "classFront");
    }

    create(params) {
        super.create(params);

        this.createBg("classFrontBg");
        

        // Quinta fila de sillas y mesas
        this.row5Chairs = this.add.image(0, 0, "frontRow5Chairs").setOrigin(0, 0).setScale(this.bgScale);
        this.row5Tables = this.add.image(0, 0, "frontRow5Tables").setOrigin(0, 0).setScale(this.bgScale);
        
        // Cuarta fila de sillas y mesas
        this.row4Chairs = this.add.image(0, 0, "frontRow4Chairs").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row5Chairs.depth + 1);
        this.row4Tables = this.add.image(0, 0, "frontRow4Tables").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row4Chairs.depth + 1);
        
        // Tercera fila de sillas y mesas
        this.row3Chairs = this.add.image(0, 0, "frontRow3Chairs").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row4Chairs.depth + 1);
        this.row3Tables = this.add.image(0, 0, "frontRow3Tables").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row3Chairs.depth + 1);

        // Segunda fila de sillas y mesas
        this.row2Chairs = this.add.image(0, 0, "frontRow2Chairs").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row3Chairs.depth + 1);
        this.row2Tables = this.add.image(0, 0, "frontRow2Tables").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row2Chairs.depth + 1);

        // Primera fila de sillas y mesas
        this.row1Chairs = this.add.image(0, 0, "frontRow1Chairs").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row2Chairs.depth + 1);
        this.row1Tables = this.add.image(0, 0, "frontRow1Tables").setOrigin(0, 0).setScale(this.bgScale).setDepth(this.row1Chairs.depth + 1);


        // Forma geometrica para poder interactuar con los sitios libres
        let graphics = this.add.graphics(0, 0);
        let polygon = new Phaser.Geom.Polygon([
            1240, 525,
            910, 525,
            1095, 670,
            1495, 670,
            1550, 680,
            1550, 600,
            1365, 615,
            1260, 580,
            1465, 565,
        ]);
        // graphics.lineStyle(5, 0xFF00FF, 1.0).fillStyle(0xFFF, 1.0).fillPoints(polygon.points, true);
        graphics.generateTexture("tables", this.rightBound, this.CANVAS_HEIGHT);
        graphics.destroy();

        this.tables = this.add.image(0, 0, "tables").setOrigin(0, 0).setDepth(200);
        setInteractive(this.tables, {
            hitArea: polygon,
            hitAreaCallback: Phaser.Geom.Polygon.Contains
        });

        this.tablesNode = null;
        this.setInteractive("tables", this.tables, () => {
            this.localizationManager.setNode(this.tablesNode);
        })
    }
}