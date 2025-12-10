import { gameState } from "./gameState.js";
import { gameBoard } from "./gameBoard.js";
import {
  WINNING_CONDITIONS,
  PLAYER_X,
  PLAYER_O,
  EMPTY_CELL,
} from "./config.js";
import { handleGameResult } from "./uiManager.js";

// Логика игры и ИИ компьютера
export function handleCellClick(index) {
  if (!gameState.isGameActive || gameState.board[index] !== EMPTY_CELL) return;

  // Ход игрока
  makeMove(index, PLAYER_X);

  // Проверка результата
  const result = checkGameResult();
  if (result) {
    handleGameResult(result);
    return;
  }

  // Ход компьютера с задержкой
  setTimeout(() => {
    const computerMove = getComputerMove();
    if (computerMove !== -1) {
      makeMove(computerMove, PLAYER_O);

      const computerResult = checkGameResult();
      if (computerResult) {
        handleGameResult(computerResult);
      }
    }
  }, 800);
}

// Совершение хода
export function makeMove(index, player) {
  if (gameState.setCell(index, player)) {
    gameBoard.updateCell(index, player);
    gameState.switchPlayer();
  }
}

// Проверка результата игры
export function checkGameResult() {
  const board = gameState.board;

  // Проверка победы игрока
  if (checkWin(board, PLAYER_X)) {
    return { type: "win", player: PLAYER_X };
  }

  // Проверка победы компьютера
  if (checkWin(board, PLAYER_O)) {
    return { type: "loss", player: PLAYER_O };
  }

  // Проверка ничьей
  if (checkDraw(board)) {
    return { type: "draw" };
  }

  return null;
}

// Проверка победы
export function checkWin(board, player) {
  return WINNING_CONDITIONS.some((condition) =>
    condition.every((index) => board[index] === player)
  );
}

// Проверка ничьей
export function checkDraw(board) {
  return board.every((cell) => cell !== EMPTY_CELL);
}

// Поиск выигрышной комбинации
export function findWinningCombination(board, player) {
  return WINNING_CONDITIONS.find((condition) =>
    condition.every((index) => board[index] === player)
  );
}

// Ход компьютера
export function getComputerMove() {
  const board = gameState.board;
  const difficulty = gameState.getDifficulty();
  const emptyCells = board
    .map((cell, index) => (cell === EMPTY_CELL ? index : -1))
    .filter((index) => index !== -1);

  if (emptyCells.length === 0) return -1;

  switch (difficulty) {
    case "easy":
      return getRandomMove(emptyCells);

    case "medium":
      if (Math.random() < 0.5) {
        return getRandomMove(emptyCells);
      }
    // Продолжить как hard

    case "hard":
      // 1. Попытаться выиграть
      const winMove = findWinningMove(board, PLAYER_O, emptyCells);
      if (winMove !== -1) return winMove;

      // 2. Заблокировать игрока
      const blockMove = findWinningMove(board, PLAYER_X, emptyCells);
      if (blockMove !== -1) return blockMove;

      // 3. Занять центр
      if (board[4] === EMPTY_CELL) return 4;

      // 4. Занять угол
      const corners = [0, 2, 6, 8];
      const availableCorners = corners.filter(
        (corner) => board[corner] === EMPTY_CELL
      );
      if (availableCorners.length > 0) {
        return getRandomMove(availableCorners);
      }

      // 5. Случайный ход
      return getRandomMove(emptyCells);
  }
}

// Вспомогательные функции для ИИ
function getRandomMove(cells) {
  return cells[Math.floor(Math.random() * cells.length)];
}

function findWinningMove(board, player, emptyCells) {
  for (const index of emptyCells) {
    const boardCopy = [...board];
    boardCopy[index] = player;
    if (checkWin(boardCopy, player)) {
      return index;
    }
  }
  return -1;
}

// Поиск лучшего хода для подсказки
export function findBestMove() {
  const board = gameState.board;
  const emptyCells = board
    .map((cell, index) => (cell === EMPTY_CELL ? index : -1))
    .filter((index) => index !== -1);

  // 1. Попытаться выиграть
  const winMove = findWinningMove(board, PLAYER_X, emptyCells);
  if (winMove !== -1) return winMove;

  // 2. Заблокировать компьютер
  const blockMove = findWinningMove(board, PLAYER_O, emptyCells);
  if (blockMove !== -1) return blockMove;

  // 3. Занять центр
  if (board[4] === EMPTY_CELL) return 4;

  // 4. Случайный ход
  return getRandomMove(emptyCells);
}
