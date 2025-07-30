// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameStatusElement = document.getElementById('gameStatus');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

// Game state
let gameRunning = false;
let score = 0;
let lives = 3;
let gameLoop;

// Grid settings
const GRID_SIZE = 20;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const COLS = CANVAS_WIDTH / GRID_SIZE;
const ROWS = CANVAS_HEIGHT / GRID_SIZE;

// Maze layout (1 = wall, 0 = dot, 2 = empty space)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,1,1],
    [2,2,2,2,2,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,2,2,2,2,2],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,2,2,2,2,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,0,1,1,0,1,2,2,2,2,2,2,2,2,1,0,1,1,0,1,1,1,1,1,1],
    [2,2,2,2,2,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,2,2,2,2,2],
    [1,1,1,1,1,1,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Pac-Man object
const pacman = {
    x: 14,
    y: 21,
    direction: 'right',
    nextDirection: 'right',
    mouthAngle: 0
};

// Ghost objects
const ghosts = [
    {
        x: 14,
        y: 11,
        direction: 'up',
        color: '#ff0000', // Red
        name: 'Blinky'
    },
    {
        x: 13,
        y: 11,
        direction: 'down',
        color: '#ffb8ff', // Pink
        name: 'Pinky'
    },
    {
        x: 15,
        y: 11,
        direction: 'left',
        color: '#00ffff', // Cyan
        name: 'Inky'
    },
    {
        x: 14,
        y: 12,
        direction: 'right',
        color: '#ffb852', // Orange
        name: 'Clyde'
    }
];

// Count total dots for win condition
let totalDots = 0;
let dotsEaten = 0;

// Initialize the game
function initGame() {
    score = 0;
    lives = 3;
    dotsEaten = 0;
    totalDots = 0;
    
    // Reset positions
    pacman.x = 14;
    pacman.y = 21;
    pacman.direction = 'right';
    pacman.nextDirection = 'right';
    
    // Reset ghost positions
    ghosts[0].x = 14; ghosts[0].y = 11; ghosts[0].direction = 'up';
    ghosts[1].x = 13; ghosts[1].y = 11; ghosts[1].direction = 'down';
    ghosts[2].x = 15; ghosts[2].y = 11; ghosts[2].direction = 'left';
    ghosts[3].x = 14; ghosts[3].y = 12; ghosts[3].direction = 'right';
    
    // Count total dots
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (maze[row][col] === 0) {
                totalDots++;
            }
        }
    }
    
    updateDisplay();
    drawGame();
}

// Update score and lives display
function updateDisplay() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
}

// Draw the entire game
function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#000033';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw maze and dots
    drawMaze();
    
    // Draw Pac-Man
    drawPacman();
    
    // Draw ghosts
    drawGhosts();
}

// Draw maze walls and dots
function drawMaze() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const x = col * GRID_SIZE;
            const y = row * GRID_SIZE;
            
            if (maze[row][col] === 1) {
                // Draw wall
                ctx.fillStyle = '#006600';
                ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);
                
                // Add wall border effect
                ctx.strokeStyle = '#00aa00';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, GRID_SIZE, GRID_SIZE);
            } else if (maze[row][col] === 0) {
                // Draw dot
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(x + GRID_SIZE / 2, y + GRID_SIZE / 2, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// Draw Pac-Man with animated mouth
function drawPacman() {
    const x = pacman.x * GRID_SIZE + GRID_SIZE / 2;
    const y = pacman.y * GRID_SIZE + GRID_SIZE / 2;
    const radius = GRID_SIZE / 2 - 2;
    
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    
    // Calculate mouth angle based on direction
    let startAngle = 0;
    let endAngle = Math.PI * 2;
    
    if (gameRunning) {
        const mouthSize = 0.8; // Size of mouth opening
        
        switch (pacman.direction) {
            case 'right':
                startAngle = pacman.mouthAngle * mouthSize;
                endAngle = Math.PI * 2 - pacman.mouthAngle * mouthSize;
                break;
            case 'left':
                startAngle = Math.PI - pacman.mouthAngle * mouthSize;
                endAngle = Math.PI + pacman.mouthAngle * mouthSize;
                break;
            case 'up':
                startAngle = Math.PI * 1.5 - pacman.mouthAngle * mouthSize;
                endAngle = Math.PI * 1.5 + pacman.mouthAngle * mouthSize;
                break;
            case 'down':
                startAngle = Math.PI * 0.5 - pacman.mouthAngle * mouthSize;
                endAngle = Math.PI * 0.5 + pacman.mouthAngle * mouthSize;
                break;
        }
    }
    
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.lineTo(x, y);
    ctx.fill();
    
    // Animate mouth
    pacman.mouthAngle += 0.3;
    if (pacman.mouthAngle > 1) pacman.mouthAngle = 0;
}

// Draw all ghosts with improved design
function drawGhosts() {
    ghosts.forEach(ghost => {
        const x = ghost.x * GRID_SIZE + GRID_SIZE / 2;
        const y = ghost.y * GRID_SIZE + GRID_SIZE / 2;
        const radius = GRID_SIZE / 2 - 2;
        
        // Ghost body with gradient effect
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        // Top rounded part
        ctx.arc(x, y - radius / 3, radius, Math.PI, 0, false);
        // Main body rectangle
        ctx.rect(x - radius, y - radius / 3, radius * 2, radius * 1.2);
        ctx.fill();
        
        // Ghost bottom wavy edge with more detail
        ctx.beginPath();
        ctx.moveTo(x - radius, y + radius * 0.9);
        for (let i = 0; i <= 6; i++) {
            const waveX = x - radius + (i * radius / 3);
            const waveY = y + radius * 0.9 - (i % 2) * 6;
            ctx.lineTo(waveX, waveY);
        }
        ctx.lineTo(x + radius, y - radius / 3);
        ctx.lineTo(x - radius, y - radius / 3);
        ctx.fill();
        
        // Ghost eyes (larger and more expressive)
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(x - radius / 2.5, y - radius / 3, radius / 4, radius / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + radius / 2.5, y - radius / 3, radius / 4, radius / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye pupils that look towards Pac-Man
        const dx = pacman.x - ghost.x;
        const dy = pacman.y - ghost.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const pupilOffset = Math.min(3, distance * 0.5);
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(x - radius / 2.5 + (dx / distance) * pupilOffset, y - radius / 3 + (dy / distance) * pupilOffset, radius / 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + radius / 2.5 + (dx / distance) * pupilOffset, y - radius / 3 + (dy / distance) * pupilOffset, radius / 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Add highlight to make ghosts look more 3D
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x - radius / 3, y - radius / 2, radius / 3, radius / 4, 0, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Check if position is valid (not a wall)
function isValidPosition(x, y) {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
        return false;
    }
    return maze[y][x] !== 1;
}

// Move Pac-Man
function movePacman() {
    let newX = pacman.x;
    let newY = pacman.y;
    
    // Try to change direction if a new direction is queued
    let testX = pacman.x;
    let testY = pacman.y;
    
    switch (pacman.nextDirection) {
        case 'up': testY--; break;
        case 'down': testY++; break;
        case 'left': testX--; break;
        case 'right': testX++; break;
    }
    
    if (isValidPosition(testX, testY)) {
        pacman.direction = pacman.nextDirection;
    }
    
    // Move in current direction
    switch (pacman.direction) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
    }
    
    // Tunnel effect (wrap around horizontally)
    if (newX < 0) newX = COLS - 1;
    if (newX >= COLS) newX = 0;
    
    if (isValidPosition(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;
        
        // Check if Pac-Man eats a dot
        if (maze[newY][newX] === 0) {
            maze[newY][newX] = 2; // Remove dot
            score += 10;
            dotsEaten++;
            updateDisplay();
            
            // Check win condition
            if (dotsEaten >= totalDots) {
                winGame();
            }
        }
    }
}

// Move all ghosts with enhanced AI
function moveGhosts() {
    ghosts.forEach((ghost, index) => {
        const directions = ['up', 'down', 'left', 'right'];
        let possibleMoves = [];
        
        // Find all valid moves for this ghost
        for (let dir of directions) {
            let newX = ghost.x;
            let newY = ghost.y;
            
            switch (dir) {
                case 'up': newY--; break;
                case 'down': newY++; break;
                case 'left': newX--; break;
                case 'right': newX++; break;
            }
            
            // Tunnel effect for ghosts
            if (newX < 0) newX = COLS - 1;
            if (newX >= COLS) newX = 0;
            
            if (isValidPosition(newX, newY)) {
                possibleMoves.push({direction: dir, x: newX, y: newY});
            }
        }
        
        if (possibleMoves.length > 0) {
            let bestMove = possibleMoves[0];
            let targetX = pacman.x;
            let targetY = pacman.y;
            
            // Different AI behavior for each ghost
            switch (index) {
                case 0: // Blinky (Red) - Direct chase
                    break;
                case 1: // Pinky (Pink) - Ambush 4 tiles ahead of Pac-Man
                    switch (pacman.direction) {
                        case 'up': targetY -= 4; break;
                        case 'down': targetY += 4; break;
                        case 'left': targetX -= 4; break;
                        case 'right': targetX += 4; break;
                    }
                    break;
                case 2: // Inky (Cyan) - Complex behavior, targets area relative to Blinky
                    const blinky = ghosts[0];
                    targetX = pacman.x + (pacman.x - blinky.x);
                    targetY = pacman.y + (pacman.y - blinky.y);
                    break;
                case 3: // Clyde (Orange) - Chase when far, flee when close
                    const distanceToPacman = Math.abs(ghost.x - pacman.x) + Math.abs(ghost.y - pacman.y);
                    if (distanceToPacman < 8) {
                        // Flee to corner when close
                        targetX = 0;
                        targetY = ROWS - 1;
                    }
                    break;
            }
            
            // Find best move towards target
            let minDistance = Infinity;
            for (let move of possibleMoves) {
                const distance = Math.abs(move.x - targetX) + Math.abs(move.y - targetY);
                if (distance < minDistance) {
                    minDistance = distance;
                    bestMove = move;
                }
            }
            
            // Add some randomness to make ghosts less predictable
            const randomness = index === 3 ? 0.7 : 0.85; // Clyde is more random
            if (Math.random() < randomness) {
                ghost.x = bestMove.x;
                ghost.y = bestMove.y;
                ghost.direction = bestMove.direction;
            } else {
                // Random move
                const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                ghost.x = randomMove.x;
                ghost.y = randomMove.y;
                ghost.direction = randomMove.direction;
            }
        }
    });
}

// Check collision between Pac-Man and any ghost
function checkCollision() {
    for (let ghost of ghosts) {
        if (pacman.x === ghost.x && pacman.y === ghost.y) {
            lives--;
            updateDisplay();
            
            if (lives <= 0) {
                gameOver();
            } else {
                // Reset positions
                pacman.x = 14;
                pacman.y = 21;
                ghosts[0].x = 14; ghosts[0].y = 11;
                ghosts[1].x = 13; ghosts[1].y = 11;
                ghosts[2].x = 15; ghosts[2].y = 11;
                ghosts[3].x = 14; ghosts[3].y = 12;
                
                // Brief pause
                gameRunning = false;
                setTimeout(() => {
                    if (lives > 0) gameRunning = true;
                }, 1000);
            }
            break; // Exit loop once collision is detected
        }
    }
}

// Game loop
function gameStep() {
    if (!gameRunning) return;
    
    movePacman();
    moveGhosts();
    checkCollision();
    drawGame();
}

// Start game
function startGame() {
    if (gameRunning) return;
    
    initGame();
    gameRunning = true;
    gameStatusElement.textContent = '';
    startButton.style.display = 'none';
    restartButton.style.display = 'inline-block';
    
    // Start game loop
    gameLoop = setInterval(gameStep, 200);
}

// Restart game
function restartGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    // Reset maze dots
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (maze[row][col] === 2) {
                maze[row][col] = 0; // Restore dots
            }
        }
    }
    
    startGame();
}

// Game over
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    gameStatusElement.textContent = 'GAME OVER!';
    gameStatusElement.className = 'game-status pulse';
    startButton.style.display = 'inline-block';
    restartButton.style.display = 'none';
}

// Win game
function winGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    gameStatusElement.textContent = 'YOU WIN!';
    gameStatusElement.className = 'game-status pulse';
    gameStatusElement.style.color = '#00ff00';
    startButton.style.display = 'inline-block';
    restartButton.style.display = 'none';
}

// Keyboard controls
document.addEventListener('keydown', (event) => {
    if (!gameRunning) return;
    
    switch (event.key) {
        case 'ArrowUp':
            pacman.nextDirection = 'up';
            event.preventDefault();
            break;
        case 'ArrowDown':
            pacman.nextDirection = 'down';
            event.preventDefault();
            break;
        case 'ArrowLeft':
            pacman.nextDirection = 'left';
            event.preventDefault();
            break;
        case 'ArrowRight':
            pacman.nextDirection = 'right';
            event.preventDefault();
            break;
    }
});

// Initialize the game display
initGame();
