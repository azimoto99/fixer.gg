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
let gameStats = {
    roomsCleared: 0,
    enemiesKilled: 0,
    timeSurvived: 0,
    mutationsCollected: 0,
    finalLevel: 1
};

// Polish system variables
let hitParticles;
let deathParticles;
let muzzleFlashParticles;
let damageNumbers;
let cameraShake = { x: 0, y: 0, intensity: 0 };
let screenFlash = null;

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
            if (selectedCharacter) {
                this.scene.start('GameScene');
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
        // Initialize game with selected character
        if (!selectedCharacter) {
            selectedCharacter = 'fixer'; // Default
        }
        
        const char = characters[selectedCharacter];
        
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
        
        // Create cyberpunk background grid
        createCyberpunkBackground(this);
        
        // Create room boundaries (walls)
        createRoomWalls(this);
        
        // Create obstacles for first room
        currentRoomTemplate = Phaser.Math.Between(0, roomTemplates.length - 1);
        createRoomObstacles(this, currentRoomTemplate);
        
        // Create player
        player = this.physics.add.sprite(400, 300, 'player');
        player.setCollideWorldBounds(true);
        player.setScale(1.5);
        player.setDepth(10);
        
        // Polish: Add subtle glow effect to player
        const playerGlow = this.add.circle(400, 300, 20, char.color, 0.2);
        playerGlow.setDepth(9);
        player.glow = playerGlow;
        
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
        hitParticles = this.add.particles(0, 0, 'hitParticle', {
            speed: { min: 50, max: 150 },
            scale: { start: 1, end: 0 },
            lifespan: 300,
            quantity: 5,
            emitting: false
        });
        hitParticles.setDepth(15);
        
        deathParticles = this.add.particles(0, 0, 'particle', {
            speed: { min: 100, max: 250 },
            scale: { start: 1.5, end: 0 },
            lifespan: 500,
            quantity: 15,
            tint: [0xff0000, 0xff6600, 0xffff00],
            emitting: false
        });
        deathParticles.setDepth(15);
        
        muzzleFlashParticles = this.add.particles(0, 0, 'spark', {
            speed: { min: 100, max: 200 },
            scale: { start: 1, end: 0 },
            lifespan: 100,
            quantity: 3,
            emitting: false
        });
        muzzleFlashParticles.setDepth(12);
        
        // Create damage numbers container
        damageNumbers = this.add.container(0, 0);
        damageNumbers.setDepth(200);
        
        // Set starting weapon
        currentWeapon = weapons.pistol;
        
        // Create player health bar
        const playerHealthBarBg = this.add.image(100, 30, 'playerHealthBarBg');
        const playerHealthBarFill = this.add.image(100, 30, 'playerHealthBarFill');
        playerHealthBarFill.setOrigin(0, 0.5);
        playerHealthBarBg.setOrigin(0, 0.5);
        playerHealthBarBg.setDepth(100);
        playerHealthBarFill.setDepth(100);
        playerHealthBar = {
            bg: playerHealthBarBg,
            fill: playerHealthBarFill
        };
        
        // Health text
        const healthLabel = this.add.text(10, 10, 'HP:', {
            fontSize: '16px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        });
        healthLabel.setDepth(100);
        
        // Character name display
        const charNameText = this.add.text(10, 30, char.name, {
            fontSize: '14px',
            fill: `#${char.color.toString(16).padStart(6, '0')}`,
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        });
        charNameText.setDepth(100);
        
        // Room counter text
        roomCounterText = this.add.text(400, 30, `ROOM ${currentRoom}`, {
            fontSize: '24px',
            fill: '#00ffff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 2
        });
        roomCounterText.setOrigin(0.5);
        roomCounterText.setDepth(100);
        
        // Weapon display text
        weaponText = this.add.text(10, 50, `WEAPON: ${currentWeapon.name}`, {
            fontSize: '16px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        });
        weaponText.setDepth(100);
        
        // Level and XP display
        levelText = this.add.text(10, 70, `LEVEL: ${playerLevel}`, {
            fontSize: '16px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        });
        levelText.setDepth(100);
        
        xpText = this.add.text(10, 90, `XP: ${playerXP}/${xpToNextLevel}`, {
            fontSize: '14px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        });
        xpText.setDepth(100);
        
        // Mutations display
        mutationsDisplay = this.add.text(10, 110, 'MUTATIONS:', {
            fontSize: '14px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        });
        mutationsDisplay.setDepth(100);
        
        // Spawn enemies for first room
        startRoom(this);
        
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
        this.physics.add.collider(bullets, roomWalls, (bullet) => {
            bullets.killAndHide(bullet);
        });
        
        // Collision detection: enemy bullets vs walls
        this.physics.add.collider(enemyBullets, roomWalls, (bullet) => {
            enemyBullets.killAndHide(bullet);
        });
        
        // Collision detection: bullets vs obstacles
        this.physics.add.collider(bullets, roomObstacles, (bullet) => {
            bullets.killAndHide(bullet);
        });
        
        // Collision detection: enemy bullets vs obstacles
        this.physics.add.collider(enemyBullets, roomObstacles, (bullet) => {
            enemyBullets.killAndHide(bullet);
        });
        
        // Collision detection: player vs obstacles
        this.physics.add.collider(player, roomObstacles);
        
        // Collision detection: enemies vs obstacles
        this.physics.add.collider(enemies, roomObstacles);
        
        // Input setup
        cursors = this.input.keyboard.createCursorKeys();
        wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
        mousePointer = this.input.activePointer;
        
        // Enable mouse input
        this.input.mouse.disableContextMenu();
    }

    update(time) {
        if (isGameOver || isLevelUpScreen) {
            return;
        }
        
        // Check if required objects are initialized
        if (!player || !cursors || !wasdKeys || !mousePointer) {
            return;
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
    // Apply mutation multipliers
    const damageMultiplier = getMutationMultiplier('damage');
    const speedMultiplier = getMutationMultiplier('bulletSpeed');
    const fireRateMultiplier = getMutationMultiplier('fireRate');
    
    if (currentWeapon.type === 'shotgun') {
        // Shotgun fires multiple bullets in spread
        const spreadAngle = 0.3; // Total spread angle in radians
        const bulletCount = currentWeapon.spread;
        
        for (let i = 0; i < bulletCount; i++) {
            const angle = Phaser.Math.Angle.Between(
                player.x,
                player.y,
                mousePointer.worldX,
                mousePointer.worldY
            ) + (i - bulletCount / 2) * (spreadAngle / bulletCount);
            
            const bullet = bullets.get(player.x, player.y);
            if (bullet) {
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.setScale(1);
                bullet.damage = Math.floor(currentWeapon.damage * damageMultiplier);
                bullet.setTint(currentWeapon.color);
                
                // Polish: Muzzle flash for each shotgun pellet
                if (i === 0) { // Only flash once per shot
                    createMuzzleFlash(player.x, player.y, angle, currentWeapon.color);
                }
                
                const bulletSpeed = Math.floor(currentWeapon.bulletSpeed * speedMultiplier);
                scene.physics.velocityFromRotation(angle, bulletSpeed, bullet.body.velocity);
                bullet.setPosition(player.x, player.y);
            }
        }
    } else {
        // Single bullet weapons
        const bullet = bullets.get(player.x, player.y);
        
        if (!bullet) {
            return;
        }
        
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setScale(1);
        bullet.damage = Math.floor(currentWeapon.damage * damageMultiplier);
        bullet.setTint(currentWeapon.color);
        
        const angle = Phaser.Math.Angle.Between(
            player.x,
            player.y,
            mousePointer.worldX,
            mousePointer.worldY
        );
        
        // Polish: Muzzle flash
        createMuzzleFlash(player.x, player.y, angle, currentWeapon.color);
        
        const bulletSpeed = Math.floor(currentWeapon.bulletSpeed * speedMultiplier);
        scene.physics.velocityFromRotation(angle, bulletSpeed, bullet.body.velocity);
        bullet.setPosition(player.x, player.y);
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
                    createHitParticles(enemy.x, enemy.y, currentWeapon.color);
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
    switchWeapon(pickup.weaponType);
    
    // Polish: Create pickup particles
    createHitParticles(pickup.x, pickup.y, weapons[pickup.weaponType].color);
    
    // Polish: Show pickup text
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
    
    // Polish: Create healing particles
    createHitParticles(pickup.x, pickup.y, 0x00ff00);
    
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

// Room templates with obstacle layouts
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
    
    // Select random room template
    currentRoomTemplate = Phaser.Math.Between(0, roomTemplates.length - 1);
    createRoomObstacles(scene, currentRoomTemplate);
    
    // Calculate enemy count (5-10 base, +1-2 per room)
    const baseEnemies = 5;
    const additionalEnemies = Math.floor((currentRoom - 1) * 1.5);
    const enemyCount = Phaser.Math.Between(
        baseEnemies + additionalEnemies,
        baseEnemies + additionalEnemies + 2
    );
    
    // Spawn enemies (will avoid obstacles)
    spawnEnemies(scene, enemyCount);
    
    // Hide portal if it exists
    if (exitPortal) {
        exitPortal.setVisible(false);
        exitPortal.setActive(false);
    }
    
    // Reset player position to center (safe spawn)
    player.setPosition(400, 300);
}

function checkRoomCleared() {
    if (isRoomCleared || isGameOver) return;
    
    // Count living enemies
    let livingEnemies = 0;
    enemies.children.entries.forEach(enemy => {
        if (enemy.active) {
            livingEnemies++;
        }
    });
    
    // If all enemies are dead, show portal
    if (livingEnemies === 0 && !exitPortal) {
        createExitPortal(gameScene);
        isRoomCleared = true;
    } else if (livingEnemies === 0 && exitPortal && !exitPortal.visible) {
        exitPortal.setVisible(true);
        exitPortal.setActive(true);
        isRoomCleared = true;
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
    
    // Polish: Create portal exit particles
    createDeathParticles(exitPortal.x, exitPortal.y, 0x00ffff);
    
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
        const healthBarBg = scene.add.image(0, -20, 'healthBarBg');
        const healthBarFill = scene.add.image(0, -20, 'healthBarFill');
        healthBarFill.setOrigin(0, 0.5);
        healthBarBg.setOrigin(0.5, 0.5);
        healthBarFill.setOrigin(0, 0.5);
        
        const healthBarContainer = scene.add.container(x, y, [healthBarBg, healthBarFill]);
        enemy.healthBar = healthBarContainer;
        enemy.healthBarFill = healthBarFill;
        enemyHealthBars.add(healthBarContainer);
    }
}

function hitEnemy(bullet, enemy) {
    // Damage enemy with weapon damage
    const damage = bullet.damage || bulletDamage;
    enemy.health -= damage;
    enemy.isHit = true;
    
    // Polish: Show damage number
    showDamageNumber(enemy.x, enemy.y - 20, damage, currentWeapon.color);
    
    // Polish: Create hit particles
    createHitParticles(enemy.x, enemy.y, currentWeapon.color);
    
    // Polish: Light screen shake on hit
    addScreenShake(2, 50);
    
    // Flash effect - make enemy white briefly
    enemy.setTint(0xffffff);
    
    // Polish: Add knockback effect
    const knockbackAngle = Phaser.Math.Angle.Between(enemy.x, enemy.y, bullet.x, bullet.y);
    const knockbackForce = 50;
    enemy.x += Math.cos(knockbackAngle) * knockbackForce * 0.1;
    enemy.y += Math.sin(knockbackAngle) * knockbackForce * 0.1;
    
    // Destroy bullet on impact
    cleanupBulletTrail(bullet);
    bullets.killAndHide(bullet);
    
    // Check if enemy is dead
    if (enemy.health <= 0) {
        // Drop pickups when enemy dies
        dropWeapon(gameScene, enemy.x, enemy.y);
        dropHealthPack(gameScene, enemy.x, enemy.y);
        killEnemy(enemy);
    }
}

function killEnemy(enemy) {
    // Polish: Create death particles
    const enemyColor = enemy.tintTopLeft || 0xff0000;
    createDeathParticles(enemy.x, enemy.y, enemyColor);
    
    // Polish: Screen shake on kill
    addScreenShake(3, 100);
    
    // Gain XP for killing enemy
    const xpGain = 10;
    playerXP += xpGain;
    
    // Track total kills
    totalEnemiesKilled++;
    
    // Check for level up
    checkLevelUp();
    
    // Update XP display
    if (xpText) {
        xpText.setText(`XP: ${playerXP}/${xpToNextLevel}`);
    }
    
    // Polish: Show XP gain text
    const xpGainText = gameScene.add.text(enemy.x, enemy.y - 30, `+${xpGain} XP`, {
        fontSize: '16px',
        fill: '#00ffff',
        fontFamily: 'Courier New',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
    });
    xpGainText.setOrigin(0.5);
    xpGainText.setDepth(200);
    gameScene.tweens.add({
        targets: xpGainText,
        y: enemy.y - 60,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => xpGainText.destroy()
    });
    
    // Remove health bar
    if (enemy.healthBar) {
        enemy.healthBar.destroy();
    }
    
    // Remove enemy
    enemies.remove(enemy);
    enemy.destroy();
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
    if (!mutationsDisplay) return;
    
    let displayText = 'MUTATIONS:\n';
    if (activeMutations.length === 0) {
        displayText += 'None';
    } else {
        // Count mutations
        const mutationCounts = {};
        activeMutations.forEach(key => {
            mutationCounts[key] = (mutationCounts[key] || 0) + 1;
        });
        
        Object.keys(mutationCounts).forEach(key => {
            const count = mutationCounts[key];
            const name = mutations[key].name;
            displayText += `${name}${count > 1 ? ` x${count}` : ''}\n`;
        });
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
        
        const distance = Phaser.Math.Distance.Between(
            enemy.x, enemy.y,
            player.x, player.y
        );
        
        // Move toward player
        if (enemy.type === 'melee') {
            // Melee enemies chase directly
            const angle = Phaser.Math.Angle.Between(
                enemy.x, enemy.y,
                player.x, player.y
            );
            scene.physics.velocityFromRotation(angle, enemy.speed, enemy.body.velocity);
        } else {
            // Ranged enemies maintain distance (stop at ~200 pixels)
            if (distance > 200) {
                const angle = Phaser.Math.Angle.Between(
                    enemy.x, enemy.y,
                    player.x, player.y
                );
                scene.physics.velocityFromRotation(angle, enemy.speed, enemy.body.velocity);
            } else {
                enemy.setVelocity(0, 0);
            }
            
            // Ranged enemies shoot at player
            if (time > enemy.lastShot + enemy.shootCooldown) {
                enemyShoot(scene, enemy);
                enemy.lastShot = time;
            }
        }
    });
}

function enemyShoot(scene, enemy) {
    const bullet = enemyBullets.get(enemy.x, enemy.y);
    
    if (!bullet) {
        return; // No available bullets in pool
    }
    
    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.setScale(1);
    
    // Calculate direction to player
    const angle = Phaser.Math.Angle.Between(
        enemy.x,
        enemy.y,
        player.x,
        player.y
    );
    
    // Set bullet velocity
    scene.physics.velocityFromRotation(angle, enemyBulletSpeed, bullet.body.velocity);
    
    // Reset bullet position
    bullet.setPosition(enemy.x, enemy.y);
}

function hitPlayer(bullet, playerSprite) {
    // Damage player
    playerHealth -= enemyBulletDamage;
    
    // Polish: Show damage number
    showDamageNumber(player.x, player.y - 20, enemyBulletDamage, 0xff0000);
    
    // Polish: Screen flash on damage
    flashScreen(0xff0000, 150);
    
    // Polish: Strong screen shake on damage
    addScreenShake(5, 200);
    
    // Polish: Create hit particles
    createHitParticles(player.x, player.y, 0xff0000);
    
    // Flash effect
    playerSprite.setTint(0xff0000);
    gameScene.time.delayedCall(100, () => {
        if (playerSprite.active) {
            playerSprite.clearTint();
        }
    });
    
    // Destroy bullet
    enemyBullets.killAndHide(bullet);
    
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

function gameOver() {
    isGameOver = true;
    
    // Stop player movement
    player.setVelocity(0, 0);
    
    // Stop all enemies
    enemies.children.entries.forEach(enemy => {
        enemy.setVelocity(0, 0);
    });
    
    // Calculate game stats
    const timeSurvived = Math.floor((Date.now() - gameStartTime) / 1000); // seconds
    gameStats = {
        roomsCleared: Math.max(0, currentRoom - 1),
        enemiesKilled: totalEnemiesKilled,
        timeSurvived: timeSurvived,
        mutationsCollected: activeMutations.length,
        finalLevel: playerLevel
    };
    
    // Calculate score (rooms * 100 + kills * 10 + time)
    const score = gameStats.roomsCleared * 100 + gameStats.enemiesKilled * 10 + gameStats.timeSurvived;
    
    // Get and update high score
    const highScore = getHighScore();
    const isNewHighScore = score > highScore;
    if (isNewHighScore) {
        saveHighScore(score);
    }
    
    // Create overlay
    const overlay = gameScene.add.rectangle(400, 300, 800, 600, 0x000000, 0.9);
    overlay.setDepth(200);
    
    // Game over text
    gameOverText = gameScene.add.text(400, 100, 'GAME OVER', {
        fontSize: '48px',
        fill: '#ff0000',
        fontFamily: 'Courier New',
        stroke: '#000000',
        strokeThickness: 4
    });
    gameOverText.setOrigin(0.5);
    gameOverText.setDepth(201);
    
    // Stats display
    const statsY = 200;
    const statsStyle = {
        fontSize: '20px',
        fill: '#00ffff',
        fontFamily: 'Courier New',
        align: 'center'
    };
    
    const statsText = gameScene.add.text(400, statsY, 
        `ROOMS CLEARED: ${gameStats.roomsCleared}\n` +
        `ENEMIES KILLED: ${gameStats.enemiesKilled}\n` +
        `TIME SURVIVED: ${formatTime(gameStats.timeSurvived)}\n` +
        `MUTATIONS: ${gameStats.mutationsCollected}\n` +
        `FINAL LEVEL: ${gameStats.finalLevel}\n` +
        `\nSCORE: ${score}`,
        statsStyle
    );
    statsText.setOrigin(0.5);
    statsText.setDepth(201);
    
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
    gameStats = {
        roomsCleared: 0,
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
            // Update health bar position
            enemy.healthBar.setPosition(enemy.x, enemy.y - 25);
            
            // Update health bar fill width
            const healthPercent = enemy.health / enemy.maxHealth;
            enemy.healthBarFill.setScale(healthPercent, 1);
            
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
    
    // Dark background
    graphics.fillStyle(0x0a0a0a);
    graphics.fillRect(0, 0, 800, 600);
    
    // Grid pattern
    graphics.lineStyle(1, 0x00ffff, 0.3);
    
    // Vertical lines
    for (let x = 0; x <= 800; x += 40) {
        graphics.moveTo(x, 0);
        graphics.lineTo(x, 600);
    }
    
    // Horizontal lines
    for (let y = 0; y <= 600; y += 40) {
        graphics.moveTo(0, y);
        graphics.lineTo(800, y);
    }
    
    graphics.strokePath();
    
    // Neon accent corners
    graphics.lineStyle(2, 0x00ffff, 0.6);
    graphics.strokeRect(10, 10, 100, 100);
    graphics.strokeRect(690, 10, 100, 100);
    graphics.strokeRect(10, 490, 100, 100);
    graphics.strokeRect(690, 490, 100, 100);
    
    // Add some scanline effect
    graphics.lineStyle(1, 0x00ffff, 0.08);
    for (let y = 0; y <= 600; y += 2) {
        graphics.moveTo(0, y);
        graphics.lineTo(800, y);
    }
    graphics.strokePath();
}

// ========== POLISH FUNCTIONS ==========

function addScreenShake(intensity, duration = 200) {
    cameraShake.intensity = intensity;
    cameraShake.duration = duration;
    cameraShake.startTime = Date.now();
}

function updateScreenShake(scene) {
    if (cameraShake.intensity > 0) {
        const elapsed = Date.now() - cameraShake.startTime;
        if (elapsed < cameraShake.duration) {
            const decay = 1 - (elapsed / cameraShake.duration);
            const shakeX = (Math.random() - 0.5) * cameraShake.intensity * decay;
            const shakeY = (Math.random() - 0.5) * cameraShake.intensity * decay;
            scene.cameras.main.setScroll(shakeX, shakeY);
        } else {
            scene.cameras.main.setScroll(0, 0);
            cameraShake.intensity = 0;
        }
    }
}

function showDamageNumber(x, y, damage, color = 0xffffff) {
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
            damageText.destroy();
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
    if (!hitParticles) return;
    
    // Set tint in config and update position
    hitParticles.setConfig({ tint: color });
    hitParticles.setPosition(x, y);
    hitParticles.explode(5);
}

function createDeathParticles(x, y, color) {
    if (!deathParticles) return;
    
    // Set tint in config and update position
    deathParticles.setConfig({ tint: color });
    deathParticles.setPosition(x, y);
    deathParticles.explode(15);
}

function createMuzzleFlash(x, y, angle, color = 0xffff00) {
    if (!muzzleFlashParticles) return;
    
    // Set tint in config and update position/angle
    muzzleFlashParticles.setConfig({ tint: color });
    muzzleFlashParticles.setPosition(x, y);
    muzzleFlashParticles.setAngle(Phaser.Math.RadToDeg(angle) - 90);
    muzzleFlashParticles.explode(3);
}

function flashScreen(color = 0xff0000, duration = 100) {
    if (screenFlash) {
        screenFlash.destroy();
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
            if (screenFlash) {
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
    if (bullet.trail) {
        bullet.trail.destroy();
        bullet.trail = null;
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

