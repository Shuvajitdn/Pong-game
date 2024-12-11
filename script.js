const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

// Game settings
const paddleWidth = 10, paddleHeight = 100;
const ballSize = 10;
let paddleSpeed = 5;
let ballSpeedX = 4, ballSpeedY = 4;
let speedIncreaseInterval = 5; // Increase speed every 5 hits
let hits = 0;

// Paddle positions
const player = { x: 0, y: canvas.height / 2 - paddleHeight / 2 };
const computer = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2 };
let ball = { x: canvas.width / 2, y: canvas.height / 2 };

// Score
let playerScore = 0;
let computerScore = 0;

// Key states
let upPressed = false;
let downPressed = false;

function draw() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  context.fillStyle = '#61dafb';
  context.fillRect(player.x, player.y, paddleWidth, paddleHeight);
  context.fillRect(computer.x, computer.y, paddleWidth, paddleHeight);

  // Draw ball
  context.fillStyle = '#ff4081';
  context.beginPath();
  context.arc(ball.x, ball.y, ballSize, 0, Math.PI * 2);
  context.fill();

  // Draw scores
  context.font = '24px Arial';
  context.fillStyle = '#61dafb';
  context.fillText(`Player: ${playerScore}`, 50, 30);
  context.fillText(`Computer: ${computerScore}`, canvas.width - 150, 30);
}

function update() {
  // Move the ball
  ball.x += ballSpeedX;
  ball.y += ballSpeedY;

  // Ball collision with top/bottom
  if (ball.y + ballSize > canvas.height || ball.y - ballSize < 0) {
    ballSpeedY = -ballSpeedY;
  }

  // Ball collision with paddles
  if (
    (ball.x - ballSize < player.x + paddleWidth && ball.y > player.y && ball.y < player.y + paddleHeight) ||
    (ball.x + ballSize > computer.x && ball.y > computer.y && ball.y < computer.y + paddleHeight)
  ) {
    ballSpeedX = -ballSpeedX;
    hits++;
    
    // Add some randomness to the ball speed
    ballSpeedY += (Math.random() - 0.5) * 2;

    // Increase speed after a certain number of hits
    if (hits % speedIncreaseInterval === 0) {
      ballSpeedX *= 1.1; // Increase horizontal speed by 10%
      ballSpeedY *= 1.1; // Increase vertical speed by 10%
    }
  }

  // Score update
  if (ball.x + ballSize < 0) {
    computerScore++;
    resetBall();
  } else if (ball.x - ballSize > canvas.width) {
    playerScore++;
    resetBall();
  }

  // Computer AI
  if (ball.y > computer.y + paddleHeight / 2) {
    computer.y += paddleSpeed;
  } else {
    computer.y -= paddleSpeed;
  }

  // Limit computer paddle movement
  if (computer.y < 0) computer.y = 0;
  if (computer.y + paddleHeight > canvas.height) computer.y = canvas.height - paddleHeight;

  // Control player paddle using keyboard
  if (upPressed && player.y > 0) {
    player.y -= paddleSpeed;
  }
  if (downPressed && player.y + paddleHeight < canvas.height) {
    player.y += paddleSpeed;
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ballSpeedX = ballSpeedX > 0 ? 4 : -4; // Reset ball speed
  ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1); // Randomize initial vertical direction
  hits = 0; // Reset hits after scoring
}

function gameLoop() {
  draw();
  update();
  requestAnimationFrame(gameLoop);
}

// Control the player paddle with mouse
document.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = event.clientY - rect.top;
  player.y = mouseY - paddleHeight / 2;

  // Limit player paddle movement
  if (player.y < 0) player.y = 0;
  if (player.y + paddleHeight > canvas.height) player.y = canvas.height - paddleHeight;
});

// Control the player paddle with keyboard
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' || event.key === 'w') {
    upPressed = true;
  }
  if (event.key === 'ArrowDown' || event.key === 's') {
    downPressed = true;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowUp' || event.key === 'w') {
    upPressed = false;
  }
  if (event.key === 'ArrowDown' || event.key === 's') {
    downPressed = false;
  }
});

// Touch controls for mobile
canvas.addEventListener('touchstart', (event) => {
  const rect = canvas.getBoundingClientRect();
  const touchY = event.touches[0].clientY - rect.top;
  player.y = touchY - paddleHeight / 2;

  // Limit player paddle movement
  if (player.y < 0) player.y = 0;
  if (player.y + paddleHeight > canvas.height) player.y = canvas.height - paddleHeight;
});

canvas.addEventListener('touchmove', (event) => {
  const rect = canvas.getBoundingClientRect();
  const touchY = event.touches[0].clientY - rect.top;
  player.y = touchY - paddleHeight / 2;

  // Limit player paddle movement
  if (player.y < 0) player.y = 0;
  if (player.y + paddleHeight > canvas.height) player.y = canvas.height - paddleHeight;

  event.preventDefault(); // Prevent scrolling
});

gameLoop();