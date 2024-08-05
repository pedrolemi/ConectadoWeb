import Button from '../../UI/button.js';
import GameManager from '../../managers/gameManager.js';

export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
    }

    create(params) {
        this.CANVAS_WIDTH = this.sys.game.canvas.width;
        this.CANVAS_HEIGHT = this.sys.game.canvas.height;

        this.gameManager = GameManager.getInstance();

        let bgColor = 0xFFFFFF;
        let bg = this.add.rectangle(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, bgColor);
        bg.setOrigin(0.5);
        bg.setStrokeStyle(1, bgColor);

        let sidePadding = 100;
        let bottomPadding = 40;

        let exitButton = new Button(this, sidePadding, this.CANVAS_HEIGHT - bottomPadding, 0.47,
            () => {
                this.gameManager.startLangMenu();
            },
            this.gameManager.textBox.fillName, { R: 240, G: 240, B: 240 }, { R: 64, G: 142, B: 134 }, { R: 200, G: 200, B: 200 },
            "Salir", { font: 'kimberley', size: 75, style: 'normal', color: '#004E46' }, this.gameManager.textBox.edgeName,
            {
                area: new Phaser.Geom.Rectangle(this.gameManager.textBox.offset, this.gameManager.textBox.offset, this.gameManager.textBox.width, this.gameManager.textBox.height),
                callback: Phaser.Geom.Rectangle.Contains
            }
        );

        if (!params.endgame) {
            new Button(this, exitButton.x, exitButton.y - bottomPadding * 1.3, 0.47,
                () => {
                    this.gameManager.startTitleMenu();
                },
                this.gameManager.textBox.fillName, { R: 240, G: 240, B: 240 }, { R: 64, G: 142, B: 134 }, { R: 200, G: 200, B: 200 },
                "Volver", { font: 'kimberley', size: 75, style: 'normal', color: '#004E46' }, this.gameManager.textBox.edgeName,
                {
                    area: new Phaser.Geom.Rectangle(this.gameManager.textBox.offset, this.gameManager.textBox.offset, this.gameManager.textBox.width, this.gameManager.textBox.height),
                    callback: Phaser.Geom.Rectangle.Contains
                }
            );
        }

        let gameLogo = this.add.image(this.CANVAS_WIDTH - sidePadding, this.CANVAS_HEIGHT - bottomPadding, 'logoWT');
        gameLogo.setScale(0.32);

        this.rightRewind = this.createRewind(this.CANVAS_WIDTH / 7, this.CANVAS_HEIGHT / 4, false);
        this.leftRewind = this.createRewind(6 * this.CANVAS_WIDTH / 7, this.CANVAS_HEIGHT / 4, true);

        this.MouseButton = {
            RIGHT: 'RIGHT',
            LEFT: 'LEFT',
            NONE: 'NONE'
        }
        this.buttonPressed = this.MouseButton.NONE;

        this.creditsCont = null;
        this.creditsContPadding = 80;
        this.lastItem = null;

        this.automaticMov = true;
        this.movSpeed = {
            automatic: 0.2,
            manual: 1
        };

        this.createCreditsContainer();

        //this.enableManualMov();
    }

    createCreditsContainer() {
        let sizes = {
            title: 95,          // titulos
            subtitle: 59,       // subtitulos
            name: 47,           // nombres personas
            team: 45,           // departamentos
            key: 31,            // leyendas
            schoolKey: 28,
            school: 34,         // colegios
            schoolPlace: 28     // lugares de los colegios
        }

        let fonts = {
            kimberley: "kimberley",
            adventpro: "adventpro-regular"
        }

        let paddings = {
            title: 65,
            name: 10,       // separacion entre nombres personas
            team: 37,       // separacion departamento-nombre
            key: 10         // separacion nombre-leyenda
        }
        paddings.doubleTeam = paddings.team * 2;

        let fontParams = {
            title: {
                size: sizes.title,
                font: fonts.kimberley
            },
            subtitle: {
                size: sizes.subtitle,
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
        this.createTextBelow(0, "Créditos", fontParams.title);
        // Direccion de proyecto
        this.createTextBelow(paddings.title, "Dirección de proyecto", fontParams.team);
        this.createTextBelow(paddings.team, "Baltasar Fernández Majón", fontParams.name);
        // Diseño y desarrollo
        this.createTextBelow(paddings.team, "Diseño y desarrollo", fontParams.team);
        this.createTextBelow(paddings.team, "Antonio Calvo Morata", fontParams.name);
        // Direccion y arte
        this.createTextBelow(paddings.team, "Dirección y arte", fontParams.team);
        this.createTextBelow(paddings.team, "Ana Vallecillos Ruiz", fontParams.name);
        // Arte y animacion
        this.createTextBelow(paddings.team, "Arte y animación", fontParams.team);
        this.createTextBelow(paddings.team, "Lola González Gutiérrez", fontParams.name);
        this.createTextBelow(paddings.name, "Ana Vallecillos Ruiz", fontParams.name);
        // Aplicacion web
        this.createTextBelow(paddings.team, "Aplicación web", fontParams.team);
        this.createTextBelow(paddings.team, "Matt Castellanos Silva", fontParams.name);
        this.createTextBelow(paddings.name, "Pedro León Miranda", fontParams.name);
        // Idea original
        this.createTextBelow(paddings.team, "Idea original", fontParams.subtitle);
        this.createTextBelow(paddings.team, "Antonio Calvo Morata", fontParams.name);
        this.createTextBelow(paddings.name, "Dan Cristian Rotaru", fontParams.name);
        this.createTextBelow(paddings.name, "Iván José Pérez Colado", fontParams.name);
        this.createTextBelow(paddings.name, "Lola Fernández Gutiérrez", fontParams.name);
        // Agradecimientos
        this.createTextBelow(paddings.team, "Agradecimientos", fontParams.team);
        this.createTextBelow(paddings.team, "Víctor Manuel Pérez Colado", fontParams.name);
        this.createTextBelow(paddings.key, "por su magnífica librería de diálogos", fontParams.key);
        this.createTextBelow(paddings.doubleTeam, "Dan Cristian Rotaru", fontParams.name);
        this.createTextBelow(paddings.name, "Ivan José Pérez Colado", fontParams.name);
        this.createTextBelow(paddings.name, "Lola Fernández Gutiérrez", fontParams.name);
        this.createTextBelow(paddings.key, "por aquel hacktan que originó todo", fontParams.key);
        // Beta testers
        let medalOffsetX = 300;
        this.createTextBelow(paddings.team, "Beta Testers", fontParams.subtitle);
        this.createTextBelow(paddings.doubleTeam, "Ana Ruiz Lanau", fontParams.name);
        this.createMedalOnTheRight(this.lastItem, medalOffsetX, 'first');
        this.createTextBelow(paddings.doubleTeam, "Cristina Alonso Fernández", fontParams.name);
        this.createMedalOnTheRight(this.lastItem, medalOffsetX, 'second');
        this.createTextBelow(paddings.doubleTeam, "Dan Cristian Rotaru", fontParams.name);
        this.createMedalOnTheRight(this.lastItem, medalOffsetX, 'third');
        this.createTextBelow(paddings.doubleTeam, "Ana Rus Cano Moreno", fontParams.name);
        // Equipo de localizacion
        this.createTextBelow(paddings.team, "Equipo de localizacion", fontParams.team);
        this.createTextBelow(paddings.team, "Pablo Gómez Calvo", fontParams.name);
        this.createTextBelow(paddings.name, "Sergio Juan Higuera Velasco", fontParams.name);
        this.createTextBelow(paddings.name, "Javier Landaburu Sánchez", fontParams.name);
        this.createTextBelow(paddings.name, "Jose María Monreal González", fontParams.name);
        // Textos en frances
        this.createTextBelow(paddings.team, "Textos en francés", fontParams.team);
        this.createTextBelow(paddings.team, "Julio Santilario Berthilier", fontParams.name);
        // Colaboradores
        this.createTextBelow(paddings.team, "Colaboradores", fontParams.subtitle);
        this.createImgBelow(paddings.team, 0.45, 'orientacion_Madrid', 'someBrands');
        // Centros educativos
        this.createTextBelow(paddings.team, "Centros educativos", fontParams.subtitle);
        this.createTextBelow(paddings.team, "Han colaborado en la validación del juego:", fontParams.schoolKey);
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
        this.createTextBelow(paddings.team, "Gracias también a:", fontParams.subtitle);
        this.createTextBelow(paddings.team, "Concha García Diego", fontParams.name);
        this.createTextBelow(paddings.key, "(Escuni)", fontParams.name);
        this.createTextBelow(paddings.team, "Santiago Ortigosa López", fontParams.name);
        this.createTextBelow(paddings.key, "(Facultad de Educación, UCM)", fontParams.name);
        // Patrocinadores
        this.createTextBelow(paddings.doubleTeam, "Patrocinadores", fontParams.subtitle);
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
        this.createTextBelow(paddings.title * 2, "¡GRACIAS!", fontParams.title);

        // Altura del contenedor de creditos
        this.creditsCont.h = this.lastItem.y + this.lastItem.displayHeight;
    }

    moveCreditsDown(speed, dt) {
        let bottomBoundary = this.CANVAS_HEIGHT - this.creditsContPadding;
        this.creditsEnd = this.creditsCont.y + this.creditsCont.h;
        if (this.creditsEnd > bottomBoundary) {
            this.creditsCont.y = this.creditsCont.y - speed * dt;
            return false;
        }
        else {
            this.creditsCont.y = bottomBoundary - this.creditsCont.h;
            return true;
        }
    }

    moveCreditsUp(speed, dt) {
        let topBoundary = this.creditsContPadding;
        if (this.creditsCont.y < topBoundary) {
            this.creditsCont.y = this.creditsCont.y + speed * dt;
        }
        else {
            this.creditsCont.y = topBoundary;
        }
    }

    update(t, dt) {
        if (this.automaticMov) {
            let end = this.moveCreditsDown(this.movSpeed.automatic, dt);
            if (end) {
                this.enableManualMov();
            }
        }
        else {
            // clic secundario (hacia abajo)
            if (this.buttonPressed === this.MouseButton.RIGHT) {
                this.moveCreditsDown(this.movSpeed.manual, dt);
            }
            // clic principal (hacia arriba)
            else if (this.buttonPressed === this.MouseButton.LEFT) {
                this.moveCreditsUp(this.movSpeed.manual, dt);
            }
        }
    }

    enableManualMov() {
        this.automaticMov = false;

        this.input.on('pointerdown', (pointer) => {
            if (this.buttonPressed === this.MouseButton.NONE) {
                if (pointer.rightButtonDown()) {
                    this.buttonPressed = this.MouseButton.RIGHT;
                    this.leftRewind.setVisible(true);
                }
                else {
                    this.buttonPressed = this.MouseButton.LEFT;
                    this.rightRewind.setVisible(true);
                }
            }
        });

        this.input.on('pointerup', (pointer) => {
            this.buttonPressed = this.MouseButton.NONE;
            this.leftRewind.setVisible(false);
            this.rightRewind.setVisible(false);
        });
    }

    createSchoolsTexts(schoolsInfo, colsPadding, nCols, fontParams, paddings) {
        let schools = [];
        let places = [];

        let cont = 0;
        schoolsInfo.forEach((info) => {
            schools.push(info.school);
            places.push("(" + info.place + ")");
            ++cont;
            if (cont >= nCols) {
                this.createColsTextsBelow(paddings.team, schools, fontParams.school, colsPadding);
                this.createColsTextsBelow(paddings.key, places, fontParams.schoolPlace, colsPadding);
                cont = 0;
                schools = [];
                places = [];
            }
        });

        if (schools.length > 0) {
            this.createColsTextsBelow(paddings.team, schools, fontParams.school, colsPadding);
        }
        if (places.length > 0) {
            this.createColsTextsBelow(paddings.key, places, fontParams.schoolPlace, colsPadding);
        }
    }

    createImgOnTheRight(item, offsetX, scale, sprite, atlas) {
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

    createMedalOnTheRight(item, offsetX, frame) {
        let medal = this.createImgOnTheRight(item, offsetX, 0.9, frame, 'medals');
        medal.setTint(Phaser.Display.Color.GetColor(0, 104, 93));
        return medal;
    }

    placeColsObjsBelow(offsetY, objects, colsPadding) {
        let nColumns = objects.length;
        let halfColumns = Math.floor(nColumns / 2);

        let x = 0;
        // par (no hay ningun elemento en medio)
        if (nColumns % 2 == 0) {
            x = -(colsPadding / 2 + colsPadding * (halfColumns - 1));
        }
        // impar (hay un elemento en el medio)
        else {
            x = -colsPadding * halfColumns;
        }

        let y = offsetY;
        if (this.lastItem) {
            y = y + this.lastItem.y + this.lastItem.displayHeight;
        }

        objects.forEach((object) => {
            object.x = x;
            object.y = y;
            x = x + colsPadding;
            object.setOrigin(0.5, 0);
            this.creditsCont.add(object);
        });

        this.lastItem = objects[objects.length - 1];
    }

    createColsImgsBelow(offsetY, imgs, height, colsPadding) {
        let imgsObjs = [];
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
        this.placeColsObjsBelow(offsetY, imgsObjs, colsPadding);
        return imgsObjs;
    }

    createColsTextsBelow(offsetY, texts, fontParams, colsPadding) {
        let style = { ...this.style };
        style.fontSize = fontParams.size + 'px';
        style.fontFamily = fontParams.font;

        let textsObjs = [];
        texts.forEach((text) => {
            let textObj = this.add.text(0, 0, text, style);
            textsObjs.push(textObj);
        });
        this.placeColsObjsBelow(offsetY, textsObjs, colsPadding);
        return textsObjs;
    }

    placeObjectBelow(offsetY, object) {
        let y = offsetY;
        if (this.lastItem) {
            y = y + this.lastItem.y + this.lastItem.displayHeight;
        }
        object.y = y;
        object.setOrigin(0.5, 0);
        this.creditsCont.add(object);
        this.lastItem = object;
    }

    createTextBelow(offsetY, text, fontParams) {
        let style = { ...this.style };
        style.fontSize = fontParams.size + 'px';
        style.fontFamily = fontParams.font;

        let textObj = this.add.text(0, 0, text, style);
        this.placeObjectBelow(offsetY, textObj);
        return textObj;
    }

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

    createRewind(x, y, right) {
        let rewind = this.add.image(x, y, 'rewind');
        rewind.setTint(Phaser.Display.Color.GetColor(0, 104, 93));
        rewind.setScale(1.1);
        rewind.setVisible(false);
        rewind.flipX = right;

        return rewind;
    }
}