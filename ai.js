/**
 * ============================================================================
 * Tic Tac Toe - Optimal AI Solver (ai.js)
 * ============================================================================
 * 
 * Step 4: Optimal Minimax Computer Opponent
 * 
 * Invariants & Architecture:
 * - Pure, DOM-independent mathematical solver.
 * - AI plays as 'O', Human plays as 'X' (by default).
 * - Minimax algorithm with depth-weighted terminal state evaluation.
 * - Guaranteed mathematically optimal (unbeatable in standard 3x3 Tic Tac Toe).
 * - Zero difficulty settings, zero randomness, zero heuristics.
 * - Reuses checkWinner, checkDraw, and getAvailableMoves from game.js.
 */

import {
  checkWinner,
  checkDraw,
  getAvailableMoves
} from './game.js';

/**
 * Evaluates a terminal board state with depth weighting:
 * - AI win: +10 - depth (prefers faster wins)
 * - Opponent win: depth - 10 (prefers delayed losses)
 * - Draw: 0
 * 
 * @param {Object|null} winInfo - Result from checkWinner
 * @param {number} depth - Search tree depth
 * @param {string} aiPlayer - AI player symbol
 * @param {string} humanPlayer - Opponent symbol
 * @returns {number} Evaluated score
 */
function evaluateTerminal(winInfo, depth, aiPlayer, humanPlayer) {
  if (winInfo) {
    if (winInfo.winner === aiPlayer) {
      return 10 - depth;
    }
    if (winInfo.winner === humanPlayer) {
      return depth - 10;
    }
  }
  return 0;
}

/**
 * Minimax recursive algorithm to evaluate optimal game tree values.
 * 
 * @param {Array<string|null>} board - Current 3x3 board array
 * @param {number} depth - Recursion depth
 * @param {boolean} isMaximizing - True if AI player turn, false if opponent turn
 * @param {string} aiPlayer - AI player symbol
 * @param {string} humanPlayer - Opponent symbol
 * @returns {number} Best score achievable from this board state
 */
function minimax(board, depth, isMaximizing, aiPlayer, humanPlayer) {
  // 1. Check terminal win condition
  const winInfo = checkWinner(board);
  if (winInfo) {
    return evaluateTerminal(winInfo, depth, aiPlayer, humanPlayer);
  }

  // 2. Check terminal draw / available moves
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return 0; // Draw score
  }

  // 3. Recursive search
  if (isMaximizing) {
    let maxScore = -Infinity;
    for (let i = 0; i < availableMoves.length; i++) {
      const move = availableMoves[i];
      board[move] = aiPlayer;
      const score = minimax(board, depth + 1, false, aiPlayer, humanPlayer);
      board[move] = null; // Backtrack

      if (score > maxScore) {
        maxScore = score;
      }
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (let i = 0; i < availableMoves.length; i++) {
      const move = availableMoves[i];
      board[move] = humanPlayer;
      const score = minimax(board, depth + 1, true, aiPlayer, humanPlayer);
      board[move] = null; // Backtrack

      if (score < minScore) {
        minScore = score;
      }
    }
    return minScore;
  }
}

/**
 * Finds an immediate winning move for a given player if one exists.
 * @param {Array<string|null>} board
 * @param {string} player
 * @returns {number|null}
 */
function findImmediateWinningMove(board, player) {
  const availableMoves = getAvailableMoves(board);
  for (let i = 0; i < availableMoves.length; i++) {
    const move = availableMoves[i];
    board[move] = player;
    const win = checkWinner(board);
    board[move] = null; // Backtrack
    if (win && win.winner === player) {
      return move;
    }
  }
  return null;
}

/**
 * Optimal Minimax move computation (Bihar / Impossible level).
 * @param {Array<string|null>} board
 * @param {string} aiPlayer
 * @param {string} humanPlayer
 * @returns {number|null}
 */
function getOptimalMove(board, aiPlayer, humanPlayer) {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return null;
  if (availableMoves.length === 1) return availableMoves[0];

  let bestScore = -Infinity;
  let bestMoves = [];

  const workingBoard = [...board];

  for (let i = 0; i < availableMoves.length; i++) {
    const move = availableMoves[i];
    workingBoard[move] = aiPlayer;

    const score = minimax(workingBoard, 0, false, aiPlayer, humanPlayer);

    workingBoard[move] = null; // Backtrack

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }

  if (bestMoves.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * bestMoves.length);
  return bestMoves[randomIndex];
}

/**
 * Medium difficulty move selection: plays intelligently but gives realistic chances to win.
 * - Takes immediate win opportunities with ~60% probability.
 * - Blocks immediate player winning threats with ~50% probability.
 * - Prefers center or corners if available, but does NOT run deep Minimax tree calculations.
 * - This creates a natural human-like opponent that normal players can realistically beat
 *   (e.g., via forks and basic tactical setups) without feeling completely random.
 * 
 * @param {Array<string|null>} board
 * @param {string} aiPlayer
 * @param {string} humanPlayer
 * @returns {number|null}
 */
function getMediumMove(board, aiPlayer, humanPlayer) {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return null;
  if (availableMoves.length === 1) return availableMoves[0];

  const workingBoard = [...board];

  // 1. With 60% probability, take an immediate win
  if (Math.random() < 0.6) {
    const winMove = findImmediateWinningMove(workingBoard, aiPlayer);
    if (winMove !== null) return winMove;
  }

  // 2. With 50% probability, block opponent's immediate winning threat
  if (Math.random() < 0.5) {
    const blockMove = findImmediateWinningMove(workingBoard, humanPlayer);
    if (blockMove !== null) return blockMove;
  }

  // 3. Positional play with human-like heuristics (Center -> Corners -> Random)
  // 3a. If center (4) is available, 40% chance to claim center
  if (availableMoves.includes(4) && Math.random() < 0.4) {
    return 4;
  }

  // 3b. If corners (0, 2, 6, 8) are available, 50% chance to pick a corner
  const corners = [0, 2, 6, 8].filter(c => availableMoves.includes(c));
  if (corners.length > 0 && Math.random() < 0.5) {
    const randomCorner = corners[Math.floor(Math.random() * corners.length)];
    return randomCorner;
  }

  // 3c. Otherwise choose a random available move
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
}

/**
 * Easy difficulty move selection: intentionally beatable with noticeable suboptimal moves.
 * @param {Array<string|null>} board
 * @param {string} aiPlayer
 * @param {string} humanPlayer
 * @returns {number|null}
 */
function getEasyMove(board, aiPlayer, humanPlayer) {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return null;
  if (availableMoves.length === 1) return availableMoves[0];

  const workingBoard = [...board];

  // 1. With 30% probability, take an immediate win
  if (Math.random() < 0.3) {
    const winMove = findImmediateWinningMove(workingBoard, aiPlayer);
    if (winMove !== null) return winMove;
  }

  // 2. With 20% probability, block opponent's threat
  if (Math.random() < 0.2) {
    const blockMove = findImmediateWinningMove(workingBoard, humanPlayer);
    if (blockMove !== null) return blockMove;
  }

  // 3. Otherwise, pick a random available move
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
}

/**
 * Computes the move for the AI opponent on the given board based on difficulty.
 * 
 * @param {Array<string|null>} board - 9-element array representing the board
 * @param {string} [aiPlayer='O'] - Symbol for the AI player (default 'O')
 * @param {string} [humanPlayer='X'] - Symbol for the human player (default 'X')
 * @param {'easy'|'medium'|'bihar'|'impossible'} [difficulty='bihar'] - AI difficulty level
 * @returns {number|null} Index (0-8) of chosen move, or null if no move is possible
 */
export function getBestMove(board, aiPlayer = 'O', humanPlayer = 'X', difficulty = 'bihar') {
  if (!Array.isArray(board) || board.length !== 9) {
    return null;
  }

  // If game is already won or drawn, no valid moves remain
  if (checkWinner(board) || checkDraw(board)) {
    return null;
  }

  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return null;
  }

  const normalizedDiff = (difficulty || '').toLowerCase();

  if (normalizedDiff === 'easy') {
    return getEasyMove(board, aiPlayer, humanPlayer);
  }

  if (normalizedDiff === 'medium') {
    return getMediumMove(board, aiPlayer, humanPlayer);
  }

  // Default: 'bihar' / 'impossible' -> Optimal Minimax
  return getOptimalMove(board, aiPlayer, humanPlayer);
}

