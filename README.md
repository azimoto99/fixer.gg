# Cyberpunk Roguelike

Nuclear Throne style top-down twin-stick shooter roguelike with cyberpunk aesthetic. Infiltrate a 100-floor cyberpunk corpo base, clear rooms, defeat bosses, and choose powerful augments to reach the final boss.

## Development Status

**Current Status: Step 10 Complete - Advanced Features Implemented**

All core features and advanced systems are implemented and functional.

## Game Overview

### Objective
Infiltrate a 100-floor cyberpunk corporate base. Clear rooms, defeat bosses, and choose augments to power up. Reach floor 100 and defeat the final boss to win.

### Core Gameplay
- **Floor Progression**: 100 floors to clear, each with 8 procedurally generated rooms
- **Room Clearing**: Kill all enemies in a room to unlock doors and progress
- **Boss Fights**: Each floor has a boss room that must be cleared to advance
- **Augment Selection**: After each floor, choose from 3 random augments to power up
- **Character Selection**: Choose from 6 unique characters with different stats
- **Procedural Generation**: Each floor generates a unique map layout

## Getting Started

### Prerequisites

- Node.js (optional, for local server)
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Running Locally

1. Install dependencies (optional):
```bash
npm install
```

2. Start local server:
```bash
npm start
```

Or use any static file server. The game will be available at `http://localhost:8080`

Alternatively, simply open `index.html` in a modern web browser.

### Controls

- **WASD** or **Arrow Keys**: Move player
- **Mouse**: Aim
- **Left Click**: Shoot
- **ESC**: Pause (if implemented)

## Features

### Character System
- **6 Unique Characters**: Each with different stats and passives
  - **FIXER**: Balanced cybernetic operative
  - **REAPER**: High damage, low health assassin
  - **TANK**: Heavy armor, slow but durable
  - **SCOUT**: Fast and agile, low health
  - **SNIPER**: High damage, slow fire rate
  - **BERSERKER**: Gains power when damaged

### Floor & Room System
- **100 Floors**: Progressive difficulty as you descend
- **Procedural Generation**: Each floor generates 8 rooms in a 3x3 grid
- **Binding of Isaac Style**: Compact, chamber-like rooms (240-320px)
- **Room Clearing**: Kill all enemies to unlock doors
- **Boss Rooms**: Special boss room on each floor (marked with red borders)
- **Door System**: Doors lock/unlock based on room clearing status

### Augment System
After clearing each floor's boss, choose from 3 random augments:

**Damage Augments:**
- Damage Boost (+25% damage)
- Critical Strike (10% chance for 2x damage)
- Piercing Shots (bullets pierce through enemies)

**Speed Augments:**
- Speed Boost (+30% movement speed)
- Bullet Speed (+40% bullet speed)

**Fire Rate Augments:**
- Rapid Fire (+35% fire rate)
- Double Shot (fire 2 bullets at once)

**Health Augments:**
- Health Boost (+50 max HP)
- Health Regen (regenerate 2 HP per second)
- Lifesteal (heal 10% of damage dealt)

**Utility Augments:**
- Extra Bullets (+2 bullets per shot)
- Bullet Size (+50% bullet size)
- Knockback (bullets push enemies back)
- Shield (block first hit every 10 seconds)
- Luck (+25% drop rate)

### Enemy AI
- **Line of Sight Detection**: Enemies only aggro when they can see you
- **AI States**: 
  - **Patrol**: Random movement in spawn area
  - **Alert**: Move toward last known player position
  - **Combat**: Actively chase and attack
- **Sight Range**: 300-400 pixels
- **Obstacle Awareness**: Line of sight blocked by walls

### Weapons
- **Pistol**: Balanced default weapon
- **SMG**: Fast fire rate, lower damage
- **Shotgun**: Spread shot, high damage
- **Rocket Launcher**: Explosive area damage
- **Laser**: Continuous beam weapon
- **Flamethrower**: Close-range damage over time

### Visual Features
- **Minimap**: Real-time map display showing rooms, player, and enemies
- **Particle Effects**: Hit particles, death explosions, muzzle flashes
- **Screen Shake**: Visual feedback on damage and explosions
- **Camera Following**: Smooth camera that follows the player
- **UI Elements**: Health bar, floor counter, room counter, augment display

### Progression
- **High Score Tracking**: Tracks floors cleared (stored in localStorage)
- **Permadeath**: Death resets to floor 1
- **Victory Condition**: Reach floor 100 and defeat final boss
- **Stats Tracking**: Enemies killed, floors cleared, time survived

## Development Steps

See [DESIGN.md](./DESIGN.md) for the complete development guide and step-by-step implementation details.

## Tech Stack

- **Phaser.js 3**: Game framework for rendering, physics, and scene management
- **JavaScript**: Core programming language
- **HTML5 Canvas**: Rendering surface
- **LocalStorage**: High score persistence

## Game Architecture

### Scenes
- **MainMenuScene**: Main menu with play button
- **CharacterSelectScene**: Character selection screen
- **GameScene**: Main gameplay scene

### Key Systems
- **Procedural Map Generation**: Grid-based room generation algorithm
- **Physics System**: Arcade physics for collisions and movement
- **Enemy AI System**: State machine for enemy behavior
- **Augment System**: Power-up selection and application
- **Particle System**: Visual effects for combat feedback
- **Camera System**: Player following with bounds and deadzone

## Known Issues & Future Improvements

- Sound effects and music (planned)
- More enemy types and behaviors
- Additional weapons and augments
- Different biomes/themes per floor range
- Leaderboards (requires backend)
- Daily challenges
- Cosmetic skins

## License

MIT

