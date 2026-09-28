# AGENTS.md - Authoritative Development Context & Guidelines

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**  
> You MUST read this file before performing any work on this repository. Treat `AGENTS.md` as the authoritative source for development workflows, project context, and constraints. Refer to [PRD.md](file:///e:/projects/tic-tac-toe/PRD.md) for detailed product requirements and game specifications.

---

## 1. Core Directives for Future Agents

1. **Authoritative Context:** Always check `AGENTS.md` first. It contains architectural decisions, operating rules, and current project status.
2. **Consult PRD for Behavior:** Read [PRD.md](file:///e:/projects/tic-tac-toe/PRD.md) when requirements, game rules, or product specifications require clarification.
3. **No Unnecessary Project Scans:** Do **NOT** repeatedly scan, re-analyze, or redesign the entire codebase from scratch.
4. **No Rebuilding Completed Work:** Do **NOT** rebuild or refactor completed, working functionality unless a task specifically demands it.
5. **Preserve Architecture & Logic:** Maintain existing conventions, separation of concerns, and clean boundaries between game engine, AI logic, and UI rendering.
6. **Work Incrementally:** Make surgical, focused edits. Apply the smallest change necessary to achieve the goal.
7. **Inspect Only Relevant Files:** Limit file reads and searches strictly to files directly involved in the current task.
8. **Strict Tech Stack (Zero Dependencies):**
   - Use **only** standard **HTML5**, **CSS3**, and **Vanilla JavaScript**.
   - Do **NOT** install or introduce npm packages, build tools (Vite/Webpack), CSS libraries (Tailwind), or JavaScript frameworks (React/Vue/etc.) unless explicitly requested by the user.
9. **Scope Adherence:** Follow the documented project scope strictly. Do **NOT** implement roadmap/future items (such as sound effects, score persistence, or theme toggles) unless specifically requested.
10. **AI Difficulty Modes:** The VS AI mode defaults to **Medium**. Supported levels are **Easy**, **Medium**, and **Bihar (Impossible)** (which uses the 100% optimal, unbeatable Minimax solver). In-game difficulty is changed via the compact three-dot menu on the VS AI game screen without resetting the active board. 2 Players (PvP) mode has no difficulty controls.
11. **Test After Changes:** Verify and test all modified functionality before concluding any task.
12. **Clear Reporting:** Conclude every task with a concise summary of exactly what was modified and what was tested.

---

## 2. Mandatory Task Workflow

For every future task or prompt, all agents **MUST** execute the following sequence:

```
+-------------------------------------------------------------------+
| 1. Read AGENTS.md                                                 |
|    - Confirm constraints, architecture, and current state.        |
+---------------------------------+---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
| 2. Consult PRD.md (If requirements clarification is needed)      |
|    - Review relevant functional/UI/game logic specs.              |
+---------------------------------+---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
| 3. Inspect Only Relevant Files                                    |
|    - Open and read only the specific files to be modified/tested. |
|    - Avoid full repository re-analysis.                           |
+---------------------------------+---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
| 4. Understand Existing Implementation                             |
|    - Inspect existing function signatures, state, and DOM IDs.    |
+---------------------------------+---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
| 5. Make the Smallest Appropriate Change                           |
|    - Implement focused edits without modifying unrelated files.   |
+---------------------------------+---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
| 6. Test Affected Functionality                                    |
|    - Validate logic, transitions, edge cases, and UI behavior.    |
+---------------------------------+---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
| 7. Report Results                                                 |
|    - Clearly report what was changed and how it was verified.     |
+---------------------------------+---------------------------------+
```

---

## 3. Project Architecture & Decisions

### 3.1. Technology Decisions
- **Markup:** Semantic HTML5 (Single-page architecture with screen/view toggling).
- **Styling:** Vanilla CSS3 (Modern, responsive CSS Grid / Flexbox, clean visual tokens).
- **Scripting:** Modern Vanilla JavaScript (ES6+), cleanly structured into modular concerns.
- **Dependencies:** None. Zero external runtime dependencies. Zero build step.

### 3.2. Architecture & Separation of Concerns
1. **Game Engine (`game.js` / logic module):**
   - Core Tic Tac Toe state (3x3 grid array, turn tracker, move validation).
   - Win/Draw detection (8 winning combinations: rows, cols, diagonals).
   - Reset and state transition logic.
   - Completely decoupled from DOM manipulation.
   - Shared and reused identically between VS AI and 2 Players modes.
2. **AI Solver (`ai.js` / AI solver module):**
   - Implements 3 difficulty levels: `Easy`, `Medium` (default), and `Bihar (Impossible)`.
   - `Bihar (Impossible)`: Pure, depth-weighted Minimax algorithm for optimal move selection with randomized tie-breaking among equally optimal moves.
   - `Medium`: Balanced, intelligent play with occasional sub-optimal decisions.
   - `Easy`: Noticeably beatable play with frequent mistakes.
3. **UI Controller (`app.js` / DOM handler):**
   - Event listeners for mode selection, cell clicks, restart, navigation, and difficulty dropdown.
   - Renders board state, active turn indicators, winning line highlights, and game over messages.
   - Manages screen transitions between Landing Page, Mode Selection Screen, and Game Screen.

### 3.3. Key Product Rules & Invariants
- **Two Game Modes:**
  - `Play vs AI` / `VS AI` (Human = X, AI = O, defaults to Medium difficulty).
  - `2 Players` (Local pass-and-play, Player 1 = X, Player 2 = O).
- **Difficulty Selection:** VS AI defaults to `Medium` on game start. Difficulty can be switched live in-game between `Easy`, `Medium`, and `Bihar (Impossible)` via the compact header dropdown. PvP mode has no AI difficulty controls.
- **Shared Logic:** Never write separate game rules or win-detection algorithms for PvE and PvP modes.
- **X Moves First:** Player `X` always makes the first move on a fresh board.

---

## 4. Current Repository Status

- **Status:** Complete with AI Difficulty Modes and VS AI UI naming.
- **Active Files:**
  - `index.html`: Main HTML5 single-page application shell.
  - `style.css`: Responsive styling and design system.
  - `game.js`: Pure game state engine.
  - `ai.js`: AI move solver (Easy, Medium, Bihar/Minimax).
  - `app.js`: DOM UI controller and event coordinator.
  - `PRD.md`: Full Product Requirements Document.
  - `AGENTS.md`: Authoritative agent guide and development protocol.
