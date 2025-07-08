import BaseScreen from "./baseScreen.js";
import StatusBar from "./statusBar.js";

export default class StatusScreen extends BaseScreen {
    constructor(scene, phone, prevScreen) {
        super(scene, phone, 'statusBg', prevScreen);
        this.scene = scene;

        // Configuracion de texto para la el texto de ll titulo
        let textConfig = { ...scene.gameManager.textConfig };
        textConfig.fontSize = '30px'
        textConfig.fontFamily = 'gidolinya-regular';
        textConfig.fontStyle = 'normal';
        textConfig.color = '#FFF';

        // Se coge el texto del archivo de traducciones y se pone en pantalla 
        let text = this.i18next.t("statusScreen.title", { ns: "phoneInfo" });
        let title = this.scene.add.text(this.BG_X, this.BG_Y * 0.39, text, textConfig).setOrigin(0.5, 0.5);
        text = this.i18next.t("statusScreen.subtitle", { ns: "phoneInfo" });
        let subtitle = this.scene.add.text(this.BG_X, this.BG_Y * 0.63, text, textConfig).setOrigin(0.5, 0.5);
        
        this.statusBars = new Map();
        
        this.average = new StatusBar(scene, this, this.BG_X, this.BG_Y / 2.05, 170, 30, "Average");
        this.addStatusBar("Alison", "left");
        this.addStatusBar("Alex", "mid");
        this.addStatusBar("Guille", "left");
        this.addStatusBar("Ana", "mid");
        this.addStatusBar("Maria", "left");
        this.addStatusBar("Jose", "mid");
        this.addStatusBar("parents", "left");
        this.addStatusBar("teacher", "mid");

        this.updateRelationShip();
        
        this.add(title);
        this.add(subtitle);
    }

    /**
     * Anade la barra de amistad del personaje indicado a pantalla y la guarda en el mapa
     * @param {String} character - id del personaje de la barra
     * @param {String} pos - posicion en la que colocar la barra (a la izquierda o en el medio)
     */
    addStatusBar(character, pos = "left") {
        let LEFT_X = this.BG_X + this.bg.displayWidth * 0.01;
        let MID_X =  LEFT_X + 75;
        let BAR_Y = this.BG_Y * 0.74;
        let BAR_OFFSET = 51;
        let BAR_ERROR = 3;
        let BAR_W = 140;
        let BAR_H = 15;

        let barPos = LEFT_X;
        if (pos === "mid") {
            barPos = MID_X;
        }
        let bar = new StatusBar(this.scene, this, barPos, BAR_Y + BAR_OFFSET * this.statusBars.size - BAR_ERROR * this.statusBars.size, BAR_W, BAR_H, character);
        this.statusBars.set(character, bar);
    }

    /**
     * Actualiza la barra de amistad del personaje indicado
     * @param {String} character - id del personaje cuya amistad modificar
     * @param {Number} newValue - nuevo valor de la barra de amistad 
     */
    updateRelationShip(character, newValue) {
        if (character && newValue !== undefined) {
            let bar = this.statusBars.get(character);
            bar.value = newValue
            bar.updateColor();    
        }
        
        let total = 0;
        this.statusBars.forEach((bar) => {
            total += bar.value;
        });

        this.average.value = total / this.statusBars.size;
        this.average.updateColor();
    } 
}