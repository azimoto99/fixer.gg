# Design Document

## Overview

The Cyberpunk Roguelike is a browser-based top-down twin-stick shooter built with Phaser.js 3. The game features a 100-floor progression system where players infiltrate a cyberpunk corporate base, fighting through procedurally generated rooms with permadeath mechanics. The core gameplay loop involves clearing rooms of enemies, collecting weapons and augments, and progressing through increasingly challenging floors until reaching the final boss on floor 100.

The game emphasizes fast-paced combat, meaningful upgrade choices through an augment system, and high replayability through procedural generation. The visual style follows cyberpunk aesthetics with dark backgrounds, neon accents, and geometric shapes.

## Architecture

### Core Game Architecture

```
Game Engine (Phaser.js 3)
├── Scene Management
│   ├── MainMenuScene
│   ├── GameScene (primary gameplay)
│   ├── GameOverScene
│   └── VictoryScene
├── Entity System
│   ├── Player
│   ├── Enemy (multiple types)
│   ├── Projectile
│   └── Pickup
├── World Management
│   ├── FloorGenerator
│   ├── RoomManager
│   └── DoorSystem
└── Game Systems
    ├── CombatSystem
    ├── AugmentSystem
    ├── WeaponSystem
    └── ProgressionSystem
```

### Technical Stack

- **Framework:** Phaser.js 3.70+ for game engine, physics, and rendering
- **Language:** JavaScript (ES6+) with potential TypeScript migration
- **Graphics:** Geometric shapes and simple sprites for rapid development
- **Audio:** Web Audio API through Phaser for sound effects
- **Storage:** LocalStorage for high scores and settings
- **Deployment:** Single HTML file with bundled assets

## Components and Interfaces

### Player Component

The player is the central entity controlled by the user, featuring movement, combat, and progression capabilities.

**Properties:**
- Position (x, y coordinates)
- Health (current/maximum)
- Movement speed (base 200 pixels/second)
- Rotation (facing direction toward mouse)
- Active weapon reference
- Augment collection
- Invincibility timer for damage protection

**Methods:**
- `update()` - Handle input, movement, and rotation
- `shoot()` - Create projectiles based on current weapon
- `takeDamage(amount)` - Apply damage with invincibility frames
- `heal(amount)` - Restore health up to maximum
- `addAugment(augment)` - Apply augment effects
- `switchWeapon(index)` - Change active weapon

### Enemy Component

Enemies provide combat challenges with AI-driven behavior and different types for variety.

**Base Enemy Properties:**
- Position and rotation
- Health points (10-20 HP based on type)
- Movement speed (120-150 pixels/second)
- AI state (Patrol, Alert, Combat)
- Sight range (300-400 pixels)
- Attack patterns (melee/ranged)

**AI State Machine:**
```
Patrol State:
- Random movement within spawn area
- Scan for player within sight range
- Transition to Alert when player detected

Alert State:
- Move toward last known player position
- Continue scanning for player
- Transition to Combat when player in sight
- Return to Patrol after 2-second timeout

Combat State:
- Active pursuit of player
- Execute attack patterns (shoot/chase)
- Maintain line-of-sight checks
- Return to Alert when player lost
```

**Enemy Types:**
- **Basic Melee:** Fast movement, contact damage
- **Ranged Shooter:** Slower movement, projectile attacks
- **Heavy Unit:** High health, slow movement, high damage
- **Boss Enemies:** Unique mechanics per floor milestone

### Weapon System

Weapons provide combat variety with distinct characteristics and upgrade potential.

**Weapon Interface:**
```javascript
class Weapon {
  constructor(type, damage, fireRate, bulletSpeed, special) {
    this.type = type;
    this.damage = damage;
    this.fireRate = fireRate; // shots per second
    this.bulletSpeed = bulletSpeed;
    this.special = special; // unique mechanics
    this.lastFired = 0;
  }
  
  canFire() {
    return Date.now() - this.lastFired > (1000 / this.fireRate);
  }
  
  fire(x, y, angle) {
    // Create projectile(s) based on weapon type
  }
}
```

**Weapon Types:**
- **Pistol:** Balanced damage (15), medium fire rate (3/sec), standard bullets
- **SMG:** Low damage (8), high fire rate (8/sec), fast bullets
- **Shotgun:** High damage (25), low fire rate (1.5/sec), spread pattern (5 bullets)
- **Laser:** Continuous beam, medium damage (12/sec), instant hit
- **Rocket Launcher:** Very high damage (50), very low fire rate (0.5/sec), explosive area damage
- **Flamethrower:** Damage over time (20/sec), short range, wide cone

### Floor Generation System

The floor generator creates procedural layouts using a grid-based approach inspired by The Binding of Isaac.

**Floor Structure:**
- 3000x3000 pixel world size
- 8 rooms arranged in connected patterns
- Room sizes: 240-320 pixels (compact chambers)
- Grid-based connections with explicit doors
- One designated boss room per floor

**Room Generation Algorithm:**
```javascript
class FloorGenerator {
  generateFloor(floorNumber) {
    // 1. Create room grid layout (2x4, 3x3, etc.)
    // 2. Generate room connections (ensure all reachable)
    // 3. Designate boss room (furthest from start)
    // 4. Generate individual room layouts
    // 5. Place doors between connected rooms
    // 6. Return floor data structure
  }
  
  generateRoom(roomType) {
    // 1. Place outer walls
    // 2. Add internal obstacles (cover, pillars)
    // 3. Ensure clear paths to doors
    // 4. Define enemy spawn points
    // 5. Return room layout data
  }
}
```

### Augment System

The augment system provides meaningful progression choices after each floor completion.

**Augment Categories:**
- **Damage Augments:** Damage Boost (+25%), Critical Strike (10% chance 2x damage), Piercing Shots
- **Speed Augments:** Movement Speed (+30%), Bullet Speed (+40%)
- **Fire Rate Augments:** Rapid Fire (+35%), Double Shot (2 bullets per shot)
- **Health Augments:** Health Boost (+50 HP), Health Regen (2 HP/sec), Lifesteal (10% damage as healing)
- **Utility Augments:** Extra Bullets (+2 per shot), Bullet Size (+50%), Knockback, Shield (block hit every 10s), Luck (+25% drop rates)

**Augment Rarity System:**
- **Common (70%):** Basic stat improvements
- **Uncommon (25%):** Moderate enhancements with special effects
- **Rare (5%):** Powerful abilities with significant gameplay impact

**Augment Selection Interface:**
```javascript
class AugmentSystem {
  generateChoices(playerLevel, rarity) {
    // 1. Determine rarity distribution
    // 2. Select 3 random augments from pools
    // 3. Ensure no duplicates in single choice
    // 4. Return augment options with descriptions
  }
  
  applyAugment(player, augment) {
    // 1. Add augment to player collection
    // 2. Apply immediate stat modifications
    // 3. Register passive effect handlers
    // 4. Update UI display
  }
}
```

## Data Models

### Game State Model

```javascript
class GameState {
  constructor() {
    this.currentFloor = 1;
    this.player = new Player();
    this.currentMap = null;
    this.clearedRooms = new Set();
    this.gameStats = {
      startTime: Date.now(),
      enemiesKilled: 0,
      floorsCleared: 0,
      augmentsCollected: []
    };
  }
}
```

### Floor Data Model

```javascript
class FloorData {
  constructor() {
    this.rooms = []; // Array of RoomData
    this.doors = []; // Array of DoorData
    this.playerStartRoom = 0;
    this.bossRoom = 7;
    this.worldBounds = { width: 3000, height: 3000 };
  }
}

class RoomData {
  constructor() {
    this.id = 0;
    this.bounds = { x, y, width, height };
    this.walls = []; // Wall collision rectangles
    this.obstacles = []; // Obstacle positions
    this.enemySpawns = []; // Enemy spawn points
    this.connections = []; // Connected room IDs
    this.cleared = false;
  }
}
```

### Player Data Model

```javascript
class PlayerData {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.health = { current: 100, maximum: 100 };
    this.weapons = [new Weapon('pistol')];
    this.activeWeapon = 0;
    this.augments = [];
    this.stats = {
      damageMultiplier: 1.0,
      speedMultiplier: 1.0,
      fireRateMultiplier: 1.0,
      healthRegen: 0,
      criticalChance: 0,
      lifesteal: 0
    };
  }
}
```

## Error Handling

### Collision System Error Handling

```javascript
class CollisionManager {
  checkBulletEnemyCollision(bullet, enemy) {
    try {
      if (!bullet.active || !enemy.active) return false;
      
      const distance = Phaser.Math.Distance.Between(
        bullet.x, bullet.y, enemy.x, enemy.y
      );
      
      if (distance < (bullet.radius + enemy.radius)) {
        this.handleBulletHit(bullet, enemy);
        return true;
      }
    } catch (error) {
      console.warn('Collision check failed:', error);
      return false;
    }
    return false;
  }
}
```

### Particle System Error Handling

```javascript
class ParticleManager {
  createHitEffect(x, y) {
    try {
      if (this.scene && this.scene.add) {
        // Create particle effect safely
        const particles = this.scene.add.particles(x, y, 'spark', {
          speed: { min: 50, max: 100 },
          lifespan: 300,
          quantity: 5
        });
        
        // Auto-cleanup
        this.scene.time.delayedCall(300, () => {
          if (particles && particles.destroy) {
            particles.destroy();
          }
        });
      }
    } catch (error) {
      console.warn('Particle effect failed:', error);
    }
  }
}
```

### Save System Error Handling

```javascript
class SaveManager {
  saveHighScore(score) {
    try {
      const currentBest = this.loadHighScore();
      if (score > currentBest) {
        localStorage.setItem('cyberpunk_roguelike_highscore', score.toString());
        return true;
      }
    } catch (error) {
      console.warn('Failed to save high score:', error);
    }
    return false;
  }
  
  loadHighScore() {
    try {
      const saved = localStorage.getItem('cyberpunk_roguelike_highscore');
      return saved ? parseInt(saved, 10) : 0;
    } catch (error) {
      console.warn('Failed to load high score:', error);
      return 0;
    }
  }
}
```

## Testing Strategy

### Unit Testing Approach

**Core Systems Testing:**
- Weapon damage calculations and fire rate timing
- Augment effect stacking and application
- Enemy AI state transitions and line-of-sight detection
- Floor generation algorithm correctness
- Collision detection accuracy

**Test Structure:**
```javascript
// Example test for weapon system
describe('Weapon System', () => {
  test('Pistol fire rate respects cooldown', () => {
    const pistol = new Weapon('pistol', 15, 3, 600);
    expect(pistol.canFire()).toBe(true);
    
    pistol.fire(0, 0, 0);
    expect(pistol.canFire()).toBe(false);
    
    // Simulate time passage
    jest.advanceTimersByTime(400);
    expect(pistol.canFire()).toBe(true);
  });
});
```

### Integration Testing

**Game Flow Testing:**
- Complete floor progression from start to boss room
- Augment selection and effect application
- Player death and restart functionality
- Save/load high score persistence

**Performance Testing:**
- Frame rate stability with maximum entities (100+ enemies, bullets, particles)
- Memory usage over extended play sessions
- Load time optimization for web deployment

### Manual Testing Checklist

**Core Gameplay:**
- [ ] Player movement feels responsive in all directions
- [ ] Shooting accuracy matches mouse cursor position
- [ ] Enemy AI behaves predictably and fairly
- [ ] Room clearing mechanics work consistently
- [ ] Door unlocking provides clear feedback

**Progression Systems:**
- [ ] Floor advancement works correctly
- [ ] Augment choices appear after boss defeats
- [ ] Augment effects stack properly
- [ ] High score tracking persists between sessions

**Edge Cases:**
- [ ] Player survives with 1 HP
- [ ] All enemies killed simultaneously
- [ ] Rapid weapon switching
- [ ] Browser refresh during gameplay
- [ ] Multiple augments of same type

### Automated Testing Integration

**Continuous Testing:**
- Jest for unit tests with 80%+ code coverage
- Playwright for browser compatibility testing
- Performance monitoring with automated benchmarks
- Visual regression testing for UI consistency

**Test Data Generation:**
- Procedural floor layouts for stress testing
- Random augment combinations for balance validation
- Simulated player input for gameplay flow verification