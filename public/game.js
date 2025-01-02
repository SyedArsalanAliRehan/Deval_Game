// Setting up the game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state variables
let character = { x: 50, y: 500, width: 30, height: 30, speed: 5, isAttacking: false };
let dragons = [];
let dragonsKilled = 0;
let roomsCleared = 0;
let currentRoom = 1;

// Character and Dragon Colors
const characterColor = '#FF0000';
const dragonColor = '#008000';

// Function to spawn dragons in random positions
function spawnDragon() {
    let dragon = {
        x: Math.random() * (canvas.width - 50) + 100,
        y: Math.random() * (canvas.height - 50) + 100,
        width: 40,
        height: 40,
        isDead: false
    };
    dragons.push(dragon);
}

// Draw the character
function drawCharacter() {
    ctx.fillStyle = characterColor;
    ctx.fillRect(character.x, character.y, character.width, character.height);
}

// Draw dragons
function drawDragons() {
    dragons.forEach(dragon => {
        if (!dragon.isDead) {
            ctx.fillStyle = dragonColor;
            ctx.fillRect(dragon.x, dragon.y, dragon.width, dragon.height);
        }
    });
}

// Check for collisions with dragons
function checkCollision() {
    dragons.forEach(dragon => {
        if (!dragon.isDead &&
            character.x < dragon.x + dragon.width &&
            character.x + character.width > dragon.x &&
            character.y < dragon.y + dragon.height &&
            character.y + character.height > dragon.y) {
                dragon.isDead = true;
                dragonsKilled++;
                document.getElementById('dragonsKilled').innerText = dragonsKilled;
        }
    });
}

// Handle character movement
function moveCharacter(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (character.y > 0) character.y -= character.speed;
            break;
        case 'ArrowDown':
            if (character.y + character.height < canvas.height) character.y += character.speed;
            break;
        case 'ArrowLeft':
            if (character.x > 0) character.x -= character.speed;
            break;
        case 'ArrowRight':
            if (character.x + character.width < canvas.width) character.x += character.speed;
            break;
        case ' ':
            character.isAttacking = true;
            checkCollision();
            break;
    }
}

// Handle game logic updates
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw character and dragons
    drawCharacter();
    drawDragons();

    // Check if all dragons are dead (room cleared)
    if (dragons.every(dragon => dragon.isDead)) {
        roomsCleared++;
        document.getElementById('roomsCleared').innerText = roomsCleared;
        dragons = [];
        spawnDragon();
        spawnDragon();
    }

    requestAnimationFrame(updateGame);
}

// Spawn the first set of dragons
spawnDragon();
spawnDragon();

// Start the game loop
updateGame();

// Listen for key presses
window.addEventListener('keydown', moveCharacter);

