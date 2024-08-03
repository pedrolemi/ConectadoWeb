import NightmareMinigame from '../nightmareMinigame.js';
import ChairWithGum from '../../../gameObjects/chairWithGum.js';

export default class NightmareDay2 extends NightmareMinigame {
    /**
     * Pesadilla que aparece el dia 2
     * El minijuego consiste en chicles que van cayendo desde el cielo cada vez mas deprisa y cada menos tiempo
     * Hay que evitar que choquen con las sillas clicandolos
     */
    constructor() {
        super(2, false);
    }

    create(params) {
        super.create(params);

        // Grupo con las sillas (para las colisiones)
        // Se diferencia de un grupo de arcade physics en que un grupo de arcade sirve ademas de para las funciones normales de un grupo,
        // para configurar las fisicas de todos los elementos del grupo de forma conjunta (anade un collider a todos los elementos)
        let chairs = this.add.group();
        this.gums = this.add.group();

        // Si el minijuego esta activo o no
        this.enableMinigame = false;

        // Velocidad que adquiere un chice
        this.gumSpeed = {
            value: 100.0,       // valor que adquiere
            increase: 1.1,      // cuanto aumenta (aumenta cada vez que spawnea un chicle)
            max: 410.0,         // maximo que puede aumentar
            // Actualizar valores rapidamente
            update: () => {
                this.gumSpeed.value = this.gumSpeed.value * this.gumSpeed.increase;
                if (this.gumSpeed.value > this.gumSpeed.max) {
                    this.gumSpeed.value = this.gumSpeed.max;
                }
            }
        }
        // Cada cuanto tiempo spawnea un chicle
        this.elapsedTime = 0;
        this.gumSpawnTime = {
            value: 1500.0,      // cada cuanto spawnea
            decrement: 0.9,     // cuanto decrementa este tiempo (decrementa cada vez que spawnea un chicle)
            min: 450,           // minimo que puede disminuir
            // Actualizar valores rapidamente
            update: () => {
                this.gumSpawnTime.value = this.gumSpawnTime.value * this.gumSpawnTime.decrement;
                if (this.gumSpawnTime.value < this.gumSpawnTime.min) {
                    this.gumSpawnTime.value = this.gumSpawnTime.min;
                }
            }
        }
        // Minimo y maximo valor que puede tener el tam de un chicle spawneado
        this.gumScale = {
            min: 0.67,
            max: 1.0
        }

        // Donde spawnean los chicles
        this.spawnPosY = -50;
        // Distancia que se deja a los lados respecto al canvas para la linea de spawn de los chicles
        this.spawPadding = 10;

        // Posiciones de los chicles pegados en las sillas
        let gumsOffsets = [
            {
                x: 10,
                y: -2.5,
                scale: 1.15,
                left: false
            },
            {
                x: 17,
                y: 17,
                scale: 0.95,
                left: true
            },
            {
                x: 0,
                y: -7,
                scale: 0.8,
                left: true
            },
            {
                x: 0,
                y: -2.5,
                scale: 1.15,
                left: false
            },
            {
                x: 5,
                y: 3,
                scale: 1.27,
                left: true
            }
        ]

        // Numero de sillas que hay en el escenario
        let nChairs = 5;

        // Se crea el modelo
        let chairAux = new ChairWithGum(this, 0, 0, 1.160);
        let y = this.CANVAS_HEIGHT - 75;
        // Se crea la hilera de sillas
        let chairsArr = this.createCenteredObjects(y, nChairs, 0, chairAux);
        for (let i = 0; i < nChairs; ++i) {
            let chair = chairsArr[i];
            // Se coloca el chicle que tienen pegado
            chair.moveGum(gumsOffsets[i]);
            // Se anaden al grupo (para las fisicas)
            chairs.add(chair);
        }

        // Colision entre las sillas y las bolas de chicle
        this.physics.add.collider(chairs, this.gums, (chair, gum) => {
            // Se elimina el chicle del grupo
            // 1er true --> se elimina tb de la escena
            // 2º true --> se llama al destroy() del chicle
            this.gums.remove(gum, true, true);
            // Si el chicle no estaba pegado...
            if (!chair.stickedGum) {
                // Se pega
                chair.stickGum();
                // Disminuye el numero de sillas con chicles pegados
                --nChairs;
                if (nChairs <= 0) {
                    this.onMinigameFinishes();
                }
            }
        });
    }

    update(t, dt) {
        super.update(t, dt);

        if (this.enableMinigame) {
            // Crear una bola de chicle cada cierto tiempo
            this.elapsedTime += dt;
            if (this.elapsedTime > this.gumSpawnTime.value) {
                this.elapsedTime = 0;
                this.createGum();
                // Actualizar velocidad y tiempo de spawn
                this.gumSpeed.update();
                this.gumSpawnTime.update();
            }
        }
    }

    /**
     * Crear un chicle con collider que se destruye cuando se clica
     */
    createGum() {
        let gum = this.add.image(0, 0, this.atlasName, 'gum');

        // Escala aleatoria
        let randScale = Phaser.Math.FloatBetween(this.gumScale.min, this.gumScale.max);
        gum.setScale(randScale);

        // Posicion aleatoria dentro de la linea de spawn
        let randPosX = Phaser.Math.FloatBetween(gum.displayWidth / 2 + this.spawPadding, this.CANVAS_WIDTH - gum.displayWidth / 2 - this.spawPadding);
        gum.x = randPosX;
        gum.y = this.spawnPosY;

        this.physics.add.existing(gum);
        // Velocidad del chicle
        gum.body.setVelocityY(this.gumSpeed.value);
        this.gums.add(gum);

        gum.setInteractive({ useHandCursor: true });
        gum.on('pointerdown', () => {
            // Si se clica, se elmina del grupo y se destruye
            this.gums.remove(gum, true, true);
        })
    }

    onMinigameStarts() {
        this.enableMinigame = true;
    }

    onMinigameFinishes() {
        this.enableMinigame = false;
        // Cuando termina el minijuego...
        this.gums.getChildren().forEach((gum) => {
            // Se paran todos los chicles restantes
            gum.body.stop();
            // Los chicles restantes dejan de ser interactuables
            gum.removeInteractive();
        });
        super.onMinigameFinishes();
    }
}