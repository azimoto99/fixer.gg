# CYBERPUNK ROGUELIKE - DEVELOPMENT GUIDE

**Nuclear Throne Style | Browser-Based | fixer.gg**

---

## 🎯 CORE CONCEPT

Top-down twin-stick shooter roguelike with cyberpunk aesthetic. Fast-paced, permadeath, procedural rooms, weapon variety, and mutation upgrades.

---

## 🛠️ TECH STACK

- **Framework:** Phaser.js 3 (handles physics, sprites, collisions)

- **Language:** JavaScript/TypeScript

- **Graphics:** Simple geometric shapes or pixel art (keep it fast to implement)

- **Audio:** Basic sound effects (optional for later)

- **Deployment:** Single HTML file or simple build for web hosting

---

## 📋 DEVELOPMENT STEPS

**Mark each step COMPLETE when working demo exists**

---

### ✅ STEP 1: Basic Movement & Shooting

**Goal:** Playable character that moves and shoots

**Implementation:**

- [ ] Set up Phaser.js project

- [ ] Create game canvas (800x600 or similar)

- [ ] Add player sprite/shape (simple square or triangle)

- [ ] WASD movement (8-directional, smooth)

- [ ] Mouse position tracking

- [ ] Player rotates to face mouse cursor

- [ ] Left-click shoots bullet toward mouse

- [ ] Bullets travel and disappear off-screen

- [ ] Simple cyberpunk background (dark grid, neon accents)

**Success Criteria:** You can move around and shoot bullets with mouse

**Notes:**

- Keep movement speed moderate (~200 pixels/sec)

- Bullet speed should be fast (~600 pixels/sec)

- Don't worry about enemies yet

---

### ✅ STEP 2: Enemies & Hit Detection

**Goal:** Enemies that can be killed

**Implementation:**

- [ ] Create enemy class/object

- [ ] Spawn 3-5 enemies in random positions

- [ ] Enemies are stationary (don't move yet)

- [ ] Give enemies health (10-20 HP)

- [ ] Bullet collision with enemies

- [ ] Damage enemies on hit (5-10 damage per bullet)

- [ ] Enemies disappear when health reaches 0

- [ ] Simple health bars above enemies

**Success Criteria:** You can shoot and kill stationary enemies

**Notes:**

- Use different colors for enemies (red, purple, etc.)

- Bullets should destroy on impact

- Add simple hit flash/effect if time permits

---

### ✅ STEP 3: Enemy AI & Combat

**Goal:** Enemies that fight back

**Implementation:**

- [ ] Enemies move toward player (simple chase AI)

- [ ] Enemies maintain distance (some melee, some ranged)

- [ ] Ranged enemies shoot bullets at player

- [ ] Player has health (100 HP)

- [ ] Player takes damage from enemy bullets

- [ ] Display player health bar/number

- [ ] Player death state (freeze, game over text)

- [ ] Simple restart button

**Success Criteria:** Enemies chase and damage you, you can die

**Notes:**

- Enemy movement speed: ~120-150 pixels/sec

- Enemy bullet speed: ~400 pixels/sec

- Different enemy types: 1 melee (fast), 1 ranged (slower)

- Keep it simple: don't overcomplicate AI

---

### ✅ STEP 4: Room System

**Goal:** Clear room, progress to next room

**Implementation:**

- [ ] Define room boundaries (walls)

- [ ] Spawn enemies at room start (5-10 enemies)

- [ ] Track living enemies

- [ ] When all enemies dead, show exit portal/door

- [ ] Click/walk to portal to go to next room

- [ ] Next room spawns more enemies

- [ ] Room counter display (Room 1, Room 2, etc.)

- [ ] Reset player position at room start

**Success Criteria:** Clear rooms, progress through multiple rooms

**Notes:**

- Start with single room layout (can randomize later)

- Increase enemy count slightly each room (+1-2 enemies)

- Portal should be obvious (glowing, animated)

---

### ✅ STEP 5: Weapons & Pickups

**Goal:** Different guns and items to collect

**Implementation:**

- [ ] Create weapon system (weapon object with stats)

- [ ] Weapon types: Pistol (default), SMG (fast/weak), Shotgun (spread), Laser (continuous beam)

- [ ] Weapons drop from enemies (20% chance)

- [ ] Weapon pickup collision

- [ ] Display current weapon

- [ ] Weapon switching (1, 2, 3 keys or scroll)

- [ ] Ammo system (optional: can be infinite for now)

- [ ] Health pack drops (10% chance, +30 HP)

- [ ] Health pack pickup

**Success Criteria:** Find and use different weapons, heal from pickups

**Notes:**

- Each weapon should feel different:

  - Pistol: Medium damage, medium speed

  - SMG: Low damage, very fast

  - Shotgun: High damage, slow, 5-bullet spread

  - Laser: Continuous beam, medium damage

- Display weapon name on HUD

---

### ✅ STEP 6: Procedural Rooms

**Goal:** Random room layouts each run

**Implementation:**

- [ ] Create 3-5 room templates (different wall/obstacle layouts)

- [ ] Randomly select room template on room start

- [ ] Random enemy spawn positions (avoid walls)

- [ ] Add obstacles/cover (boxes, pillars)

- [ ] Bullets collide with obstacles

- [ ] Player collides with walls/obstacles

**Success Criteria:** Each room looks different, has obstacles

**Notes:**

- Keep room templates simple (just different wall arrangements)

- Obstacles should provide cover from enemy bullets

- Make sure player spawn point is always safe

---

### ✅ STEP 7: Mutations/Upgrades (Cyberpunk Theme)

**Goal:** Level up system with choices

**Implementation:**

- [ ] XP system (gain XP for killing enemies)

- [ ] Level up when XP threshold reached

- [ ] Pause game on level up

- [ ] Show 3 random mutation choices

- [ ] Mutation effects:

  - **Neural Overclock:** +20% movement speed

  - **Ballistic Implant:** +30% damage

  - **Dermal Armor:** +20 max HP

  - **Cyber Reflexes:** +25% fire rate

  - **Synthetic Blood:** Regenerate 1 HP per second

  - **Targeting System:** +20% bullet speed

  - **Adrenaline Pump:** +10% movement when low HP

- [ ] Apply selected mutation

- [ ] Track active mutations

- [ ] Display mutation icons/text on HUD

**Success Criteria:** Level up and choose upgrades that affect gameplay

**Notes:**

- Start with 4-5 mutations, add more later

- Mutations should stack (can get same one multiple times)

- Make level-up screen obvious (screen overlay, pause enemies)

---

### ✅ STEP 8: Permadeath & Meta Progression

**Goal:** Full roguelike loop

**Implementation:**

- [ ] Game over screen with stats:

  - Rooms cleared

  - Enemies killed

  - Time survived

  - Mutations collected

- [ ] "Play Again" button (restart from Room 1)

- [ ] High score tracking (store in localStorage)

- [ ] Display high score on game over

- [ ] Reset all player stats on restart

- [ ] Optional: unlock system (new weapons/mutations after achievements)

**Success Criteria:** Die, see stats, restart easily

**Notes:**

- Keep game over screen clean and motivating

- Show what went well (kills, rooms) not just failure

- Fast restart is crucial for roguelikes

---

### ✅ STEP 9: Polish & Content (COMPLETED)

**Goal:** Make it feel good and add variety

**Completed Features:**

- [x] Boss rooms (every floor has a boss room with a tough enemy)

- [x] More enemy types (6-8 total with unique behaviors)

- [x] More weapons (rocket launcher, flamethrower, etc.)

- [x] Particle effects (bullet trails, explosions, sparks)

- [x] Screen shake on damage/explosions

- [x] Mini-map (real-time map display with room and enemy positions)

- [x] More mutations/augments (15+ total augments with various effects)

**Success Criteria:** Game feels polished and has replay value ✅

**Notes:**

- Core loop is fun and engaging

- Visual feedback (particles, screen shake) enhances gameplay feel

- Mini-map helps with navigation in larger maps

---

### ✅ STEP 10: Advanced Features (COMPLETED)

**Goal:** Expand gameplay with floor progression and advanced systems

**Completed Features:**

#### Floor-Based Progression System
- [x] **100-Floor Structure**: Game objective is to infiltrate a cyberpunk corpo base and defeat the final boss on floor 100
- [x] **Floor Progression**: Each floor must be cleared before advancing to the next
- [x] **Floor Counter**: UI displays current floor number
- [x] **Victory Condition**: Reaching floor 100 and defeating the final boss triggers victory screen

#### Procedural Map Generation (Binding of Isaac Style)
- [x] **Grid-Based Room Generation**: Each floor generates 8 rooms in a 3x3 grid layout
- [x] **Compact Chamber Design**: Rooms are 240-320 pixels in size (Binding of Isaac style)
- [x] **Random Room Layouts**: Each room has procedurally generated walls and obstacles
- [x] **Room Connections**: Rooms are connected in a grid pattern with explicit doors
- [x] **Boss Room Designation**: Last room on each floor is designated as the boss room with red borders
- [x] **World Size**: Maps are 3000x3000 pixels, requiring exploration

#### Room & Door System
- [x] **Room Clearing**: Enemies spawn in each room (except starting room)
- [x] **Door Locking**: All doors start locked with lock icons
- [x] **Door Unlocking**: Doors unlock when all enemies in the connected room are killed
- [x] **Room Tracking**: System tracks which rooms have been cleared
- [x] **Starting Room**: First room is always cleared and its doors unlocked
- [x] **Boss Room**: Special boss room on each floor that must be cleared to progress

#### Camera System
- [x] **Player Following**: Camera smoothly follows the player
- [x] **Camera Deadzone**: Camera only moves when player is near screen edges
- [x] **World Bounds**: Camera is constrained to world boundaries
- [x] **UI Fixed to Camera**: All UI elements (health, floor, minimap) are fixed to camera viewport

#### Minimap System
- [x] **Real-Time Map Display**: Minimap shows all rooms, player position, and enemy positions
- [x] **Room Visualization**: Cleared rooms are highlighted, boss rooms are marked
- [x] **Player Indicator**: Player position shown as cyan dot
- [x] **Enemy Indicators**: Active enemies shown as red dots
- [x] **Fixed Position**: Minimap is fixed to top-right corner of screen

#### Advanced Enemy AI
- [x] **Line of Sight Detection**: Enemies only aggro when they can see the player
- [x] **AI States**: Three states - Patrol, Alert, and Combat
  - **Patrol**: Enemies move randomly within their spawn area
  - **Alert**: Enemies move toward last known player position
  - **Combat**: Enemies actively chase and attack the player
- [x] **Sight Range**: Enemies have configurable sight range (300-400 pixels)
- [x] **Obstacle Awareness**: Line of sight blocked by walls and obstacles
- [x] **Alert Timer**: Enemies stay alert for 2 seconds after losing sight

#### Augment System (Post-Floor Progression)
- [x] **Augment Selection**: After clearing each floor's boss, player chooses from 3 random augments
- [x] **Augment Categories**:
  - **Damage**: Damage Boost (+25%), Critical Strike (10% chance for 2x), Piercing Shots
  - **Speed**: Speed Boost (+30%), Bullet Speed (+40%)
  - **Fire Rate**: Rapid Fire (+35%), Double Shot (2 bullets)
  - **Health**: Health Boost (+50 HP), Health Regen (2 HP/sec), Lifesteal (10% of damage)
  - **Utility**: Extra Bullets (+2), Bullet Size (+50%), Knockback, Shield (block first hit/10s), Luck (+25% drops)
- [x] **Rarity System**: Common, Uncommon, Rare augments with color coding
- [x] **Augment Stacking**: Multiple augments of the same type stack their effects
- [x] **Visual Display**: Active augments shown as icons in the UI
- [x] **Immediate Effects**: Augments apply immediately upon selection

#### Floor Transition System
- [x] **Transition Screen**: "FLOOR X CLEARED!" message displayed
- [x] **Map Regeneration**: New procedural map generated for each floor
- [x] **Player Reset**: Player position reset to new starting room
- [x] **Enemy Respawn**: New enemies spawn in all rooms (except starting room)
- [x] **Boss Spawn**: New boss spawns in boss room
- [x] **State Reset**: Cleared rooms and door states reset for new floor

#### Enhanced Combat Systems
- [x] **Invincibility Frames**: Player has brief invincibility after taking damage
- [x] **Shield Augment**: Blocks first hit every 10 seconds
- [x] **Lifesteal**: Heal percentage of damage dealt (from augment)
- [x] **Critical Strikes**: Random chance for double damage (from augment)
- [x] **Piercing Bullets**: Bullets pass through enemies (from augment)
- [x] **Multi-shot**: Fire multiple bullets per shot (from augment)
- [x] **Bullet Size Scaling**: Bullets can be enlarged (from augment)

#### Particle System Improvements
- [x] **Hit Particles**: Visual feedback when bullets hit enemies
- [x] **Death Particles**: Explosion effect when enemies die
- [x] **Muzzle Flash**: Flash effect when shooting
- [x] **Error Handling**: Particle functions wrapped in try-catch for stability
- [x] **Performance**: Optimized particle creation and cleanup

#### Bug Fixes & Stability
- [x] **Particle System Fix**: Fixed game freeze when projectiles hit (removed invalid setTint calls)
- [x] **Bullet Hit Tracking**: Prevented same bullet from hitting same enemy multiple times
- [x] **Memory Management**: Proper cleanup of bullets, trails, and particle effects
- [x] **Null Safety**: Added safety checks throughout collision and update systems

**Success Criteria:** Advanced progression system with floor-based gameplay ✅

**Notes:**

- Floor system creates clear progression goals (reach floor 100)
- Augment system provides meaningful choices after each floor
- Procedural generation ensures each run feels different
- Enemy AI creates dynamic combat encounters
- Camera and minimap systems improve navigation and awareness

---

## 🎨 ART DIRECTION

**Cyberpunk Aesthetic:**

- Dark backgrounds (blacks, dark blues/purples)

- Neon accents (cyan, magenta, yellow, green)

- Grid patterns, scanlines, glitch effects

- Geometric shapes (if not using pixel art)

- High contrast

**Visual Hierarchy:**

- Player: Bright cyan/white (always visible)

- Enemies: Red/orange/purple (threatening)

- Pickups: Green (health), yellow (weapons)

- Bullets: Bright neon colors

- UI: Clean, minimal, corners of screen

---

## 🎮 GAME FEEL CHECKLIST

**Make Sure These Feel Good:**

- [ ] Movement is responsive and smooth

- [ ] Shooting feels punchy (recoil, muzzle flash)

- [ ] Enemies react to hits (flash, knockback)

- [ ] Health/damage feedback is clear

- [ ] Weapons feel different from each other

- [ ] Upgrades have noticeable effects

- [ ] Death feels fair (you know why you died)

- [ ] Restart is instant (no long load times)

---

## 🚨 COMMON PITFALLS TO AVOID

1. **Don't add too many features at once** - Finish each step fully

2. **Don't perfectionist the art** - Placeholder shapes are fine, make it fun first

3. **Don't skip playtesting** - Play your game after every step

4. **Don't over-complicate AI** - Simple chase/shoot is enough

5. **Don't forget collision detection** - Bullets, enemies, walls all need proper collision

6. **Don't make enemies too hard early** - Balance after core loop works

---

## 📝 STEP COMPLETION LOG

**Update this as you complete each step:**

- [x] Step 1: Basic Movement & Shooting - COMPLETED

- [x] Step 2: Enemies & Hit Detection - COMPLETED

- [x] Step 3: Enemy AI & Combat - COMPLETED

- [x] Step 4: Room System - COMPLETED

- [x] Step 5: Weapons & Pickups - COMPLETED

- [x] Step 6: Procedural Rooms - COMPLETED

- [x] Step 7: Mutations/Upgrades - COMPLETED

- [x] Step 8: Permadeath & Meta Progression - COMPLETED

- [x] Step 9: Polish & Content - COMPLETED

- [x] Step 10: Advanced Features (Floor System, Augments, Advanced AI) - COMPLETED

---

## 🎯 MINIMUM VIABLE GAME (MVG)

**You have a shippable game after Step 8.** Step 9 and 10 add significant polish and depth.

**Core Loop (Updated):**

1. Select character from character select screen

2. Enter floor (procedurally generated with 8 rooms)

3. Clear rooms by killing all enemies

4. Unlock doors to progress through rooms

5. Defeat boss in boss room

6. Choose augment after clearing floor

7. Progress to next floor (up to floor 100)

8. Eventually die or reach floor 100 and defeat final boss

9. Try to beat your high score (floors cleared)

**Enhanced Features:**

- 100-floor progression system with clear objective
- Augment selection after each floor (15+ augments)
- Advanced enemy AI with line-of-sight detection
- Procedural map generation (Binding of Isaac style)
- Camera following and minimap for navigation
- Room and door system with clearing mechanics

**That's it. Keep it simple. Make it fun. Ship it.**

---

## 🚀 DEPLOYMENT CHECKLIST

**When ready to put on fixer.gg:**

- [ ] Test in multiple browsers (Chrome, Firefox, Safari)

- [ ] Test on mobile (should work with touch controls or skip mobile)

- [ ] Optimize asset loading

- [ ] Add meta tags (title, description, Open Graph)

- [ ] Add analytics (optional)

- [ ] Add "Made with ❤️ for fixer.gg" footer

- [ ] Test game performance (60 FPS target)

---

## 💰 MONETIZATION IDEAS (LATER)

- Ads between runs (not during gameplay)

- Premium version ($2.99): More mutations, skins, no ads

- Leaderboards (requires backend)

- Daily challenges

- Cosmetic skins for player/weapons

---

**NOW GO BUILD IT. STEP BY STEP. YOU GOT THIS.**

