const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    const startBtn = document.getElementById("startBtn");
    const restartBtn = document.getElementById("restartBtn");
    const gameOverText = document.getElementById("gameOverText");
    const scoreBoard = document.getElementById("scoreBoard");

    const scale = 10;
    const rows = canvas.height / scale;
    const cols = canvas.width / scale;

    let snake;
    let fruit;
    let playing = false;
    let lastUpdateTime = 0;
    const speed = 100; // milliseconds
    let score = 0;

    function Snake() {
      this.x = 0;
      this.y = 0;
      this.xSpeed = scale;
      this.ySpeed = 0;
      this.total = 0;
      this.tail = [];
      this.dead = false;

      this.draw = function () {
        ctx.fillStyle = "#999999";
        for (let i = 0; i < this.tail.length; i++) {
          ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }
        ctx.fillRect(this.x, this.y, scale, scale);
      };

      this.update = function () {
        for (let i = 0; i < this.tail.length - 1; i++) {
          this.tail[i] = this.tail[i + 1];
        }
        if (this.total > 0) {
          this.tail[this.total - 1] = { x: this.x, y: this.y };
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // Wrap around screen
        if (this.x >= canvas.width) this.x = 0;
        if (this.y >= canvas.height) this.y = 0;
        if (this.x < 0) this.x = canvas.width - scale;
        if (this.y < 0) this.y = canvas.height - scale;

        this.checkSelfCollision();
      };

      this.changeDirection = function (dir) {
        if (this.dead) return;
        if (dir === "Up" && this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = -scale;
        } else if (dir === "Down" && this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = scale;
        } else if (dir === "Left" && this.xSpeed === 0) {
          this.xSpeed = -scale;
          this.ySpeed = 0;
        } else if (dir === "Right" && this.xSpeed === 0) {
          this.xSpeed = scale;
          this.ySpeed = 0;
        }
      };

      this.eat = function (fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
          this.total++;
          score++;
          updateScore();
          return true;
        }
        return false;
      };

      this.checkSelfCollision = function () {
        for (let i = 0; i < this.tail.length; i++) {
          if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
            this.dead = true;
            gameOver();
          }
        }
      };
    }

    function Fruit() {
      this.x;
      this.y;

      this.pickLocation = function () {
        this.x = Math.floor(Math.random() * cols) * scale;
        this.y = Math.floor(Math.random() * rows) * scale;
      };

      this.draw = function () {
        ctx.fillStyle = "#f00";
        ctx.fillRect(this.x, this.y, scale, scale);
      };
    }

    function updateScore() {
      scoreBoard.textContent = `Score: ${score}`;
    }

    function gameLoop(currentTime) {
      if (!playing) return;

      requestAnimationFrame(gameLoop);
      if (currentTime - lastUpdateTime > speed) {
        lastUpdateTime = currentTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        fruit.draw();
        snake.update();
        snake.draw();

        if (snake.eat(fruit)) {
          fruit.pickLocation();
        }
      }
    }

    function startGame() {
      snake = new Snake();
      fruit = new Fruit();
      fruit.pickLocation();

      score = 0;
      updateScore();

      canvas.style.display = "block";
      scoreBoard.style.display = "block";
      startBtn.style.display = "none";
      gameOverText.style.display = "none";
      restartBtn.style.display = "none";
      playing = true;

      requestAnimationFrame(gameLoop);
    }

    function gameOver() {
      playing = false;
      gameOverText.style.display = "block";
      restartBtn.style.display = "inline-block";
    }

    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", startGame);

    window.addEventListener("keydown", (e) => {
      if (!playing) return;
      const direction = e.key.replace("Arrow", "");
      snake.changeDirection(direction);
    });