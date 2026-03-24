// script.js
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

let gameMode = 0, animId;
let score1 = 0, score2 = 0;

const paddle = { w: 12, h: 80, speed: 6 };
let p1 = { x: 20, y: 160 };
let p2 = { x: 768, y: 160 };
let ball = { x: 400, y: 200, vx: 5, vy: 3, size: 10 };
let keys = {};

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function startGame(mode) {
    gameMode = mode;
    resetGame();
    if (animId) cancelAnimationFrame(animId);
    loop();
}

function resetGame() {
    score1 = 0; score2 = 0;
    document.getElementById('score1').textContent = 0;
    document.getElementById('score2').textContent = 0;
    resetBall();
}

function resetBall() {
    ball = { x: 400, y: 200, vx: (Math.random() > 0.5 ? 5 : -5), vy: (Math.random() * 4 - 2), size: 10 };
    p1.y = 160; p2.y = 160;
}

function movePaddles() {
    // Player 1: W/S
    if (keys['w'] && p1.y > 0) p1.y -= paddle.speed;
    if (keys['s'] && p1.y < canvas.height - paddle.h) p1.y += paddle.speed;

    // Player 2 or AI
    if (gameMode === 2) {
        if (keys['ArrowUp'] && p2.y > 0) p2.y -= paddle.speed;
        if (keys['ArrowDown'] && p2.y < canvas.height - paddle.h) p2.y += paddle.speed;
    } else {
        // AI tracking
        let center = p2.y + paddle.h / 2;
        if (center < ball.y - 10) p2.y += paddle.speed * 0.85;
        if (center > ball.y + 10) p2.y -= paddle.speed * 0.85;
    }
}

function moveBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top/bottom bounce
    if (ball.y <= 0 || ball.y >= canvas.height - ball.size) ball.vy *= -1;

    // Paddle collisions
    if (ball.x <= p1.x + paddle.w && ball.y >= p1.y && ball.y <= p1.y + paddle.h) {
        ball.vx = Math.abs(ball.vx) * 1.05;
        ball.vy += (ball.y - (p1.y + paddle.h/2)) * 0.1;
    }
    if (ball.x >= p2.x - ball.size && ball.y >= p2.y && ball.y <= p2.y + paddle.h) {
        ball.vx = -Math.abs(ball.vx) * 1.05;
        ball.vy += (ball.y - (p2.y + paddle.h/2)) * 0.1;
    }

    // Scoring
    if (ball.x < 0) {
        score2++;
        document.getElementById('score2').textContent = score2;
        resetBall();
    }
    if (ball.x > canvas.width) {
        score1++;
        document.getElementById('score1').textContent = score1;
        resetBall();
    }
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center line
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(400, 0);
    ctx.lineTo(400, 400);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddles
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(p1.x, p1.y, paddle.w, paddle.h);
    ctx.fillRect(p2.x, p2.y, paddle.w, paddle.h);

    // Ball
    ctx.fillStyle = '#fff';
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

    // Start prompt
    if (gameMode === 0) {
        ctx.fillStyle = '#00ff88';
        ctx.font = '24px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('Click 1 Player or 2 Players to Start!', 400, 200);
    }
}

function loop() {
    movePaddles();
    moveBall();
    draw();
    animId = requestAnimationFrame(loop);
}

// Draw initial screen
draw();
