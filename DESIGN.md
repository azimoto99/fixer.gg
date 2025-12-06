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

### ✅ STEP 9: Polish & Content (Optional)

**Goal:** Make it feel good and add variety

**Add When Ready:**

- [ ] Boss rooms (every 5 rooms, big tough enemy)

- [ ] More enemy types (6-8 total with unique behaviors)

- [ ] More weapons (rocket launcher, flamethrower, etc.)

- [ ] Particle effects (bullet trails, explosions, sparks)

- [ ] Screen shake on damage/explosions

- [ ] Sound effects (shooting, hits, death)

- [ ] Cyberpunk music/ambient sounds

- [ ] More mutations (15-20 total)

- [ ] Rare/legendary weapons

- [ ] Mini-map

- [ ] Different biomes/themes (corporate tower, underground, cyberspace)

**Success Criteria:** Game feels polished and has replay value

**Notes:**

- Only add polish after core loop is fun

- Juice is important: screen shake, particles, sound make it feel good

- Test with friends, see what's missing

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

- [ ] Step 1: Basic Movement & Shooting - COMPLETED: [DATE]

- [ ] Step 2: Enemies & Hit Detection - COMPLETED: [DATE]

- [ ] Step 3: Enemy AI & Combat - COMPLETED: [DATE]

- [ ] Step 4: Room System - COMPLETED: [DATE]

- [ ] Step 5: Weapons & Pickups - COMPLETED: [DATE]

- [ ] Step 6: Procedural Rooms - COMPLETED: [DATE]

- [ ] Step 7: Mutations/Upgrades - COMPLETED: [DATE]

- [ ] Step 8: Permadeath & Meta Progression - COMPLETED: [DATE]

- [ ] Step 9: Polish & Content - COMPLETED: [DATE]

---

## 🎯 MINIMUM VIABLE GAME (MVG)

**You have a shippable game after Step 8.** Everything after is extra content.

**Core Loop:**

1. Enter room

2. Kill all enemies

3. Get stronger (mutations/weapons)

4. Go to next room

5. Eventually die

6. Try to beat your high score

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

