import GameManager from "../managers/gameManager.js";

export default class Counter extends Phaser.GameObjects.Container {
    /**
    * Clase que activa un contador y al llegar a un numero creando explota creando particulas
    * Luego de un rato, reaparece y vuelve a funcionar de la misma manera
    * @param {Phaser.Scene} scene - escena a la que pertenece
    * @param {Number} x - posicion x del contador (numero, imagen, donde salen las particulas)
    * @param {Number} y - posicion y del contador (numero, imagen, desde donde salen las particulas)
    * @param {Number} scale - escala del objeto
    * @param {String} fill - sprite que se usa para el relleno del contador
    * @param {String} edge - sprite que se usa para el borde del contador
    * @param {String} particle - sprite que se usa para las particulas
    * @param {String} font - tipografica que se usa para los numeros del contador
    * @param {Number} limit - cuando se llega a este numero (no incluido) el contador desaparece y se produce una explosion
    * @param {Number} increase - el contador escala segun una funcion exponencial (ej. 2^x). Este valor es la x
    * @param {Number} waitTimer - despues de que el contador haya desaparecido, este es el tiempo que tarda en volver a aparecer
    * @param {Color} fillColor - color del relleno en formato RGB (opcional)
    */
    constructor(scene, x, y, scale, fill, edge, particle, font, limit, waitTimer, increase, fillColor) {
        super(scene, x, y);

        this.scene.add.existing(this);

        let gameManager = GameManager.getInstance();

        // Inicializacion
        this.elapsedTime = 0;
        this.waitTimer = waitTimer;
        this.limit = limit;
        this.increase = increase;

        this.fillImg = this.scene.add.image(0, 0, fill);
        if (fillColor) {
            this.fillImg.setTint(fillColor);
        }
        this.add(this.fillImg);

        this.edgeImg = this.scene.add.image(0, 0, edge);
        this.add(this.edgeImg);

        let style = { ...gameManager.textConfig };
        style.fontFamily = font;
        style.fontSize = '90px';

        this.cont = 0;
        this.text = this.scene.add.text(0, 0, this.cont, style);
        this.text.setOrigin(0.5);
        this.add(this.text);

        // Se crea el emisor de particula que funciona en modo explosion
        // Es decir, emite particulas de golpe cuando se llama a una funcion
        this.emitter = this.scene.add.particles(0, 0, particle, {
            lifespan: 3000,                     // duracion de cada particula
            speed: { min: 750, max: 1000 },     // velocidad de cada particula en x, y. Valor aleatorio entre los dos especificados
            scale: { start: 0.4, end: 0 },      // las particulas vas reduciendo su tam hasta desaparecer
            frequency: -1,                      // modo explosion
            quantity: 22                        // particulas generadas cada vez
        });

        this.add(this.emitter);

        // Se agrega el contenedor a la lista de actualizados para poder usar el preUpdate
        this.addToUpdateList();
        this.setScale(scale);
    }

    preUpdate(t, dt) {
        this.elapsedTime += dt;

        // Mientras el numero de particulas es menor que el permitido, sigue aumentado el contador
        if (this.cont < this.limit) {
            // El contador responde a una funcion exponencial del modo dt^x, siendo x = increase
            this.cont = Math.pow(this.elapsedTime / 1000, this.increase);
            // Se aproxima al mayor
            this.cont = Math.ceil(this.cont);

            // Si no ha llegado al limite, se actualiza
            if (this.cont < this.limit) {
                this.text.setText(this.cont);
            }
            // En caso contrario, desaparece el contador y se produce la explosion
            else {
                this.elapsedTime = 0;
                this.makeVisible(false);
                this.emitter.explode();
            }
        }
        // Timer para hacer que vuelve a aparecer el contador
        else if (this.elapsedTime > this.waitTimer) {
            this.elapsedTime = 0;
            this.cont = 0;
            this.text.setText(this.cont);
            this.makeVisible(true);
        }
    }

    makeVisible(enable) {
        this.fillImg.setVisible(enable);
        this.edgeImg.setVisible(enable);
        this.text.setVisible(enable);
    }
}