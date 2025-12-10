import { PLAYER_X, EMPTY_CELL } from "./config.js";

// Состояние игры (синглтон)
class GameState {
  constructor() {
    this.reset();
    this.difficulty = "medium";
    this.scores = { wins: 0, draws: 0, losses: 0 };
  }

  reset() {
    this.currentPlayer = PLAYER_X;
    this.gameBoard = Array(9).fill(EMPTY_CELL);
    this.gameActive = true;
  }

  // Геттеры
  get isGameActive() {
    return this.gameActive;
  }

  get currentPlayerSymbol() {
    return this.currentPlayer;
  }

  get board() {
    return [...this.gameBoard]; // возвращаем копию
  }

  // Сеттеры
  setCell(index, player) {
    if (this.gameActive && this.gameBoard[index] === EMPTY_CELL) {
      this.gameBoard[index] = player;
      return true;
    }
    return false;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === PLAYER_X ? "🌺" : PLAYER_X;
  }

  endGame() {
    this.gameActive = false;
  }

  // Работа со счетом
  addWin() {
    this.scores.wins++;
  }

  addDraw() {
    this.scores.draws++;
  }

  addLoss() {
    this.scores.losses++;
  }

  getScores() {
    return { ...this.scores };
  }

  setScores(scores) {
    this.scores = { ...scores };
  }

  // Работа со сложностью
  setDifficulty(level) {
    if (["easy", "medium", "hard"].includes(level)) {
      this.difficulty = level;
    }
  }

  getDifficulty() {
    return this.difficulty;
  }
}

// Экспортируем единственный экземпляр
export const gameState = new GameState();
