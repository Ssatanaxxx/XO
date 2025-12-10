// Точка входа в игру
import { gameState } from "./gameState.js";
import { gameBoard } from "./gameBoard.js";
import { uiManager } from "./uiManager.js";
import { modalManager } from "./modalManager.js";
import { storageManager } from "./storageManager.js";
import { telegramService } from "./telegramService.js";
import { DOM_ELEMENTS } from "./config.js";

// Инициализация игры
function initGame() {
  // Загрузка сохраненного счета
  const savedScores = storageManager.loadScores();
  if (savedScores) {
    gameState.setScores(savedScores);
  }

  // Создание игрового поля
  gameBoard.create();

  // Настройка UI
  uiManager.updateGameStatus();
  uiManager.updateScoreDisplay();
  uiManager.updateDifficultyButtons();

  // Настройка обработчиков событий
  setupEventListeners();

  console.log("Игра инициализирована!");
}

// Настройка обработчиков событий
function setupEventListeners() {
  const elements = DOM_ELEMENTS;

  // Кнопка перезапуска
  const restartBtn = elements.restartBtn();
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      uiManager.resetGame();
      storageManager.saveScores(gameState.getScores());
    });
  }

  // Кнопка подсказки
  const hintBtn = elements.hintBtn();
  if (hintBtn) {
    hintBtn.addEventListener("click", () => uiManager.giveHint());
  }

  // Кнопки сложности
  const difficultyButtons = elements.difficultyButtons();
  if (difficultyButtons) {
    difficultyButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        gameState.setDifficulty(btn.dataset.level);
        uiManager.updateDifficultyButtons();
        uiManager.resetGame();
      });
    });
  }

  // Настройка обработчиков модальных окон
  modalManager.setupModalHandlers(() => {
    uiManager.resetGame();
    storageManager.saveScores(gameState.getScores());
  });
}

// Сохранение счета при закрытии страницы
window.addEventListener("beforeunload", () => {
  storageManager.saveScores(gameState.getScores());
});

// Запуск игры при загрузке DOM
document.addEventListener("DOMContentLoaded", initGame);

// Экспорт для отладки (опционально)
if (process.env.NODE_ENV === "development") {
  window.game = {
    state: gameState,
    board: gameBoard,
    ui: uiManager,
    storage: storageManager,
    telegram: telegramService,
  };
}
