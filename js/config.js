export const PLAYER_X = "🌸";
export const PLAYER_O = "🌺";
export const EMPTY_CELL = "";

// Условия победы
export const WINNING_CONDITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Настройки сложности
export const DIFFICULTY_SETTINGS = {
  easy: { name: "Лёгкий", intelligence: 0.0 },
  medium: { name: "Средний", intelligence: 0.5 },
  hard: { name: "Сложный", intelligence: 1.0 },
};

// DOM элементы
export const DOM_ELEMENTS = {
  // Игровые элементы
  gameBoard: () => document.getElementById("game-board"),
  gameStatus: () => document.getElementById("game-status"),

  // Статистика
  winsCount: () => document.getElementById("wins-count"),
  drawsCount: () => document.getElementById("draws-count"),
  lossesCount: () => document.getElementById("losses-count"),

  // Кнопки
  restartBtn: () => document.getElementById("restart-btn"),
  hintBtn: () => document.getElementById("hint-btn"),
  difficultyButtons: () => document.querySelectorAll(".difficulty-btn"),

  // Модальные окна
  winModal: () => document.getElementById("win-modal"),
  loseModal: () => document.getElementById("lose-modal"),
  drawModal: () => document.getElementById("draw-modal"),

  // Элементы модальных окон
  promoCodeElement: () => document.getElementById("promo-code"),
  closeWinBtn: () => document.getElementById("close-win-btn"),
  closeLoseBtn: () => document.getElementById("close-lose-btn"),
  tryAgainBtn: () => document.getElementById("try-again-btn"),
  closeDrawBtn: () => document.getElementById("close-draw-btn"),
  shareBtn: () => document.getElementById("share-btn"),
};
