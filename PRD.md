# Product Requirements Document (PRD)

## Project: Browser-Based Tic Tac Toe

---

### 1. Product Overview
The project is a polished, lightweight, browser-based Tic Tac Toe game built using pure standard web technologies (HTML5, CSS3, Vanilla JavaScript). The game supports two primary modes of play: **Play vs AI** (featuring configurable difficulty: Easy, Medium [default], and Bihar [Impossible]) and **2 Players** (local turn-based multiplayer on the same device).

---

### 2. Product Goals
- Provide an intuitive, responsive, and seamless Tic Tac Toe gaming experience directly in any modern web browser.
- Deliver an engaging single-player experience against an AI opponent with Easy, Medium, and unbeatable Bihar difficulty modes.
- Offer an accessible two-player mode for local shared-screen gameplay.
- Establish clean, modular, and maintainable software architecture with reusable core game logic across all game modes.
- Keep the application completely standalone with zero external dependencies, build steps, or backend services.

---

### 3. Target Experience
- **Immediate Playability:** Load instantly in any browser without installation or build configuration.
- **Clear Navigation:** Fluid transition between Landing Page, Mode Selection (Home), and Active Gameplay.
- **Zero Ambiguity:** Game state, turn progression, wins, and draws are communicated clearly to the player(s) at all times.
- **Tactile and Responsive:** Interactive board controls with clear feedback for valid moves and game resolution.

---

### 4. Game Modes

#### 4.1. Play vs AI (VS AI)
- **Human Player:** Plays as symbol `X` and always makes the opening move.
- **AI Opponent:** Plays as symbol `O` and responds to player moves.
- **Default Difficulty:** Clicking "Play vs AI" starts the game directly on **Medium** difficulty without an extra screen.
- **Difficulty Levels:**
  - **Easy:** Deliberately beatable with noticeable sub-optimal decisions and frequent mistakes while retaining basic gameplay structure.
  - **Medium (Default):** Balanced and intelligent play, taking wins and blocking threats frequently but making occasional imperfect moves to give the player realistic opportunities to win.
  - **Bihar (Impossible):** Pure, depth-weighted Minimax solver with randomized tie-breaking among equally optimal moves. Guaranteed unbeatable (never loses).
- **In-Game Difficulty Selector:**
  - Compact three-dot (`⋮ ›`) dropdown menu in the VS AI game header.
  - Allows live switching between Easy, Medium, and Bihar (Impossible) without page reloads, board resets, or game state corruption.

#### 4.2. 2 Players (Local Multiplayer)
- **Local Play:** Two human players alternate turns using the same device/screen.
- **Player X:** Plays as `X` and takes the first turn.
- **Player O:** Plays as `O` and takes the second turn.
- **Turn Alternation:** The active turn switches automatically after each valid move.
- **No Difficulty Controls:** 2 Players mode does not display any AI difficulty dropdown.

---

### 5. Game Flow

```
+------------------------------------+
|           LANDING PAGE             |
|  - "START GAME" Button             |
+-----------------+------------------+
                  |
                  v (Start Game)
+------------------------------------+
|        MODE SELECTION SCREEN       |
|  - "Play vs AI" Button             |
|  - "2 Players" Button              |
|  - "Back" Button (to Landing)      |
+-----------------+------------------+
                  |
                  v (Select Mode)
+------------------------------------+
|          ACTIVE GAME SCREEN        |
|  - Header / Title                  |
|  - Mode Indicator (VS AI / 2 PLAYERS)
|  - Difficulty Selector (VS AI only)|
|  - Turn / Status Banner            |
|  - 3x3 Game Board Grid             |
|  - Controls (Restart / Back)       |
+-----------------+------------------+
                  |
                  v (Moves Played)
+------------------------------------+
|          GAME IN PROGRESS          |
|  - Dynamic turn indicator updates  |
|  - Valid move verification         |
|  - AI move execution (if VS AI)    |
|  - Live difficulty adjustment      |
+-----------------+------------------+
                  |
                  v (Terminal State Reached)
+------------------------------------+
|          WIN / DRAW STATE          |
|  - Winner / Draw announcement      |
|    ("X WINS!", "O WINS!", "DRAW")  |
|  - Winning line highlighting       |
+-----------------+------------------+
                  |
                  v
+------------------------------------+
|       POST-GAME ACTIONS            |
|  - "Restart Game" (Reset Board)    |
|  - "Back to Menu" (Return to Modes)|
+------------------------------------+
```

---

### 6. Core Game Rules
1. Played on a standard 3x3 grid (9 total cells).
2. Player `X` always moves first; Player `O` moves second.
3. Players take turns claiming an unoccupied cell by placing their respective mark (`X` or `O`).
4. Once marked, a cell cannot be altered or overwritten until the game is reset.
5. **Win Condition:** A player wins immediately if they place three of their marks in a horizontal row, vertical column, or diagonal line (8 possible winning combinations).
6. **Draw Condition:** If all 9 cells are filled and neither player has achieved 3 in a row, the game ends in a draw (tie/cat's game).
7. No moves are accepted once a win or draw state is reached.

---

### 7. Functional Requirements

#### 7.1. Mode Selection Screen (Home Screen)
- **FR-1.1:** Render clear options for the user to select either **Play vs AI** or **2 Players**.
- **FR-1.2:** Transition cleanly to the Game Screen upon mode selection without page reloads.
- **FR-1.3:** Provide a "Back" button to return to the Landing Page.

#### 7.2. Game Board & Controls
- **FR-2.1:** Render a 3x3 interactive grid representing 9 distinct cells.
- **FR-2.2:** Display a Status Bar showing current turn (e.g., "Player X's Turn", "AI is Thinking...", "Player O's Turn") or end result (e.g., "X WINS!", "O WINS!", "DRAW").
- **FR-2.3:** Provide a "Restart Game" button that resets the current board while staying in the active game mode.
- **FR-2.4:** Provide a "Back to Menu" button that returns to the Mode Selection screen and resets the game state.
- **FR-2.5:** In VS AI mode, render a compact in-game difficulty dropdown control (`⋮ ›`) allowing dynamic difficulty switching between Easy, Medium, and Bihar (Impossible).

#### 7.3. Gameplay & Validation
- **FR-3.1:** Prevent clicking on already occupied cells.
- **FR-3.2:** Prevent clicks when it is not the human player's turn (e.g., while AI is calculating).
- **FR-3.3:** Prevent clicks after the game has ended (win or draw).
- **FR-3.4:** Trigger win/draw detection immediately after every move.
- **FR-3.5:** In VS AI mode, trigger the AI move automatically following Player X's move if the game has not ended.

#### 7.4. Reusable Architecture
- **FR-4.1:** The underlying game engine (board state, move validation, win/draw checking, reset logic) must be agnostic to the player type and reused identically across both modes.

---

### 8. UI / UX Requirements
- **Screen 0 (Landing Page):**
  - Application Title: "TIC TAC TOE"
  - Tagline and visual mark decoration
  - Action: "START GAME" button
- **Screen 1 (Mode Selection):**
  - Application Title: "Tic Tac Toe"
  - Mode buttons: "Play vs AI" and "2 Players (Pass & Play)"
  - Navigation: "Back" button to return to Landing Page
- **Screen 2 (Game Screen):**
  - Application / Screen Header
  - Mode Indicator: "VS AI" or "2 PLAYERS"
  - Difficulty Selector (VS AI only): Compact three-dot menu showing active level ("Medium" by default)
  - Turn / Outcome Status Banner
  - 3x3 Game Board Grid
  - Action Controls: "Restart Game" and "Back to Menu"
- **Visual Feedback:**
  - Distinct styling for `X` and `O` marks.
  - Clear visual indicator of winning cells upon game conclusion.
  - Disabled state or visual cue for unclickable / filled cells.

---

### 9. Game State Requirements

The application state model must maintain:
- `gameMode`: `'pve'` (Play vs AI) | `'pvp'` (2 Players) | `null` (Home/Unselected)
- `board`: Array of 9 elements containing `'X'`, `'O'`, or `null` (indices 0–8 corresponding to grid positions)
- `currentTurn`: `'X'` | `'O'`
- `gameStatus`: `'idle'` | `'in_progress'` | `'won'` | `'draw'`
- `winner`: `'X'` | `'O'` | `null`
- `winningCombination`: Array of 3 cell indices (e.g., `[0, 1, 2]`) or `null`

---

### 10. AI Requirements (Play vs AI)
- **Difficulty Modes:**
  - **Easy:** Sub-optimal, beatable AI that makes frequent mistakes while keeping game flow.
  - **Medium (Default):** Intelligent play with moderate challenge, taking wins and blocking threats often but occasionally making suboptimal moves.
  - **Bihar (Impossible):** Pure Minimax algorithm with depth-weighting and randomized tie-breaking.
- **Optimality Standard for Bihar (Impossible):** 
  - If the human makes a sub-optimal move, the AI will capitalize and win.
  - If both players play optimally, the game must end in a draw.
  - The AI must NEVER lose under any circumstance.
- **Behavior:** 
  - AI operates strictly as `O`.
  - Difficulty can be adjusted mid-game from the in-game header dropdown.

---

### 11. Technical Requirements & Stack

- **Technology Stack:**
  - **HTML5:** Semantic document structure (`<main>`, `<section>`, `<button>`, `<header>`, etc.).
  - **CSS3:** Clean, modern vanilla styling, CSS Grid / Flexbox for layout.
  - **JavaScript:** Pure Vanilla JavaScript (ES6+), modular design (using ES modules or clean object/functional separation).
- **Constraints:**
  - **NO** frontend frameworks (No React, Vue, Angular, Svelte).
  - **NO** bundlers or complex build setups required (No Vite, Webpack, Parcel).
  - **NO** CSS utility libraries (No Tailwind CSS).
  - **NO** external dependencies, npm packages, or runtime CDNs.
  - **NO** backend servers or database requirements.

---

### 12. Non-Functional Requirements
- **Portability & Zero Install:** Must execute by opening `index.html` directly in any modern browser.
- **Performance:** Instantaneous AI calculation and rendering without UI stutter.
- **Maintainability:** Separation of concerns between Game Engine (Logic), AI Solver (Minimax), and UI Controller (DOM events/rendering).
- **Accessibility:** Keyboard navigation support for grid buttons and screen-reader friendly status updates.

---

### 13. Testing Requirements
- **Win Detection Tests:** Verify all 8 winning lines (3 horizontal, 3 vertical, 2 diagonal) for both `X` and `O`.
- **Draw Detection Tests:** Verify board completion without a winner produces a draw.
- **Move Validation Tests:** Prevent overwriting marked cells or playing out of turn.
- **AI Optimality Tests:** Validate that the AI never loses in simulated scenarios (all potential game branches result in AI Win or Draw).
- **State Transition Tests:** Verify clean resets and switching between game modes without lingering board state.

---

### 14. Future Enhancements (Post-Core Roadmap)
*(Note: Not to be implemented during initial core build)*
- Sound effects and toggle controls (move sounds, win sounds, draw sounds).
- Enhanced animations (marker draw animations, winning line strike-through).
- Score tracking (X wins, O wins, Draws counters).
- Light / Dark theme toggle.
- LocalStorage persistence for match statistics.

---

### 15. Out of Scope
- Online/networked multiplayer (WebSockets / WebRTC).
- AI difficulty selectors (Easy, Medium, etc.).
- Custom board dimensions (4x4, 5x5, Connect Four variants).
- User accounts, server databases, or backend APIs.
