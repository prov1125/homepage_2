const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 캔버스 크기 설정
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 플레이어 객체
const player = {
    x: 50,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    jumping: false,
    draw: function() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    update: function() {
        // 중력 적용
        this.dy += this.gravity;
        this.x += this.dx;
        this.y += this.dy;

        // 바닥에 닿았을 때
        if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height;
            this.dy = 0;
            this.jumping = false;
        }

        // 기본 충돌 감지
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;

        this.draw();
    }
};

let platforms = [];
let currentStage = 0;

function loadStage(stageData) {
    platforms = stageData.platforms;
    player.x = stageData.playerStart.x;
    player.y = stageData.playerStart.y;
}

function drawPlatforms() {
    ctx.fillStyle = 'green';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function checkPlatformCollision() {
    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y) {

            player.y = platform.y - player.height;
            player.dy = 0;
            player.jumping = false;
        }
    });
}

function loadStages() {
    fetch('stages.json')
        .then(response => response.json())
        .then(data => {
            loadStage(data[currentStage]);
        });
}

const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys['ArrowRight']) {
        player.dx = player.speed;
    } else if (keys['ArrowLeft']) {
        player.dx = -player.speed;
    } else {
        player.dx = 0;
    }

    if (keys['Space'] && !player.jumping) {
        player.dy = player.jumpPower;
        player.jumping = true;
    }

    player.update();
    drawPlatforms();
    checkPlatformCollision();

    requestAnimationFrame(gameLoop);
}

// 게임 시작
loadStages();
gameLoop();
