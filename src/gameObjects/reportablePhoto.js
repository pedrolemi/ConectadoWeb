import GameManager from "../managers/gameManager.js";

export default class ReportablePhoto extends Phaser.GameObjects.Container {
    /**
     * Foto denunciable que se mueve de forma aleatoria por el mapa cada vez que se pasa el cursor por encima de ella
     * y que despues de haber pasado un numero de veces concreto el cursor, se ejecuta una funcion
     * @param {Phaser.Scene} scene - escena a la que pertenece  
     * @param {Number} scale - escala de la foto 
     * @param {String} frame - imagen que se utiliza en la foto
     * @param {Number} speed - velocidad a la que se desplaza la foto
     * @param {Number} minTouches 
     * @param {Number} maxTouches
     *      El numero minimo de veces que hay que pasar el cursor por encima de la foto para que se ejecute la funcion es
     *      un valor aleatorio [minTouches, maxTouches] 
     * @param {Function} onTouched - funcion que se ejecuta cuando se ha pasado el cursor un numero de veces concreto
     * @param {Object} pos - posicion inicial de la foto (opciona, sino se coge una aleatoria) 
     * @param {Boolean} startMoving - tiene dos funcionamientos iniciales (true si comienza moviendose o false si hay que pasar el cursor por encima) 
     */
    constructor(scene, scale, frame, speed, minTouches, maxTouches, onTouched, pos, startMoving) {
        super(scene, 0, 0)

        const CANVAS_WIDTH = this.scene.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.scene.sys.game.canvas.height;

        this.scene.add.existing(this);

        let gameManager = GameManager.getInstance();

        this.setScale(scale);
        // Poder tener preUpdate
        this.addToUpdateList();

        // Minima distancia de separacion a la que el punto aleatorio debe encontrarse para evitar que la foto se desplace una distancia muy pequena
        this.randomPointThreshold = 300;
        // Maximo numero de intentos de buscar un punto aleatorio (evitar que se produzca un bucle infinito)
        this.maxAttempts = 15;
        // Distancia a la que debe encontrarse del target para que se considere que ha llegado a la posicion destino
        this.movThreshold = 50;
        
        // Numero de toques necesarios para que se ejecute la funcion
        this.nTouches = Phaser.Math.Between(minTouches, maxTouches);
        this.minTouches = minTouches;
        this.maxTouches = maxTouches;
        this.onTouched = onTouched;
        // Si se esta moviendo o se tiene que clciar
        this.allowMov = false;
        // Velocidad a la que se mueve
        this.speed = speed;

        // Foto
        this.image = this.scene.add.image(0, 0, 'photos', frame);
        this.add(this.image);

        // Block
        let blockImg = this.scene.add.image(0, 0, 'computerElements', 'block');
        blockImg.y -= this.image.displayHeight / 4;
        blockImg.setScale(1.8);
        this.add(blockImg);

        // Texto
        let padding = 3;
        let textStyle = { ...gameManager.textConfig };
        textStyle.fontFamily = 'gidolinya-regular';
        textStyle.fontSize = '84px';
        textStyle.fontBold = 'bold'
        textStyle.color = '#FF0000';
        textStyle.align = 'center';
        textStyle.wordWrap = {
            width: this.image.displayWidth - padding * 2,
            useAdvancedWrap: true
        }
        let textTranslation = gameManager.i18next.t('imageText', { ns: 'day4\\nightmareDay4' });
        let text = this.scene.add.text(0, 0, textTranslation, textStyle);
        text.setOrigin(0.5);
        text.y += text.displayHeight / 4;
        this.add(text);

        let width = this.image.displayWidth * scale;
        let height = this.image.displayHeight * scale;
        // Limites en los que puede aparecer un punto random (se considera tanto el tam del canvas como el de la propia foto)
        this.boundaries = {
            left: width / 2,
            right: CANVAS_WIDTH - width / 2,
            top: height / 2,
            bottom: CANVAS_HEIGHT - height / 2
        }

        // Setear la posicion inicial
        this.currentPos = new Phaser.Math.Vector2();
        if (!pos) {
            this.currentPos = this.getRandomPoint(false);
        }
        else {
            this.currentPos.set(pos.x, pos.y);
        }
        this.setPosition(this.currentPos.x, this.currentPos.y);
        // Objetivo
        this.target = {
            point: new Phaser.Math.Vector2(),           // punto destino
            currentDir: new Phaser.Math.Vector2(),      // direccion en cada frame (para poder calcular la distancia al punto destino)
            normDir: new Phaser.Math.Vector2()          // direccion normalizado (para ir moviendo la foto)
        }

        // Comienza moviendose o hay que pasar el cursor por encima
        if (startMoving) {
            this.move();
        }
        else {
            this.allowTouch();
        }
    }

    preUpdate(t, dt) {
        if (this.allowMov) {
            // Direccion hasta el objetivo
            this.target.currentDir.copy(this.target.point);
            this.target.currentDir.subtract(this.currentPos);

            // Se comprueba si la distancia es menor que el umbral
            if (this.target.currentDir.length() > this.movThreshold) {
                // Si no es menor, sigue moviendose
                this.currentPos.x = this.currentPos.x + this.target.normDir.x * this.speed * dt;
                this.currentPos.y = this.currentPos.y + this.target.normDir.y * this.speed * dt;
            }
            else {
                // Si es menor...
                // Se coloca en la posicion destino exacta
                this.currentPos.copy(this.target.point);
                // Deja de mover y ahora hay que pasar el cursor por encima
                this.allowTouch();
            }
            // Cambiar la pos de la foto
            this.setPosition(this.currentPos.x, this.currentPos.y);
        }
    }

    /**
     * Deja de moverse y ahora hay qeu pasar el cursor por encima
     */
    allowTouch() {
        // Vuevle a ser interactuable
        this.image.setInteractive({ useHandCursor: true });
        this.allowMov = false;

        // Evento cuando se pasa el cursor por encima
        this.image.once('pointerover', () => {
            // Pasa a moverse
            this.move();
            // Se reduce el numero de toques
            --this.nTouches;
            if (this.nTouches <= 0) {
                this.nTouches = Phaser.Math.Between(this.minTouches, this.maxTouches);
                if (this.onTouched) {
                    this.onTouched();
                }
            }
        });
    }

    move() {
        // Deja de ser interactuable
        this.image.removeInteractive();
        // Se calcula un nuevo punto destino
        this.target.point = this.getRandomPoint(true);
        this.target.currentDir.copy(this.target.point);
        this.target.currentDir.subtract(this.currentPos);
        this.target.normDir.copy(this.target.currentDir);
        this.target.normDir.normalize();
        this.allowMov = true;
    }

    /**
     * Obtener un punto aleatorio dentro de los limites
     * @param {Boolean} limit - true si es necesario que el punto este a la distancia minima oportuna, false en caso contrario 
     * @returns 
     */
    getRandomPoint(limit) {
        // Punto aleatorio
        let x = Phaser.Math.FloatBetween(this.boundaries.left, this.boundaries.right);
        let y = Phaser.Math.FloatBetween(this.boundaries.top, this.boundaries.bottom);
        let point = new Phaser.Math.Vector2(x, y);

        // Es necesario que el punto aleatorio este a la distancia minima oportuna de la distancia actual
        if (limit) {
            let direction = new Phaser.Math.Vector2();
            // copy -> copia el vector dado en el propio vector
            direction.copy(point);
            // subtract -> propio vector - vector dado
            // Entonces, en este caso seria: point - currentPos
            direction.subtract(this.currentPos);
            let attempts = 0;
            // Se comprueba si el punto aleatorio calcualdo es valido. Si no lo es, se sigue buscando otro
            while (direction.length() < this.randomPointThreshold && attempts < this.maxAttempts) {
                // minimo incluido, maximo excluido
                let x = Phaser.Math.FloatBetween(this.boundaries.left, this.boundaries.right);
                let y = Phaser.Math.FloatBetween(this.boundaries.top, this.boundaries.bottom);
                point.set(x, y);

                direction.copy(point);
                direction.subtract(this.currentPos);

                ++attempts;
            }
        }

        return point;
    }

    /**
     * Desactivar la funcionalidad de la foto (movimiento e interactividad)
     */
    stop() {
        this.allowMov = false;
        this.image.removeInteractive();
    }
}