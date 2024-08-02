import NightmareMinigame from '../nightmareMinigame.js';

export default class NightmareDay3 extends NightmareMinigame {
    /**
     * Pesadilla que aparece el dia 3
     * El minijuego consiste en hablar con todos los personajes
     */
    constructor() {
        super(3, false);
    }

    create(params) {
        super.create(params);

        this.characters = new Map();

        // Se crean todos los personajes y sus retratos
        let tr = {
            x: this.CANVAS_WIDTH / 3.7,
            y: 7.15 * this.CANVAS_HEIGHT / 8,
            scale: 0.16
        }
        this.createClassmate(tr, 'Maria');

        tr = {
            x: 1.65 * this.CANVAS_WIDTH / 4,
            y: 3.15 * this.CANVAS_HEIGHT / 4,
            scale: 0.138
        }
        let character = this.createClassmate(tr, 'Guille');
        character.char.flipX = true;
        character.portrait.flipX = true;

        tr = {
            x: 1.12 * this.CANVAS_WIDTH / 2,
            y: 2.95 * this.CANVAS_HEIGHT / 4,
            scale: 0.125
        }
        let portraitOffset = {...this.portraitOffset};
        portraitOffset.x += 5;
        portraitOffset.scale = 1.54;
        portraitOffset.y += -20
        this.createClassmate(tr, 'Jose', portraitOffset);

        tr = {
            x: 2.9 * this.CANVAS_WIDTH / 4,
            y: 7.8 * this.CANVAS_HEIGHT / 9,
            scale: 0.17
        }
        portraitOffset = {...this.portraitOffset};
        portraitOffset.y -= 20;
        this.createClassmate(tr, 'Alison', portraitOffset);

        tr = {
            x: 3.6 * this.CANVAS_WIDTH / 4,
            y: this.CANVAS_HEIGHT - 17,
            scale: 0.182
        }
        portraitOffset = {...this.portraitOffset};
        portraitOffset.y -= 23;
        portraitOffset.scale = 1.558;
        this.createClassmate(tr, 'Ana', portraitOffset);

        // Los personajes se han creado algo desplazados a la derecha, por lo tanto,
        // se mueven para que esten mas o menos en el centro
        let offset = 60;
        this.characters.forEach((char, name) => {
            char.x -= offset;
        });

        // Cuando llega el evento, es que el dialogo del personaje ha terminado y tiene que desaparecer
        let fadeOutDuration = 1000;
        this.dispatcher.add('characterFadesOut', this, (eventInfo) => {
            let charName = eventInfo.character;
            if (this.characters.has(charName)) {
                let char = this.characters.get(charName);

                // El personaje desparece
                let fadeOut = this.tweens.add({
                    targets: char,
                    alpha: 0,
                    duration: fadeOutDuration,
                    repeat: 0,
                });
                fadeOut.on('complete', () => {
                    this.characters.delete(charName);
                    char.destroy();

                    // Si han desaparecido todos los personajes, la pesadillas termina
                    if (this.characters.size <= 0) {
                        this.onMinigameFinishes();
                    }
                })
            }
        })
    }

    onMinigameStarts() {
        this.characters.forEach((char, name) => {
            char.setVisible(true);
        });
    }

    /**
     * Crear personaje que aparece en la pesadillas con el que se puede interactuar
     */
    createClassmate(tr, charName, portraitOffset) {
        let character = this.createCharFromImage(tr, charName, portraitOffset);
        character.char.setOrigin(0.5, 1);
        character.char.setVisible(false);

        let node = this.readNodes(charName);

        character.char.setInteractive({ useHandCursor: true });
        character.char.once('pointerdown', () => {
            character.char.removeInteractive();
            this.dialogManager.setNode(node);
        })

        this.characters.set(charName, character.char);

        return character;
    }
}