---
inclusion: always
---

# Cyberpunk Roguelike Development Guidelines

## Project Overview

This is a Nuclear Throne-style top-down twin-stick shooter roguelike built with Phaser.js 3. The game features a cyberpunk aesthetic with 100-floor progression, procedural generation, and character-based gameplay.

## Technology Stack

- **Framework**: Phaser.js 3 for game engine, physics, and rendering
- **Language**: Vanilla JavaScript (ES6+)
- **Architecture**: Scene-based with MainMenuScene, CharacterSelectScene, and GameScene
- **Deployment**: Browser-based, single HTML file with static assets

## Code Style & Conventions

### JavaScript Standards

- Use `let` and `const` instead of `var`
- Prefer arrow functions for callbacks and short functions
- Use template literals for string interpolation
- Follow camelCase naming for variables and functions
- Use PascalCase for classes and constructors

### Game Architecture Patterns

- **Scene Management**: Use Phaser's scene system for different game states
- **Component System**: Group related functionality (weapons, enemies, particles)
- **State Management**: Use global variables sparingly, prefer scene-local state
- **Physics Groups**: Leverage Phaser's physics groups for collision detection

### Performance Guidelines

- **Object Pooling**: Reuse bullets, particles, and enemies when possible
- **Texture Generation**: Create textures in preload(), not during gameplay
- **Collision Optimization**: Use physics groups and bounds checking
- **Memory Management**: Clean up sprites, timers, and event listeners

## Game Design Patterns

### Procedural Generation

- Use grid-based room generation (Binding of Isaac style)
- Maintain consistent room sizes (800x600 pixels)
- Ensure rooms are always accessible and fair

### Character System

- Each character has unique stats affecting gameplay
- Apply character modifiers to base values, not hardcoded stats
- Maintain character balance through playtesting

### Augment/Mutation System

- Stack augments multiplicatively for damage/speed
- Stack augments additively for health/utility effects
- Provide meaningful choices with trade-offs

## Visual & Audio Standards

### Cyberpunk Aesthetic

- **Color Palette**: Dark backgrounds (#0a0a0a) with neon accents (cyan #00ffff, magenta #ff00ff)
- **Typography**: Courier New for authentic terminal feel
- **Effects**: Use glow effects, screen shake, and particle systems
- **UI Design**: Minimal, corner-positioned HUD elements

### Sprite Creation

- Generate sprites programmatically using Phaser Graphics
- Use consistent sizing and scaling across similar objects
- Apply depth layering for proper rendering order

## Testing & Debugging

### Development Workflow

- Test each feature incrementally before moving to next step
- Use browser dev tools for debugging and performance monitoring
- Maintain playable builds at each development milestone

### Error Handling

- Wrap particle system calls in try-catch blocks
- Validate object existence before accessing properties
- Provide fallbacks for missing assets or failed operations

## File Organization

- Keep main game logic in `src/main.js`
- Use single HTML file for deployment simplicity
- Store development documentation in markdown files
- Maintain clean separation between scenes and systems
