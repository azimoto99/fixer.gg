// Cyberpunk Roguelike - Main Game File
// Step 9: Menus & Character Selection

// Character definitions (similar to Nuclear Throne)
const characters = {
    fixer: {
        name: 'FIXER',
        description: 'Balanced cybernetic operative',
        color: 0x00ffff,
        stats: {
            maxHealth: 100,
            speed: 200,
            damage: 1.0,
            fireRate: 1.0,
            bulletSpeed: 1.0
        },
        passive: 'None'
    },
    reaper: {
        name: 'REAPER',
        description: 'High damage, low health assassin',
        color: 0xff0000,
        stats: {
            maxHealth: 70,
            speed: 220,
            damage: 1.5,
            fireRate: 0.9,
            bulletSpeed: 1.1
        },
        passive: '+50% Damage, -30% Health'
    },
    tank: {
        name: 'TANK',
        description: 'Heavy armor, slow but durable',
        color: 0x666666,
        stats: {
            maxHealth: 150,
            speed: 160,
            damage: 0.9,
            fireRate: 0.8,
            bulletSpeed: 0.9
        },
        passive: '+50% Health, -20% Speed'
    },
    scout: {
        name: 'SCOUT',
        description: 'Fast and agile, low health',
        color: 0x00ff00,
        stats: {
            maxHealth: 80,
            speed: 250,
            damage: 0.9,
            fireRate: 1.2,
            bulletSpeed: 1.2
        },
        passive: '+25% Speed, +20% Fire Rate'
    },
    sniper: {
        name: 'SNIPER',
        description: 'High damage, slow fire rate',
        color: 0xffff00,
        stats: {
            maxHealth: 90,
            speed: 180,
            damage: 1.8,
            fireRate: 0.6,
            bulletSpeed: 1.3
        },
        passive: '+80% Damage, -40% Fire Rate'
    },
    berserker: {
        name: 'BERSERKER',
        description: 'Gains power when damaged',
        color: 0xff6600,
        stats: {
            maxHealth: 100,
            speed: 210,
            damage: 1.0,
            fireRate: 1.0,
            bulletSpeed: 1.0
        },
        passive: '+10% Damage per 10% missing HP'
    }
};

// Global game data
let selectedCharacter = null;
let gameInstance = null;

// Initialize weapons before game starts
let weapons = {};
let currentWeapon;

function initializeWeapons() {
    weapons = {
        pistol: {
            name: 'Pistol',
            type: 'pistol',
            damage: 7,
            fireRate: 150, // ms between shots
            bulletSpeed: 600,
            color: 0xffff00
        },
        smg: {
            name: 'SMG',
            type: 'smg',
            damage: 4,
            fireRate: 80, // Very fast
            bulletSpeed: 650,
            color: 0x00ff00
        },
        shotgun: {
            name: 'Shotgun',
            type: 'shotgun',
            damage: 8,
            fireRate: 400, // Slow
            bulletSpeed: 500,
            color: 0xff6600,
            spread: 5 // Number of bullets
        },
        laser: {
            name: 'Laser',
            type: 'laser',
            damage: 3, // Per tick
            fireRate: 50, // Damage tick rate
            bulletSpeed: 0, // Not used for laser
            color: 0x00ffff
        }
    };
}

// Initialize weapons
initializeWeapons();

let player;
let cursors;
let wasdKeys;
let mousePointer;
let bullets;
let enemyBullets;
let enemies;
let enemyHealthBars;
let playerHealthBar;
let gameOverText;
let restartButton;
let lastFired = 0;
let bulletSpeed = 600;
let playerSpeed = 200;
let bulletDamage = 7; // 5-10 damage per bullet
let enemyBulletSpeed = 400;
let enemyBulletDamage = 10;
let playerMaxHealth = 100;
let playerHealth = 100;
let isGameOver = false;
let gameScene;
let currentRoom = 1;
let roomCounterText;
let exitPortal;
let roomWalls;
let roomObstacles;
let isRoomCleared = false;
let currentRoomTemplate = 0;
let playerXP = 0;
let playerLevel = 1;
let xpToNextLevel = 100;
let activeMutations = [];
let isLevelUpScreen = false;
let levelUpOverlay;
let mutationButtons = [];
let mutationTexts = [];
let levelText;
let xpText;
let mutationsDisplay;
let floorText;
let basePlayerSpeed = 200;
let baseBulletDamage = 7;
let baseFireRate = 150;
let baseBulletSpeed = 600;
let healthRegenTimer = 0;
let weaponPickups;
let healthPickups;
let weaponText;
let laserBeam;
let laserActive = false;
let laserTimer = 0;
let totalEnemiesKilled = 0;
let gameStartTime = 0;
let     gameStats = {
        floorsCleared: 0,
        enemiesKilled: 0,
        timeSurvived: 0,
        mutationsCollected: 0,
        finalLevel: 1
    };

// Polish system variables
let hitParticles;
let hitParticleEmitter;
let deathParticles;
let deathParticleEmitter;
let muzzleFlashParticles;
let muzzleFlashEmitter;
let damageNumbers;
let cameraShake = { x: 0, y: 0, intensity: 0, offsetX: 0, offsetY: 0 };
let screenFlash = null;
let playerInvincible = false;
let playerInvincibleUntil = 0;

// Procedural map system - Binding of Isaac style (screen-sized rooms)
let roomWidth = 800; // Each room is screen size
let roomHeight = 600;
let worldWidth = 3200; // 4 rooms wide (800 * 4)
let worldHeight = 2400; // 4 rooms tall (600 * 4)
let generatedMap = null;
let mapRooms = [];
let mapCorridors = [];
let allWalls = null;
let allObstacles = null;
let minimap = null;
let minimapGraphics = null;
let exploredAreas = new Set(); // Track explored areas for minimap
let enemyStates = new Map(); // Track enemy AI states: 'patrol', 'alert', 'combat'

// Floor system
let currentFloor = 1;
let maxFloors = 100;
let currentRoomId = null; // Track which room player is in
let roomDoors = new Map(); // Map of room ID to door objects
let clearedRooms = new Set(); // Track cleared rooms
let bossRoomId = null; // ID of the boss room for current floor
let allDoors = null; // Group containing all doors
let floorTransitionActive = false;

// Augment system
let activeAugments = [];
let augmentSelectionActive = false;
let augmentSelectionOverlay = null;
let augmentButtons = [];
let availableAugments = [];

// ========== MAIN MENU SCENE ==========
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        // Create menu background
        const bgGraphics = this.add.graphics();
        bgGraphics.fillStyle(0x0a0a0a);
        bgGraphics.fillRect(0, 0, 800, 600);
        bgGraphics.generateTexture('menuBg', 800, 600);
    }

    create() {
        // Background
        this.add.image(400, 300, 'menuBg');
        createCyberpunkBackground(this);

        // Title
        const title = this.add.text(400, 150, 'FIXER.GG', {
            fontSize: '64px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        title.setOrigin(0.5);

        // Subtitle
        const subtitle = this.add.text(400, 220, 'CYBERPUNK ROGUELIKE', {
            fontSize: '24px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 2
        });
        subtitle.setOrigin(0.5);

        // Start button
        const startButton = this.add.rectangle(400, 350, 300, 60, 0x00ffff);
        startButton.setStrokeStyle(2, 0xffffff, 1);
        startButton.setInteractive({ useHandCursor: true });

        const startText = this.add.text(400, 350, 'START', {
            fontSize: '32px',
            fill: '#000000',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });
        startText.setOrigin(0.5);

        // Button hover effects
        startButton.on('pointerover', () => {
            startButton.setFillStyle(0x00ffff, 0.8);
        });
        startButton.on('pointerout', () => {
            startButton.setFillStyle(0x00ffff, 1);
        });
        startButton.on('pointerdown', () => {
            this.scene.start('CharacterSelectScene');
        });

        // Instructions
        const instructions = this.add.text(400, 480, 'WASD/Arrows: Move | Mouse: Aim | Click: Shoot', {
            fontSize: '16px',
            fill: '#888888',
            fontFamily: 'Courier New'
        });
        instructions.setOrigin(0.5);

        // High score display
        const highScore = getHighScore();
        if (highScore > 0) {
            const highScoreText = this.add.text(400, 520, `HIGH SCORE: ${highScore}`, {
                fontSize: '18px',
                fill: '#ffff00',
                fontFamily: 'Courier New',
                fontStyle: 'bold'
            });
            highScoreText.setOrigin(0.5);
        }
    }
}

// ========== CHARACTER SELECT SCENE ==========
class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterSelectScene' });
    }

    create() {
        // Background
        this.add.image(400, 300, 'menuBg');
        createCyberpunkBackground(this);

        // Title
        const title = this.add.text(400, 50, 'SELECT CHARACTER', {
            fontSize: '36px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        title.setOrigin(0.5);

        // Character selection grid
        const characterKeys = Object.keys(characters);
        const cols = 3;
        const startX = 200;
        const startY = 150;
        const spacingX = 200;
        const spacingY = 150;
        let selectedIndex = 0;

        const characterButtons = [];
        const characterPreviews = [];

        characterKeys.forEach((key, index) => {
            const char = characters[key];
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * spacingX;
            const y = startY + row * spacingY;

            // Character preview circle
            const preview = this.add.circle(x, y, 30, char.color, 0.8);
            preview.setStrokeStyle(3, char.color, 1);
            preview.setInteractive({ useHandCursor: true });
            characterPreviews.push(preview);

            // Character name
            const nameText = this.add.text(x, y + 50, char.name, {
                fontSize: '16px',
                fill: '#00ffff',
                fontFamily: 'Courier New',
                fontStyle: 'bold'
            });
            nameText.setOrigin(0.5);

            // Description
            const descText = this.add.text(x, y + 70, char.description, {
                fontSize: '12px',
                fill: '#888888',
                fontFamily: 'Courier New'
            });
            descText.setOrigin(0.5);

            // Passive ability
            const passiveText = this.add.text(x, y + 85, char.passive, {
                fontSize: '10px',
                fill: '#ffff00',
                fontFamily: 'Courier New'
            });
            passiveText.setOrigin(0.5);

            // Stats display
            const statsText = this.add.text(x, y + 100, 
                `HP: ${char.stats.maxHealth} | SPD: ${char.stats.speed}`, {
                fontSize: '10px',
                fill: '#00ff00',
                fontFamily: 'Courier New'
            });
            statsText.setOrigin(0.5);

            // Button interaction
            preview.on('pointerover', () => {
                preview.setScale(1.2);
                preview.setFillStyle(char.color, 1);
            });
            preview.on('pointerout', () => {
                if (selectedIndex !== index) {
                    preview.setScale(1);
                    preview.setFillStyle(char.color, 0.8);
                }
            });
            preview.on('pointerdown', () => {
                // Deselect previous
                if (selectedIndex >= 0) {
                    const prevChar = characterKeys[selectedIndex];
                    characterPreviews[selectedIndex].setScale(1);
                    characterPreviews[selectedIndex].setFillStyle(characters[prevChar].color, 0.8);
                }
                // Select new
                selectedIndex = index;
                preview.setScale(1.2);
                preview.setFillStyle(char.color, 1);
                selectedCharacter = key;
            });

            characterButtons.push({ preview, nameText, descText, passiveText, statsText });
        });

        // Select first character by default
        if (characterPreviews.length > 0) {
            selectedIndex = 0;
            selectedCharacter = characterKeys[0];
            characterPreviews[0].setScale(1.2);
            characterPreviews[0].setFillStyle(characters[characterKeys[0]].color, 1);
        }

        // Start game button
        const startButton = this.add.rectangle(400, 500, 250, 50, 0x00ffff);
        startButton.setStrokeStyle(2, 0xffffff, 1);
        startButton.setInteractive({ useHandCursor: true });

        const startText = this.add.text(400, 500, 'START GAME', {
            fontSize: '24px',
            fill: '#000000',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });
        startText.setOrigin(0.5);

        startButton.on('pointerover', () => {
            startButton.setFillStyle(0x00ffff, 0.8);
        });
        startButton.on('pointerout', () => {
            startButton.setFillStyle(0x00ffff, 1);
        });
        startButton.on('pointerdown', () => {
            console.log('Start button clicked, selectedCharacter:', selectedCharacter);
            if (selectedCharacter) {
                console.log('Starting GameScene...');
                this.scene.start('GameScene');
            } else {
                console.warn('No character selected!');
            }
        });

        // Back button
        const backButton = this.add.text(50, 550, 'BACK', {
            fontSize: '18px',
            fill: '#888888',
            fontFamily: 'Courier New'
        });
        backButton.setInteractive({ useHandCursor: true });
        backButton.on('pointerover', () => {
            backButton.setFill('#00ffff');
        });
        backButton.on('pointerout', () => {
            backButton.setFill('#888888');
        });
        backButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}

// ========== GAME SCENE ==========
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Create enhanced player sprite with glow
        const playerGraphics = this.add.graphics();
        playerGraphics.fillStyle(0x00ffff, 1);
        playerGraphics.fillCircle(16, 16, 16);
        playerGraphics.fillStyle(0xffffff, 0.5);
        playerGraphics.fillCircle(16, 16, 12);
        playerGraphics.lineStyle(2, 0x00ffff, 1);
        playerGraphics.strokeCircle(16, 16, 16);
        playerGraphics.generateTexture('player', 32, 32);
        
        // Create enhanced bullet with glow
        const bulletGraphics = this.add.graphics();
        bulletGraphics.fillStyle(0xffff00, 1);
        bulletGraphics.fillCircle(4, 4, 4);
        bulletGraphics.fillStyle(0xffffff, 0.8);
        bulletGraphics.fillCircle(4, 4, 2);
        bulletGraphics.generateTexture('bullet', 8, 8);
        
        // Create enemy bullet texture (red)
        this.add.graphics()
            .fillStyle(0xff0000)
            .fillCircle(4, 4, 4)
            .generateTexture('enemyBullet', 8, 8);
        
        // Create enemy textures with different colors
        const enemyColors = [0xff0000, 0xff00ff, 0xff6600, 0xcc00ff, 0xff0066];
        enemyColors.forEach((color, index) => {
            this.add.graphics()
                .fillStyle(color)
                .fillCircle(12, 12, 12)
                .generateTexture(`enemy_${index}`, 24, 24);
        });
        
        // Create health bar background
        this.add.graphics()
            .fillStyle(0x000000)
            .fillRect(0, 0, 30, 4)
            .generateTexture('healthBarBg', 30, 4);
        
        // Create health bar fill
        this.add.graphics()
            .fillStyle(0x00ff00)
            .fillRect(0, 0, 30, 4)
            .generateTexture('healthBarFill', 30, 4);
        
        // Create player health bar (larger)
        this.add.graphics()
            .fillStyle(0x000000)
            .fillRect(0, 0, 200, 8)
            .generateTexture('playerHealthBarBg', 200, 8);
        
        this.add.graphics()
            .fillStyle(0x00ff00)
            .fillRect(0, 0, 200, 8)
            .generateTexture('playerHealthBarFill', 200, 8);
        
        // Create portal texture (animated glowing circle)
        const portalGraphics = this.add.graphics();
        portalGraphics.lineStyle(3, 0x00ffff, 1);
        portalGraphics.fillStyle(0x00ffff, 0.3);
        portalGraphics.fillCircle(20, 20, 20);
        portalGraphics.strokeCircle(20, 20, 20);
        portalGraphics.lineStyle(2, 0xffffff, 0.8);
        portalGraphics.strokeCircle(20, 20, 15);
        portalGraphics.generateTexture('portal', 40, 40);
        
        // Create weapon pickup texture
        this.add.graphics()
            .fillStyle(0xffff00)
            .fillRect(0, 0, 16, 16)
            .generateTexture('weaponPickup', 16, 16);
        
        // Create health pack texture
        this.add.graphics()
            .fillStyle(0x00ff00)
            .fillRect(0, 0, 16, 16)
            .generateTexture('healthPickup', 16, 16);
        
        // Create laser beam texture
        this.add.graphics()
            .fillStyle(0x00ffff)
            .fillRect(0, 0, 4, 100)
            .generateTexture('laserBeam', 4, 100);
        
        // Create obstacle textures (boxes and pillars)
        this.add.graphics()
            .fillStyle(0x666666)
            .fillRect(0, 0, 40, 40)
            .lineStyle(2, 0x00ffff, 0.5)
            .strokeRect(0, 0, 40, 40)
            .generateTexture('obstacleBox', 40, 40);
        
        this.add.graphics()
            .fillStyle(0x666666)
            .fillCircle(20, 20, 20)
            .lineStyle(2, 0x00ffff, 0.5)
            .strokeCircle(20, 20, 20)
            .generateTexture('obstaclePillar', 40, 40);
        
        // Create particle textures for polish effects
        const particleGraphics = this.add.graphics();
        particleGraphics.fillStyle(0xffffff, 1);
        particleGraphics.fillCircle(2, 2, 2);
        particleGraphics.generateTexture('particle', 4, 4);
        
        // Create spark particle
        const sparkGraphics = this.add.graphics();
        sparkGraphics.fillStyle(0xffff00, 1);
        sparkGraphics.fillRect(1, 1, 2, 4);
        sparkGraphics.generateTexture('spark', 4, 6);
        
        // Create hit particle
        const hitGraphics = this.add.graphics();
        hitGraphics.fillStyle(0xff6600, 1);
        hitGraphics.fillCircle(2, 2, 2);
        hitGraphics.fillStyle(0xffffff, 0.8);
        hitGraphics.fillCircle(2, 2, 1);
        hitGraphics.generateTexture('hitParticle', 4, 4);
    }

    create() {
        console.log('GameScene.create() called');
        try {
            // Initialize game with selected character
            if (!selectedCharacter) {
                console.log('No character selected, using default');
                selectedCharacter = 'fixer'; // Default
            }
            
            console.log('Selected character:', selectedCharacter);
            const char = characters[selectedCharacter];
            if (!char) {
                console.error('Invalid character:', selectedCharacter);
                this.scene.start('CharacterSelectScene');
                return;
            }
            
            console.log('Character loaded, initializing game...');
        
        // Apply character stats
        playerMaxHealth = char.stats.maxHealth;
        playerHealth = playerMaxHealth;
        basePlayerSpeed = char.stats.speed;
        baseBulletDamage = 7 * char.stats.damage;
        baseFireRate = 150 / char.stats.fireRate;
        baseBulletSpeed = 600 * char.stats.bulletSpeed;
        
        // Update player sprite color based on character
        const playerGraphics = this.add.graphics();
        playerGraphics.fillStyle(char.color, 1);
        playerGraphics.fillCircle(16, 16, 16);
        playerGraphics.fillStyle(0xffffff, 0.5);
        playerGraphics.fillCircle(16, 16, 12);
        playerGraphics.lineStyle(2, char.color, 1);
        playerGraphics.strokeCircle(16, 16, 16);
        playerGraphics.generateTexture('player', 32, 32);
        
        // Continue with existing create logic...
        gameScene = this;
        isGameOver = false;
        currentRoom = 1;
        isRoomCleared = false;
        playerXP = 0;
        playerLevel = 1;
        xpToNextLevel = 100;
        activeMutations = [];
        isLevelUpScreen = false;
        totalEnemiesKilled = 0;
        gameStartTime = Date.now();
        playerInvincible = false;
        playerInvincibleUntil = 0;
        
        // Initialize floor system - reset to floor 1 for new game
        currentFloor = 1;
        clearedRooms.clear();
        currentRoomId = 0; // Start in first room
        floorTransitionActive = false;
        activeAugments = []; // Reset augments for new game
        
        // Set world bounds for larger map
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        
        // Create procedural map
        createProceduralMap(this);
        
        // Create cyberpunk background grid (scaled for larger world)
        createCyberpunkBackground(this);
        
        // Create player at first room center
        if (!mapRooms || mapRooms.length === 0) {
            console.error('Map rooms not initialized!');
            return;
        }
        const firstRoom = mapRooms[0];
        player = this.physics.add.sprite(firstRoom.centerX, firstRoom.centerY, 'player');
        player.setCollideWorldBounds(true);
        player.setScale(1.5);
        player.setDepth(10);
        
        // Polish: Add subtle glow effect to player
        const playerGlow = this.add.circle(firstRoom.centerX, firstRoom.centerY, 20, char.color, 0.2);
        playerGlow.setDepth(9);
        player.glow = playerGlow;
        
        // Set up camera for Binding of Isaac style (no following, room transitions)
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.setZoom(1);
        // Position camera at first room (0, 0)
        this.cameras.main.scrollX = 0;
        this.cameras.main.scrollY = 0;
        
        // Create bullets group
        bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 50
        });
        
        // Create enemy bullets group
        enemyBullets = this.physics.add.group({
            defaultKey: 'enemyBullet',
            maxSize: 30
        });
        
        // Create enemies group
        enemies = this.physics.add.group();
        
        // Create pickups groups
        weaponPickups = this.physics.add.group();
        healthPickups = this.physics.add.group();
        
        // Create health bars container
        enemyHealthBars = this.add.container(0, 0);
        
        // Initialize particle systems for polish
        // Particles are currently disabled to prevent freezes
        // Setting to null to avoid any particle-related errors
        hitParticles = null;
        hitParticleEmitter = null;
        deathParticles = null;
        deathParticleEmitter = null;
        muzzleFlashParticles = null;
        muzzleFlashEmitter = null;
        
        // Create damage numbers container
        damageNumbers = this.add.container(0, 0);
        damageNumbers.setDepth(200);
        
        // Set starting weapon
        currentWeapon = weapons.pistol;
        
        // Create player health bar (fixed to camera)
        const playerHealthBarBg = this.add.image(100, 30, 'playerHealthBarBg');
        const playerHealthBarFill = this.add.image(100, 30, 'playerHealthBarFill');
        playerHealthBarFill.setOrigin(0, 0.5);
        playerHealthBarBg.setOrigin(0, 0.5);
        playerHealthBarBg.setDepth(100);
        playerHealthBarFill.setDepth(100);
        playerHealthBarBg.setScrollFactor(0); // Fixed to camera
        playerHealthBarFill.setScrollFactor(0);
        playerHealthBar = {
            bg: playerHealthBarBg,
            fill: playerHealthBarFill
        };
        
        // Health text (fixed to camera)
        const healthLabel = this.add.text(10, 10, 'HP:', {
            fontSize: '16px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        });
        healthLabel.setDepth(100);
        healthLabel.setScrollFactor(0);
        
        // Character name display (fixed to camera)
        const charNameText = this.add.text(10, 30, char.name, {
            fontSize: '14px',
            fill: `#${char.color.toString(16).padStart(6, '0')}`,
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });
        charNameText.setDepth(100);
        charNameText.setScrollFactor(0);
        
        // Floor display (fixed to camera)
        floorText = this.add.text(400, 30, `FLOOR ${currentFloor}/100`, {
            fontSize: '28px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 3,
            fontStyle: 'bold'
        });
        floorText.setOrigin(0.5);
        floorText.setDepth(100);
        floorText.setScrollFactor(0);
        
        // Room counter text (fixed to camera)
        roomCounterText = this.add.text(400, 60, `ROOM ${currentRoomId !== null ? currentRoomId + 1 : 1}`, {
            fontSize: '18px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 2
        });
        roomCounterText.setOrigin(0.5);
        roomCounterText.setDepth(100);
        roomCounterText.setScrollFactor(0);
        
        // Weapon display text (fixed to camera)
        weaponText = this.add.text(10, 50, `WEAPON: ${currentWeapon.name}`, {
            fontSize: '16px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        });
        weaponText.setDepth(100);
        weaponText.setScrollFactor(0);
        
        // Level and XP display (fixed to camera)
        levelText = this.add.text(10, 70, `LEVEL: ${playerLevel}`, {
            fontSize: '16px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        });
        levelText.setDepth(100);
        levelText.setScrollFactor(0);
        
        xpText = this.add.text(10, 90, `XP: ${playerXP}/${xpToNextLevel}`, {
            fontSize: '14px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        });
        xpText.setDepth(100);
        xpText.setScrollFactor(0);
        
        // Mutations display (fixed to camera)
        mutationsDisplay = this.add.text(10, 110, 'MUTATIONS:', {
            fontSize: '14px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        });
        mutationsDisplay.setDepth(100);
        mutationsDisplay.setScrollFactor(0);
        
        // Spawn enemies for first room
        console.log('Starting first room...');
        startRoom(this);
        console.log('First room started');
        
        // Collision detection: bullets vs enemies
        this.physics.add.overlap(bullets, enemies, hitEnemy, null, this);
        
        // Collision detection: enemy bullets vs player
        this.physics.add.overlap(enemyBullets, player, hitPlayer, null, this);
        
        // Collision detection: weapon pickups vs player
        this.physics.add.overlap(weaponPickups, player, pickupWeapon, null, this);
        
        // Collision detection: health pickups vs player
        this.physics.add.overlap(healthPickups, player, pickupHealth, null, this);
        
        // Weapon switching keys
        this.input.keyboard.on('keydown-ONE', () => switchWeapon('pistol'));
        this.input.keyboard.on('keydown-TWO', () => switchWeapon('smg'));
        this.input.keyboard.on('keydown-THREE', () => switchWeapon('shotgun'));
        this.input.keyboard.on('keydown-FOUR', () => switchWeapon('laser'));
        
        // Collision detection: bullets vs walls
        this.physics.add.collider(bullets, allWalls, (bullet) => {
            bullets.killAndHide(bullet);
        });
        
        // Collision detection: enemy bullets vs walls
        this.physics.add.collider(enemyBullets, allWalls, (bullet) => {
            enemyBullets.killAndHide(bullet);
        });
        
        // Collision detection: bullets vs obstacles
        this.physics.add.collider(bullets, allObstacles, (bullet) => {
            bullets.killAndHide(bullet);
        });
        
        // Collision detection: enemy bullets vs obstacles
        this.physics.add.collider(enemyBullets, allObstacles, (bullet) => {
            enemyBullets.killAndHide(bullet);
        });
        
        // Collision detection: player vs walls
        this.physics.add.collider(player, allWalls);
        
        // Collision detection: player vs obstacles
        this.physics.add.collider(player, allObstacles);
        
        // Collision detection: enemies vs obstacles
        this.physics.add.collider(enemies, allObstacles);
        
        // Collision detection: enemies vs walls
        this.physics.add.collider(enemies, allWalls);
        
        // Collision detection: player vs locked doors
        this.physics.add.collider(player, allDoors, (player, door) => {
            if (door.locked) {
                // Push player back slightly
                const angle = Phaser.Math.Angle.Between(door.x, door.y, player.x, player.y);
                player.x += Math.cos(angle) * 5;
                player.y += Math.sin(angle) * 5;
            }
        });
        
        // Collision detection: enemies vs locked doors
        this.physics.add.collider(enemies, allDoors, (enemy, door) => {
            if (door.locked) {
                // Enemies can't pass through locked doors
                const angle = Phaser.Math.Angle.Between(door.x, door.y, enemy.x, enemy.y);
                enemy.x += Math.cos(angle) * 5;
                enemy.y += Math.sin(angle) * 5;
            }
        });
        
        // Create minimap
        createMinimap(this);
        
        // Input setup
        cursors = this.input.keyboard.createCursorKeys();
        wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
        mousePointer = this.input.activePointer;
        
        // Enable mouse input
        this.input.mouse.disableContextMenu();
        
        console.log('GameScene.create() completed successfully!');
        
        } catch (error) {
            console.error('Error in GameScene.create():', error);
            console.error('Error message:', error.message);
            console.error('Stack trace:', error.stack);
            // Try to go back to character select
            alert('Error starting game: ' + error.message + '\nCheck console for details.');
            this.scene.start('CharacterSelectScene');
        }
    }

    update(time) {
        if (isGameOver || isLevelUpScreen) {
            return;
        }
        
        // Check if required objects are initialized
        if (!player || !cursors || !wasdKeys || !mousePointer) {
            return;
        }
        
        // Update invincibility frames
        if (playerInvincible && time >= playerInvincibleUntil) {
            playerInvincible = false;
            if (player && player.active) {
                player.clearTint();
            }
        }
        
        // Visual feedback for invincibility (flashing)
        if (playerInvincible && player && player.active) {
            const flashRate = 100; // ms
            const flashPhase = Math.floor(time / flashRate) % 2;
            if (flashPhase === 0) {
                player.setAlpha(0.5);
            } else {
                player.setAlpha(1);
            }
        } else if (player && player.active) {
            player.setAlpha(1);
        }
        
        // Player movement (WASD + Arrow keys)
        let velocityX = 0;
        let velocityY = 0;
        
        if (cursors.left.isDown || wasdKeys.A.isDown) {
            velocityX = -playerSpeed;
        } else if (cursors.right.isDown || wasdKeys.D.isDown) {
            velocityX = playerSpeed;
        }
        
        if (cursors.up.isDown || wasdKeys.W.isDown) {
            velocityY = -playerSpeed;
        } else if (cursors.down.isDown || wasdKeys.S.isDown) {
            velocityY = playerSpeed;
        }
        
        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= 0.707;
            velocityY *= 0.707;
        }
        
        player.setVelocity(velocityX, velocityY);
        
        // Polish: Update player glow position
        if (player.glow) {
            player.glow.setPosition(player.x, player.y);
        }
        
        // Rotate player to face mouse cursor
        const angle = Phaser.Math.Angle.Between(
            player.x,
            player.y,
            mousePointer.worldX,
            mousePointer.worldY
        );
        player.setRotation(angle + Math.PI / 2);
        
        // Apply berserker passive (damage increases when low on health)
        if (selectedCharacter === 'berserker') {
            const healthPercent = playerHealth / playerMaxHealth;
            const missingHealthPercent = 1 - healthPercent;
            const damageBonus = missingHealthPercent; // 0-1 multiplier
            baseBulletDamage = 7 * characters.berserker.stats.damage * (1 + damageBonus);
        }
        
        // Shooting (left mouse button)
        if (currentWeapon && currentWeapon.type === 'laser') {
            if (mousePointer.isDown) {
                shootLaser(this, time);
            } else {
                stopLaser();
            }
        } else if (currentWeapon) {
            if (mousePointer.isDown && time > lastFired) {
                const fireRateMultiplier = getMutationMultiplier('fireRate');
                const adjustedFireRate = Math.floor(baseFireRate / fireRateMultiplier);
                shoot(this, time);
                lastFired = time + adjustedFireRate;
            }
        }
        
        // Update enemy AI
        updateEnemyAI(this, time);
        
        // Check if room is cleared
        checkRoomCleared();
        
        // Update portal animation
        if (exitPortal && exitPortal.active) {
            exitPortal.setRotation(exitPortal.rotation + 0.02);
            const scale = 1 + Math.sin(time * 0.005) * 0.1;
            exitPortal.setScale(scale);
        }
        
        // Remove bullets that go off screen
        if (bullets) {
            bullets.children.entries.forEach(bullet => {
                if (bullet && bullet.active) {
                    const bounds = this.physics.world.bounds;
                    if (bullet.x < bounds.x || bullet.x > bounds.width ||
                        bullet.y < bounds.y || bullet.y > bounds.height) {
                        cleanupBulletTrail(bullet);
                        bullets.killAndHide(bullet);
                    }
                }
            });
        }
        
        // Remove enemy bullets that go off screen
        if (enemyBullets) {
            enemyBullets.children.entries.forEach(bullet => {
                if (bullet && bullet.active) {
                    const bounds = this.physics.world.bounds;
                    if (bullet.x < bounds.x || bullet.x > bounds.width ||
                        bullet.y < bounds.y || bullet.y > bounds.height) {
                        cleanupBulletTrail(bullet);
                        enemyBullets.killAndHide(bullet);
                    }
                }
            });
        }
        
        // Update health bars
        updateHealthBars(this, time);
        updatePlayerHealthBar();
        
        // Update laser beam
        if (laserActive && laserBeam) {
            updateLaserBeam(this);
        }
        
        // Health regeneration (Synthetic Blood mutation)
        if (time > healthRegenTimer) {
            const regenAmount = getMutationValue('healthRegen');
            if (regenAmount > 0 && playerHealth < playerMaxHealth) {
                playerHealth = Math.min(playerMaxHealth, playerHealth + regenAmount);
                healthRegenTimer = time + 1000;
            }
        }
        
        // Update player speed with mutations
        updatePlayerStats();
        
        // Polish: Update screen shake
        updateScreenShake(this);
        
        // Polish: Add bullet trails
        if (bullets) {
            bullets.children.entries.forEach(bullet => {
                if (bullet && bullet.active) {
                    addBulletTrail(bullet);
                }
            });
        }
        
        // Update minimap
        updateMinimap();
        
        // Detect which room player is in
        detectCurrentRoom();
    }
}

// Detect which room the player is currently in and transition camera
function detectCurrentRoom() {
    if (!player || !mapRooms || !gameScene) return;
    
    for (const room of mapRooms) {
        if (player.x >= room.x && player.x <= room.x + room.width &&
            player.y >= room.y && player.y <= room.y + room.height) {
            if (currentRoomId !== room.id) {
                // Player entered a new room
                const previousRoomId = currentRoomId;
                currentRoomId = room.id;
                
                console.log('Entered room:', currentRoomId);
                
                // Update room counter
                if (roomCounterText) {
                    roomCounterText.setText(`ROOM ${currentRoomId + 1}`);
                }
                
                // Lock doors if room has enemies (trap the player until cleared)
                lockRoomIfEnemiesExist(room);
                
                // Transition camera to this room (Binding of Isaac style)
                gameScene.cameras.main.pan(room.x + room.width / 2, room.y + room.height / 2, 500, 'Power2', false);
            }
            break;
        }
    }
}

// Lock all doors connected to a room if enemies exist in it
function lockRoomIfEnemiesExist(room) {
    if (!room || clearedRooms.has(room.id)) return;
    
    // Count enemies in this room
    let enemyCount = 0;
    enemies.children.entries.forEach(enemy => {
        if (!enemy.active) return;
        if (enemy.x >= room.x && enemy.x <= room.x + room.width &&
            enemy.y >= room.y && enemy.y <= room.y + room.height) {
            enemyCount++;
        }
    });
    
    // If enemies exist, lock all doors connected to this room
    if (enemyCount > 0 && roomDoors.has(room.id)) {
        roomDoors.get(room.id).forEach(door => {
            if (!door.locked) {
                door.locked = true;
                door.setVisible(true);
                door.setActive(true);
                if (door.lockIcon) {
                    door.lockIcon.setVisible(true);
                }
            }
        });
    }
}

// Mutation definitions
const mutations = {
    neuralOverclock: {
        name: 'Neural Overclock',
        description: '+20% Movement Speed',
        effect: 'speed',
        value: 0.2
    },
    ballisticImplant: {
        name: 'Ballistic Implant',
        description: '+30% Damage',
        effect: 'damage',
        value: 0.3
    },
    dermalArmor: {
        name: 'Dermal Armor',
        description: '+20 Max HP',
        effect: 'maxHealth',
        value: 20
    },
    cyberReflexes: {
        name: 'Cyber Reflexes',
        description: '+25% Fire Rate',
        effect: 'fireRate',
        value: 0.25
    },
    syntheticBlood: {
        name: 'Synthetic Blood',
        description: 'Regenerate 1 HP/sec',
        effect: 'healthRegen',
        value: 1
    },
    targetingSystem: {
        name: 'Targeting System',
        description: '+20% Bullet Speed',
        effect: 'bulletSpeed',
        value: 0.2
    },
    adrenalinePump: {
        name: 'Adrenaline Pump',
        description: '+10% Speed when low HP',
        effect: 'adrenaline',
        value: 0.1
    }
};


// Weapon system functions (weapons initialized at top of file)

function switchWeapon(weaponName) {
    if (weapons[weaponName] && !isGameOver) {
        currentWeapon = weapons[weaponName];
        stopLaser();
        if (weaponText) {
            weaponText.setText(`WEAPON: ${currentWeapon.name}`);
            // Polish: Flash weapon text on switch
            weaponText.setTint(currentWeapon.color);
            gameScene.tweens.add({
                targets: weaponText,
                alpha: 0.5,
                duration: 100,
                yoyo: true,
                ease: 'Power2',
                onComplete: () => weaponText.clearTint()
            });
        }
        // Polish: Light screen shake on weapon switch
        addScreenShake(1, 30);
    }
}

function shoot(scene, time) {
    // Apply mutation and augment multipliers
    const damageMultiplier = getMutationMultiplier('damage');
    const speedMultiplier = getMutationMultiplier('bulletSpeed');
    const fireRateMultiplier = getMutationMultiplier('fireRate');
    
    // Check for multishot augments
    let bulletCount = 1;
    activeAugments.forEach(augment => {
        if (augment.type === 'multishot') {
            bulletCount += augment.value;
        }
    });
    
    if (currentWeapon.type === 'shotgun') {
        // Shotgun fires multiple bullets in spread
        const spreadAngle = 0.3; // Total spread angle in radians
        const shotgunBulletCount = currentWeapon.spread;
        
        for (let i = 0; i < shotgunBulletCount; i++) {
            const angle = Phaser.Math.Angle.Between(
                player.x,
                player.y,
                mousePointer.worldX,
                mousePointer.worldY
            ) + (i - shotgunBulletCount / 2) * (spreadAngle / shotgunBulletCount);
            
            const bullet = bullets.get(player.x, player.y);
            if (bullet) {
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.setScale(1);
                bullet.damage = Math.floor(currentWeapon.damage * damageMultiplier);
                bullet.setTint(currentWeapon.color);
                bullet.hitEnemies = new Set(); // Track which enemies this bullet has hit
                bullet.piercing = false; // Shotgun doesn't pierce by default
                
                // Polish: Muzzle flash for each shotgun pellet (disabled)
                // if (i === 0) { // Only flash once per shot
                //     createMuzzleFlash(player.x, player.y, angle, currentWeapon.color);
                // }
                
                const bulletSpeed = Math.floor(currentWeapon.bulletSpeed * speedMultiplier);
                scene.physics.velocityFromRotation(angle, bulletSpeed, bullet.body.velocity);
                bullet.setPosition(player.x, player.y);
            }
        }
    } else {
        // Single bullet weapons (with multishot support)
        const baseAngle = Phaser.Math.Angle.Between(
            player.x,
            player.y,
            mousePointer.worldX,
            mousePointer.worldY
        );
        
        // Fire multiple bullets if multishot augment is active
        const spreadAngle = bulletCount > 1 ? 0.15 : 0;
        for (let i = 0; i < bulletCount; i++) {
            const bullet = bullets.get(player.x, player.y);
            if (!bullet) continue;
            
            const angle = baseAngle + (i - (bulletCount - 1) / 2) * spreadAngle;
            
            bullet.setActive(true);
            bullet.setVisible(true);
            
            // Initialize bullet properties
            bullet.hitEnemies = new Set(); // Track which enemies this bullet has hit
            
            // Check for bullet size augment
            let bulletScale = 1;
            activeAugments.forEach(augment => {
                if (augment.type === 'bulletSize') {
                    bulletScale *= (1 + augment.value);
                }
            });
            bullet.setScale(bulletScale);
            
            // Check for critical strike
            let finalDamage = currentWeapon.damage * damageMultiplier;
            activeAugments.forEach(augment => {
                if (augment.type === 'critical' && Math.random() < augment.value) {
                    finalDamage *= 2;
                }
            });
            bullet.damage = Math.floor(finalDamage);
            bullet.setTint(currentWeapon.color);
            
            // Check for piercing
            bullet.piercing = false;
            activeAugments.forEach(augment => {
                if (augment.type === 'pierce') {
                    bullet.piercing = true;
                }
            });
            
            // Polish: Muzzle flash (only once) - disabled
            // if (i === 0) {
            //     createMuzzleFlash(player.x, player.y, angle, currentWeapon.color);
            // }
            
            const finalBulletSpeed = Math.floor(currentWeapon.bulletSpeed * speedMultiplier);
            scene.physics.velocityFromRotation(angle, finalBulletSpeed, bullet.body.velocity);
            bullet.setPosition(player.x, player.y);
        }
    }
    
    // Polish: Light screen shake on shoot (shotgun gets more)
    const shakeIntensity = currentWeapon.type === 'shotgun' ? 3 : 1;
    addScreenShake(shakeIntensity, 50);
}

function shootLaser(scene, time) {
    if (!laserActive) {
        laserActive = true;
        laserBeam = scene.add.graphics();
        laserBeam.setDepth(11); // Above player, below UI
    }
    
    // Apply mutation multipliers
    const damageMultiplier = getMutationMultiplier('damage');
    
    // Damage enemies in laser path
    const angle = Phaser.Math.Angle.Between(
        player.x,
        player.y,
        mousePointer.worldX,
        mousePointer.worldY
    );
    
    if (time > laserTimer) {
        // Check for enemy hits
        enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            
            // Simple line intersection check
            const dist = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
            const angleToEnemy = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
            const angleDiff = Math.abs(Phaser.Math.Angle.Wrap(angle - angleToEnemy));
            
            if (dist < 300 && angleDiff < 0.2) {
                const damage = Math.floor(currentWeapon.damage * damageMultiplier);
                enemy.health -= damage;
                enemy.isHit = true;
                enemy.setTint(0xffffff);
                
                // Polish: Show damage number for laser
                if (time % 200 < 50) { // Show damage number every 200ms
                    showDamageNumber(enemy.x, enemy.y - 20, damage, currentWeapon.color);
                }
                
                // Polish: Create hit particles for laser
                if (time % 100 < 50) {
                    // createHitParticles(enemy.x, enemy.y, currentWeapon.color);
                }
                
                if (enemy.health <= 0) {
                    killEnemy(enemy);
                }
            }
        });
        
        laserTimer = time + currentWeapon.fireRate;
    }
}

function updateLaserBeam(scene) {
    if (!laserBeam || !player.active) return;
    
    const angle = Phaser.Math.Angle.Between(
        player.x,
        player.y,
        mousePointer.worldX,
        mousePointer.worldY
    );
    
    laserBeam.clear();
    
    // Polish: Enhanced laser beam with glow effect
    // Outer glow
    laserBeam.lineStyle(8, currentWeapon.color, 0.3);
    laserBeam.beginPath();
    laserBeam.moveTo(player.x, player.y);
    const endX = player.x + Math.cos(angle) * 300;
    const endY = player.y + Math.sin(angle) * 300;
    laserBeam.lineTo(endX, endY);
    laserBeam.strokePath();
    
    // Main beam
    laserBeam.lineStyle(4, currentWeapon.color, 0.9);
    laserBeam.beginPath();
    laserBeam.moveTo(player.x, player.y);
    laserBeam.lineTo(endX, endY);
    laserBeam.strokePath();
    
    // Inner bright core
    laserBeam.lineStyle(2, 0xffffff, 1);
    laserBeam.beginPath();
    laserBeam.moveTo(player.x, player.y);
    laserBeam.lineTo(endX, endY);
    laserBeam.strokePath();
}

function stopLaser() {
    laserActive = false;
    if (laserBeam) {
        laserBeam.destroy();
        laserBeam = null;
    }
}

function dropWeapon(scene, x, y) {
    if (Math.random() > 0.2) return; // 20% chance
    
    const weaponTypes = ['pistol', 'smg', 'shotgun', 'laser'];
    const weaponType = weaponTypes[Phaser.Math.Between(0, weaponTypes.length - 1)];
    
    const pickup = scene.physics.add.sprite(x, y, 'weaponPickup');
    pickup.setScale(1.5);
    pickup.weaponType = weaponType;
    pickup.setTint(weapons[weaponType].color);
    
    // Add rotation animation
    scene.tweens.add({
        targets: pickup,
        rotation: Math.PI * 2,
        duration: 1000,
        repeat: -1
    });
    
    weaponPickups.add(pickup);
}

function dropHealthPack(scene, x, y) {
    if (Math.random() > 0.1) return; // 10% chance
    
    const pickup = scene.physics.add.sprite(x, y, 'healthPickup');
    pickup.setScale(1.5);
    
    // Add pulsing animation
    scene.tweens.add({
        targets: pickup,
        scaleX: 1.8,
        scaleY: 1.8,
        duration: 500,
        yoyo: true,
        repeat: -1
    });
    
    healthPickups.add(pickup);
}

function pickupWeapon(playerSprite, pickup) {
    // Check if this is an augment pickup
    if (pickup.isAugmentPickup && pickup.augment) {
        // Apply the augment
        activeAugments.push(pickup.augment);
        applyAugment(pickup.augment);
        updateAugmentsDisplay();
        
        // Show pickup text
        const pickupText = gameScene.add.text(pickup.x, pickup.y - 20, `${pickup.augment.icon} ${pickup.augment.name}`, {
            fontSize: '16px',
            fill: '#ff00ff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        });
        pickupText.setOrigin(0.5);
        pickupText.setDepth(200);
        gameScene.tweens.add({
            targets: pickupText,
            y: pickup.y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => pickupText.destroy()
        });
        
        // Destroy label if exists
        if (pickup.label) {
            pickup.label.destroy();
        }
        
        weaponPickups.remove(pickup);
        pickup.destroy();
        return;
    }
    
    // Regular weapon pickup
    switchWeapon(pickup.weaponType);
    
    // Show pickup text
    const pickupText = gameScene.add.text(pickup.x, pickup.y - 20, `PICKED UP: ${weapons[pickup.weaponType].name}`, {
        fontSize: '14px',
        fill: `#${weapons[pickup.weaponType].color.toString(16).padStart(6, '0')}`,
        fontFamily: 'Courier New',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
    });
    pickupText.setOrigin(0.5);
    pickupText.setDepth(200);
    gameScene.tweens.add({
        targets: pickupText,
        y: pickup.y - 50,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => pickupText.destroy()
    });
    
    weaponPickups.remove(pickup);
    pickup.destroy();
}

function pickupHealth(playerSprite, pickup) {
    const healAmount = 30;
    playerHealth = Math.min(playerMaxHealth, playerHealth + healAmount);
    
    // Polish: Create healing particles (disabled)
    // createHitParticles(pickup.x, pickup.y, 0x00ff00);
    
    // Polish: Show heal text
    const healText = gameScene.add.text(pickup.x, pickup.y - 20, `+${healAmount} HP`, {
        fontSize: '16px',
        fill: '#00ff00',
        fontFamily: 'Courier New',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
    });
    healText.setOrigin(0.5);
    healText.setDepth(200);
    gameScene.tweens.add({
        targets: healText,
        y: pickup.y - 50,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => healText.destroy()
    });
    
    // Polish: Flash screen green on heal
    flashScreen(0x00ff00, 100);
    
    healthPickups.remove(pickup);
    pickup.destroy();
}

function shoot(scene, time) {
    const bullet = bullets.get(player.x, player.y);
    
    if (!bullet) {
        return; // No available bullets in pool
    }
    
    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.setScale(1);
    
    // Calculate direction to mouse
    const angle = Phaser.Math.Angle.Between(
        player.x,
        player.y,
        mousePointer.worldX,
        mousePointer.worldY
    );
    
    // Set bullet velocity
    scene.physics.velocityFromRotation(angle, bulletSpeed, bullet.body.velocity);
    
    // Reset bullet position
    bullet.setPosition(player.x, player.y);
}

// ========== PROCEDURAL MAP GENERATION ==========

// ========== ENEMY SYSTEM ==========

// Enemy type definitions with unique attack patterns
const enemyTypes = {
    melee: {
        name: 'Charger',
        color: 0xff0000,
        attackPattern: 'melee',
        baseHealth: 30,
        baseSpeed: 100,
        baseDamage: 5,
        behavior: 'chase', // Directly chases player
        description: 'Fast melee attacker'
    },
    ranged: {
        name: 'Shooter',
        color: 0xff00ff,
        attackPattern: 'single',
        baseHealth: 25,
        baseSpeed: 60,
        baseDamage: 4,
        shootCooldown: 1500,
        behavior: 'maintainDistance', // Stays at range
        description: 'Basic ranged attacker'
    },
    sniper: {
        name: 'Sniper',
        color: 0x00ffff,
        attackPattern: 'sniper',
        baseHealth: 20,
        baseSpeed: 40,
        baseDamage: 8,
        shootCooldown: 3000,
        behavior: 'flee', // Moves away from player
        description: 'High damage, slow fire rate'
    },
    shotgun: {
        name: 'Shotgunner',
        color: 0xff6600,
        attackPattern: 'shotgun',
        baseHealth: 35,
        baseSpeed: 50,
        baseDamage: 3,
        shootCooldown: 2000,
        behavior: 'maintainDistance',
        description: 'Fires spread shots'
    },
    burst: {
        name: 'Burst Fire',
        color: 0xcc00ff,
        attackPattern: 'burst',
        baseHealth: 28,
        baseSpeed: 55,
        baseDamage: 3,
        shootCooldown: 2500,
        burstCount: 3,
        behavior: 'maintainDistance',
        description: 'Fires 3-shot bursts'
    },
    teleporter: {
        name: 'Teleporter',
        color: 0xff0066,
        attackPattern: 'single',
        baseHealth: 30,
        baseSpeed: 70,
        baseDamage: 4,
        shootCooldown: 2000,
        behavior: 'teleport', // Teleports near player
        teleportCooldown: 5000,
        description: 'Teleports around the battlefield'
    },
    charger: {
        name: 'Berserker',
        color: 0xffff00,
        attackPattern: 'melee',
        baseHealth: 40,
        baseSpeed: 120,
        baseDamage: 6,
        behavior: 'charge', // Charges at player
        chargeCooldown: 4000,
        description: 'Fast charging melee'
    },
    turret: {
        name: 'Turret',
        color: 0x666666,
        attackPattern: 'rapid',
        baseHealth: 50,
        baseSpeed: 0, // Stationary
        baseDamage: 2,
        shootCooldown: 500,
        behavior: 'stationary', // Doesn't move
        description: 'Stationary rapid fire'
    }
};

// Enemy augment definitions (similar to player augments but for enemies)
const enemyAugments = {
    healthBoost: { type: 'health', value: 0.5, name: 'Tough' },
    speedBoost: { type: 'speed', value: 0.3, name: 'Swift' },
    damageBoost: { type: 'damage', value: 0.4, name: 'Deadly' },
    rapidFire: { type: 'fireRate', value: 0.5, name: 'Rapid' },
    regen: { type: 'regen', value: 1, name: 'Regenerating' },
    shield: { type: 'shield', value: 1, name: 'Shielded' }
};

// Get random enemy type based on floor (higher floors get harder enemies)
function getRandomEnemyType() {
    // Ensure currentFloor and maxFloors are valid
    if (!currentFloor || !maxFloors || maxFloors === 0) {
        return 'ranged'; // Safe fallback
    }
    
    const floorProgress = currentFloor / maxFloors; // 0 to 1
    
    // Early floors: mostly basic enemies
    // Mid floors: mix of all types
    // Late floors: more dangerous enemies
    const weights = {
        melee: floorProgress < 0.3 ? 0.4 : floorProgress < 0.7 ? 0.25 : 0.15,
        ranged: floorProgress < 0.3 ? 0.4 : floorProgress < 0.7 ? 0.25 : 0.15,
        sniper: floorProgress < 0.3 ? 0.05 : floorProgress < 0.7 ? 0.15 : 0.20,
        shotgun: floorProgress < 0.3 ? 0.05 : floorProgress < 0.7 ? 0.15 : 0.15,
        burst: floorProgress < 0.3 ? 0.05 : floorProgress < 0.7 ? 0.10 : 0.15,
        teleporter: floorProgress < 0.3 ? 0.02 : floorProgress < 0.7 ? 0.05 : 0.10,
        charger: floorProgress < 0.3 ? 0.02 : floorProgress < 0.7 ? 0.03 : 0.05,
        turret: floorProgress < 0.3 ? 0.01 : floorProgress < 0.7 ? 0.02 : 0.05
    };
    
    // Normalize weights to ensure they sum to 1
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) {
        return 'ranged'; // Fallback if all weights are 0
    }
    
    const rand = Math.random() * totalWeight;
    let cumulative = 0;
    for (const [type, weight] of Object.entries(weights)) {
        cumulative += weight;
        if (rand <= cumulative) {
            return type;
        }
    }
    return 'ranged'; // Fallback
}

// Get random enemy augments based on floor
function getRandomEnemyAugments(floor) {
    const augments = [];
    const floorProgress = floor / maxFloors;
    
    // Higher floors get more augments
    const augmentChance = 0.1 + (floorProgress * 0.4); // 10% to 50% chance
    const numAugments = floorProgress < 0.3 ? 0 : floorProgress < 0.7 ? 1 : Math.random() < 0.5 ? 1 : 2;
    
    const availableAugments = Object.keys(enemyAugments);
    const used = new Set();
    
    for (let i = 0; i < numAugments; i++) {
        if (Math.random() < augmentChance) {
            const randomAug = availableAugments[Phaser.Math.Between(0, availableAugments.length - 1)];
            if (!used.has(randomAug)) {
                augments.push(enemyAugments[randomAug]);
                used.add(randomAug);
            }
        }
    }
    
    return augments;
}

// Calculate floor-based scaling
function getFloorScaling(floor) {
    // Ensure valid floor and maxFloors
    if (!floor || !maxFloors || maxFloors === 0) {
        return {
            healthMultiplier: 1,
            damageMultiplier: 1,
            speedMultiplier: 1,
            fireRateMultiplier: 1
        };
    }
    
    // Exponential scaling - gets harder faster as you go deeper
    const progress = floor / maxFloors;
    return {
        healthMultiplier: 1 + (progress * 2), // 1x to 3x health
        damageMultiplier: 1 + (progress * 1.5), // 1x to 2.5x damage
        speedMultiplier: 1 + (progress * 0.5), // 1x to 1.5x speed
        fireRateMultiplier: 1 + (progress * 0.3) // 1x to 1.3x fire rate
    };
}

// ========== AUGMENT SYSTEM ==========

// Augment definitions (Binding of Isaac style powerups)
const augments = {
    // Damage augments
    damageBoost: {
        name: 'Damage Boost',
        description: '+25% Damage',
        icon: '⚔️',
        type: 'damage',
        value: 0.25,
        rarity: 'common'
    },
    criticalStrike: {
        name: 'Critical Strike',
        description: '10% chance for 2x damage',
        icon: '💥',
        type: 'critical',
        value: 0.10,
        rarity: 'uncommon'
    },
    piercingShots: {
        name: 'Piercing Shots',
        description: 'Bullets pierce through enemies',
        icon: '➡️',
        type: 'pierce',
        value: true,
        rarity: 'rare'
    },
    
    // Speed augments
    speedBoost: {
        name: 'Speed Boost',
        description: '+30% Movement Speed',
        icon: '⚡',
        type: 'speed',
        value: 0.30,
        rarity: 'common'
    },
    bulletSpeed: {
        name: 'Bullet Speed',
        description: '+40% Bullet Speed',
        icon: '🚀',
        type: 'bulletSpeed',
        value: 0.40,
        rarity: 'common'
    },
    
    // Fire rate augments
    rapidFire: {
        name: 'Rapid Fire',
        description: '+35% Fire Rate',
        icon: '🔥',
        type: 'fireRate',
        value: 0.35,
        rarity: 'common'
    },
    doubleShot: {
        name: 'Double Shot',
        description: 'Fire 2 bullets at once',
        icon: '👁️',
        type: 'multishot',
        value: 2,
        rarity: 'rare'
    },
    
    // Health augments
    healthBoost: {
        name: 'Health Boost',
        description: '+50 Max HP',
        icon: '❤️',
        type: 'maxHealth',
        value: 50,
        rarity: 'common'
    },
    healthRegen: {
        name: 'Health Regen',
        description: 'Regenerate 2 HP per second',
        icon: '💚',
        type: 'regen',
        value: 2,
        rarity: 'uncommon'
    },
    lifesteal: {
        name: 'Lifesteal',
        description: 'Heal 10% of damage dealt',
        icon: '🩸',
        type: 'lifesteal',
        value: 0.10,
        rarity: 'rare'
    },
    
    // Utility augments
    extraBullets: {
        name: 'Extra Bullets',
        description: '+2 bullets per shot',
        icon: '📦',
        type: 'multishot',
        value: 2,
        rarity: 'uncommon'
    },
    bulletSize: {
        name: 'Bullet Size',
        description: '+50% Bullet Size',
        icon: '🔴',
        type: 'bulletSize',
        value: 0.50,
        rarity: 'common'
    },
    knockback: {
        name: 'Knockback',
        description: 'Bullets push enemies back',
        icon: '👊',
        type: 'knockback',
        value: true,
        rarity: 'uncommon'
    },
    shield: {
        name: 'Shield',
        description: 'Block first hit every 10 seconds',
        icon: '🛡️',
        type: 'shield',
        value: 10,
        rarity: 'rare'
    },
    luck: {
        name: 'Luck',
        description: '+25% Drop Rate',
        icon: '🍀',
        type: 'luck',
        value: 0.25,
        rarity: 'uncommon'
    }
};

// Get random augments for selection (3 random augments)
function getRandomAugments(count = 3) {
    const augmentKeys = Object.keys(augments);
    const selected = [];
    const used = new Set();
    
    while (selected.length < count && selected.length < augmentKeys.length) {
        const randomKey = augmentKeys[Phaser.Math.Between(0, augmentKeys.length - 1)];
        if (!used.has(randomKey) && !activeAugments.some(a => a.key === randomKey)) {
            selected.push({ ...augments[randomKey], key: randomKey });
            used.add(randomKey);
        }
    }
    
    return selected;
}

// Procedural map generation - Binding of Isaac style (screen-sized rooms)
function generateProceduralMap(numRooms = 8) {
    const rooms = [];
    const gridCols = 4;
    const gridRows = 4;
    
    // Generate rooms in a grid-like layout
    // Each room is exactly screen-sized (800x600) and positioned adjacent
    let roomId = 0;
    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            if (roomId >= numRooms) break;
            
            // Binding of Isaac style: rooms are exactly screen-sized
            const width = roomWidth;
            const height = roomHeight;
            const x = col * roomWidth;
            const y = row * roomHeight;
            
            const room = {
                x: x,
                y: y,
                width: width,
                height: height,
                centerX: x + width / 2,
                centerY: y + height / 2,
                id: roomId,
                isBossRoom: false,
                connections: [] // Which rooms this connects to
            };
            
            rooms.push(room);
            roomId++;
        }
        if (roomId >= numRooms) break;
    }
    
    // Designate last room as boss room
    if (rooms.length > 0) {
        rooms[rooms.length - 1].isBossRoom = true;
        bossRoomId = rooms[rooms.length - 1].id;
    }
    
    // Create connections between adjacent rooms (grid-based)
    for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i];
        const row = Math.floor(i / gridCols);
        const col = i % gridCols;
        
        // Connect to room to the right
        if (col < gridCols - 1 && i + 1 < rooms.length) {
            room.connections.push(i + 1);
            rooms[i + 1].connections.push(i);
        }
        
        // Connect to room below
        if (row < gridRows - 1 && i + gridCols < rooms.length) {
            room.connections.push(i + gridCols);
            rooms[i + gridCols].connections.push(i);
        }
    }
    
    return { rooms, corridors: [] }; // No open corridors, use doors instead
}

function createProceduralMap(scene) {
    // Generate map (8 rooms per floor)
    generatedMap = generateProceduralMap(8);
    mapRooms = generatedMap.rooms;
    mapCorridors = generatedMap.corridors;
    
    // Create walls group
    if (!allWalls) {
        allWalls = scene.physics.add.staticGroup();
    } else {
        allWalls.clear(true, true);
    }
    
    // Create obstacles group
    if (!allObstacles) {
        allObstacles = scene.physics.add.staticGroup();
    } else {
        allObstacles.clear(true, true);
    }
    
    // Create room walls and floors
    mapRooms.forEach((room, index) => {
        // Room floor (background)
        const floor = scene.add.rectangle(
            room.centerX, room.centerY,
            room.width, room.height,
            0x1a1a1a
        );
        floor.setDepth(-10);
        
        // Room walls - using origin (0,0) for precise positioning
        const wallThickness = 20;
        const doorWidth = 80; // Width of door opening (larger for easier access)
        
        // Determine which walls need doors (check connections)
        const hasTopConnection = room.connections.some(connId => {
            const connRoom = mapRooms[connId];
            return connRoom && connRoom.centerY < room.centerY;
        });
        const hasBottomConnection = room.connections.some(connId => {
            const connRoom = mapRooms[connId];
            return connRoom && connRoom.centerY > room.centerY;
        });
        const hasLeftConnection = room.connections.some(connId => {
            const connRoom = mapRooms[connId];
            return connRoom && connRoom.centerX < room.centerX;
        });
        const hasRightConnection = room.connections.some(connId => {
            const connRoom = mapRooms[connId];
            return connRoom && connRoom.centerX > room.centerX;
        });
        
        // Helper function to create wall segment
        function createWall(x, y, w, h) {
            const wall = scene.add.rectangle(x + w/2, y + h/2, w, h, 0x444444);
            wall.setDepth(5);
            scene.physics.add.existing(wall, true);
            allWalls.add(wall);
            return wall;
        }
        
        // Calculate door positions (centered on each wall)
        const doorHalfWidth = doorWidth / 2;
        const hDoorStart = room.centerX - doorHalfWidth; // Horizontal door start X
        const hDoorEnd = room.centerX + doorHalfWidth;   // Horizontal door end X
        const vDoorStart = room.centerY - doorHalfWidth; // Vertical door start Y
        const vDoorEnd = room.centerY + doorHalfWidth;   // Vertical door end Y
        
        // TOP WALL
        if (hasTopConnection) {
            // Left segment: from room.x to door start
            createWall(room.x, room.y - wallThickness/2, hDoorStart - room.x, wallThickness);
            // Right segment: from door end to room.x + room.width
            createWall(hDoorEnd, room.y - wallThickness/2, room.x + room.width - hDoorEnd, wallThickness);
        } else {
            // Full wall
            createWall(room.x, room.y - wallThickness/2, room.width, wallThickness);
        }
        
        // BOTTOM WALL
        if (hasBottomConnection) {
            createWall(room.x, room.y + room.height - wallThickness/2, hDoorStart - room.x, wallThickness);
            createWall(hDoorEnd, room.y + room.height - wallThickness/2, room.x + room.width - hDoorEnd, wallThickness);
        } else {
            createWall(room.x, room.y + room.height - wallThickness/2, room.width, wallThickness);
        }
        
        // LEFT WALL
        if (hasLeftConnection) {
            createWall(room.x - wallThickness/2, room.y, wallThickness, vDoorStart - room.y);
            createWall(room.x - wallThickness/2, vDoorEnd, wallThickness, room.y + room.height - vDoorEnd);
        } else {
            createWall(room.x - wallThickness/2, room.y, wallThickness, room.height);
        }
        
        // RIGHT WALL
        if (hasRightConnection) {
            createWall(room.x + room.width - wallThickness/2, room.y, wallThickness, vDoorStart - room.y);
            createWall(room.x + room.width - wallThickness/2, vDoorEnd, wallThickness, room.y + room.height - vDoorEnd);
        } else {
            createWall(room.x + room.width - wallThickness/2, room.y, wallThickness, room.height);
        }
        
        // CORNER BLOCKS - Extra large to seal all gaps
        const cornerSize = wallThickness * 2;
        
        // Top-left corner
        createWall(room.x - wallThickness, room.y - wallThickness, cornerSize, cornerSize);
        // Top-right corner  
        createWall(room.x + room.width - wallThickness, room.y - wallThickness, cornerSize, cornerSize);
        // Bottom-left corner
        createWall(room.x - wallThickness, room.y + room.height - wallThickness, cornerSize, cornerSize);
        // Bottom-right corner
        createWall(room.x + room.width - wallThickness, room.y + room.height - wallThickness, cornerSize, cornerSize);
        
        // Neon border (red for boss room)
        const border = scene.add.graphics();
        if (room.isBossRoom) {
            border.lineStyle(3, 0xff0000, 1);
        } else {
            border.lineStyle(2, 0x00ffff, 0.6);
        }
        border.strokeRect(room.x, room.y, room.width, room.height);
        border.setDepth(1);
        
        // Boss room label
        if (room.isBossRoom) {
            const bossLabel = scene.add.text(room.centerX, room.y + 30, 'BOSS', {
                fontSize: '32px',
                fill: '#ff0000',
                fontFamily: 'Courier New',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            });
            bossLabel.setOrigin(0.5);
            bossLabel.setDepth(2);
        }
        
        // Add obstacles to room (fewer in boss room)
        const numObstacles = room.isBossRoom ? 
            Phaser.Math.Between(2, 4) : 
            Phaser.Math.Between(0, 8);
        for (let i = 0; i < numObstacles; i++) {
            const obsX = Phaser.Math.Between(room.x + 40, room.x + room.width - 40);
            const obsY = Phaser.Math.Between(room.y + 40, room.y + room.height - 40);
            const obsType = Math.random() > 0.5 ? 'pillar' : 'box';
            const texture = obsType === 'pillar' ? 'obstaclePillar' : 'obstacleBox';
            
            const obstacle = scene.physics.add.sprite(obsX, obsY, texture);
            obstacle.setImmovable(true);
            obstacle.body.setSize(40, 40);
            obstacle.setDepth(5);
            allObstacles.add(obstacle);
        }
        
        // Store room data
        room.enemies = [];
        room.cleared = false;
    });
    
    // Create doors between connected rooms
    createDoors(scene);
    
    // Set world bounds
    scene.physics.world.setBounds(0, 0, worldWidth, worldHeight);
}

// Create doors between connected rooms
function createDoors(scene) {
    if (!allDoors) {
        allDoors = scene.physics.add.staticGroup();
    } else {
        allDoors.clear(true, true);
    }
    
    roomDoors.clear();
    
    // Track created doors to avoid duplicates
    const createdDoors = new Set();
    
    mapRooms.forEach(room => {
        room.connections.forEach(connectedRoomId => {
            const connectedRoom = mapRooms[connectedRoomId];
            if (!connectedRoom) return;
            
            // Create unique door ID to prevent duplicates
            const doorId = `${Math.min(room.id, connectedRoomId)}-${Math.max(room.id, connectedRoomId)}`;
            if (createdDoors.has(doorId)) return;
            createdDoors.add(doorId);
            
            // Determine door position and orientation
            let doorX, doorY, doorW, doorH;
            const doorSize = 80; // Must match wall opening size
            const doorThickness = 30; // Thick enough to block passage
            
            // Check if connected room is to the right
            if (connectedRoom.centerX > room.centerX && Math.abs(connectedRoom.centerY - room.centerY) < 100) {
                // Door on EAST wall (right), centered vertically
                doorX = room.x + room.width;
                doorY = room.centerY;
                doorW = doorThickness;
                doorH = doorSize;
            }
            // Check if connected room is to the left
            else if (connectedRoom.centerX < room.centerX && Math.abs(connectedRoom.centerY - room.centerY) < 100) {
                // Door on WEST wall (left), centered vertically
                doorX = room.x;
                doorY = room.centerY;
                doorW = doorThickness;
                doorH = doorSize;
            }
            // Check if connected room is below
            else if (connectedRoom.centerY > room.centerY && Math.abs(connectedRoom.centerX - room.centerX) < 100) {
                // Door on SOUTH wall (bottom), centered horizontally
                doorX = room.centerX;
                doorY = room.y + room.height;
                doorW = doorSize;
                doorH = doorThickness;
            }
            // Check if connected room is above
            else if (connectedRoom.centerY < room.centerY && Math.abs(connectedRoom.centerX - room.centerX) < 100) {
                // Door on NORTH wall (top), centered horizontally
                doorX = room.centerX;
                doorY = room.y;
                doorW = doorSize;
                doorH = doorThickness;
            }
            else {
                return; // Skip diagonal connections
            }
            
            const door = scene.add.rectangle(doorX, doorY, doorW, doorH, 0xff4444);
            door.setDepth(6);
            door.setStrokeStyle(3, 0xff0000, 1);
            scene.physics.add.existing(door, true);
            
            // Door properties
            door.locked = true;
            door.room1Id = room.id;
            door.room2Id = connectedRoomId;
            door.doorId = doorId;
            
            // Store door
            allDoors.add(door);
            
            // Add to both rooms' door lists
            if (!roomDoors.has(room.id)) {
                roomDoors.set(room.id, []);
            }
            roomDoors.get(room.id).push(door);
            
            if (!roomDoors.has(connectedRoomId)) {
                roomDoors.set(connectedRoomId, []);
            }
            roomDoors.get(connectedRoomId).push(door);
            
            // Locked door indicator (centered on door)
            const lockIcon = scene.add.text(doorX, doorY, '🔒', {
                fontSize: '24px'
            });
            lockIcon.setOrigin(0.5);
            lockIcon.setDepth(7);
            door.lockIcon = lockIcon;
        });
    });
}

// Unlock door between two rooms
function unlockDoor(room1Id, room2Id) {
    if (!allDoors || !allDoors.children) {
        console.warn('No doors to unlock');
        return;
    }
    
    const doorId = `${Math.min(room1Id, room2Id)}-${Math.max(room1Id, room2Id)}`;
    console.log('Unlocking door:', doorId);
    
    let unlocked = false;
    allDoors.children.entries.forEach(door => {
        if (door.doorId === doorId) {
            door.locked = false;
            door.setVisible(false);
            door.setActive(false);
            door.body.enable = false; // Disable physics
            if (door.lockIcon) {
                door.lockIcon.destroy();
            }
            unlocked = true;
            console.log('Door unlocked:', doorId);
        }
    });
    
    if (!unlocked) {
        console.warn('Door not found:', doorId);
    }
}

// Line of sight check for enemies
function hasLineOfSight(enemy, target, obstacles) {
    const ray = new Phaser.Geom.Line(enemy.x, enemy.y, target.x, target.y);
    const distance = Phaser.Geom.Line.Length(ray);
    
    // Check if line of sight is blocked by obstacles
    if (obstacles) {
        for (const obstacle of obstacles.children.entries) {
            if (!obstacle.active) continue;
            
            const obstacleRect = new Phaser.Geom.Rectangle(
                obstacle.x - obstacle.width / 2,
                obstacle.y - obstacle.height / 2,
                obstacle.width,
                obstacle.height
            );
            
            if (Phaser.Geom.Intersects.LineToRectangle(ray, obstacleRect)) {
                return false;
            }
        }
    }
    
    return true;
}

// Get distance between two points
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Create minimap
function createMinimap(scene) {
    const minimapSize = 200;
    const minimapX = 800 - minimapSize - 10;
    const minimapY = 10;
    
    // Minimap background
    const minimapBg = scene.add.rectangle(
        minimapX + minimapSize / 2,
        minimapY + minimapSize / 2,
        minimapSize,
        minimapSize,
        0x000000,
        0.8
    );
    minimapBg.setDepth(250);
    minimapBg.setScrollFactor(0); // Fixed to camera
    
    // Minimap border
    const minimapBorder = scene.add.graphics();
    minimapBorder.lineStyle(2, 0x00ffff, 1);
    minimapBorder.strokeRect(minimapX, minimapY, minimapSize, minimapSize);
    minimapBorder.setDepth(251);
    minimapBorder.setScrollFactor(0);
    
    // Minimap graphics for drawing
    minimapGraphics = scene.add.graphics();
    minimapGraphics.setDepth(250);
    minimapGraphics.setScrollFactor(0);
    
    // Minimap label
    const minimapLabel = scene.add.text(minimapX, minimapY - 20, 'MAP', {
        fontSize: '12px',
        fill: '#00ffff',
        fontFamily: 'Courier New'
    });
    minimapLabel.setDepth(251);
    minimapLabel.setScrollFactor(0);
}

// Update minimap
function updateMinimap() {
    if (!minimapGraphics || !mapRooms || !player) return;
    
    const minimapSize = 200;
    const minimapX = 800 - minimapSize - 10;
    const minimapY = 10;
    const scaleX = minimapSize / worldWidth;
    const scaleY = minimapSize / worldHeight;
    
    minimapGraphics.clear();
    
    // Draw rooms
    mapRooms.forEach(room => {
        const roomX = minimapX + room.x * scaleX;
        const roomY = minimapY + room.y * scaleY;
        const roomW = room.width * scaleX;
        const roomH = room.height * scaleY;
        
        // Check if room is explored (player has been near it)
        const distanceToRoom = Phaser.Math.Distance.Between(
            player.x, player.y,
            room.centerX, room.centerY
        );
        const explored = distanceToRoom < 300;
        
        if (explored) {
            exploredAreas.add(room.id);
            minimapGraphics.fillStyle(0x00ffff, 0.3);
        } else if (exploredAreas.has(room.id)) {
            minimapGraphics.fillStyle(0x666666, 0.2);
        } else {
            return; // Don't draw unexplored rooms
        }
        
        minimapGraphics.fillRect(roomX, roomY, roomW, roomH);
        minimapGraphics.lineStyle(1, 0x00ffff, 0.5);
        minimapGraphics.strokeRect(roomX, roomY, roomW, roomH);
    });
    
    // Draw player
    const playerX = minimapX + player.x * scaleX;
    const playerY = minimapY + player.y * scaleY;
    minimapGraphics.fillStyle(0x00ffff, 1);
    minimapGraphics.fillCircle(playerX, playerY, 3);
    
    // Draw enemies
    if (enemies) {
        enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            const enemyX = minimapX + enemy.x * scaleX;
            const enemyY = minimapY + enemy.y * scaleY;
            const distanceToEnemy = Phaser.Math.Distance.Between(
                player.x, player.y,
                enemy.x, enemy.y
            );
            if (distanceToEnemy < 500) { // Only show nearby enemies
                minimapGraphics.fillStyle(0xff0000, 1);
                minimapGraphics.fillCircle(enemyX, enemyY, 2);
            }
        });
    }
}

// Room templates with obstacle layouts (kept for backward compatibility)
const roomTemplates = [
    // Template 0: Empty room (just walls)
    {
        obstacles: []
    },
    // Template 1: Central pillars
    {
        obstacles: [
            { type: 'pillar', x: 200, y: 200 },
            { type: 'pillar', x: 600, y: 200 },
            { type: 'pillar', x: 200, y: 400 },
            { type: 'pillar', x: 600, y: 400 }
        ]
    },
    // Template 2: Boxes in corners
    {
        obstacles: [
            { type: 'box', x: 150, y: 150 },
            { type: 'box', x: 650, y: 150 },
            { type: 'box', x: 150, y: 450 },
            { type: 'box', x: 650, y: 450 }
        ]
    },
    // Template 3: Central box cluster
    {
        obstacles: [
            { type: 'box', x: 350, y: 250 },
            { type: 'box', x: 400, y: 250 },
            { type: 'box', x: 450, y: 250 },
            { type: 'box', x: 350, y: 300 },
            { type: 'box', x: 450, y: 300 },
            { type: 'box', x: 350, y: 350 },
            { type: 'box', x: 400, y: 350 },
            { type: 'box', x: 450, y: 350 }
        ]
    },
    // Template 4: Scattered obstacles
    {
        obstacles: [
            { type: 'pillar', x: 300, y: 200 },
            { type: 'box', x: 500, y: 250 },
            { type: 'pillar', x: 250, y: 400 },
            { type: 'box', x: 550, y: 400 },
            { type: 'pillar', x: 400, y: 500 }
        ]
    },
    // Template 5: L-shaped cover
    {
        obstacles: [
            { type: 'box', x: 200, y: 200 },
            { type: 'box', x: 240, y: 200 },
            { type: 'box', x: 200, y: 240 },
            { type: 'box', x: 600, y: 360 },
            { type: 'box', x: 640, y: 360 },
            { type: 'box', x: 600, y: 400 }
        ]
    }
];

function createRoomWalls(scene) {
    // Create walls group
    roomWalls = scene.physics.add.staticGroup();
    
    // Top wall
    const topWall = scene.add.rectangle(400, 10, 800, 20, 0x444444);
    topWall.setDepth(0);
    scene.physics.add.existing(topWall, true);
    roomWalls.add(topWall);
    
    // Bottom wall
    const bottomWall = scene.add.rectangle(400, 590, 800, 20, 0x444444);
    bottomWall.setDepth(0);
    scene.physics.add.existing(bottomWall, true);
    roomWalls.add(bottomWall);
    
    // Left wall
    const leftWall = scene.add.rectangle(10, 300, 20, 600, 0x444444);
    leftWall.setDepth(0);
    scene.physics.add.existing(leftWall, true);
    roomWalls.add(leftWall);
    
    // Right wall
    const rightWall = scene.add.rectangle(790, 300, 20, 600, 0x444444);
    rightWall.setDepth(0);
    scene.physics.add.existing(rightWall, true);
    roomWalls.add(rightWall);
    
    // Add neon borders
    const graphics = scene.add.graphics();
    graphics.setDepth(1);
    graphics.lineStyle(2, 0x00ffff, 0.8);
    graphics.strokeRect(10, 10, 780, 580);
}

function createRoomObstacles(scene, templateIndex) {
    // Clear existing obstacles
    if (roomObstacles) {
        roomObstacles.clear(true, true);
    }
    
    // Create obstacles group
    roomObstacles = scene.physics.add.staticGroup();
    
    // Get template
    const template = roomTemplates[templateIndex];
    
    // Create obstacles from template
    template.obstacles.forEach(obs => {
        const texture = obs.type === 'pillar' ? 'obstaclePillar' : 'obstacleBox';
        const obstacle = scene.physics.add.sprite(obs.x, obs.y, texture);
        obstacle.setImmovable(true);
        obstacle.body.setSize(40, 40);
        roomObstacles.add(obstacle);
    });
}

function startRoom(scene) {
    isRoomCleared = false;
    
    // Clear all pickups from previous room
    weaponPickups.clear(true, true);
    healthPickups.clear(true, true);
    stopLaser();
    
    // Clear all enemies
    enemies.clear(true, true);
    enemyStates.clear();
    
    // Spawn enemies in each room
    if (mapRooms && mapRooms.length > 0) {
        mapRooms.forEach((room, index) => {
            if (index === 0) {
                // First room is safe (player spawn) - no enemies
                // Mark first room as cleared so doors unlock
                clearedRooms.add(0);
                room.cleared = true;
                return;
            }
            
            if (room.isBossRoom) {
                // Spawn boss in boss room
                spawnBoss(scene, room);
            } else {
                // Spawn regular enemies (scales with floor - easier at start, harder later)
                // Floor 1-10: 2-4 enemies
                // Floor 11-50: 3-6 enemies
                // Floor 51-100: 5-10 enemies
                let baseCount, maxCount;
                if (currentFloor <= 10) {
                    baseCount = 2;
                    maxCount = 4;
                } else if (currentFloor <= 50) {
                    baseCount = 3;
                    maxCount = 6;
                } else {
                    baseCount = 5;
                    maxCount = 10;
                }
                const enemyCount = baseCount + Math.floor((currentFloor / maxFloors) * (maxCount - baseCount));
                spawnEnemiesInRoom(scene, room, enemyCount);
            }
        });
    }
    
    // Unlock all doors from the first room (room 0)
    if (roomDoors.has(0)) {
        console.log('Unlocking doors from first room, count:', roomDoors.get(0).length);
        roomDoors.get(0).forEach(door => {
            unlockDoor(door.room1Id, door.room2Id);
        });
    } else {
        console.warn('No doors found for first room!');
    }
}

// Spawn enemies in a specific room
function spawnEnemiesInRoom(scene, room, count) {
    if (!scene || !room || count <= 0) return;
    
    const scaling = getFloorScaling(currentFloor);
    
    for (let i = 0; i < count; i++) {
        const spawnX = Phaser.Math.Between(room.x + 50, room.x + room.width - 50);
        const spawnY = Phaser.Math.Between(room.y + 50, room.y + room.height - 50);
        
        // Get random enemy type based on floor
        const enemyTypeKey = getRandomEnemyType();
        const enemyTypeDef = enemyTypes[enemyTypeKey];
        
        if (!enemyTypeDef) {
            console.warn('Invalid enemy type:', enemyTypeKey);
            continue; // Skip this enemy if type is invalid
        }
        
        // Get random sprite index (0-4)
        const spriteIndex = Phaser.Math.Between(0, 4);
        const enemy = scene.physics.add.sprite(spawnX, spawnY, `enemy_${spriteIndex}`);
        enemy.setScale(1.2);
        enemy.setDepth(10);
        enemy.setTint(enemyTypeDef.color);
        
        // Apply floor scaling
        const baseHealth = enemyTypeDef.baseHealth * scaling.healthMultiplier;
        const baseSpeed = enemyTypeDef.baseSpeed * scaling.speedMultiplier;
        const baseDamage = enemyTypeDef.baseDamage * scaling.damageMultiplier;
        const baseCooldown = enemyTypeDef.shootCooldown ? enemyTypeDef.shootCooldown / scaling.fireRateMultiplier : 0;
        
        // Get enemy augments
        const enemyAugs = getRandomEnemyAugments(currentFloor);
        
        // Apply augment bonuses
        let finalHealth = baseHealth;
        let finalSpeed = baseSpeed;
        let finalDamage = baseDamage;
        let finalCooldown = baseCooldown;
        let hasRegen = false;
        let hasShield = false;
        
        enemyAugs.forEach(aug => {
            switch (aug.type) {
                case 'health':
                    finalHealth *= (1 + aug.value);
                    break;
                case 'speed':
                    finalSpeed *= (1 + aug.value);
                    break;
                case 'damage':
                    finalDamage *= (1 + aug.value);
                    break;
                case 'fireRate':
                    finalCooldown /= (1 + aug.value);
                    break;
                case 'regen':
                    hasRegen = true;
                    break;
                case 'shield':
                    hasShield = true;
                    break;
            }
        });
        
        // Set enemy properties
        enemy.type = enemyTypeKey;
        enemy.attackPattern = enemyTypeDef.attackPattern;
        enemy.behavior = enemyTypeDef.behavior;
        enemy.health = Math.floor(finalHealth);
        enemy.maxHealth = enemy.health;
        enemy.speed = Math.floor(finalSpeed);
        enemy.damage = Math.floor(finalDamage);
        enemy.lastShot = 0;
        enemy.shootCooldown = Math.floor(finalCooldown);
        enemy.isBoss = false;
        enemy.augments = enemyAugs;
        enemy.hasRegen = hasRegen;
        enemy.hasShield = hasShield;
        enemy.shieldActive = hasShield;
        enemy.lastRegen = 0;
        enemy.regenCooldown = 2000; // Regen every 2 seconds
        
        // Special properties for specific enemy types
        if (enemyTypeDef.burstCount) {
            enemy.burstCount = enemyTypeDef.burstCount;
            enemy.burstIndex = 0;
        }
        if (enemyTypeDef.teleportCooldown) {
            enemy.teleportCooldown = enemyTypeDef.teleportCooldown;
            enemy.lastTeleport = 0;
        }
        if (enemyTypeDef.chargeCooldown) {
            enemy.chargeCooldown = enemyTypeDef.chargeCooldown;
            enemy.lastCharge = 0;
            enemy.isCharging = false;
        }
        
        // Assign room bounds to keep enemy in this room
        enemy.roomBounds = {
            x: room.x,
            y: room.y,
            width: room.width,
            height: room.height
        };
        
        enemies.add(enemy);
        enemyStates.set(enemy, {
            state: 'patrol',
            patrolTarget: { x: spawnX, y: spawnY },
            alertTimer: 0,
            lastSeenPlayer: 0
        });
        
        // Create health bar for this enemy
        const healthBarBg = scene.add.image(0, 0, 'healthBarBg');
        const healthBarFill = scene.add.image(0, 0, 'healthBarFill');
        healthBarFill.setOrigin(0, 0.5);
        healthBarBg.setOrigin(0.5, 0.5);
        healthBarFill.x = -healthBarBg.displayWidth / 2;
        
        const healthBarContainer = scene.add.container(spawnX, spawnY - 20, [healthBarBg, healthBarFill]);
        healthBarContainer.setDepth(15);
        enemy.healthBar = healthBarContainer;
        enemy.healthBarFill = healthBarFill;
        enemyHealthBars.add(healthBarContainer);
        
        // Track enemy in room
        if (!room.enemies) room.enemies = [];
        room.enemies.push(enemy);
    }
}

// Spawn boss in boss room
function spawnBoss(scene, room) {
    const spawnX = room.centerX;
    const spawnY = room.centerY;
    
    const boss = scene.physics.add.sprite(spawnX, spawnY, `enemy_${Phaser.Math.Between(0, 4)}`);
    boss.setScale(2.0); // Boss is bigger
    boss.setDepth(10);
    boss.setTint(0xff0000); // Red boss
    
    boss.type = 'boss';
    boss.health = 150 + (currentFloor * 30);
    boss.maxHealth = boss.health;
    boss.speed = 100;
    boss.lastShot = 0;
    boss.shootCooldown = 800; // Faster shooting
    boss.isBoss = true;
    boss.attackPattern = 'shotgun'; // Boss default attack pattern
    boss.behavior = 'chase'; // Will be overridden by updateBossBehavior
    boss.damage = 15 + (currentFloor * 2);
    
    // Room bounds to keep boss in the room
    boss.roomBounds = {
        x: room.x,
        y: room.y,
        width: room.width,
        height: room.height
    };
    
    // Boss name label
    const bossName = scene.add.text(spawnX, spawnY - 80, `FLOOR ${currentFloor} BOSS`, {
        fontSize: '24px',
        fill: '#ff0000',
        fontFamily: 'Courier New',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
    });
    bossName.setOrigin(0.5);
    bossName.setDepth(11);
    boss.bossLabel = bossName;
    
    // Create boss health bar (larger than regular enemies)
    const bgScale = 3;
    const bgHeightScale = 1.5;
    const baseWidth = 30; // Base texture width
    
    const healthBarBg = scene.add.image(0, 0, 'healthBarBg');
    healthBarBg.setScale(bgScale, bgHeightScale);
    healthBarBg.setOrigin(0.5, 0.5);
    
    const healthBarFill = scene.add.image(0, 0, 'healthBarFill');
    healthBarFill.setOrigin(0, 0.5); // Left-aligned
    
    // Position fill to align with left edge of background
    const bgWidth = baseWidth * bgScale; // 90 pixels
    healthBarFill.x = -bgWidth / 2; // -45 pixels (left edge of 90px wide bar)
    
    // Initialize health bar fill scale based on current health (should be 100% = full scale)
    const initialHealthPercent = Math.max(0, Math.min(1, boss.health / boss.maxHealth));
    healthBarFill.setScale(initialHealthPercent * bgScale, bgHeightScale);
    
    const healthBarContainer = scene.add.container(spawnX, spawnY - 50, [healthBarBg, healthBarFill]);
    healthBarContainer.setDepth(11);
    boss.healthBar = healthBarContainer;
    boss.healthBarFill = healthBarFill;
    boss.healthBarBaseWidth = bgWidth; // Store for calculations
    boss.healthBarBaseScale = bgScale; // Store base scale
    enemyHealthBars.add(healthBarContainer);
    
    enemies.add(boss);
    enemyStates.set(boss, {
        state: 'patrol',
        patrolTarget: { x: spawnX, y: spawnY },
        alertTimer: 0,
        lastSeenPlayer: 0
    });
    
    // Track boss in room
    if (!room.enemies) room.enemies = [];
    room.enemies.push(boss);
}

// Show augment selection screen
function showAugmentSelection() {
    if (augmentSelectionActive) return;
    
    augmentSelectionActive = true;
    
    // Pause game updates
    isLevelUpScreen = true;
    
    // Get random augments
    availableAugments = getRandomAugments(3);
    
    // Create overlay
    augmentSelectionOverlay = gameScene.add.container(400, 300);
    augmentSelectionOverlay.setDepth(400);
    augmentSelectionOverlay.setScrollFactor(0);
    
    // Background
    const bg = gameScene.add.rectangle(0, 0, 800, 600, 0x000000, 0.95);
    augmentSelectionOverlay.add(bg);
    
    // Title
    const title = gameScene.add.text(0, -250, `FLOOR ${currentFloor} CLEARED!\nChoose an Augment:`, {
        fontSize: '32px',
        fill: '#00ffff',
        fontFamily: 'Courier New',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
    });
    title.setOrigin(0.5);
    augmentSelectionOverlay.add(title);
    
    // Create augment buttons
    augmentButtons = [];
    const buttonSpacing = 250;
    const startX = -(buttonSpacing * (availableAugments.length - 1)) / 2;
    
    availableAugments.forEach((augment, index) => {
        const buttonX = startX + index * buttonSpacing;
        
        // Button background
        const buttonBg = gameScene.add.rectangle(buttonX, 0, 200, 300, 0x1a1a1a);
        buttonBg.setStrokeStyle(3, getRarityColor(augment.rarity), 1);
        buttonBg.setInteractive({ useHandCursor: true });
        augmentSelectionOverlay.add(buttonBg);
        
        // Augment icon
        const icon = gameScene.add.text(buttonX, -100, augment.icon, {
            fontSize: '64px'
        });
        icon.setOrigin(0.5);
        augmentSelectionOverlay.add(icon);
        
        // Augment name
        const nameText = gameScene.add.text(buttonX, -20, augment.name, {
            fontSize: '20px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: 180 }
        });
        nameText.setOrigin(0.5);
        augmentSelectionOverlay.add(nameText);
        
        // Augment description
        const descText = gameScene.add.text(buttonX, 40, augment.description, {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            align: 'center',
            wordWrap: { width: 180 }
        });
        descText.setOrigin(0.5);
        augmentSelectionOverlay.add(descText);
        
        // Rarity indicator
        const rarityText = gameScene.add.text(buttonX, 120, augment.rarity.toUpperCase(), {
            fontSize: '12px',
            fill: getRarityColor(augment.rarity),
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });
        rarityText.setOrigin(0.5);
        augmentSelectionOverlay.add(rarityText);
        
        // Button hover effects
        buttonBg.on('pointerover', () => {
            buttonBg.setFillStyle(0x2a2a2a, 1);
            buttonBg.setScale(1.05);
        });
        buttonBg.on('pointerout', () => {
            buttonBg.setFillStyle(0x1a1a1a, 1);
            buttonBg.setScale(1);
        });
        buttonBg.on('pointerdown', () => {
            selectAugment(augment);
        });
        
        augmentButtons.push({ bg: buttonBg, augment: augment });
    });
}

// Get rarity color
function getRarityColor(rarity) {
    switch (rarity) {
        case 'common': return 0x00ffff; // Cyan
        case 'uncommon': return 0x00ff00; // Green
        case 'rare': return 0xff00ff; // Magenta
        default: return 0xffffff;
    }
}

// Select an augment
function selectAugment(augment) {
    // Add augment to active augments
    activeAugments.push(augment);
    
    // Apply augment effects
    applyAugment(augment);
    
    // Close selection screen
    closeAugmentSelection();
    
    // Proceed to next floor
    proceedToNextFloor();
}

// Apply augment effects
function applyAugment(augment) {
    switch (augment.type) {
        case 'damage':
            baseBulletDamage *= (1 + augment.value);
            break;
        case 'speed':
            basePlayerSpeed *= (1 + augment.value);
            break;
        case 'fireRate':
            baseFireRate /= (1 + augment.value);
            break;
        case 'bulletSpeed':
            baseBulletSpeed *= (1 + augment.value);
            break;
        case 'maxHealth':
            playerMaxHealth += augment.value;
            playerHealth += augment.value;
            break;
        case 'regen':
            // Handled in update loop
            break;
        // Other augments handled in their respective systems
    }
    
    // Update mutations display
    updateAugmentsDisplay();
}

// Close augment selection
function closeAugmentSelection() {
    if (augmentSelectionOverlay) {
        augmentSelectionOverlay.destroy();
        augmentSelectionOverlay = null;
    }
    augmentButtons = [];
    augmentSelectionActive = false;
    isLevelUpScreen = false;
}

// Update augments display
function updateAugmentsDisplay() {
    if (!mutationsDisplay) return;
    
    let displayText = 'AUGMENTS: ';
    if (activeAugments.length === 0) {
        displayText += 'None';
    } else {
        displayText += activeAugments.map(a => a.icon).join(' ');
    }
    mutationsDisplay.setText(displayText);
}

// Proceed to next floor
function proceedToNextFloor() {
    if (floorTransitionActive) return;
    
    floorTransitionActive = true;
    
    if (currentFloor >= maxFloors) {
        // Victory!
        gameOver(true);
        return;
    }
    
    // Transition to next floor
    currentFloor++;
    clearedRooms.clear();
    currentRoomId = 0;
    
    // Clear everything
    enemies.clear(true, true);
    enemyStates.clear();
    bullets.clear(true, true);
    enemyBullets.clear(true, true);
    weaponPickups.clear(true, true);
    healthPickups.clear(true, true);
    
    // Regenerate map for new floor
    createProceduralMap(gameScene);
    
    // Move player to start room
    const firstRoom = mapRooms[0];
    player.setPosition(firstRoom.centerX, firstRoom.centerY);
    if (player.glow) {
        player.glow.setPosition(firstRoom.centerX, firstRoom.centerY);
    }
    
    // Update UI
    if (floorText) {
        floorText.setText(`FLOOR ${currentFloor}/100`);
    }
    if (roomCounterText) {
        roomCounterText.setText(`ROOM 1`);
    }
    
    // Spawn enemies for new floor
    startRoom(gameScene);
    
    floorTransitionActive = false;
}

function checkRoomCleared() {
    if (isGameOver || currentRoomId === null) return;
    
    const currentRoom = mapRooms[currentRoomId];
    if (!currentRoom) return;
    
    // Count living enemies in current room
    let livingEnemies = 0;
    enemies.children.entries.forEach(enemy => {
        if (!enemy.active) return;
        
        // Check if enemy is in current room
        if (enemy.x >= currentRoom.x && enemy.x <= currentRoom.x + currentRoom.width &&
            enemy.y >= currentRoom.y && enemy.y <= currentRoom.y + currentRoom.height) {
            livingEnemies++;
        }
    });
    
    // If all enemies in room are dead, unlock doors
    if (livingEnemies === 0 && !clearedRooms.has(currentRoomId)) {
        clearedRooms.add(currentRoomId);
        currentRoom.cleared = true;
        
        // Unlock all doors connected to this room
        if (roomDoors.has(currentRoomId)) {
            roomDoors.get(currentRoomId).forEach(door => {
                if (door.locked) {
                    unlockDoor(door.room1Id, door.room2Id);
                }
            });
        }
        
        // If this is the boss room and boss is dead, show augment selection
        if (currentRoom.isBossRoom && currentRoomId === bossRoomId) {
            showAugmentSelection();
        }
    }
}

function createExitPortal(scene) {
    // Create portal at center bottom of room
    exitPortal = scene.physics.add.sprite(400, 500, 'portal');
    exitPortal.setScale(1.5);
    exitPortal.setInteractive();
    exitPortal.setCollideWorldBounds(false);
    exitPortal.body.setSize(40, 40);
    
    // Add glow effect
    const glow = scene.add.circle(400, 500, 30, 0x00ffff, 0.2);
    glow.setDepth(-1);
    exitPortal.glow = glow;
    
    // Add text
    const portalText = scene.add.text(400, 500, 'EXIT', {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Courier New',
        stroke: '#000000',
        strokeThickness: 2
    });
    portalText.setOrigin(0.5);
    exitPortal.text = portalText;
    
    // Set up collision detection with player
    scene.physics.add.overlap(player, exitPortal, enterPortal, null, scene);
}

function enterPortal() {
    if (!exitPortal || !exitPortal.active || !isRoomCleared) return;
    
    // Polish: Create portal exit particles (disabled)
    // createDeathParticles(exitPortal.x, exitPortal.y, 0x00ffff);
    
    // Polish: Screen flash on portal entry
    flashScreen(0x00ffff, 200);
    
    // Polish: Screen shake on portal entry
    addScreenShake(5, 300);
    
    // Clear all bullets
    bullets.clear(true, true);
    enemyBullets.clear(true, true);
    stopLaser();
    
    // Destroy portal
    if (exitPortal.glow) exitPortal.glow.destroy();
    if (exitPortal.text) exitPortal.text.destroy();
    exitPortal.destroy();
    exitPortal = null;
    
    // Move to next room (this counts as clearing the current room)
    currentRoom++;
    roomCounterText.setText(`ROOM ${currentRoom}`);
    
    // Polish: Animate room counter text
    gameScene.tweens.add({
        targets: roomCounterText,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 200,
        yoyo: true,
        ease: 'Power2'
    });
    
    // Start next room
    startRoom(gameScene);
}

function isValidSpawnPosition(x, y, minDistanceFromPlayer = 150) {
    // Check distance from player spawn
    if (Phaser.Math.Distance.Between(x, y, 400, 300) < minDistanceFromPlayer) {
        return false;
    }
    
    // Check distance from obstacles
    if (roomObstacles) {
        for (let obstacle of roomObstacles.children.entries) {
            if (obstacle.active) {
                const dist = Phaser.Math.Distance.Between(x, y, obstacle.x, obstacle.y);
                if (dist < 60) { // Minimum distance from obstacles
                    return false;
                }
            }
        }
    }
    
    // Check distance from walls (keep enemies away from edges)
    if (x < 80 || x > 720 || y < 80 || y > 520) {
        return false;
    }
    
    return true;
}

function spawnEnemies(scene, count) {
    const minDistance = 150; // Minimum distance from player spawn
    
    for (let i = 0; i < count; i++) {
        let x, y;
        let attempts = 0;
        let validPosition = false;
        
        // Find a valid spawn position (not too close to player or obstacles)
        do {
            x = Phaser.Math.Between(80, 720);
            y = Phaser.Math.Between(80, 520);
            attempts++;
            validPosition = isValidSpawnPosition(x, y, minDistance);
        } while (!validPosition && attempts < 50);
        
        // If we couldn't find a valid position after many attempts, use a fallback
        if (!validPosition) {
            // Try positions in a circle around the center
            const angle = (i / count) * Math.PI * 2;
            const radius = 200;
            x = 400 + Math.cos(angle) * radius;
            y = 300 + Math.sin(angle) * radius;
        }
        
        // Determine enemy type (50% melee, 50% ranged)
        const isRanged = Phaser.Math.Between(0, 1) === 1;
        const enemyType = isRanged ? 0 : 1; // 0 = ranged (red), 1 = melee (purple)
        const enemy = scene.physics.add.sprite(x, y, `enemy_${enemyType}`);
        
        // Enemy properties
        enemy.setCollideWorldBounds(true);
        enemy.setScale(1.2);
        enemy.setDepth(5); // Ensure enemies are visible
        enemy.maxHealth = Phaser.Math.Between(10, 20);
        enemy.health = enemy.maxHealth;
        enemy.isHit = false;
        enemy.hitFlashStartTime = null;
        enemy.type = isRanged ? 'ranged' : 'melee';
        enemy.speed = isRanged ? 120 : 150; // Ranged slower, melee faster
        enemy.lastShot = 0;
        enemy.shootCooldown = isRanged ? 2000 : 0; // Ranged enemies shoot every 2 seconds
        
        // Add to enemies group
        enemies.add(enemy);
        
        // Create health bar for this enemy
        const healthBarBg = scene.add.image(0, 0, 'healthBarBg');
        healthBarBg.setOrigin(0.5, 0.5);
        
        const healthBarFill = scene.add.image(0, 0, 'healthBarFill');
        healthBarFill.setOrigin(0, 0.5); // Left-aligned
        healthBarFill.x = -15; // Base width is 30, so -15 aligns to left edge
        
        const healthBarContainer = scene.add.container(x, y - 20, [healthBarBg, healthBarFill]);
        enemy.healthBar = healthBarContainer;
        enemy.healthBarFill = healthBarFill;
        enemyHealthBars.add(healthBarContainer);
    }
}

function hitEnemy(bullet, enemy) {
    // Safety checks
    if (!bullet || !bullet.active || !enemy || !enemy.active) {
        return;
    }
    
    // Prevent multiple hits from same bullet
    if (bullet.hitEnemies) {
        if (bullet.hitEnemies.has(enemy)) {
            return;
        }
    } else {
        bullet.hitEnemies = new Set();
    }
    bullet.hitEnemies.add(enemy);
    
    // Get damage value
    const damage = bullet.damage || bulletDamage;
    
    // Check for enemy shield
    if (enemy.hasShield && enemy.shieldActive) {
        enemy.shieldActive = false;
        return;
    }
    
    // Apply damage
    enemy.health -= damage;
    enemy.isHit = true; // Trigger hit flash
    
    // Lifesteal augment (simplified)
    if (activeAugments && activeAugments.length > 0) {
        for (let i = 0; i < activeAugments.length; i++) {
            if (activeAugments[i].type === 'lifesteal') {
                playerHealth = Math.min(playerMaxHealth, playerHealth + Math.floor(damage * activeAugments[i].value));
            }
        }
    }
    
    // Destroy bullet on impact (unless piercing)
    if (!bullet.piercing) {
        if (bullet.trail) {
            bullet.trail.destroy();
            bullet.trail = null;
        }
        bullets.killAndHide(bullet);
    }
    
    // Check if enemy is dead
    if (enemy.health <= 0 && enemy.active) {
        killEnemy(enemy);
    }
}

function killEnemy(enemy) {
    if (!enemy) return;
    
    const enemyX = enemy.x;
    const enemyY = enemy.y;
    const isBoss = enemy.isBoss;
    
    // Gain XP for killing enemy (bosses give more)
    const xpGain = isBoss ? 100 : 10;
    playerXP += xpGain;
    
    // Track total kills
    totalEnemiesKilled++;
    
    // Check for level up
    checkLevelUp();
    
    // Update XP display
    if (xpText) {
        xpText.setText(`XP: ${playerXP}/${xpToNextLevel}`);
    }
    
    // Drop loot
    if (gameScene) {
        dropEnemyLoot(gameScene, enemyX, enemyY, isBoss);
    }
    
    // Remove health bar
    if (enemy.healthBar) {
        enemy.healthBar.destroy();
    }
    
    // Remove boss label if it exists
    if (enemy.bossLabel) {
        enemy.bossLabel.destroy();
    }
    
    // Remove enemy
    enemies.remove(enemy);
    enemy.destroy();
}

// Drop loot from killed enemies
function dropEnemyLoot(scene, x, y, isBoss) {
    // Bosses always drop something good
    if (isBoss) {
        // 100% chance to drop augment pickup
        dropAugmentPickup(scene, x, y);
        // 50% chance to also drop a weapon
        if (Math.random() < 0.5) {
            dropWeapon(scene, x + 30, y);
        }
        // Always drop health
        dropHealthPack(scene, x - 30, y);
        return;
    }
    
    // Regular enemy loot chances
    const roll = Math.random();
    
    if (roll < 0.02) {
        // 2% chance to drop augment
        dropAugmentPickup(scene, x, y);
    } else if (roll < 0.10) {
        // 8% chance to drop weapon
        dropWeapon(scene, x, y);
    } else if (roll < 0.25) {
        // 15% chance to drop health
        dropHealthPack(scene, x, y);
    }
    // 75% chance to drop nothing
}

// Drop an augment pickup
function dropAugmentPickup(scene, x, y) {
    const pickup = scene.physics.add.sprite(x, y, 'weaponPickup');
    pickup.setScale(1.8);
    pickup.setTint(0xff00ff); // Purple for augment
    pickup.isAugmentPickup = true;
    
    // Get a random augment for this pickup
    const randomAugments = getRandomAugments(1);
    pickup.augment = randomAugments[0];
    
    // Add glow/pulse animation
    scene.tweens.add({
        targets: pickup,
        scaleX: 2.2,
        scaleY: 2.2,
        alpha: 0.7,
        duration: 600,
        yoyo: true,
        repeat: -1
    });
    
    // Add label showing augment icon
    const label = scene.add.text(x, y - 25, pickup.augment.icon, {
        fontSize: '24px'
    });
    label.setOrigin(0.5);
    label.setDepth(20);
    pickup.label = label;
    
    // Add to weapon pickups group (reuse existing collision)
    weaponPickups.add(pickup);
}

function checkLevelUp() {
    if (playerXP >= xpToNextLevel) {
        // Level up!
        playerLevel++;
        playerXP -= xpToNextLevel;
        xpToNextLevel = Math.floor(100 * Math.pow(1.2, playerLevel - 1)); // Increasing XP requirement
        
        // Update displays
        if (levelText) {
            levelText.setText(`LEVEL: ${playerLevel}`);
        }
        if (xpText) {
            xpText.setText(`XP: ${playerXP}/${xpToNextLevel}`);
        }
        
        // Show level up screen
        showLevelUpScreen();
    }
}

function showLevelUpScreen() {
    isLevelUpScreen = true;
    
    // Pause all enemies
    enemies.children.entries.forEach(enemy => {
        enemy.setVelocity(0, 0);
    });
    
    // Create overlay
    const overlay = gameScene.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
    overlay.setDepth(100);
    
    // Level up text
    const levelUpText = gameScene.add.text(400, 150, 'LEVEL UP!', {
        fontSize: '48px',
        fill: '#00ffff',
        fontFamily: 'Courier New',
        stroke: '#000000',
        strokeThickness: 4
    });
    levelUpText.setOrigin(0.5);
    levelUpText.setDepth(101);
    
    // Choose 3 random mutations
    const mutationKeys = Object.keys(mutations);
    const availableMutations = [];
    const usedIndices = new Set();
    
    while (availableMutations.length < 3 && availableMutations.length < mutationKeys.length) {
        const randomIndex = Phaser.Math.Between(0, mutationKeys.length - 1);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            availableMutations.push(mutationKeys[randomIndex]);
        }
    }
    
    // Create mutation choice buttons
    mutationButtons = [];
    mutationTexts = [];
    
    availableMutations.forEach((mutationKey, index) => {
        const mutation = mutations[mutationKey];
        const yPos = 250 + index * 100;
        
        // Button background
        const button = gameScene.add.rectangle(400, yPos, 600, 80, 0x1a1a1a);
        button.setStrokeStyle(2, 0x00ffff, 1);
        button.setInteractive({ useHandCursor: true });
        button.setDepth(101);
        button.mutationKey = mutationKey;
        
        // Mutation name
        const nameText = gameScene.add.text(400, yPos - 15, mutation.name, {
            fontSize: '24px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });
        nameText.setOrigin(0.5);
        nameText.setDepth(102);
        
        // Mutation description
        const descText = gameScene.add.text(400, yPos + 15, mutation.description, {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        });
        descText.setOrigin(0.5);
        descText.setDepth(102);
        
        // Button hover effects
        button.on('pointerover', () => {
            button.setFillStyle(0x2a2a2a);
        });
        
        button.on('pointerout', () => {
            button.setFillStyle(0x1a1a1a);
        });
        
        button.on('pointerdown', () => {
            selectMutation(mutationKey);
        });
        
        mutationButtons.push(button);
        mutationTexts.push(nameText, descText);
    });
    
    levelUpOverlay = {
        overlay: overlay,
        levelUpText: levelUpText,
        buttons: mutationButtons,
        texts: mutationTexts
    };
}

function selectMutation(mutationKey) {
    // Add mutation to active mutations
    activeMutations.push(mutationKey);
    
    // Apply mutation effect
    applyMutation(mutationKey);
    
    // Update mutations display
    updateMutationsDisplay();
    
    // Close level up screen
    closeLevelUpScreen();
}

function applyMutation(mutationKey) {
    const mutation = mutations[mutationKey];
    
    switch (mutation.effect) {
        case 'maxHealth':
            playerMaxHealth += mutation.value;
            playerHealth += mutation.value; // Also increase current health
            break;
        case 'damage':
            // Damage is applied per weapon in shoot function
            break;
        case 'fireRate':
            // Fire rate is applied per weapon
            break;
        case 'bulletSpeed':
            // Bullet speed is applied per weapon
            break;
        // Other effects are handled in update functions
    }
}

function getMutationValue(effectType) {
    let total = 0;
    activeMutations.forEach(key => {
        const mutation = mutations[key];
        if (mutation.effect === effectType) {
            total += mutation.value;
        }
    });
    // Also check augments
    activeAugments.forEach(augment => {
        if (augment.type === effectType && typeof augment.value === 'number') {
            total += augment.value;
        }
    });
    return total;
}

function getMutationMultiplier(effectType) {
    let multiplier = 1;
    activeMutations.forEach(key => {
        const mutation = mutations[key];
        if (mutation.effect === effectType) {
            multiplier += mutation.value;
        }
    });
    // Also check augments
    activeAugments.forEach(augment => {
        if (augment.type === effectType && typeof augment.value === 'number') {
            multiplier += augment.value;
        }
    });
    return multiplier;
}

function updatePlayerStats() {
    // Update movement speed
    const speedMultiplier = getMutationMultiplier('speed');
    const adrenalineMultiplier = (playerHealth < playerMaxHealth * 0.3) ? 
        getMutationMultiplier('adrenaline') : 1;
    playerSpeed = basePlayerSpeed * speedMultiplier * adrenalineMultiplier;
}

function updateMutationsDisplay() {
    // This is now handled by updateAugmentsDisplay
    updateAugmentsDisplay();
}

function updateAugmentsDisplay() {
    if (!mutationsDisplay) return;
    
    let displayText = 'AUGMENTS: ';
    if (activeAugments.length === 0) {
        displayText += 'None';
    } else {
        displayText += activeAugments.map(a => a.icon).join(' ');
    }
    mutationsDisplay.setText(displayText);
}

function closeLevelUpScreen() {
    if (!levelUpOverlay) return;
    
    // Destroy overlay elements
    levelUpOverlay.overlay.destroy();
    levelUpOverlay.levelUpText.destroy();
    levelUpOverlay.buttons.forEach(btn => btn.destroy());
    levelUpOverlay.texts.forEach(txt => txt.destroy());
    
    levelUpOverlay = null;
    mutationButtons = [];
    mutationTexts = [];
    isLevelUpScreen = false;
}

function updateEnemyAI(scene, time) {
    enemies.children.entries.forEach(enemy => {
        if (!enemy.active || !player.active) return;
        
        // Handle enemy regen
        if (enemy.hasRegen && time > enemy.lastRegen + enemy.regenCooldown) {
            enemy.health = Math.min(enemy.maxHealth, enemy.health + 1);
            enemy.lastRegen = time;
        }
        
        // Initialize enemy state if not set
        if (!enemyStates.has(enemy)) {
            enemyStates.set(enemy, {
                state: 'patrol',
                patrolTarget: { x: enemy.x, y: enemy.y },
                alertTimer: 0,
                lastSeenPlayer: 0
            });
        }
        
        const enemyState = enemyStates.get(enemy);
        // Bosses use dynamic behavior patterns
        const behavior = enemy.isBoss ? updateBossBehavior(enemy, time) : (enemy.behavior || 'chase');
        const distance = Phaser.Math.Distance.Between(
            enemy.x, enemy.y,
            player.x, player.y
        );
        
        // Check line of sight
        const sightRange = 400;
        const hasSight = distance < sightRange && hasLineOfSight(enemy, player, allObstacles);
        
        // State machine for enemy AI
        if (hasSight) {
            // Player is visible
            enemyState.state = 'combat';
            enemyState.lastSeenPlayer = time;
            enemyState.alertTimer = time + 2000; // Stay alert for 2 seconds after losing sight
            
            // Handle different behaviors
            const angle = Phaser.Math.Angle.Between(
                enemy.x, enemy.y,
                player.x, player.y
            );
            
            switch (behavior) {
                case 'chase':
                case 'melee':
                    // Directly chase player
                    scene.physics.velocityFromRotation(angle, enemy.speed, enemy.body.velocity);
                    break;
                    
                case 'maintainDistance':
                    // Maintain optimal range (200-300 pixels)
                    if (distance > 300) {
                        scene.physics.velocityFromRotation(angle, enemy.speed * 0.7, enemy.body.velocity);
                    } else if (distance < 200) {
                        // Move away from player
                        scene.physics.velocityFromRotation(angle + Math.PI, enemy.speed * 0.5, enemy.body.velocity);
                    } else {
                        enemy.setVelocity(0, 0);
                    }
                    // Shoot if ranged
                    if (enemy.attackPattern !== 'melee' && time > enemy.lastShot + enemy.shootCooldown) {
                        enemyShoot(scene, enemy);
                        enemy.lastShot = time;
                    }
                    break;
                    
                case 'flee':
                    // Move away from player (sniper behavior)
                    scene.physics.velocityFromRotation(angle + Math.PI, enemy.speed, enemy.body.velocity);
                    if (time > enemy.lastShot + enemy.shootCooldown) {
                        enemyShoot(scene, enemy);
                        enemy.lastShot = time;
                    }
                    break;
                    
                case 'teleport':
                    // Teleport near player periodically
                    if (time > (enemy.lastTeleport || 0) + enemy.teleportCooldown) {
                        // Teleport to random position near player
                        const teleportAngle = Math.random() * Math.PI * 2;
                        const teleportDistance = Phaser.Math.Between(150, 250);
                        enemy.x = player.x + Math.cos(teleportAngle) * teleportDistance;
                        enemy.y = player.y + Math.sin(teleportAngle) * teleportDistance;
                        enemy.lastTeleport = time;
                        // Visual effect (flash)
                        enemy.setTint(0xffffff);
                        scene.time.delayedCall(100, () => {
                            if (enemy && enemy.active) enemy.clearTint();
                        });
                    } else {
                        // Move toward player while waiting for teleport
                        scene.physics.velocityFromRotation(angle, enemy.speed * 0.5, enemy.body.velocity);
                    }
                    if (time > enemy.lastShot + enemy.shootCooldown) {
                        enemyShoot(scene, enemy);
                        enemy.lastShot = time;
                    }
                    break;
                    
                case 'charge':
                    // Charge at player periodically
                    if (!enemy.isCharging && time > (enemy.lastCharge || 0) + enemy.chargeCooldown) {
                        enemy.isCharging = true;
                        enemy.lastCharge = time;
                        enemy.chargeEndTime = time + 1000; // Charge for 1 second
                    }
                    if (enemy.isCharging && time < enemy.chargeEndTime) {
                        // Charge at high speed
                        scene.physics.velocityFromRotation(angle, enemy.speed * 2, enemy.body.velocity);
                    } else {
                        enemy.isCharging = false;
                        // Normal movement
                        scene.physics.velocityFromRotation(angle, enemy.speed * 0.7, enemy.body.velocity);
                    }
                    break;
                    
                case 'stationary':
                    // Don't move, just shoot
                    enemy.setVelocity(0, 0);
                    if (time > enemy.lastShot + enemy.shootCooldown) {
                        enemyShoot(scene, enemy);
                        enemy.lastShot = time;
                    }
                    break;
                    
                default:
                    // Default: chase
                    scene.physics.velocityFromRotation(angle, enemy.speed, enemy.body.velocity);
            }
        } else if (enemyState.state === 'combat' && time < enemyState.alertTimer) {
            // Lost sight but still alert - move to last known position
            enemyState.state = 'alert';
            const angle = Phaser.Math.Angle.Between(
                enemy.x, enemy.y,
                player.x, player.y
            );
            scene.physics.velocityFromRotation(angle, enemy.speed * 0.5, enemy.body.velocity);
        } else {
            // Patrol state
            enemyState.state = 'patrol';
            
            // Simple patrol: move to random nearby point
            const patrolDistance = Phaser.Math.Distance.Between(
                enemy.x, enemy.y,
                enemyState.patrolTarget.x, enemyState.patrolTarget.y
            );
            
            if (patrolDistance < 50 || Math.random() < 0.01) {
                // Pick new patrol target
                enemyState.patrolTarget = {
                    x: enemy.x + Phaser.Math.Between(-200, 200),
                    y: enemy.y + Phaser.Math.Between(-200, 200)
                };
            }
            
            const angle = Phaser.Math.Angle.Between(
                enemy.x, enemy.y,
                enemyState.patrolTarget.x, enemyState.patrolTarget.y
            );
            scene.physics.velocityFromRotation(angle, enemy.speed * 0.3, enemy.body.velocity);
        }
    });
}

function enemyShoot(scene, enemy) {
    if (!enemy || !enemy.active || !player || !player.active) return;
    
    const attackPattern = enemy.attackPattern || 'single';
    const angle = Phaser.Math.Angle.Between(
        enemy.x,
        enemy.y,
        player.x,
        player.y
    );
    
    switch (attackPattern) {
        case 'single':
            // Single bullet
            createEnemyBullet(scene, enemy, angle, enemy.damage);
            break;
            
        case 'shotgun':
            // Spread shot (5 bullets)
            for (let i = -2; i <= 2; i++) {
                const spreadAngle = angle + (i * 0.2); // 0.2 radian spread
                createEnemyBullet(scene, enemy, spreadAngle, enemy.damage);
            }
            break;
            
        case 'burst':
            // Burst fire (3 bullets in quick succession)
            if (!enemy.burstIndex) enemy.burstIndex = 0;
            if (enemy.burstIndex === 0) {
                // Start of burst - fire first bullet
                createEnemyBullet(scene, enemy, angle, enemy.damage);
                enemy.burstIndex = 1;
                // Schedule next bullets in burst
                scene.time.delayedCall(150, () => {
                    if (enemy && enemy.active) {
                        createEnemyBullet(scene, enemy, angle, enemy.damage);
                        enemy.burstIndex = 2;
                        scene.time.delayedCall(150, () => {
                            if (enemy && enemy.active) {
                                createEnemyBullet(scene, enemy, angle, enemy.damage);
                                enemy.burstIndex = 0; // Reset for next burst
                            }
                        });
                    }
                });
            }
            break;
            
        case 'sniper':
            // High damage, slow bullet
            const sniperBullet = createEnemyBullet(scene, enemy, angle, enemy.damage);
            if (sniperBullet) {
                sniperBullet.setScale(1.5); // Larger bullet
                // Slower but more visible
                const speed = enemyBulletSpeed * 0.7;
                scene.physics.velocityFromRotation(angle, speed, sniperBullet.body.velocity);
            }
            break;
            
        case 'rapid':
            // Rapid fire (2 bullets at once)
            createEnemyBullet(scene, enemy, angle, enemy.damage);
            scene.time.delayedCall(100, () => {
                if (enemy && enemy.active) {
                    createEnemyBullet(scene, enemy, angle, enemy.damage);
                }
            });
            break;
            
        case 'melee':
            // Melee enemies don't shoot
            break;
        
        case 'circle':
            // Circle shot (8 bullets in all directions) - boss attack
            for (let i = 0; i < 8; i++) {
                const circleAngle = (i / 8) * Math.PI * 2;
                createEnemyBullet(scene, enemy, circleAngle, enemy.damage);
            }
            break;
        
        case 'spiral':
            // Spiral shot - boss attack
            if (!enemy.spiralAngle) enemy.spiralAngle = 0;
            for (let i = 0; i < 3; i++) {
                const spiralAngle = enemy.spiralAngle + (i * Math.PI * 2 / 3);
                createEnemyBullet(scene, enemy, spiralAngle, enemy.damage);
            }
            enemy.spiralAngle += 0.3;
            break;
        
        case 'wave':
            // Wave shot - multiple bullets in a wave pattern
            for (let i = -3; i <= 3; i++) {
                const waveAngle = angle + (i * 0.15);
                const bullet = createEnemyBullet(scene, enemy, waveAngle, enemy.damage);
                if (bullet) {
                    // Stagger bullet speeds for wave effect
                    const speed = enemyBulletSpeed * (1 - Math.abs(i) * 0.1);
                    scene.physics.velocityFromRotation(waveAngle, speed, bullet.body.velocity);
                }
            }
            break;
            
        default:
            createEnemyBullet(scene, enemy, angle, enemy.damage);
    }
}

function createEnemyBullet(scene, enemy, angle, damage) {
    const bullet = enemyBullets.get(enemy.x, enemy.y);
    
    if (!bullet) {
        return null; // No available bullets in pool
    }
    
    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.setScale(1);
    bullet.hitEnemies = new Set(); // Track hits for enemy bullets too
    bullet.damage = damage || enemyBulletDamage;
    
    // Set bullet velocity
    scene.physics.velocityFromRotation(angle, enemyBulletSpeed, bullet.body.velocity);
    
    // Reset bullet position
    bullet.setPosition(enemy.x, enemy.y);
    
    return bullet;
}

function hitPlayer(bullet, playerSprite) {
    // Safety checks
    if (!bullet || !bullet.active || !playerSprite || !playerSprite.active) {
        return;
    }
    
    if (!gameScene || isGameOver) {
        return;
    }
    
    // Check invincibility frames
    const currentTime = gameScene.time.now;
    if (playerInvincible && currentTime < playerInvincibleUntil) {
        enemyBullets.killAndHide(bullet);
        return;
    }
    
    // Set invincibility frames (500ms)
    playerInvincible = true;
    playerInvincibleUntil = currentTime + 500;
    
    // Destroy bullet
    enemyBullets.killAndHide(bullet);
    
    // Damage player
    const damage = bullet.damage || enemyBulletDamage;
    playerHealth -= damage;
    
    // Check if player is dead
    if (playerHealth <= 0) {
        playerHealth = 0;
        gameOver();
    }
}

function updatePlayerHealthBar() {
    if (!playerHealthBar) return;
    
    const healthPercent = playerHealth / playerMaxHealth;
    playerHealthBar.fill.setScale(healthPercent, 1);
    
    // Change color based on health
    if (healthPercent > 0.6) {
        playerHealthBar.fill.setTint(0x00ff00); // Green
    } else if (healthPercent > 0.3) {
        playerHealthBar.fill.setTint(0xffff00); // Yellow
    } else {
        playerHealthBar.fill.setTint(0xff0000); // Red
    }
}

function gameOver(victory = false) {
    isGameOver = true;
    
    // Stop player movement
    if (player) {
        player.setVelocity(0, 0);
    }
    
    // Stop all enemies
    enemies.children.entries.forEach(enemy => {
        enemy.setVelocity(0, 0);
    });
    
    // Calculate game stats
    const timeSurvived = Math.floor((Date.now() - gameStartTime) / 1000); // seconds
    gameStats = {
        floorsCleared: currentFloor - 1,
        enemiesKilled: totalEnemiesKilled,
        timeSurvived: timeSurvived,
        mutationsCollected: activeMutations.length,
        finalLevel: playerLevel
    };
    
    // Calculate score (floors * 1000 + kills * 10 + time)
    const score = gameStats.floorsCleared * 1000 + gameStats.enemiesKilled * 10 + gameStats.timeSurvived;
    
    // Get and update high score
    const highScore = getHighScore();
    const isNewHighScore = score > highScore;
    if (isNewHighScore) {
        saveHighScore(score);
    }
    
    // Create overlay
    const overlay = gameScene.add.rectangle(400, 300, 800, 600, 0x000000, 0.9);
    overlay.setDepth(200);
    overlay.setScrollFactor(0);
    
    // Game over text (victory or defeat)
    const gameOverMessage = victory ? 'VICTORY!\nFLOOR 100 CLEARED!' : 'GAME OVER';
    const gameOverColor = victory ? '#00ff00' : '#ff0000';
    gameOverText = gameScene.add.text(400, 100, gameOverMessage, {
        fontSize: '48px',
        fill: gameOverColor,
        fontFamily: 'Courier New',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
    });
    gameOverText.setOrigin(0.5);
    gameOverText.setDepth(201);
    gameOverText.setScrollFactor(0);
    
    // Stats display
    const statsY = 200;
    const statsStyle = {
        fontSize: '20px',
        fill: '#00ffff',
        fontFamily: 'Courier New',
        align: 'center'
    };
    
    const statsText = gameScene.add.text(400, statsY, 
        `FLOORS CLEARED: ${gameStats.floorsCleared}\n` +
        `ENEMIES KILLED: ${gameStats.enemiesKilled}\n` +
        `TIME SURVIVED: ${formatTime(gameStats.timeSurvived)}\n` +
        `MUTATIONS: ${gameStats.mutationsCollected}\n` +
        `FINAL LEVEL: ${gameStats.finalLevel}\n` +
        `\nSCORE: ${score}`,
        statsStyle
    );
    statsText.setOrigin(0.5);
    statsText.setDepth(201);
    statsText.setScrollFactor(0);
    
    // High score display
    const highScoreText = gameScene.add.text(400, statsY + 180, 
        `HIGH SCORE: ${Math.max(score, highScore)}${isNewHighScore ? ' (NEW!)' : ''}`,
        {
            fontSize: '24px',
            fill: isNewHighScore ? '#ffff00' : '#00ffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }
    );
    highScoreText.setOrigin(0.5);
    highScoreText.setDepth(201);
    
    // Create Play Again button
    restartButton = gameScene.add.rectangle(400, 480, 250, 60, 0x00ffff);
    restartButton.setInteractive({ useHandCursor: true });
    restartButton.setDepth(201);
    
    const restartText = gameScene.add.text(400, 480, 'CHARACTER SELECT', {
        fontSize: '24px',
        fill: '#000000',
        fontFamily: 'Courier New',
        fontStyle: 'bold'
    });
    restartText.setOrigin(0.5);
    restartText.setDepth(202);
    
    restartButton.on('pointerdown', () => {
        // Return to character select instead of restarting
        gameScene.scene.start('CharacterSelectScene');
    });
    
    restartButton.on('pointerover', () => {
        restartButton.setFillStyle(0x00ffff, 0.8);
    });
    
    restartButton.on('pointerout', () => {
        restartButton.setFillStyle(0x00ffff, 1);
    });
    
    // Add menu button
    const menuButton = gameScene.add.rectangle(400, 540, 200, 50, 0x666666);
    menuButton.setStrokeStyle(2, 0x888888, 1);
    menuButton.setInteractive({ useHandCursor: true });
    menuButton.setDepth(201);
    
    const menuText = gameScene.add.text(400, 540, 'MAIN MENU', {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Courier New',
        fontStyle: 'bold'
    });
    menuText.setOrigin(0.5);
    menuText.setDepth(202);
    
    menuButton.on('pointerdown', () => {
        gameScene.scene.start('MainMenuScene');
    });
    
    menuButton.on('pointerover', () => {
        menuButton.setFillStyle(0x888888, 1);
    });
    
    menuButton.on('pointerout', () => {
        menuButton.setFillStyle(0x666666, 1);
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getHighScore() {
    try {
        const highScore = localStorage.getItem('cyberpunkRoguelikeHighScore');
        return highScore ? parseInt(highScore, 10) : 0;
    } catch (e) {
        return 0;
    }
}

function saveHighScore(score) {
    try {
        localStorage.setItem('cyberpunkRoguelikeHighScore', score.toString());
    } catch (e) {
        // localStorage not available, ignore
    }
}

function restartGame() {
    // Close level up screen if open
    if (isLevelUpScreen) {
        closeLevelUpScreen();
    }
    
    // Destroy all game objects
    bullets.clear(true, true);
    enemyBullets.clear(true, true);
    enemies.clear(true, true);
    enemyHealthBars.removeAll(true);
    weaponPickups.clear(true, true);
    healthPickups.clear(true, true);
    stopLaser();
    
    // Clean up game over screen
    if (gameOverText) {
        gameOverText.destroy();
        gameOverText = null;
    }
    if (restartButton) {
        restartButton.destroy();
        restartButton = null;
    }
    
    // Destroy any overlay elements (they might be in a container)
    gameScene.children.list.forEach(child => {
        if (child.depth >= 200) {
            child.destroy();
        }
    });
    
    if (exitPortal) {
        if (exitPortal.glow) exitPortal.glow.destroy();
        if (exitPortal.text) exitPortal.text.destroy();
        exitPortal.destroy();
        exitPortal = null;
    }
    
    // Reset game state
    playerMaxHealth = 100;
    playerHealth = playerMaxHealth;
    isGameOver = false;
    currentRoom = 1;
    isRoomCleared = false;
    playerXP = 0;
    playerLevel = 1;
    xpToNextLevel = 100;
    activeMutations = [];
    basePlayerSpeed = 200;
    baseBulletDamage = 7;
    baseFireRate = 150;
    baseBulletSpeed = 600;
    totalEnemiesKilled = 0;
    gameStartTime = Date.now();
    playerInvincible = false;
    playerInvincibleUntil = 0;
    gameStats = {
        floorsCleared: 0,
        enemiesKilled: 0,
        timeSurvived: 0,
        mutationsCollected: 0,
        finalLevel: 1
    };
    
    roomCounterText.setText(`ROOM ${currentRoom}`);
    currentWeapon = weapons.pistol;
    if (weaponText) {
        weaponText.setText(`WEAPON: ${currentWeapon.name}`);
    }
    if (levelText) {
        levelText.setText(`LEVEL: ${playerLevel}`);
    }
    if (xpText) {
        xpText.setText(`XP: ${playerXP}/${xpToNextLevel}`);
    }
    updateMutationsDisplay();
    
    // Reset player position
    player.setPosition(400, 300);
    player.clearTint();
    
    // Start first room
    startRoom(gameScene);
}

function updateHealthBars(scene, time) {
    enemies.children.entries.forEach(enemy => {
        if (enemy.active && enemy.healthBar) {
            // Update health bar position (bosses need more offset due to size)
            const yOffset = enemy.isBoss ? -60 : -25;
            enemy.healthBar.setPosition(enemy.x, enemy.y + yOffset);
            
            // Update boss label position too
            if (enemy.isBoss && enemy.bossLabel) {
                enemy.bossLabel.setPosition(enemy.x, enemy.y - 90);
            }
            
            // Update health bar fill width
            if (!enemy.healthBarFill || !enemy.maxHealth) return;
            
            const healthPercent = Math.max(0, Math.min(1, enemy.health / enemy.maxHealth));
            
            // Boss health bars are scaled 3x wider, regular ones are 1x
            if (enemy.isBoss) {
                // Boss: scale by healthPercent (base scale is 3)
                const baseScale = enemy.healthBarBaseScale || 3;
                const newScaleX = healthPercent * baseScale;
                enemy.healthBarFill.setScale(newScaleX, 1.5);
                // Reposition fill to stay left-aligned (x position stays constant)
                if (enemy.healthBarBaseWidth) {
                    enemy.healthBarFill.x = -enemy.healthBarBaseWidth / 2;
                }
            } else {
                // Regular enemy: scale is 1x
                enemy.healthBarFill.setScale(healthPercent, 1);
                // Reposition fill to stay left-aligned (base width is 30, so -15)
                enemy.healthBarFill.x = -15;
            }
            
            // Change color based on health
            if (healthPercent > 0.6) {
                enemy.healthBarFill.setTint(0x00ff00); // Green
            } else if (healthPercent > 0.3) {
                enemy.healthBarFill.setTint(0xffff00); // Yellow
            } else {
                enemy.healthBarFill.setTint(0xff0000); // Red
            }
            
            // Handle hit flash
            if (enemy.isHit) {
                if (!enemy.hitFlashStartTime) {
                    enemy.hitFlashStartTime = time;
                }
                if (time - enemy.hitFlashStartTime > 100) {
                    enemy.clearTint();
                    enemy.isHit = false;
                    enemy.hitFlashStartTime = null;
                }
            }
        }
    });
}

function createCyberpunkBackground(scene) {
    const graphics = scene.add.graphics();
    graphics.setDepth(-100); // Ensure background is behind everything
    graphics.setVisible(true);
    
    // Dark background for entire world
    graphics.fillStyle(0x0a0a0a);
    graphics.fillRect(0, 0, worldWidth, worldHeight);
    
    // Grid pattern (tiled across world)
    graphics.lineStyle(1, 0x00ffff, 0.2);
    
    // Vertical lines
    for (let x = 0; x <= worldWidth; x += 40) {
        graphics.moveTo(x, 0);
        graphics.lineTo(x, worldHeight);
    }
    
    // Horizontal lines
    for (let y = 0; y <= worldHeight; y += 40) {
        graphics.moveTo(0, y);
        graphics.lineTo(worldWidth, y);
    }
    
    graphics.strokePath();
    
    // Add some scanline effect (less dense for larger world)
    graphics.lineStyle(1, 0x00ffff, 0.05);
    for (let y = 0; y <= worldHeight; y += 4) {
        graphics.moveTo(0, y);
        graphics.lineTo(worldWidth, y);
    }
    graphics.strokePath();
}

// ========== POLISH FUNCTIONS ==========

function addScreenShake(intensity, duration = 200) {
    // Screen shake disabled - setOffset not available in Phaser 3.80
    return;
}

function updateScreenShake(scene) {
    // Screen shake disabled - setOffset not available in Phaser 3.80
    return;
}

function showDamageNumber(x, y, damage, color = 0xffffff) {
    if (!gameScene) return;
    
    const damageText = gameScene.add.text(x, y, `-${damage}`, {
        fontSize: '20px',
        fill: `#${color.toString(16).padStart(6, '0')}`,
        fontFamily: 'Courier New',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
    });
    damageText.setOrigin(0.5);
    damageText.setDepth(200);
    
    // Animate damage number
    gameScene.tweens.add({
        targets: damageText,
        y: y - 50,
        alpha: 0,
        duration: 800,
        ease: 'Power2',
        onComplete: () => {
            if (damageText && damageText.active) {
                damageText.destroy();
            }
        }
    });
    
    // Add slight horizontal drift
    gameScene.tweens.add({
        targets: damageText,
        x: x + (Math.random() - 0.5) * 30,
        duration: 800,
        ease: 'Power2'
    });
}

function createHitParticles(x, y, color = 0xffff00) {
    // Completely disabled - do nothing
    return;
    
    // Use particle manager directly if emitter access fails
    if (!hitParticles || !gameScene) return;
    
    try {
        // Try to use the particle manager's emit method directly
        if (hitParticleEmitter) {
            hitParticleEmitter.setPosition(x, y);
            hitParticleEmitter.flow(5, 100);
        } else if (hitParticles.emitters) {
            // Fallback: use the manager's emit method
            hitParticles.emitParticleAt(x, y, 5);
        }
    } catch (e) {
        // If particle system has issues, just skip it silently
        // console.warn('Hit particle error:', e);
    }
}

function createDeathParticles(x, y, color) {
    // Completely disabled - do nothing
    return;
    
    if (!deathParticleEmitter || !gameScene) return;
    
    try {
        // Simple approach: just update position and use flow for a quick burst
        deathParticleEmitter.setPosition(x, y);
        deathParticleEmitter.flow(15, 100);
    } catch (e) {
        // If particle system has issues, just skip it silently
        // console.warn('Death particle error:', e);
    }
}

function createMuzzleFlash(x, y, angle, color = 0xffff00) {
    // Completely disabled - do nothing
    return;
    
    if (!muzzleFlashEmitter || !gameScene) return;
    
    try {
        // Simple approach: just update position, angle, and use flow for a quick burst
        muzzleFlashEmitter.setPosition(x, y);
        muzzleFlashEmitter.setAngle(Phaser.Math.RadToDeg(angle) - 90);
        muzzleFlashEmitter.flow(3, 100);
    } catch (e) {
        // If particle system has issues, just skip it silently
        // console.warn('Muzzle flash error:', e);
    }
}

function flashScreen(color = 0xff0000, duration = 100) {
    if (!gameScene) return;
    
    if (screenFlash) {
        screenFlash.destroy();
        screenFlash = null;
    }
    
    screenFlash = gameScene.add.rectangle(400, 300, 800, 600, color, 0.3);
    screenFlash.setDepth(300);
    screenFlash.setAlpha(0.3);
    
    gameScene.tweens.add({
        targets: screenFlash,
        alpha: 0,
        duration: duration,
        ease: 'Power2',
        onComplete: () => {
            if (screenFlash && screenFlash.active) {
                screenFlash.destroy();
                screenFlash = null;
            }
        }
    });
}

function addBulletTrail(bullet) {
    // Add a subtle trail effect to bullets
    if (!bullet.trail) {
        bullet.trail = gameScene.add.graphics();
        bullet.trail.setDepth(8);
    }
    
    bullet.trail.clear();
    bullet.trail.lineStyle(2, bullet.tint || 0xffff00, 0.5);
    bullet.trail.beginPath();
    bullet.trail.moveTo(bullet.x, bullet.y);
    
    // Draw a short trail behind the bullet
    const angle = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
    const trailLength = 15;
    const startX = bullet.x - Math.cos(angle) * trailLength;
    const startY = bullet.y - Math.sin(angle) * trailLength;
    bullet.trail.lineTo(startX, startY);
    bullet.trail.strokePath();
}

function cleanupBulletTrail(bullet) {
    if (!bullet) return;
    
    if (bullet.trail) {
        bullet.trail.destroy();
        bullet.trail = null;
    }
    
    // Clean up hit tracking
    if (bullet.hitEnemies) {
        bullet.hitEnemies.clear();
        bullet.hitEnemies = null;
    }
}

// ========== GAME INITIALIZATION ==========
// Initialize game after all classes and functions are defined
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#0a0a0a',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainMenuScene, CharacterSelectScene, GameScene]
};

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        gameInstance = new Phaser.Game(config);
    });
} else {
    gameInstance = new Phaser.Game(config);
}

// Boss attack patterns system
function updateBossBehavior(boss, time) {
    if (!boss.bossPhase) {
        boss.bossPhase = 1;
        boss.phaseTimer = time;
        boss.attackCycle = 0;
        boss.attackPatternCycle = 0;
    }
    
    // Change phase based on health
    const healthPercent = boss.health / boss.maxHealth;
    if (healthPercent < 0.3 && boss.bossPhase < 3) {
        boss.bossPhase = 3;
        boss.speed = Math.min(200, boss.speed * 1.3);
        boss.shootCooldown = Math.max(200, boss.shootCooldown * 0.5);
    } else if (healthPercent < 0.6 && boss.bossPhase < 2) {
        boss.bossPhase = 2;
        boss.speed = Math.min(150, boss.speed * 1.2);
        boss.shootCooldown = Math.max(300, boss.shootCooldown * 0.7);
    }
    
    // Cycle through attack and movement patterns every 3 seconds
    if (time - boss.phaseTimer > 3000) {
        boss.attackCycle = (boss.attackCycle + 1) % 4;
        boss.attackPatternCycle = (boss.attackPatternCycle + 1) % 5;
        boss.phaseTimer = time;
        
        // Change attack pattern
        const attackPatterns = ['shotgun', 'circle', 'spiral', 'wave', 'burst'];
        boss.attackPattern = attackPatterns[boss.attackPatternCycle];
    }
    
    // Return movement behavior based on current cycle and phase
    const movementPatterns = ['chase', 'maintainDistance', 'chase', 'maintainDistance'];
    return movementPatterns[boss.attackCycle];
}

function createHitParticles(x, y, color = 0xffff00) {
    // Completely disabled - do nothing
    return;
    
    // Use particle manager directly if emitter access fails
    if (!hitParticles || !gameScene) return;
    
    try {
        // Try to use the particle manager's emit method directly
        if (hitParticleEmitter) {
            hitParticleEmitter.setPosition(x, y);
            hitParticleEmitter.flow(5, 100);
        } else if (hitParticles.emitters) {
            // Fallback: use the manager's emit method
            hitParticles.emitParticleAt(x, y, 5);
        }
    } catch (e) {
        // If particle system has issues, just skip it silently
        // console.warn('Hit particle error:', e);
    }
}

function createDeathParticles(x, y, color) {
    // Completely disabled - do nothing
    return;
    
    if (!deathParticleEmitter || !gameScene) return;
    
    try {
        // Simple approach: just update position and use flow for a quick burst
        deathParticleEmitter.setPosition(x, y);
        deathParticleEmitter.flow(15, 100);
    } catch (e) {
        // If particle system has issues, just skip it silently
        // console.warn('Death particle error:', e);
    }
}

function createMuzzleFlash(x, y, angle, color = 0xffff00) {
    // Completely disabled - do nothing
    return;
    
    if (!muzzleFlashEmitter || !gameScene) return;
    
    try {
        // Simple approach: just update position, angle, and use flow for a quick burst
        muzzleFlashEmitter.setPosition(x, y);
        muzzleFlashEmitter.setAngle(Phaser.Math.RadToDeg(angle) - 90);
        muzzleFlashEmitter.flow(3, 100);
    } catch (e) {
        // If particle system has issues, just skip it silently
        // console.warn('Muzzle flash error:', e);
    }
}

function flashScreen(color = 0xff0000, duration = 100) {
    if (!gameScene) return;
    
    if (screenFlash) {
        screenFlash.destroy();
        screenFlash = null;
    }
    
    screenFlash = gameScene.add.rectangle(400, 300, 800, 600, color, 0.3);
    screenFlash.setDepth(300);
    screenFlash.setAlpha(0.3);
    
    gameScene.tweens.add({
        targets: screenFlash,
        alpha: 0,
        duration: duration,
        ease: 'Power2',
        onComplete: () => {
            if (screenFlash && screenFlash.active) {
                screenFlash.destroy();
                screenFlash = null;
            }
        }
    });
}

function addBulletTrail(bullet) {
    // Add a subtle trail effect to bullets
    if (!bullet.trail) {
        bullet.trail = gameScene.add.graphics();
        bullet.trail.setDepth(8);
    }
    
    bullet.trail.clear();
    bullet.trail.lineStyle(2, bullet.tint || 0xffff00, 0.5);
    bullet.trail.beginPath();
    bullet.trail.moveTo(bullet.x, bullet.y);
    
    // Draw a short trail behind the bullet
    const angle = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
    const trailLength = 15;
    const startX = bullet.x - Math.cos(angle) * trailLength;
    const startY = bullet.y - Math.sin(angle) * trailLength;
    bullet.trail.lineTo(startX, startY);
    bullet.trail.strokePath();
}

function cleanupBulletTrail(bullet) {
    if (!bullet) return;
    
    if (bullet.trail) {
        bullet.trail.destroy();
        bullet.trail = null;
    }
    
    // Clean up hit tracking
    if (bullet.hitEnemies) {
        bullet.hitEnemies.clear();
        bullet.hitEnemies = null;
    }
}
