import ConectadoBaseScene from "../conectadoBaseScene.js";
import TextArea from "../../../framework/UI/textArea.js";
import Grid from "../../../framework/UI/grid.js";
import RectTextButton from "../../../framework/UI/rectTextButton.js";
import { tintAnimation } from "../../../framework/utils/graphics.js";

export default class Credits extends ConectadoBaseScene {
    /**
    * Creditos del juego
    * @extends ConectadoBaseScene
    */
    constructor() {
        super("Credits");
    }

    create(params) {
        super.create(params);

        this.rect = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0xffffff, 1).setOrigin(0, 0);

        this.namespace = "menus\\credits"

        // Padings laterales e inferiores de los botones y el logo del juego
        let sidePadding = 100;
        let bottomPadding = 40;

        // Flechas para indicar que los creditos van hacia adelante o hacia atras
        const REWIND_ARROW_OFFSET = 90;
        const REWIND_ARROW_Y = this.CANVAS_HEIGHT / 4;
        this.rightRewind = this.createRewindArrow(REWIND_ARROW_OFFSET, REWIND_ARROW_Y, false);
        this.leftRewind = this.createRewindArrow(this.CANVAS_WIDTH - REWIND_ARROW_OFFSET, REWIND_ARROW_Y, true);

        // Configuracion del scroll 
        this.CREDITS_INIT_Y = this.CANVAS_HEIGHT;
        this.TOP_PADDING = 50;
        this.BOTTOM_PADDING = 50;
        this.AUTO_SCROLL_SPEED = -0.2;
        this.MANUAL_SCROLL_SPEED = 1;
        this.currentScrollSpeed = this.AUTO_SCROLL_SPEED;

        // Container con todos los creditos para hacer el scroll
        this.container = this.add.container(0, 0);
        this.createCreditsContents();


        // Botones
        this.BUTTONS_TEXT_CONFIG = {
            fontFamily: "kimberley",
            fontSize: 40,
            fontStyle: "normal",
            color: "#004E46",
            align: "center",
        };
        const BUTTON_X = sidePadding;
        const BUTTON_START_Y = this.CANVAS_HEIGHT - bottomPadding;

        // Boton de salir
        let exitButton = this.createCreditsButtons(BUTTON_X, BUTTON_START_Y, this.localizationManager.translate("exitButton", this.namespace), () => {
            this.gameManager.startLanguageMenu();
        })

        // Boton de volver (solo aparece si se accede desde el menu principal)
        if (params.fromMainMenu) {
            let y = BUTTON_START_Y - exitButton.displayHeight - bottomPadding / 2;
            let returnButton = this.createCreditsButtons(BUTTON_X, y, this.localizationManager.translate("returnButton", this.namespace), () => {
                this.gameManager.startMainMenu();
            });
        }

        // Logo del juego
        let gameLogo = this.add.image(this.CANVAS_WIDTH - sidePadding, this.CANVAS_HEIGHT - bottomPadding, "logoWT");
        gameLogo.setScale(0.32);
    }


    update(t, dt) {
        // Si los creditos van hacia abajo y hay mas cosas por encima o si van hacia arriba y hay mas cosas debajo, se mueven
        if ((this.currentScrollSpeed > 0 && this.container.y < this.TOP_PADDING) ||
            (this.currentScrollSpeed < 0 && this.container.y + this.container.displayHeight > this.CANVAS_HEIGHT - this.BOTTOM_PADDING)) {

            let movement = this.currentScrollSpeed * dt;
            this.container.y += movement;

            // Si el movimiento resultante excede los limites, se coloca el container justo en los limites
            if (this.container.y > this.TOP_PADDING && this.currentScrollSpeed != this.AUTO_SCROLL_SPEED) {
                this.container.y = this.TOP_PADDING;
            }
            else if (this.container.y + this.container.displayHeight < this.BOTTOM_PADDING) {
                this.container.y = -this.container.displayHeight - this.BOTTOM_PADDING;
            }
        }

        // Si estaba el desplazamiento automatico y se llega al final, se activa el desplazamiento manual
        if (this.currentScrollSpeed == this.AUTO_SCROLL_SPEED &&
            this.container.y + this.container.displayHeight <= this.CANVAS_HEIGHT - this.BOTTOM_PADDING) {
            this.enableManualScrolling();
        }
    }

    /**
    * Crear los botones para salir de los creditos
    * @param {Number} x - posicion x de la esquina superior izquierda del boton
    * @param {Number} y - posicion y de la esquina superior izquierda del boton
    * @param {String} text - texto a mostrar en el boton
    * @param {Function} callback - funcion a llamar al pulsar el boton
    * @returns 
    */
    createCreditsButtons(x, y, text, callback) {
        const BUTTON_W = 160;
        const BUTTON_H = 40;

        let button = new RectTextButton(this, x, y, BUTTON_W, BUTTON_H, text, this.BUTTONS_TEXT_CONFIG, callback, "creditsButton", 
            0.5, 0.5, 15, 0xFFF0F0F0, 1, 1, 0x0, 1, 0.5, 0.5, 0, -20, 0, 2);
        tintAnimation(button, button.list, callback, true, false, 0xffffff, 0x408e86, 0xc8c8c8);

        return button
    }


    /**
    * Crea todo el contenido del container de los creditos
    */
    createCreditsContents() {
        this.CREDITS_TEXT_CONFIG = {
            fontFamily: "kimberley",
            fontSize: 40,
            fontStyle: "normal",
            color: "#00685D",
            align: "center",
            wordWrap: {
                width: this.CANVAS_WIDTH - this.TOP_PADDING * 2,
                useAdvancedWrap: true
            }
        };
        const TEXTS_X = this.CANVAS_WIDTH / 2;

        // Tamanos de los textos
        let sizes = {
            title: 95,              // titulos
            smallerSubtitle: 52,    // subtitulos de tam mas pequeno
            name: 47,               // nombres personas
            team: 40,               // departamentos
            key: 31,                // leyendas
            schoolKey: 28,          // texto introductorio de los colegios
            school: 34,             // colegios
            schoolPlace: 28         // lugares de los colegios
        }

        // Posibles fuentes
        let fonts = {
            kimberley: "kimberley",
            adventpro: "adventpro-regular"
        }

        // Separacion entre el texto y el texto que tendra debajo
        let upperSpacing = {
            title: 65,      // espacio despues del titulo
            teamName: 15,   // espacio entre el subtitulo del equipo y los nombres
            name: 10,       // espacio entre nombres de las personas del equipo
            team: 37,       // espacio despues del subtitulo del equipo
            subText: 10     // espacio entre nombres de las personas y su texto de acompanamiento
        }

        // Configuraciones para los diferentes textos (tamano y fuente)
        let fontParams = {
            title: {
                size: sizes.title,
                font: fonts.kimberley
            },
            smallerSubtitle: {
                size: sizes.smallerSubtitle,
                font: fonts.kimberley
            },
            name: {
                size: sizes.name,
                font: fonts.adventpro
            },
            team: {
                size: sizes.team,
                font: fonts.kimberley
            },
            key: {
                size: sizes.key,
                font: fonts.adventpro
            },
            school: {
                size: sizes.school,
                font: fonts.adventpro
            },
            schoolPlace: {
                size: sizes.schoolPlace,
                font: fonts.adventpro
            },
            schoolKey: {
                size: sizes.schoolKey,
                font: fonts.kimberley
            }

        }

        let creditsStructure = this.cache.json.get("credits");
        let creditsNames = this.cache.json.get("creditsNames");

        this.nextY = 0;

        // Titulo
        this.createTextBelow(TEXTS_X, 0, this.localizationManager.translate("titleText", this.namespace), fontParams.title);

        // Direccion, diseno, arte, animacion, version web
        this.createSequenceSection(creditsStructure, "section1", creditsNames, TEXTS_X, fontParams.team, fontParams.name, upperSpacing.title, upperSpacing.teamName,
            upperSpacing.name, upperSpacing.team);

        // Idea original
        this.createSequenceSection(creditsStructure, "section2", creditsNames, TEXTS_X, fontParams.smallerSubtitle, fontParams.name, upperSpacing.team,
            upperSpacing.teamName, upperSpacing.name, upperSpacing.team);

        // Agradecimientos1
        this.createTextBelow(TEXTS_X, upperSpacing.team, this.localizationManager.translate("acknowledgmentsText", this.namespace), fontParams.smallerSubtitle);
        this.createSequenceWithSubtitlesSection(creditsStructure, "acknowledgmentsSection", creditsNames, TEXTS_X, fontParams.name, fontParams.key, upperSpacing.teamName,
            upperSpacing.name, upperSpacing.subText, upperSpacing.team);

        // Beta testers
        this.createTextBelow(TEXTS_X, upperSpacing.team * 1.5, this.localizationManager.translate("betaTestersText", this.namespace), fontParams.smallerSubtitle);
        this.createBetaTestersSection(creditsStructure, "betaTestersSection", creditsNames, TEXTS_X, fontParams.name, upperSpacing.team * 1.5);

        // Localizacion y traducciones
        this.createSequenceSection(creditsStructure, "section3", creditsNames, TEXTS_X, fontParams.smallerSubtitle, fontParams.name, upperSpacing.team * 1.5,
            upperSpacing.teamName, upperSpacing.name, upperSpacing.team);
        this.createSequenceSection(creditsStructure, "section4", creditsNames, TEXTS_X, fontParams.team, fontParams.name, upperSpacing.team, upperSpacing.teamName,
            upperSpacing.name, upperSpacing.team);

        // Colaboradores
        this.createTextBelow(TEXTS_X, upperSpacing.team * 1.5, this.localizationManager.translate("collaboratorsText", this.namespace), fontParams.smallerSubtitle);
        this.createImageBelow(TEXTS_X, upperSpacing.teamName, "credits_atlas", "orientacion_madrid", 0.45);

        // Escuelas
        this.createTextBelow(TEXTS_X, upperSpacing.team * 1.5, this.localizationManager.translate("schoolsText", this.namespace), fontParams.smallerSubtitle);
        this.createTextBelow(TEXTS_X, upperSpacing.teamName, this.localizationManager.translate("schoolCollabText", this.namespace), fontParams.schoolKey);
        this.createSchoolsText(creditsStructure, "schools", creditsNames, fontParams.school, fontParams.schoolPlace, upperSpacing.team, upperSpacing.team, upperSpacing.subText);

        // Agradecimientos 2
        this.createSequenceSection(creditsStructure, "section5", creditsNames, TEXTS_X, fontParams.smallerSubtitle, fontParams.name, upperSpacing.team * 2,
            upperSpacing.teamName, upperSpacing.team, upperSpacing.team);

        // Patrocinadores
        this.createTextBelow(TEXTS_X, upperSpacing.team * 1.5, this.localizationManager.translate("sponsorsText", this.namespace), fontParams.smallerSubtitle);
        this.createSponsorsImages(upperSpacing.team);

        // Texto final
        this.createTextBelow(TEXTS_X, upperSpacing.title * 2, this.localizationManager.translate("endThanksText", this.namespace), fontParams.title);


        let bounds = this.container.getBounds();
        this.container.setSize(bounds.width, bounds.height);

        // Se coloca el container en la posicion inicial
        this.container.y = this.CREDITS_INIT_Y;
    }


    /**
    * Crea texto debajo de la ultima posicion guardada
    * @param {Number} x - posicion x del centro del texto
    * @param {Number} spacing - espacio entre la ultima posicion guardada y el texto a crear
    * @param {String} text - texto a escribir
    * @param {Object} textParams - objeto con el tamano y la fuente a utilizar 
    * @returns 
    */
    createTextBelow(x, spacing, text, textParams) {
        this.CREDITS_TEXT_CONFIG.fontSize = textParams.size;
        this.CREDITS_TEXT_CONFIG.fontFamily = textParams.font;

        let textObj = new TextArea(this, x, this.nextY + spacing, 0, 0, text, this.CREDITS_TEXT_CONFIG, 0.5, 0);
        this.container.add(textObj);
        this.nextY = textObj.y + textObj.displayHeight;

        return textObj;
    }

    /**
    * Crea una imagen debajo de la ultima posicion guardada
    * @param {Number} x - posicion x del centro de la imagen
    * @param {Number} spacing - espacio entre la ultima posicion guardada y la imagen a crear
    * @param {String} atlas - nombre del atlas de la imagen
    * @param {String} id - id de la imagen
    * @param {Number} scale - escala de la imagen
    */
    createImageBelow(x, spacing, atlas, id, scale) {
        let img = null;
        if (atlas == null || atlas == "") {
            img = this.add.image(x, this.nextY + spacing, id).setOrigin(0.5, 0).setScale(scale);
        }
        else {
            img = this.add.image(x, this.nextY + spacing, atlas, id).setOrigin(0.5, 0).setScale(scale);
        }
        this.container.add(img);

        // Se actualiza la siguiente y a la parte inferior del texto
        this.nextY = img.y + img.displayHeight;
    }

    /**
    * Crea una secuencia de titulos-nombres con la estructura
    * "section1": [
            {
                "titleKey": "titleKey1",
                "namesKeys": [
                    "name1-1",
                    "name1-2"
                ]
            },
            {
                "titleKey": "titleKey2",
                "namesKeys": [
                    "name2-1",
                    "name2-2"
                ]
            },
        ]
    * 
    * Donde Cada objeto del array es un conjunto de titulo-nombres. titleKey es la id del texto del titulo traducido
    * en el namespace menu/credits, y cada elemento de namesKeys es la id del nombre en el archivo names.json
    * 
    * @param {Object} structure - json con la estructura de los creditos
    * @param {String} sectionName - id de la seccion en structure
    * @param {Object} names - json con los nombres de los creditos
    * @param {Number} x - posicion x del texto
    * @param {Object} titleParams - parametros del texto para el titulo
    * @param {Object} normalParams - parametros del texto para los nombres
    * @param {Number} initialPadding - separacion inicial entre el primer titulo y el contenido anterior
    * @param {Number} titlePadding - separacion entre el titulo y el primer nombre
    * @param {Number} textPadding - separacion entre cada nombre
    * @param {Number} fragmentPadding - separacion entre el ultimo nombre y el siguiente titulo
    */
    createSequenceSection(structure, sectionName, names, x, titleParams, normalParams, initialPadding, titlePadding, textPadding, fragmentPadding) {
        let spacing = initialPadding;

        structure[sectionName].forEach((part) => {
            this.createTextBelow(x, spacing, this.localizationManager.translate(part.titleKey, this.namespace), titleParams);
            spacing = titlePadding;

            part["namesKeys"].forEach((name) => {
                this.createTextBelow(x, spacing, names[name], normalParams);
                spacing = textPadding;

            });

            spacing = fragmentPadding;
        });
    }

    /**
    * Crea una secuencia de nombres-subtitulo con la estructura
    * 
    * "subsection1": [
            {
                "namesKeys": [
                    "subName1-1",
                    "subName1-2"
                ],
                "subtitleKey": "subtitle1"
            },
            {
                "namesKeys": [
                    "subName2-1",
                    "subName2-2",
                    "subName2-3",
                ],
                "subtitleKey": "subtitle1"
            }
        ],
    * 
    * Donde cada objeto del arrays un conjunto de nombres-subtitulo. Cada elemento de namesKeys es la id del nombre
    * en el archivo names.json y subtitleKey es la id del texto del titulo traducido en el namespace menu/credits
    * 
    * @param {Object} structure - json con la estructura de los creditos
    * @param {String} sectionName - id de la seccion en structure
    * @param {Object} names - json con los nombres de los creditos
    * @param {Number} x - posicion x del texto
    * @param {Object} normalParams - parametros del texto para los nombres
    * @param {Object} subtitleParams - parametros del texto para los subtitulos
    * @param {Number} initialPadding - separacion inicial entre el primer nombre y el contenido anterior
    * @param {Number} normalPadding - separacion entre los nombres
    * @param {Number} subtitlePadding - separacion entre el ultimo nombre y el subtitulo
    * @param {Number} fragmentPadding - separacion entre el subtitulo y el primer nombre del siguiente grupo
    */
    createSequenceWithSubtitlesSection(structure, sectionName, names, x, normalParams, subtitleParams, initialPadding, normalPadding, subtitlePadding, fragmentPadding) {
        let spacing = initialPadding;

        structure[sectionName].forEach((subtitleInfo) => {
            subtitleInfo["namesKeys"].forEach((name) => {
                this.createTextBelow(x, spacing, names[name], normalParams);
                spacing = normalPadding;
            });

            spacing = subtitlePadding;
            this.createTextBelow(x, spacing, this.localizationManager.translate(subtitleInfo["subtitleKey"], this.namespace), subtitleParams);

            spacing = fragmentPadding;
        });
    }

    /**
    * Crea el texto de los beta testers con la estructura 
    * 
    * "betaTestersSection": [
            "betaTest1",
            "betaTest2",
            "betaTest3",
            "betaTest4"
        ],
    * 
    * Donde cada elemento del array es la id del nombre en el archivo names.json
    * 
    * @param {Object} structure - json con la estructura de los creditos
    * @param {String} sectionName - id de la seccion en structure
    * @param {Object} names - json con los nombres de los creditos
    * @param {Number} x - posicion x del texto
    * @param {Object} normalParams - parametros del texto
    * @param {Number} padding - separacion entre cada nombre y entre el primer nombre y el contenido anterior
    */
    createBetaTestersSection(structure, sectionName, names, x, normalParams, padding) {
        let namesText = [];

        structure[sectionName].forEach((name) => {
            namesText.push(this.createTextBelow(x, padding, names[name], normalParams));
        });

        const BADGE_OFFSET = 50;
        let startX = 0;
        namesText.forEach((textObj) => {
            startX = Math.max(startX, textObj.x + textObj.displayWidth / 2);
        });
        startX += BADGE_OFFSET;

        this.createBadge(startX, namesText[0].y, "first");
        this.createBadge(startX, namesText[1].y, "second");
        this.createBadge(startX, namesText[2].y, "third");
    }

    createBadge(x, y, frame) {
        let badge = this.add.image(x, y, "credits_atlas", frame).setOrigin(0, 0).setScale(0.8);
        badge.setTint(0x00685d);
        this.container.add(badge);
    }


    /**
    * Crea los textos para la informacion de cada escuela con la estructura
    * 
    * "schools": [
            {
                "nameKey": "school1",
                "placeKey": "place1"
            },
            {
                "nameKey": "school2",
                "placeKey": "place2"
            },
        ]
    * 
    * Donde cada elemento del array es la informacion de la escuela. nameKey es la id del nombre de la escuela
    * y placeKey la id del nombre de la localizacion de la escuela, ambos en el archivo names.json
    * 
    * @param {Object} structure - json con la estructura de los creditos
    * @param {String} sectionName - id de la seccion en structure
    * @param {Object} names - json con los nombres de los creditos
    * @param {Object} normalParams - parametros del texto para el nombre
    * @param {Object} subtitleParams - parametros del texto para la localiacion
    * @param {Number} initialPadding - separacion inicial entre el primer nombre y el contenido anterior
    * @param {Number} normalPadding - separacion entre los nombres
    * @param {Number} subtitlePadding - separacion entre cada nombre y su subtitulo
    */
    createSchoolsText(structure, sectionName, names, normalParams, subtitleParams, initialPadding, normalPadding, subtitlePadding) {
        let textContainers = [];

        // Se crean y guardan containers con cada nombre y su localizacion. Cada conjunto esta guardado dentro de otro container
        structure[sectionName].forEach((schoolInfo) => {
            let nameText = names[schoolInfo["nameKey"]];
            let placeText = "(" + names[schoolInfo["placeKey"]] + ")";

            let textContainer = this.add.container(0, 0);

            this.CREDITS_TEXT_CONFIG.fontSize = normalParams.size;
            this.CREDITS_TEXT_CONFIG.fontFamily = normalParams.font;
            let textObj = new TextArea(this, 0, 0, 0, 0, nameText, this.CREDITS_TEXT_CONFIG, 0.5, 0);

            this.CREDITS_TEXT_CONFIG.fontSize = subtitleParams.size;
            this.CREDITS_TEXT_CONFIG.fontFamily = subtitleParams.font;
            let subTextObj = new TextArea(this, 0, textObj.y + textObj.displayHeight + subtitlePadding, 0, 0, placeText, this.CREDITS_TEXT_CONFIG, 0.5, 0);

            textContainer.add(textObj);
            textContainer.add(subTextObj);

            let bounds = textContainer.getBounds();
            textContainer.setSize(bounds.width, bounds.height);

            textContainers.push(textContainer);
        });

        // Se calculan las dimensiones y posiciones del grid
        const COLS = 2;
        const ROWS = Math.ceil(textContainers.length / COLS);
        const PADDING = 180;
        const GRID_WIDTH = this.CANVAS_WIDTH - (PADDING * 2);
        const GRID_HEIGHT = ROWS * (textContainers[0].displayHeight + normalPadding);
        const GRID_X = this.CANVAS_WIDTH / 2 - GRID_WIDTH / 2;
        const GRID_Y = this.nextY - initialPadding / 2;

        // Se crea un grid y se anaden los containers con los nombres y localizaciones
        this.createGrid(textContainers, GRID_X, GRID_Y, GRID_WIDTH, GRID_HEIGHT, COLS, ROWS);
    }

    createSponsorsImages(initialPadding) {
        let images = [];

        images.push(this.add.image(0, 0, "credits_atlas", "rage_logo").setOrigin(0.5).setScale(0.5));
        images.push(this.add.image(0, 0, "credits_atlas", "telefonica_logo").setOrigin(0.5).setScale(0.3));

        images.push(this.add.image(0, 0, "credits_atlas", "beaconing_logo").setOrigin(0.5).setScale(0.5));
        images.push(this.add.image(0, 0, "credits_atlas", "impress_logo").setOrigin(0.5).setScale(0.2));

        images.push(this.add.image(0, 0, "credits_atlas", "ucm_logo").setOrigin(0.5).setScale(0.25));
        images.push(this.add.image(0, 0, "credits_atlas", "eucm_logo").setOrigin(0.5).setScale(0.4));

        // Se obtiene la altura de la imagen mas alta
        let imagesMaxHeight = 0;
        images.forEach((image) => {
            imagesMaxHeight = Math.max(imagesMaxHeight, image.displayHeight);
        });

        // Se calculan las dimensiones y posiciones del grid
        const COLS = 2;
        const ROWS = 3;
        const PADDING = 200;
        const IMAGE_PADDING = 50;
        const GRID_WIDTH = this.CANVAS_WIDTH - (PADDING * 2);
        const GRID_HEIGHT = (imagesMaxHeight + IMAGE_PADDING) * COLS;
        const GRID_X = this.CANVAS_WIDTH / 2 - GRID_WIDTH / 2;
        const GRID_Y = this.nextY + initialPadding;

        // Se crea un grid y se anaden las imagenes
        this.createGrid(images, GRID_X, GRID_Y, GRID_WIDTH, GRID_HEIGHT, COLS, ROWS);
    }

    /**
    * Se crea un grid y se anaden los objetos indicados
    * @param {Array} items - array de objetos que meter en el grid 
    * @param {Number} x - posicion x de la esquina superior izquierda
    * @param {Number} y - posicion y de la esquina superior izquierda
    * @param {Number} width - anchura
    * @param {Number} height - altura
    * @param {Number} cols - numero de columnas
    * @param {Number} rows - numero de filas
    */
    createGrid(items, x, y, width, height, cols, rows) {
        let grid = new Grid(this, x, y, width, height, cols, rows, 0);

        // Se anade cada objeto al grid
        items.forEach((item) => {
            grid.addItem(item);
        });
        this.container.add(grid);

        // Se actualiza la siguiente y a la parte inferior del grid
        this.nextY = y + height;
    }


    /**
    * Crear los botones para las flechas de rewind
    */
    createRewindArrow(x, y, facingRight) {
        let arrow = this.add.image(x, y, "credits_atlas", "rewind");
        arrow.setTint(Phaser.Display.Color.GetColor(0, 104, 93));
        arrow.setScale(0.95);
        arrow.setFlipX(facingRight);
        arrow.setVisible(false);

        return arrow;
    }

    /**
    * Activar el scroll manual de los creditos
    */
    enableManualScrolling() {
        this.rect.setInteractive();

        this.rect.on("pointerdown", (pointer) => {
            // Pulsacion en pantalla
            if (IS_TOUCH) {
                // Si se presiona a la derecha de la pantalla, van hacia adelante
                if (pointer.position.x > this.CANVAS_WIDTH / 2) {
                    this.currentScrollSpeed = -this.MANUAL_SCROLL_SPEED
                }
                // Si se presiona a la izquierda, van hacia atras
                else {
                    this.currentScrollSpeed = this.MANUAL_SCROLL_SPEED
                }
            }
            else {
                if (this.currentScrollSpeed == 0) {
                    // Si se pulsa click derecho, van hacia adelante
                    if (pointer.rightButtonDown()) {
                        this.currentScrollSpeed = -this.MANUAL_SCROLL_SPEED
                    }
                    // Si se pulsa click izquierdo, van hacia atras
                    else {
                        this.currentScrollSpeed = this.MANUAL_SCROLL_SPEED
                    }
                }
            }

            // Se muestra la flecha correspondiente a la direccion de scroll
            if (this.currentScrollSpeed < 0) {
                this.leftRewind.setVisible(true);
            }
            else {
                this.rightRewind.setVisible(true);
            }
        });

        // Si se ha dejado de pulsar, la velocidad de scroll se pone a 0 y desaparecen las flechas
        this.rect.on("pointerup", (pointer) => {
            this.currentScrollSpeed = 0;
            this.leftRewind.setVisible(false);
            this.rightRewind.setVisible(false);
        });
    }
}