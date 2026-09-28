/**
 * ============================================================================
 * Tic Tac Toe - UI Controller (app.js)
 * ============================================================================
 * 
 * Architecture Separation:
 * - game.js: Owns all game rules, board state, move validation, win & draw detection.
 * - ai.js:   Owns AI move solver (Easy, Medium, Bihar/Minimax).
 * - app.js:  Owns DOM interaction, board rendering, user input routing, AI turn lifecycle,
 *            and in-game difficulty selection.
 */

import {
  createGameState,
  makeMove,
  resetGame,
  getGameState
} from './game.js';

import { getBestMove } from './ai.js';

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. DOM Element Cache
  // --------------------------------------------------------------------------
  const elements = {
    // Application Screens
    screens: {
      landing: document.getElementById('landing-screen'),
      modeSelection: document.getElementById('mode-selection-screen'),
      game: document.getElementById('game-screen')
    },
    // Landing Page Buttons
    landingButtons: {
      start: document.getElementById('btn-start-game')
    },
    // Mode Selection Buttons
    modeButtons: {
      pve: document.getElementById('btn-pve'),
      pvp: document.getElementById('btn-pvp'),
      back: document.getElementById('btn-mode-back')
    },
    // Game Screen Controls
    gameControls: {
      restart: document.getElementById('btn-restart'),
      backToMenu: document.getElementById('btn-back')
    },
    // Difficulty Dropdown Controls (VS AI mode only)
    difficulty: {
      container: document.getElementById('difficulty-dropdown'),
      toggle: document.getElementById('btn-difficulty-toggle'),
      badge: document.getElementById('difficulty-badge'),
      menu: document.getElementById('difficulty-menu'),
      options: Array.from(document.querySelectorAll('.difficulty-option'))
    },
    // Game Screen UI Feedback
    gameUI: {
      modeIndicator: document.getElementById('mode-indicator'),
      statusDisplay: document.getElementById('status-display'),
      board: document.getElementById('board'),
      cells: Array.from(document.querySelectorAll('.cell'))
    }
  };

  // --------------------------------------------------------------------------
  // 2. Active State Management & Cancellation Tokens
  // --------------------------------------------------------------------------
  let activeGameState = null;
  let isAiThinking = false;
  let aiTurnTimeoutId = null;
  let currentSessionId = 0;
  let lastPlacedIndex = null;

  // AI Difficulty State (Defaults to 'medium')
  let currentDifficulty = 'medium';

  const DIFFICULTY_LABELS = {
    easy: 'Easy',
    medium: 'Medium',
    bihar: 'Bihar (Impossible)'
  };

  // AI Thinking delay in milliseconds (deterministic, brief)
  const AI_THINKING_DELAY_MS = 280;

  /**
   * Invalidates any pending AI action and clears timeouts.
   */
  function cancelPendingAiAction() {
    if (aiTurnTimeoutId !== null) {
      clearTimeout(aiTurnTimeoutId);
      aiTurnTimeoutId = null;
    }
    currentSessionId++;
    isAiThinking = false;
  }

  // --------------------------------------------------------------------------
  // 3. Difficulty Menu Management
  // --------------------------------------------------------------------------

  /**
   * Opens or closes the in-game difficulty dropdown menu.
   * @param {boolean} [forceState] - Optional boolean to force open (true) or close (false)
   */
  function toggleDifficultyMenu(forceState) {
    if (!elements.difficulty.menu || !elements.difficulty.toggle) return;

    const isCurrentlyHidden = elements.difficulty.menu.classList.contains('hidden');
    const shouldOpen = typeof forceState === 'boolean' ? forceState : isCurrentlyHidden;

    if (shouldOpen) {
      elements.difficulty.menu.classList.remove('hidden');
      elements.difficulty.toggle.setAttribute('aria-expanded', 'true');
      // Focus the currently active option for accessibility
      const activeOption = elements.difficulty.options.find(opt => opt.dataset.difficulty === currentDifficulty);
      if (activeOption) {
        activeOption.focus();
      }
    } else {
      elements.difficulty.menu.classList.add('hidden');
      elements.difficulty.toggle.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Sets the active AI difficulty level and updates UI indicators.
   * @param {'easy' | 'medium' | 'bihar'} difficulty
   */
  function setDifficulty(difficulty) {
    if (!DIFFICULTY_LABELS[difficulty]) return;

    currentDifficulty = difficulty;
    const label = DIFFICULTY_LABELS[difficulty];

    // Update toggle badge & accessible label
    if (elements.difficulty.badge) {
      elements.difficulty.badge.textContent = label;
      elements.difficulty.badge.classList.remove('badge-updated');
      void elements.difficulty.badge.offsetWidth; // Force reflow for animation
      elements.difficulty.badge.classList.add('badge-updated');
    }
    if (elements.difficulty.toggle) {
      elements.difficulty.toggle.setAttribute('aria-label', `AI Difficulty: ${label}`);
    }

    // Update menu items active state
    elements.difficulty.options.forEach(opt => {
      const isSelected = opt.dataset.difficulty === difficulty;
      opt.classList.toggle('active', isSelected);
      opt.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });

    // Close menu after selection
    toggleDifficultyMenu(false);
  }

  // --------------------------------------------------------------------------
  // 4. UI Rendering Engine
  // --------------------------------------------------------------------------

  /**
   * Updates the 3x3 grid DOM buttons to reflect the engine's board state.
   * @param {Object} state - Current game state from game.js
   */
  function renderBoard(state) {
    if (!state) {
      elements.gameUI.board.classList.remove('board-draw');
      elements.gameUI.cells.forEach((cell, index) => {
        cell.textContent = '';
        cell.className = 'cell';
        cell.disabled = true;
        const row = Math.floor(index / 3) + 1;
        const col = (index % 3) + 1;
        cell.setAttribute('aria-label', `Row ${row}, Column ${col}`);
      });
      return;
    }

    const { board, gameStatus, winningCombination } = state;
    const isGameOver = gameStatus === 'won' || gameStatus === 'draw';

    if (gameStatus === 'draw') {
      elements.gameUI.board.classList.add('board-draw');
    } else {
      elements.gameUI.board.classList.remove('board-draw');
    }

    elements.gameUI.cells.forEach((cell, index) => {
      const mark = board[index];
      const row = Math.floor(index / 3) + 1;
      const col = (index % 3) + 1;

      let classList = ['cell'];

      if (mark === 'X') {
        classList.push('cell-x');
        // Only trigger entrance animation on newly placed mark
        if (index === lastPlacedIndex) {
          classList.push('cell-marked');
        }
        cell.textContent = 'X';
        cell.disabled = true;
        cell.setAttribute('aria-label', `Row ${row}, Column ${col}: X`);
      } else if (mark === 'O') {
        classList.push('cell-o');
        if (index === lastPlacedIndex) {
          classList.push('cell-marked');
        }
        cell.textContent = 'O';
        cell.disabled = true;
        cell.setAttribute('aria-label', `Row ${row}, Column ${col}: O`);
      } else {
        cell.textContent = '';
        // Disabled if game is over OR if AI is currently thinking
        cell.disabled = isGameOver || isAiThinking;
        cell.setAttribute('aria-label', `Row ${row}, Column ${col}, Empty`);
      }

      // Winning cell highlight
      if (winningCombination && winningCombination.includes(index)) {
        classList.push('cell-win');
      }

      cell.className = classList.join(' ');
    });
  }

  /**
   * Updates the status banner text and accessibility announcements.
   * @param {Object} state - Current game state from game.js
   */
  function renderStatus(state) {
    if (!state) {
      elements.gameUI.statusDisplay.className = 'status-display';
      elements.gameUI.statusDisplay.innerHTML = '<span class="status-text">Select a mode</span>';
      return;
    }

    let message = '';
    let statusClass = 'status-display';
    const isPve = state.gameMode === 'pve';

    switch (state.gameStatus) {
      case 'in_progress':
        if (state.currentTurn === 'X') {
          message = "Player X's Turn";
        } else {
          message = isPve ? "AI's Turn" : "Player O's Turn";
        }
        break;
      case 'won':
        if (state.winner === 'X') {
          statusClass = 'status-display status-result status-result-x';
          message = 'X WINS!';
        } else {
          statusClass = 'status-display status-result status-result-o';
          message = 'O WINS!';
        }
        break;
      case 'draw':
        statusClass = 'status-display status-result status-result-draw';
        message = 'DRAW';
        break;
      default:
        message = 'Ready to play';
        break;
    }

    elements.gameUI.statusDisplay.className = statusClass;
    elements.gameUI.statusDisplay.innerHTML = `<span class="status-text">${message}</span>`;
  }

  /**
   * Complete UI re-render for board and status.
   * @param {Object} state - Current game state
   */
  function renderGame(state) {
    renderBoard(state);
    renderStatus(state);
  }

  // --------------------------------------------------------------------------
  // 5. AI Turn Orchestration
  // --------------------------------------------------------------------------

  /**
   * Schedules and executes the AI's turn based on the active difficulty.
   */
  function triggerAiTurn() {
    if (!activeGameState || activeGameState.gameMode !== 'pve') {
      return;
    }

    if (activeGameState.gameStatus !== 'in_progress' || activeGameState.currentTurn !== 'O') {
      return;
    }

    const sessionId = currentSessionId;
    isAiThinking = true;
    renderGame(activeGameState);

    aiTurnTimeoutId = setTimeout(() => {
      // Validate session integrity
      if (
        sessionId !== currentSessionId ||
        !activeGameState ||
        activeGameState.gameMode !== 'pve' ||
        activeGameState.gameStatus !== 'in_progress' ||
        activeGameState.currentTurn !== 'O'
      ) {
        isAiThinking = false;
        return;
      }

      // Compute AI move based on active difficulty
      const bestMove = getBestMove(activeGameState.board, 'O', 'X', currentDifficulty);

      isAiThinking = false;

      if (bestMove !== null) {
        lastPlacedIndex = bestMove;
        makeMove(activeGameState, bestMove);
        renderGame(activeGameState);
      }
    }, AI_THINKING_DELAY_MS);
  }

  // --------------------------------------------------------------------------
  // 6. Screen Navigation
  // --------------------------------------------------------------------------

  /**
   * Toggles view between Landing Page, Mode Selection, and Active Game Screen.
   * @param {'landing' | 'mode-selection' | 'game'} targetScreen
   */
  function showScreen(targetScreen) {
    if (elements.screens.landing) {
      elements.screens.landing.classList.toggle('hidden', targetScreen !== 'landing');
    }
    if (elements.screens.modeSelection) {
      elements.screens.modeSelection.classList.toggle('hidden', targetScreen !== 'mode-selection');
    }
    if (elements.screens.game) {
      elements.screens.game.classList.toggle('hidden', targetScreen !== 'game');
    }
  }

  // --------------------------------------------------------------------------
  // 7. User Interaction Handlers
  // --------------------------------------------------------------------------

  /**
   * Starts a new game in the selected mode.
   * @param {'pve' | 'pvp'} mode
   */
  function startNewGame(mode) {
    cancelPendingAiAction();
    toggleDifficultyMenu(false);
    lastPlacedIndex = null;
    activeGameState = createGameState(mode);

    if (mode === 'pve') {
      elements.gameUI.modeIndicator.textContent = 'VS AI';
      // Show difficulty selector in VS AI mode
      if (elements.difficulty.container) {
        elements.difficulty.container.classList.remove('hidden');
      }
    } else {
      elements.gameUI.modeIndicator.textContent = '2 PLAYERS';
      // Hide difficulty selector in 2 Players mode
      if (elements.difficulty.container) {
        elements.difficulty.container.classList.add('hidden');
      }
    }

    renderGame(activeGameState);
    showScreen('game');
  }

  /**
   * Handles user click on a board cell.
   * @param {number} index - Index of clicked cell (0-8)
   */
  function handleCellClick(index) {
    // Reject clicks if no active game or if AI is currently calculating
    if (!activeGameState || isAiThinking) {
      return;
    }

    // In PvE mode, only allow human clicks during player X's turn
    if (activeGameState.gameMode === 'pve' && activeGameState.currentTurn !== 'X') {
      return;
    }

    lastPlacedIndex = index;
    const moveResult = makeMove(activeGameState, index);

    if (moveResult.success) {
      renderGame(activeGameState);

      // If in PvE mode and game is still in progress, trigger AI turn
      if (
        activeGameState.gameMode === 'pve' &&
        activeGameState.gameStatus === 'in_progress' &&
        activeGameState.currentTurn === 'O'
      ) {
        triggerAiTurn();
      }
    }
  }

  /**
   * Resets the active game board for a rematch without reloading the page.
   */
  function handleRestart() {
    if (!activeGameState) {
      return;
    }

    cancelPendingAiAction();
    toggleDifficultyMenu(false);
    lastPlacedIndex = null;
    resetGame(activeGameState);
    renderGame(activeGameState);
  }

  /**
   * Returns from game screen to main mode selection menu.
   */
  function handleBackToMenu() {
    cancelPendingAiAction();
    toggleDifficultyMenu(false);
    lastPlacedIndex = null;
    activeGameState = null;
    renderBoard(null);
    renderStatus(null);
    showScreen('mode-selection');
  }

  // --------------------------------------------------------------------------
  // 8. Event Registration & Shell Initialization
  // --------------------------------------------------------------------------
  function init() {
    // Landing page start button
    if (elements.landingButtons.start) {
      elements.landingButtons.start.addEventListener('click', () => {
        showScreen('mode-selection');
      });
    }

    // Mode selection buttons
    elements.modeButtons.pve.addEventListener('click', () => startNewGame('pve'));
    elements.modeButtons.pvp.addEventListener('click', () => startNewGame('pvp'));
    if (elements.modeButtons.back) {
      elements.modeButtons.back.addEventListener('click', () => {
        showScreen('landing');
      });
    }

    // Game control buttons
    elements.gameControls.restart.addEventListener('click', handleRestart);
    elements.gameControls.backToMenu.addEventListener('click', handleBackToMenu);

    // Difficulty dropdown toggle
    if (elements.difficulty.toggle) {
      elements.difficulty.toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDifficultyMenu();
      });
    }

    // Difficulty menu option selection
    elements.difficulty.options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const diff = opt.dataset.difficulty;
        if (diff) {
          setDifficulty(diff);
        }
      });
    });

    // Close difficulty menu on outside clicks
    document.addEventListener('click', (e) => {
      if (
        elements.difficulty.container &&
        !elements.difficulty.container.contains(e.target) &&
        elements.difficulty.menu &&
        !elements.difficulty.menu.classList.contains('hidden')
      ) {
        toggleDifficultyMenu(false);
      }
    });

    // Close difficulty menu on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.difficulty.menu && !elements.difficulty.menu.classList.contains('hidden')) {
        toggleDifficultyMenu(false);
        if (elements.difficulty.toggle) {
          elements.difficulty.toggle.focus();
        }
      }
    });

    // Board cell click handlers
    elements.gameUI.cells.forEach(cell => {
      cell.addEventListener('click', () => {
        const index = Number(cell.dataset.index);
        if (Number.isInteger(index)) {
          handleCellClick(index);
        }
      });
    });

    // Ensure initial default difficulty state is reflected
    setDifficulty('medium');

    // Start on Landing Page screen
    showScreen('landing');
    console.log('Tic Tac Toe UI Controller initialized.');
  }

  init();
});
