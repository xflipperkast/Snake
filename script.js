// Improved Snake Game in JavaScript
const dotSize = 20;
const gameBoard = document.getElementById('game-board');
const scoreBoard = document.getElementById('score');
const message = document.getElementById('message');
const settings = document.getElementById('settings');

let direction = 'Right';
let snake = [];
let food = [];
let score = 0;
let speed = 150;
let foodLimit = 5;
let gameLoopInterval = null;
let gameStarted = false;

const images = ['orange.png', 'apple.png', 'melon.png', 'begal.png'];

function setGameMode(mode) {
  switch (mode) {
    case 'Easy':
      speed = 200;
      foodLimit = 7;
      break;
    case 'Medium':
      speed = 120;
      foodLimit = 5;
      break;
    case 'Hard':
      speed = 60;
      foodLimit = 4;
      break;
  }
  message.textContent = `Game Mode: ${mode}. Press Enter to Start`;
  message.style.display = 'block';
}

function getRandomImage() {
  const index = Math.floor(Math.random() * images.length);
  return `images/${images[index]}`;
}

function createDot({ top, left }, id, type = 'body') {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  dot.style.top = `${top}px`;
  dot.style.left = `${left}px`;
  dot.id = id;

  if (type === 'food') {
    dot.style.background = `url(${getRandomImage()}) center/cover`;
  } else if (type === 'head') {
    dot.style.background = `url(images/head-${direction}.png) center/cover`;
  } else {
    dot.style.background = `url(images/body-${direction}.png) center/cover`;
  }

  gameBoard.appendChild(dot);
  return dot;
}

function generateFood() {
  while (food.length < foodLimit) {
    const left = Math.floor(Math.random() * (gameBoard.offsetWidth / dotSize)) * dotSize;
    const top = Math.floor(Math.random() * (gameBoard.offsetHeight / dotSize)) * dotSize;

    if (!snake.some(dot => dot.top === top && dot.left === left) &&
        !food.some(f => parseInt(f.style.top) === top && parseInt(f.style.left) === left)) {
      const foodDot = createDot({ top, left }, `food-${top}-${left}`, 'food');
      food.push(foodDot);
    }
  }
}

function updateSnake() {
  const newHead = { ...snake[0] };

  switch (direction) {
    case 'Up': newHead.top -= dotSize; break;
    case 'Down': newHead.top += dotSize; break;
    case 'Left': newHead.left -= dotSize; break;
    case 'Right': newHead.left += dotSize; break;
  }

  // Check wall collision
  if (newHead.left < 0 || newHead.top < 0 ||
      newHead.left >= gameBoard.offsetWidth || newHead.top >= gameBoard.offsetHeight) {
    return endGame();
  }

  // Check self collision
  if (snake.some(segment => segment.top === newHead.top && segment.left === newHead.left)) {
    return endGame();
  }

  snake.unshift(newHead);

  const foodIndex = food.findIndex(f =>
    parseInt(f.style.top) === newHead.top && parseInt(f.style.left) === newHead.left
  );

  if (foodIndex !== -1) {
    score++;
    scoreBoard.textContent = `Score: ${score}`;
    food[foodIndex].remove();
    food.splice(foodIndex, 1);
  } else {
    const tail = snake.pop();
    document.getElementById(`dot-${tail.top}-${tail.left}`)?.remove();
  }

  const id = `dot-${newHead.top}-${newHead.left}`;
  createDot(newHead, id, 'head');

  if (snake.length > 1) {
    const second = snake[1];
    const prevHeadId = `dot-${second.top}-${second.left}`;
    const prevHead = document.getElementById(prevHeadId);
    if (prevHead) {
      prevHead.style.background = `url(images/body-${direction}.png) center/cover`;
    }
  }

  generateFood();
}

function gameLoop() {
  updateSnake();
}

function startGame() {
  if (gameStarted) return;

  gameStarted = true;
  direction = 'Right';
  snake = [{ top: 0, left: 0 }];
  food = [];
  score = 0;
  scoreBoard.textContent = 'Score: 0';
  message.style.display = 'none';
  settings.style.display = 'none';

  gameBoard.innerHTML = '';
  createDot(snake[0], `dot-${snake[0].top}-${snake[0].left}`, 'head');
  generateFood();

  if (gameLoopInterval) clearInterval(gameLoopInterval);
  gameLoopInterval = setInterval(gameLoop, speed);
}

function endGame() {
  clearInterval(gameLoopInterval);
  gameStarted = false;
  alert(`Game Over! Your score is ${score}`);
  message.textContent = 'Game Over! Choose a difficulty and press Enter to Restart';
  message.style.display = 'block';
  settings.style.display = 'block';
}

function handleKeydown(e) {
  switch (e.key) {
    case 'ArrowUp': case 'w': if (direction !== 'Down') direction = 'Up'; break;
    case 'ArrowDown': case 's': if (direction !== 'Up') direction = 'Down'; break;
    case 'ArrowLeft': case 'a': if (direction !== 'Right') direction = 'Left'; break;
    case 'ArrowRight': case 'd': if (direction !== 'Left') direction = 'Right'; break;
    case 'Enter': if (!gameStarted && speed !== null) startGame(); break;
  }
}

window.addEventListener('keydown', handleKeydown);
