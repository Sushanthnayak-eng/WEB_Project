const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const speedInput = document.getElementById('speed');

const grid = 20;
let snake, dx, dy, food, maxCells, gameInterval, speed, running = false;

function resetGame() {
  snake = [{ x: 160, y: 160 }];
  dx = grid;
  dy = 0;
  maxCells = 4;
  food = { x: 0, y: 0 };
  placeFood();
}

function placeFood() {
  food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
  food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
}

function draw() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, grid - 1, grid - 1);

  ctx.fillStyle = 'lime';
  snake.forEach(cell => {
    ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
  });
}

function gameStep() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Collision detection
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some(cell => cell.x === head.x && cell.y === head.y)
  ) {
    clearInterval(gameInterval);
    running = false;
    startBtn.disabled = false;
    alert('Game over! Press Start to play again.');
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    maxCells++;
    placeFood();
  }
  while (snake.length > maxCells) {
    snake.pop();
  }
  draw();
}

function startGame() {
  if (running) return;
  resetGame();
  draw();
  speed = parseInt(speedInput.value, 10) || 120;
  startBtn.disabled = true;
  running = true;
  gameInterval = setInterval(gameStep, speed);
}

document.addEventListener('keydown', e => {
  if (!running) return;
  if (e.key === 'ArrowLeft' && dx === 0) { dx = -grid; dy = 0; }
  else if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -grid; }
  else if (e.key === 'ArrowRight' && dx === 0) { dx = grid; dy = 0; }
  else if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = grid; }
});

startBtn.addEventListener('click', startGame);

// Draw instructions before game starts
resetGame();
ctx.fillStyle = '#fff';
ctx.font = '20px Arial';
ctx.textAlign = 'center';
ctx.fillText('Set Speed & Click Start', canvas.width / 2, canvas.height / 2);

