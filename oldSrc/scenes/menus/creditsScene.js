import Button from '../../UI/button.js';
import GameManager from '../../managers/gameManager.js';

export default class CreditsScene extends Phaser.Scene {
    /**
     * Escena con los creditos del juego
     * Se puede acceder a ella desde el menu con el titulo y desde el final del juego
     */
    constructor() {
        super({ key: 'CreditsScene' });
    }

    create(params) {
        this.CANVAS_WIDTH = this.sys.game.canvas.width;
        this.CANVAS_HEIGHT = this.sys.game.canvas.height;

        this.gameManager = GameManager.getInstance();
        this.i18next = this.gameManager.i18next;
        this.ns = 'menus\\creditsScene';

        // Fondo blanco
        let bgColor = 0xFFFFFF;
        let bg = this.add.rectangle(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, bgColor);
        bg.setOrigin(0.5);
        bg.setStrokeStyle(1, bgColor);

        // Padings laterales e inferiores de los botones y el logo del juego
        let sidePadding = 100;
        let bottomPadding = 40;

        if (params.endgame) {
            // Boton de salir (se regresa a la pantalla de seleccion del idioma)
            let exitButtonTranslation = this.i18next.t("exitButton", { ns: this.ns });
            let exitButton = new Button(this, sidePadding, this.CANVAS_HEIGHT - bottomPadding, 0.47,
                () => {
                    this.gameManager.CompletedGame(true);
                    this.gameManager.startLangMenu();
                },
                this.gameManager.textBox.fillName, { R: 240, G: 240, B: 240 }, { R: 64, G: 142, B: 134 }, { R: 200, G: 200, B: 200 },
                exitButtonTranslation, { font: 'kimberley', size: 75, style: 'normal', color: '#004E46' }, this.gameManager.textBox.edgeName,
                {
                    area: new Phaser.Geom.Rectangle(this.gameManager.textBox.offset, this.gameManager.textBox.offset, this.gameManager.textBox.width, this.gameManager.textBox.height),
                    callback: Phaser.Geom.Rectangle.Contains
                }
            );
        } else {
            // Boton de volver (solo aparece si se accede desde el menu principal)
            let returnButtonTranslation = this.i18next.t("returnButton", { ns: this.ns });
            new Button(this, sidePadding, this.CANVAS_HEIGHT - bottomPadding, 0.47,
                () => {
                    this.gameManager.startTitleMenu();
                },
                this.gameManager.textBox.fillName, { R: 240, G: 240, B: 240 }, { R: 64, G: 142, B: 134 }, { R: 200, G: 200, B: 200 },
                returnButtonTranslation, { font: 'kimberley', size: 75, style: 'normal', color: '#004E46' }, this.gameManager.textBox.edgeName,
                {
                    area: new Phaser.Geom.Rectangle(this.gameManager.textBox.offset, this.gameManager.textBox.offset, this.gameManager.textBox.width, this.gameManager.textBox.height),
                    callback: Phaser.Geom.Rectangle.Contains
                }
            );
        }

        // Logo del juego
        let gameLogo = this.add.image(this.CANVAS_WIDTH - sidePadding, this.CANVAS_HEIGHT - bottomPadding, 'logoWT');
        gameLogo.setScale(0.32);

        // Flechas para indicar que se esta moviendo hacia adelante o hacia detras los creditos
        let rewindSideOffset = 90;
        let rewindY = this.CANVAS_HEIGHT / 4;
        this.rightRewind = this.createRewind(rewindSideOffset, rewindY, false);
        this.leftRewind = this.createRewind(this.CANVAS_WIDTH - rewindSideOffset, rewindY, true);

        // Enum para indicar que boton del raton se esta pulsando
        // Nota: se usa para desplazar los creditos hacia abajo o hacia arriba
        this.MouseButton = {
            RIGHT: 'RIGHT',
            LEFT: 'LEFT',
            NONE: 'NONE'
        }
        this.buttonPressed = this.MouseButton.NONE;

        this.creditsCont = null;
        // Padding de los creditos tanto al principio como al final
        this.creditsContPadding = 80;
        // Ultimo item que hay en los creditos
        // Nota: se usa para colocar mas items debajo facilmente y para poder calcular la altura total del contenedor de los creditos
        this.lastItem = null;

        // Si los creditos se estas desplazando automaticamente o manualmente
        // Nota: al principio los creditos se desplazan hacia arriba desde fuera de la pantalla y una vez que han llegado al final,
        // ya se pueden desplazar manualmente
        this.automaticMov = true;
        // Diferentes velocidades en funcion del tipo de desplazamiento
        this.movSpeed = {
            automatic: 0.2,
            manual: 1
        };

        // Se crean los creditos
        this.createCreditsContainer();
    }

    /**
     * Se crean los diferentes textos e imagenes que hay en el contendor
     */
    createCreditsContainer() {
        // Diferentes tamanos de los textos
        let sizes = {
            title: 95,              // titulos
            subtitle: 59,           // subtitulos
            smallerSubtitle: 52,    // subtitulos de tam mas pequeno
            name: 47,               // nombres personas
            team: 45,               // departamentos
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

        let paddings = {
            title: 65,      // separacion titulo-resto
            name: 10,       // separacion entre nombres personas
            team: 37,       // separacion departamento-nombre y entre imagenes
            key: 10         // separacion nombres personas-texto que acompana
        }
        // Se guarda como una propiedad porque se utiliza en varias ocasiones
        paddings.doubleTeam = paddings.team * 2;

        // Diferentes configuraciones (combinacion de tamano y fuente)
        let fontParams = {
            title: {
                size: sizes.title,
                font: fonts.kimberley
            },
            subtitle: {
                size: sizes.subtitle,
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

        // Empieza desde el final de la pantalla
        let creditsContY = this.creditsContPadding + this.CANVAS_HEIGHT;
        this.creditsCont = this.add.container(this.CANVAS_WIDTH / 2, creditsContY);

        this.style = { ...this.gameManager.textConfig };
        this.style.color = '#00685D';

        //----------------------------------------------------//
        // Titulo principal
        this.createTranslatedTextBelow(0, "titleText", fontParams.title);
        // Direccion de proyecto
        this.createTranslatedTextBelow(paddings.title, "projectManagerText", fontParams.team);
        this.createTextBelow(paddings.team, "Baltasar Fernández Majón", fontParams.name);
        // Diseño y desarrollo
        this.createTranslatedTextBelow(paddings.team, "design-devText", fontParams.team);
        this.createTextBelow(paddings.team, "Antonio Calvo Morata", fontParams.name);
        // Direccion y arte
        this.createTranslatedTextBelow(paddings.team, "artManagerText", fontParams.team);
        this.createTextBelow(paddings.team, "Ana Vallecillos Ruiz", fontParams.name);
        // Arte y animacion
        this.createTranslatedTextBelow(paddings.team, "art-animationText", fontParams.team);
        this.createTextBelow(paddings.team, "Lola González Gutiérrez", fontParams.name);
        this.createTextBelow(paddings.name, "Ana Vallecillos Ruiz", fontParams.name);
        // Versión web
        this.createTranslatedTextBelow(paddings.team, "webVersionText", fontParams.team);
        this.createTextBelow(paddings.team, "Matt Castellanos Silva", fontParams.name);
        this.createTextBelow(paddings.name, "Pedro León Miranda", fontParams.name);
        // Idea original
        this.createTranslatedTextBelow(paddings.team, "originalConceptText", fontParams.subtitle);
        this.createTextBelow(paddings.team, "Antonio Calvo Morata", fontParams.name);
        this.createTextBelow(paddings.name, "Dan Cristian Rotaru", fontParams.name);
        this.createTextBelow(paddings.name, "Iván José Pérez Colado", fontParams.name);
        this.createTextBelow(paddings.name, "Lola Fernández Gutiérrez", fontParams.name);
        // Agradecimientos
        this.createTranslatedTextBelow(paddings.team, "acknowledgmentsText", fontParams.team);
        this.createTextBelow(paddings.team, "Víctor Manuel Pérez Colado", fontParams.name);
        this.createTranslatedTextBelow(paddings.key, "libraryText", fontParams.key);
        this.createTextBelow(paddings.doubleTeam, "Dan Cristian Rotaru", fontParams.name);
        this.createTextBelow(paddings.name, "Ivan José Pérez Colado", fontParams.name);
        this.createTextBelow(paddings.name, "Lola Fernández Gutiérrez", fontParams.name);
        this.createTranslatedTextBelow(paddings.key, "hackatonText", fontParams.key);
        // Beta testers
        let medalOffsetX = 300;
        this.createTranslatedTextBelow(paddings.team, "betaTestersText", fontParams.subtitle);
        this.createTextBelow(paddings.doubleTeam, "Ana Ruiz Lanau", fontParams.name);
        this.createMedalOnTheRight(this.lastItem, medalOffsetX, 'first');
        this.createTextBelow(paddings.doubleTeam, "Cristina Alonso Fernández", fontParams.name);
        this.createMedalOnTheRight(this.lastItem, medalOffsetX, 'second');
        this.createTextBelow(paddings.doubleTeam, "Dan Cristian Rotaru", fontParams.name);
        this.createMedalOnTheRight(this.lastItem, medalOffsetX, 'third');
        this.createTextBelow(paddings.doubleTeam, "Ana Rus Cano Moreno", fontParams.name);
        // Equipo de localizacion
        this.createTranslatedTextBelow(paddings.team, "localizationText", fontParams.team);
        this.createTextBelow(paddings.team, "Pablo Gómez Calvo", fontParams.name);
        this.createTextBelow(paddings.name, "Sergio Juan Higuera Velasco", fontParams.name);
        this.createTextBelow(paddings.name, "Javier Landaburu Sánchez", fontParams.name);
        this.createTextBelow(paddings.name, "Jose María Monreal González", fontParams.name);
        // Textos en frances
        this.createTranslatedTextBelow(paddings.team, "frenchText", fontParams.team);
        this.createTextBelow(paddings.team, "Julio Santilario Berthilier", fontParams.name);
        // Colaboradores
        this.createTranslatedTextBelow(paddings.team, "collaboratorsText", fontParams.subtitle);
        this.createImgBelow(paddings.team, 0.45, 'orientacion_Madrid', 'someBrands');
        // Centros educativos
        this.createTranslatedTextBelow(paddings.team, "schoolsText", fontParams.smallerSubtitle);
        this.createTranslatedTextBelow(paddings.team, "schoolCollabText", fontParams.schoolKey);
        let schoolsInfo = [
            { school: "Centro La Inmaculada", place: "Madrid, Escolapias Puerta de Hierro" },
            { school: "Colegio San Jorge", place: "La Alcanya, Murcía" },
            { school: "IES Salvador Victoria", place: "Teruel" },
            { school: "IES Manuel de Falla", place: "Puerto Real, Cádiz" },
            { school: "IES Valdespartera", place: "Zaragoza" },
            { school: "IES Federico Balart", place: "Pliego, Murcía" },
            { school: "IES Europa", place: "Móstoles, Madrid" },
            { school: "IES Giner de los Ríos", place: "Alcobendas, Madrid" },
            { school: "IES Marqués de Santillana", place: "Colmenar Viejo, Madrid" },
            { school: "IES Antonio Machado", place: "Soria" }
        ]
        let colsPadding = 350;
        this.createSchoolsTexts(schoolsInfo, colsPadding, 2, fontParams, paddings);
        // Mas agradecimientos
        this.createTranslatedTextBelow(paddings.team, "specialThanksText", fontParams.subtitle);
        this.createTextBelow(paddings.team, "Concha García Diego", fontParams.name);
        this.createTextBelow(paddings.key, "(Escuni)", fontParams.name);
        this.createTextBelow(paddings.team, "Santiago Ortigosa López", fontParams.name);
        this.createTextBelow(paddings.key, "(Facultad de Educación, UCM)", fontParams.name);
        // Patrocinadores
        this.createTranslatedTextBelow(paddings.doubleTeam, "sponsorsText", fontParams.subtitle);
        let brandsInfo = [
            ['logo_rage',
                { atlas: 'someBrands', frame: 'logo_telefonica' }
            ],
            [
                'beaconing',
                { atlas: 'someBrands', frame: 'logo_impress' }
            ],
        ]
        colsPadding = 358;
        let brandsHeight = 90;
        brandsInfo.forEach((info) => {
            this.createColsImgsBelow(paddings.team, info, brandsHeight, colsPadding);
        })
        // Nota: las dos ultimas se crean de forma independiente para poder centrarlas y hacer el primer logo mas grande que el resto
        let logo_ucm = this.createImgBelow(paddings.team, 0.08, 'logo_ucm');
        logo_ucm.x -= colsPadding / 2;
        this.createImgOnTheRight(this.lastItem, colsPadding, 0.55, 'logo_e-ucm', 'someBrands');

        // Despedida
        this.createTranslatedTextBelow(paddings.title * 2, "endThanksText", fontParams.title);

        // Altura del contenedor de creditos (para poder moverlo correctamente)
        this.creditsCont.h = this.lastItem.y + this.lastItem.displayHeight;
    }

    /**
     * Mover los creditos hacia arriba respetando el padding
     * @param {Number} speed - velocidad la que se mueven 
     * @param {Number} dt - delta time (en segundos)
     * @returns {Boolean} - true en caso de que haya llegado al final, false en caso contrario
     */
    moveCreditsUp(speed, dt) {
        // Se calcula el punto maximo hasta el que pueden bajar
        let bottomBoundary = this.CANVAS_HEIGHT - this.creditsContPadding;
        // Se calcula la posicion final del texto (teniendo en cuenta altura)
        this.creditsEnd = this.creditsCont.y + this.creditsCont.h;
        // Si aun no ha llegado al final...
        if (this.creditsEnd > bottomBoundary) {
            // Se mueve
            this.creditsCont.y = this.creditsCont.y - speed * dt;
            return false;
        }
        // Si ha llegado...
        else {
            // Se coloca en la posicion esperada (por si habia algun pequeno error)
            this.creditsCont.y = bottomBoundary - this.creditsCont.h;
            return true;
        }
    }

    /**
     * Mover los creditos hacia abajo respetando el padding
     * @param {Number} speed - velocidad la que se mueven 
     * @param {Number} dt - delta time (en segundos)
     * @returns {Boolean} - true en caso de que haya llegado al final, false en caso contrario
     */
    moveCreditsDown(speed, dt) {
        // Se calcula el punto maximo hasta el que puede subir
        let topBoundary = this.creditsContPadding;
        // si aun no ha llegado al final...
        if (this.creditsCont.y < topBoundary) {
            // Se mueve
            this.creditsCont.y = this.creditsCont.y + speed * dt;
            return false;
        }
        // Si ha llegado...
        else {
            // Se coloca en la posicion esperada (por si habia algun pequeño error)
            this.creditsCont.y = topBoundary;
            return true;
        }
    }

    update(t, dt) {
        // Si se esta moviendo automaticamente...
        if (this.automaticMov) {
            // Los creditos van hacia arriba
            let end = this.moveCreditsUp(this.movSpeed.automatic, dt);
            if (end) {
                // Cuando han llegado al final, se activa el modo manual
                this.enableManualMov();
            }
        }
        else {
            // Movimiento manual
            // Clic secundario (hacia arriba)
            if (this.buttonPressed === this.MouseButton.RIGHT) {
                this.moveCreditsUp(this.movSpeed.manual, dt);
            }
            // Clic principal (hacia abajo)
            else if (this.buttonPressed === this.MouseButton.LEFT) {
                this.moveCreditsDown(this.movSpeed.manual, dt);
            }
        }
    }

    /**
     * Activar el movimiento manual
     */
    enableManualMov() {
        this.automaticMov = false;

        // Se usan los botones del raton para desplazar el texto
        this.input.on('pointerdown', (pointer) => {
            if (this.buttonPressed === this.MouseButton.NONE) {
                // Boton principal
                if (pointer.rightButtonDown()) {
                    this.buttonPressed = this.MouseButton.RIGHT;
                    this.leftRewind.setVisible(true);
                }
                // Boton secundario
                else {
                    this.buttonPressed = this.MouseButton.LEFT;
                    this.rightRewind.setVisible(true);
                }
            }
        });

        this.input.on('pointerup', (pointer) => {
            // Si se ha dejado de pulsar, desaparecen las flechas
            // Nota: se hace que desaparezcan ambas por sencillez
            this.buttonPressed = this.MouseButton.NONE;
            this.leftRewind.setVisible(false);
            this.rightRewind.setVisible(false);
        });
    }

    /**
     * Crear texto de los colegios (nombre y ubicacion dividos en varias columnas)
     * @param {Array} schoolsInfo - array en la que cada componente es un objeto que indica el colegio y su ubicacion
     * @param {Number} colsPadding - distancia entre ambas columnas 
     * @param {Number} nCols - numero de columnas
     * @param {Object} fontParams - objeto con todas las posibles configuraciones de fuente 
     * @param {Object} paddings - objeto con todas las posibles configuraciones de paddings
     */
    createSchoolsTexts(schoolsInfo, colsPadding, nCols, fontParams, paddings) {
        // Colegios
        let schools = [];
        // Ubicaciones de los colegios
        let places = [];

        // El numero de columnas determian como esta colocado la informacion de los colegios
        // Por ejemplo, si se indican 2 columnas y 8 colegios, va a haber 4 filas
        let cont = 0;
        schoolsInfo.forEach((info) => {
            schools.push(info.school);
            places.push("(" + info.place + ")");
            ++cont;
            // Cada vez que se cogen tantos elementos como columnas...
            if (cont >= nCols) {
                // Se crea fila 
                this.createColsTextsBelow(paddings.team, schools, fontParams.school, colsPadding);
                this.createColsTextsBelow(paddings.key, places, fontParams.schoolPlace, colsPadding);
                cont = 0;
                schools = [];
                places = [];
            }
        });

        // Si no habia suficientes elementos para hacer una fila con el numero de columnas indicado,
        // se crea una fila con un numero de columnas menor
        if (schools.length > 0) {
            this.createColsTextsBelow(paddings.team, schools, fontParams.school, colsPadding);
        }
        if (places.length > 0) {
            this.createColsTextsBelow(paddings.key, places, fontParams.schoolPlace, colsPadding);
        }
    }

    /**
     * Crear una imagen a la derecha de un objeto
     * Nota: no hace falta setear lastItem
     * @param {Object} item - objeto que se utiliza de referencia
     * @param {Number} offsetX - offset 
     * @param {Number} scale - escala de la imagen
     * @param {String} sprite - frame que se utiliza para la imagne
     * @param {String} atlas - atlas que en el que se encuentra el frame (opcional)
     *                          En caso de no especificar el atlas, es que el sprite esta solo
     * @returns {Image} - imagen creada
     */
    createImgOnTheRight(item, offsetX, scale, sprite, atlas) {
        // Posiciones
        let x = item.x + offsetX;
        let y = item.y + item.displayHeight / 2;
        let img = null;
        if (atlas) {
            img = this.add.image(x, y, atlas, sprite);
        }
        else {
            img = this.add.image(x, y, sprite);
        }
        img.setScale(scale);

        this.creditsCont.add(img);

        return img;
    }

    /**
     * Crear una medalla a la derecha de un objeto
     */
    createMedalOnTheRight(item, offsetX, frame) {
        let medal = this.createImgOnTheRight(item, offsetX, 0.9, frame, 'medals');
        medal.setTint(Phaser.Display.Color.GetColor(0, 104, 93));
        return medal;
    }

    /**
     * Crear una UNICA fila de objetos distribuidos segun un numero determinado de columnas
     * (cada objeto en una columna) debajo del ultimo objeto de los creditos
     * @param {Number} offsetY - distancia que se deja respecto al ultimo item de los creditos 
     * @param {Array} objects - numero de objetos (determina tb el numero de columnas)
     * @param {Number} colsPadding - separacion entre las columnas
     */
    placeColsObjsBelow(offsetY, objects, colsPadding) {
        // Se calcula el numero de columnas
        let nColumns = objects.length;
        // Nota: Math.floor -> se redondea un numero al menor
        let halfColumns = Math.floor(nColumns / 2);

        // Se calcula en que posicion se va a encontrar el objeto que se encuentra mas a la izquierda
        let x = 0;
        // Si es par, hay un elemento en el medio
        if (nColumns % 2 == 0) {
            x = -(colsPadding / 2 + colsPadding * (halfColumns - 1));
        }
        // Si no es par, no hay un elemento en el medio
        else {
            x = -colsPadding * halfColumns;
        }

        // Poscion y
        let y = offsetY;
        if (this.lastItem) {
            y = y + this.lastItem.y + this.lastItem.displayHeight;
        }

        // Se coloca cada objeto
        objects.forEach((object) => {
            object.x = x;
            object.y = y;
            // se pasa a la siguiente columna
            x = x + colsPadding;
            object.setOrigin(0.5, 0);
            this.creditsCont.add(object);
        });

        this.lastItem = objects[objects.length - 1];
    }

    /**
     * Crear imagenes divididas en columnas
     */
    createColsImgsBelow(offsetY, imgs, height, colsPadding) {
        let imgsObjs = [];
        // Se crea el array de imagenes
        imgs.forEach((img) => {
            let imgObj = null;
            if (img.hasOwnProperty('atlas')) {
                imgObj = this.add.image(0, 0, img.atlas, img.frame);
            }
            else {
                imgObj = this.add.image(0, 0, img);
            }
            let scale = height / imgObj.displayHeight;
            imgObj.setScale(scale);
            imgsObjs.push(imgObj);
        })
        // Se colocan en columnas
        this.placeColsObjsBelow(offsetY, imgsObjs, colsPadding);
        return imgsObjs;
    }

    /**
     * Crear textos dividos en columnas
     */
    createColsTextsBelow(offsetY, texts, fontParams, colsPadding) {
        let style = { ...this.style };
        style.fontSize = fontParams.size + 'px';
        style.fontFamily = fontParams.font;

        // Se crea el array de textos
        let textsObjs = [];
        texts.forEach((text) => {
            let textObj = this.add.text(0, 0, text, style);
            textsObjs.push(textObj);
        });
        // Se colocan en columnas
        this.placeColsObjsBelow(offsetY, textsObjs, colsPadding);
        return textsObjs;
    }

    /**
     * Colocar un objeto debajo del utlimo objeto de los creditos
     * @param {Number} offsetY - distancia que se deja respecto al ultimo item de los creditos 
     * @param {Object} object - objeto que se coloca
     */
    placeObjectBelow(offsetY, object) {
        let y = offsetY;
        // Se calcula su posicion en funcion de la posicion y tamano del ultimo objeto de los creditos
        if (this.lastItem) {
            y = y + this.lastItem.y + this.lastItem.displayHeight;
        }
        object.y = y;
        object.setOrigin(0.5, 0);
        this.creditsCont.add(object);
        this.lastItem = object;
    }

    /**
     * Crear texto localizado
     */
    createTranslatedTextBelow(offsetY, id, fontParams) {
        let text = this.i18next.t(id, { ns: this.ns });
        return this.createTextBelow(offsetY, text, fontParams);
    }

    /**
     * Crear texto debajo del ultimo objeto de los creditos
     */
    createTextBelow(offsetY, text, fontParams) {
        let style = { ...this.style };
        style.fontSize = fontParams.size + 'px';
        style.fontFamily = fontParams.font;

        let textObj = this.add.text(0, 0, text, style);
        this.placeObjectBelow(offsetY, textObj);
        return textObj;
    }

    /**
     * Crear una imagen debajo del ultimo objeto de los creditos
     */
    createImgBelow(offsetY, scale, sprite, atlas) {
        let img = null;
        if (atlas) {
            img = this.add.image(0, 0, atlas, sprite);
        }
        else {
            img = this.add.image(0, 0, sprite);
        }
        img.setScale(scale);
        this.placeObjectBelow(offsetY, img);
        return img;
    }

    /**
     * Crear una flecha que sirve para indicar que se estan desplazando los creditos
     * durante el movimiento manual
     */
    createRewind(x, y, right) {
        let rewind = this.add.image(x, y, 'rewind');
        rewind.setTint(Phaser.Display.Color.GetColor(0, 104, 93));
        rewind.setScale(0.95);
        rewind.setVisible(false);
        rewind.flipX = right;

        return rewind;
    }
}