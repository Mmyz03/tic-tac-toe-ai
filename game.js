/**
 * ============================================================================
 * Tic Tac Toe - Core Game Engine (game.js)
 * ============================================================================
 * 
 * Step 2: DOM-Independent Core Game & State Logic
 * 
 * Rules & Invariants:
 * - 3x3 Grid (9 positions: indices 0 to 8).
 * - Player X always moves first.
 * - 8 Winning combinations (3 horizontal, 3 vertical, 2 diagonal).
 * - Strict move validation (legal index, empty cell, game in progress).
 * - Reusable across both Player vs Computer ('pve') and 2 Players ('pvp') modes.
 * - Zero DOM manipulation, HTML/CSS dependencies, or UI references.
 * - Zero AI/Minimax logic (AI solver is decoupled in ai.js).
 */

/**
 * All 8 possible winning line index combinations on a 3x3 grid.
 */
export const WINNING_COMBINATIONS = [
  // Horizontal rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Vertical columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6]
];

/**
 * Creates and initializes a fresh game state.
 * @param {'pve' | 'pvp' | null} mode - Selected game mode
 * @returns {Object} Initial game state object
 */
export function createGameState(mode = null) {
  return {
    gameMode: mode, // 'pve' | 'pvp' | null
    board: [null, null, null, null, null, null, null, null, null],
    currentTurn: 'X', // 'X' always moves first
    gameStatus: mode ? 'in_progress' : 'idle', // 'idle' | 'in_progress' | 'won' | 'draw'
    winner: null, // 'X' | 'O' | null
    winningCombination: null // [number, number, number] | null
  };
}

/**
 * Validates whether a move at a given index is legal.
 * @param {Object} state - Current game state
 * @param {number} index - Target cell index (0-8)
 * @returns {boolean} True if the move is legal, false otherwise
 */
export function isValidMove(state, index) {
  if (!state || typeof index !== 'number') {
    return false;
  }

  // Must be an integer within bounds [0, 8]
  if (!Number.isInteger(index) || index < 0 || index > 8) {
    return false;
  }

  // Game must be actively in progress
  if (state.gameStatus !== 'in_progress') {
    return false;
  }

  // Target cell must be currently unoccupied
  if (state.board[index] !== null) {
    return false;
  }

  return true;
}

/**
 * Checks a board array for a winning line.
 * @param {Array<string|null>} board - Array of 9 board cells
 * @returns {Object|null} Winning details { winner: 'X'|'O', combination: [...] } or null
 */
export function checkWinner(board) {
  if (!Array.isArray(board) || board.length !== 9) {
    return null;
  }

  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const [a, b, c] = WINNING_COMBINATIONS[i];
    const mark = board[a];

    if (mark !== null && mark === board[b] && mark === board[c]) {
      return {
        winner: mark,
        combination: [a, b, c]
      };
    }
  }

  return null;
}

/**
 * Checks if a board is completely full with no winner (draw condition).
 * @param {Array<string|null>} board - Array of 9 board cells
 * @returns {boolean} True if board is full, false otherwise
 */
export function checkDraw(board) {
  if (!Array.isArray(board) || board.length !== 9) {
    return false;
  }

  return board.every(cell => cell !== null);
}

/**
 * Returns a list of all currently available/empty cell indices.
 * @param {Array<string|null>} board - Array of 9 board cells
 * @returns {Array<number>} Array of empty cell indices (0-8)
 */
export function getAvailableMoves(board) {
  if (!Array.isArray(board)) {
    return [];
  }

  const moves = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

/**
 * Safely executes a move on the provided state.
 * @param {Object} state - Current game state (will be mutated safely)
 * @param {number} index - Cell index to place the current player's mark
 * @returns {Object} Result object { success: boolean, reason?: string, state: Object }
 */
export function makeMove(state, index) {
  if (!isValidMove(state, index)) {
    return {
      success: false,
      reason: state.gameStatus !== 'in_progress' ? 'game_not_in_progress' : 'invalid_cell',
      state: getGameState(state)
    };
  }

  const player = state.currentTurn;

  // 1. Apply move to board
  state.board[index] = player;

  // 2. Check for win
  const winInfo = checkWinner(state.board);
  if (winInfo) {
    state.gameStatus = 'won';
    state.winner = winInfo.winner;
    state.winningCombination = winInfo.combination;

    return {
      success: true,
      state: getGameState(state)
    };
  }

  // 3. Check for draw
  if (checkDraw(state.board)) {
    state.gameStatus = 'draw';
    state.winner = null;
    state.winningCombination = null;

    return {
      success: true,
      state: getGameState(state)
    };
  }

  // 4. Switch turn to the other player
  state.currentTurn = player === 'X' ? 'O' : 'X';

  return {
    success: true,
    state: getGameState(state)
  };
}

/**
 * Resets the game state for a new round while preserving the active game mode.
 * @param {Object} state - Current game state
 * @returns {Object} Freshly reset state copy
 */
export function resetGame(state) {
  const mode = state ? state.gameMode : null;

  state.board = [null, null, null, null, null, null, null, null, null];
  state.currentTurn = 'X';
  state.gameStatus = mode ? 'in_progress' : 'idle';
  state.winner = null;
  state.winningCombination = null;

  return getGameState(state);
}

/**
 * Returns a safe, deep copy of the game state to prevent unintended mutations.
 * @param {Object} state - Current game state
 * @returns {Object} Deep clone of state
 */
export function getGameState(state) {
  if (!state) {
    return null;
  }

  return {
    gameMode: state.gameMode,
    board: [...state.board],
    currentTurn: state.currentTurn,
    gameStatus: state.gameStatus,
    winner: state.winner,
    winningCombination: state.winningCombination ? [...state.winningCombination] : null
  };
}
