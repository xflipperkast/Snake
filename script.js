let dotSize = 20;
let direction = 'Right';
const gameBoard = document.getElementById('game-board');
const scoreBoard = document.getElementById('score');
const message = document.getElementById('message');
const settings = document.getElementById('settings');
let score = 0;
let snake = [{ top: 0, left: 0 }];
let food = [];
let initialDot = null;
let foodLimit = 7;
let speed = null;
let gameStarted = false;

function setGameMode(mode) {
  switch(mode) {
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
}

function createDot(top, left, id, isFood = false, isHead = false, direction = 'Right') {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  dot.style.left = `${left}px`;
  dot.style.top = `${top}px`;
  dot.id = id;

  if (isFood) {
    const imageUrl = getRandomImage();
    dot.style.background = `url(${imageUrl})`;
    dot.style.backgroundSize = 'cover';
  } else if (isHead) {
    dot.style.background = `url(images/head-${direction}.png)`;  // replace with the path to your head image
    dot.style.backgroundSize = 'cover';
  } else {
    dot.style.background = `url(images/body-${direction}.png)`;  // replace with the path to your body image
    dot.style.backgroundSize = 'cover';
  }
  gameBoard.appendChild(dot);
  return dot;
}

function getRandomImage() {
const images = ['orange.png', 'apple.png', 'melon.png', 'begal.png'];  // replace these with your actual image names
const index = Math.floor(Math.random() * images.length);
return 'images/' + images[index];  // replace with your actual image folder path
}

function updateSnake() {
  let head = Object.assign({}, snake[0]); // copy head
  switch (direction) {
    case 'Left':
      head.left -= dotSize;
      break;
    case 'Up':
      head.top -= dotSize;
      break;
    case 'Right':
      head.left += dotSize;
      break;
    case 'Down':
      head.top += dotSize;
      break;
  }
  snake.unshift(head); // add new head to snake
}

function gameLoop() {
if(speed === null) return;  // don't start the game loop until the game mode is set
updateSnake();
const foodIndex = food.findIndex(f => f.style.top === `${snake[0].top}px` && f.style.left === `${snake[0].left}px`);
if (foodIndex > -1) { // snake found food
score++;
scoreBoard.textContent = `Score: ${score}`;
food[foodIndex].remove();
food.splice(foodIndex, 1);
} else {
const tail = snake.pop(); // remove tail
let tailElement = document.getElementById(tail.id);
if (tailElement !== null) {
  tailElement.remove();
}
}

// check game over
if (snake[0].top < 0 || snake[0].left < 0 || snake[0].top > gameBoard.offsetHeight - dotSize || snake[0].left > gameBoard.offsetWidth - dotSize) {
return gameOver();
}

// check snake collides with itself
for (let i = 1; i < snake.length; i++) {
if (snake[i].top === snake[0].top && snake[i].left === snake[0].left) {
  return gameOver();
}
}

// update the previous head to be a body
if (snake.length > 1) {
const previousHeadId = `dot-${snake[1].top}-${snake[1].left}`;
const previousHeadElement = document.getElementById(previousHeadId);
if (previousHeadElement !== null) {
  previousHeadElement.style.background = `url(images/body-${direction}.png)`;
  previousHeadElement.style.backgroundSize = 'cover';
}
}

// create new head
const headId = `dot-${snake[0].top}-${snake[0].left}`;
snake[0].id = headId;
createDot(snake[0].top, snake[0].left, headId, false, true, direction);

while (food.length < foodLimit) {
let left, top;
do {
  left = Math.floor(Math.random() * (gameBoard.offsetWidth - dotSize)/dotSize) * dotSize;
  top = Math.floor(Math.random() * (gameBoard.offsetHeight - dotSize)/dotSize) * dotSize;
} while (snake.find(dot => dot.top === top && dot.left === left) || food.find(f => f.style.top === `${top}px` && f.style.left === `${left}px`));
food.push(createDot(top, left, 'food-dot', true));
}

setTimeout(gameLoop, speed);
}

function gameOver() {
  message.style.display = "block";
  message.textContent = "Game Over! Choose An difficulty And Press Enter to Restart";
  settings.style.display = "block";
  alert(`Game Over! Your score is ${score}`);
  // Remove all dots
  let children = Array.from(gameBoard.children); // create a copy of children array
  for(let child of children) {
    if(child.className !== 'persistent') {
      gameBoard.removeChild(child);
    }
  }
  // Reset game state
  score = 0;
  scoreBoard.textContent = `Score: ${score}`;
  snake = [{ top: 0, left: 0 }];
  food = [];
  direction = 'Right';
  speed = null;
  gameStarted = false;
}


function handleKeydown(event) {
  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      if (direction !== 'Down') {
        direction = 'Up';
      }
      break;
    case 'a':
    case 'ArrowLeft':
      if (direction !== 'Right') {
        direction = 'Left';
      }
      break;
    case 's':
    case 'ArrowDown':
      if (direction !== 'Up') {
        direction = 'Down';
      }
      break;
    case 'd':
    case 'ArrowRight':
      if (direction !== 'Left') {
        direction = 'Right';
      }
      break;
  }
}


function startGame() {
  if(gameStarted) return;
  gameStarted = true;
  window.addEventListener('keydown', handleKeydown);
  // create first dot
  initialDot = createDot(snake[0].top, snake[0].left, 'dot-0-0', false, false);
  message.textContent = "";
  message.style.display = "none";
  settings.style.display = "none";
  setTimeout(gameLoop, speed);
  if (initialDot) {
    initialDot.remove();
    initialDot = null;
  }
}
window.addEventListener('keydown', (event) => {
  if(event.key === 'Enter' && speed !== null && !gameStarted) {
    startGame();
  }
});
