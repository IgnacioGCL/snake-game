var canvas;
var context;
var direction;
var snake;
var stop;
var headLastPosition;
var score;

function initializeVars() {
    score = 0;
    document.getElementById('score').innerHTML = score;
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    snake = [];
    fruits = [];
    direction = 'Right';
    stop = false;
    headLastPosition = [0, 0];

    canvas.width = 500;
    canvas.height = 500;

    snake.push(new createBlock(20, 20, 'black', 100, 100));
}

function startGame() {

    initializeVars();
    // Actualiza el dónde se pinta a la serpiente;
    setInterval(() => {
        headLastPosition = [snake[0].xPos, snake[0].yPos];
        context.clearRect(0, 0, canvas.width, canvas.height);
        move(direction);
        updateSnake();
        updateFruits();
        if (checkIfFruitIsEaten()) {
            addScore();
            snake.push(new createBlock(20, 20, 'red', headLastPosition[0], headLastPosition[1]));
        }
    }, 200);

    // Se crean piezas de comida
    setInterval(() => {
        generateFruits("blue");
    }, Math.floor(Math.random() * (10000 - 5000) + 5000));

    // Se crean piezas de comida doradas
    setInterval(() => {
        generateFruits('');
    }, Math.floor(Math.random() * (20000 - 15000) + 15000));

    setInterval

}

function createBlock(width, height, color, xPos, yPos) {
    this.width = width;
    this.height = height;
    this.xPos = xPos;
    this.yPos = yPos;
    this.color = color;
    context.fillStyle = this.color;
    context.fillRect(this.xPos, this.yPos, this.width, this.height);
    this.update = function () {
        if ((this.xPos == 480 || this.xPos == 0) || (this.yPos == 480 || this.yPos == 0)) {
            stop = true;
            document.getElementById('game-over').style.display = 'inline';
        }
        context.fillStyle = this.color;
        context.fillRect(this.xPos, this.yPos, this.width, this.height);
    }
}

function generateFruits(type) {
    if (!stop) {
        // TODO: generar las frutas en coordenadas que sean múltiplos de 20 
        let random1 = 1;
        let random2 = 1;
        let score = type == 'blue' ? 1 : 5;
        let color = type == 'blue' ? 'blue' : 'gold';
        let fruit = [];
        while ((random1 % 20) !== 0) {
            random1 = Math.floor(Math.random() * (480 - 20) + 20)
        }
        while ((random2 % 20) !== 0) {
            random2 = Math.floor(Math.random() * (480 - 20) + 20)
        }
        // El segundo valor indica la puntuación
        fruit = [new createBlock(20, 20, color, random1, random2), score];
        fruits.push(fruit);
    }
}

function updateSnake() {
    for (let i = 0; i < snake.length; i++) {
        snake[i].update();
    }
}

function updateFruits() {
    for (let i = 0; i < fruits.length; i++) {
        fruits[i][0].update();
    }
}

function move(direction) {
    if (!headTouchesBody()) {
        let previousPosition = [snake[0].xPos, snake[0].yPos];
        let savePosition = [];
        if (!stop) {
            switch (direction) {
                case 'Up':
                    snake[0].yPos -= 20;
                    break;
                case 'Down':
                    snake[0].yPos += 20;
                    break;
                case 'Right':
                    snake[0].xPos += 20;
                    break;
                case 'Left':
                    snake[0].xPos -= 20;
                    break;
            }
            if (snake.length >= 2) {
                for (let i = 1; i < snake.length; i++) {
                    //Guardo la posición del elemento
                    savePosition = [snake[i].xPos, snake[i].yPos];
                    //Actualizo la posición
                    snake[i].xPos = previousPosition[0];
                    snake[i].yPos = previousPosition[1];
                    previousPosition = savePosition;
                }
            }
        }
    }
}

function headTouchesBody() {
    for (let i = 1; i < snake.length; i++) {
        if ((snake[0].xPos == snake[i].xPos) && (snake[0].yPos == snake[i].yPos)) {
            stop = true;
            document.getElementById('game-over').style.display = 'inline';
            return true;
        }
    }
    return false;
}

function addScore(fruitScore) {
    if (typeof fruitScore != 'undefined') {
        score += fruitScore;
        document.getElementById('score').innerHTML = score;
    }
}

function checkIfFruitIsEaten() {
    for (let i = 0; i < fruits.length; i++) {
        //Fruta comida
        let condition = (fruits[i][0].xPos == snake[0].xPos) && (fruits[i][0].yPos == snake[0].yPos);
        if (condition) {
            addScore(fruits[i][1]);
            fruits = _.remove(fruits, element => {
                return !((element[0].xPos == snake[0].xPos) && (element[0].yPos == snake[0].yPos));
            });
            return true;
        }
    }
    return false;
}

window.onkeyup = function (e) {
    switch (e.key) {
        case 'ArrowUp':
            direction = 'Up';
            break;
        case 'ArrowDown':
            direction = 'Down';
            break;
        case 'ArrowRight':
            direction = 'Right';
            break;
        case 'ArrowLeft':
            direction = 'Left';
            break;
    }
}


startGame();