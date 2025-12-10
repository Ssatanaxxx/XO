import { gameState } from "./gameState.js";
import { gameBoard } from "./gameBoard.js";
import { DOM_ELEMENTS } from "./config.js";
import { findBestMove, findWinningCombination } from "./gameLogic.js";
import { showWinModal, showLoseModal, showDrawModal } from "./modalManager.js";
import { sendTelegramNotification } from "./telegramService.js";
import { generatePromoCode } from "./utils.js";

// Управление интерфейсом
export class UIManager {
  constructor() {
    this.elements = DOM_ELEMENTS;
  }

  // Обновление статуса игры
  updateGameStatus() {
    if (!gameState.isGameActive) return;

    const statusElement = this.elements.gameStatus();
    if (!statusElement) return;

    statusElement.textContent =
      gameState.currentPlayerSymbol === "🌸"
        ? "Ваш ход! Поставьте цветочек 🌸"
        : "Компьютер думает...";
  }

  // Обновление счета
  updateScoreDisplay() {
    const scores = gameState.getScores();

    const winsEl = this.elements.winsCount();
    const drawsEl = this.elements.drawsCount();
    const lossesEl = this.elements.lossesCount();

    if (winsEl) winsEl.textContent = scores.wins;
    if (drawsEl) drawsEl.textContent = scores.draws;
    if (lossesEl) lossesEl.textContent = scores.losses;
  }

  // Обновление кнопок сложности
  updateDifficultyButtons() {
    const buttons = this.elements.difficultyButtons();
    if (!buttons) return;

    const currentDifficulty = gameState.getDifficulty();

    buttons.forEach((btn) => {
      if (btn.dataset.level === currentDifficulty) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // Обработка результата игры
  handleGameResult(result) {
    gameState.endGame();

    // Подсветка выигрышной комбинации
    if (result.type !== "draw") {
      const winningCombo = findWinningCombination(
        gameState.board,
        result.player
      );
      if (winningCombo) {
        gameBoard.highlightWinningCells(winningCombo);
      }
    }

    // Обновление счета и сохранение
    switch (result.type) {
      case "win":
        gameState.addWin();
        this.handleWin();
        break;
      case "loss":
        gameState.addLoss();
        this.handleLoss();
        break;
      case "draw":
        gameState.addDraw();
        this.handleDraw();
        break;
    }

    this.updateScoreDisplay();
  }

  // Обработка победы
  handleWin() {
    const promoCode = generatePromoCode();

    setTimeout(() => {
      showWinModal(promoCode);
      sendTelegramNotification("win", promoCode);
    }, 1000);
  }

  // Обработка проигрыша
  handleLoss() {
    setTimeout(() => {
      showLoseModal();
      sendTelegramNotification("lose");
    }, 1000);
  }

  // Обработка ничьей
  handleDraw() {
    setTimeout(() => {
      showDrawModal();
    }, 1000);
  }

  // Подсказка
  giveHint() {
    if (!gameState.isGameActive || gameState.currentPlayerSymbol !== "🌸")
      return;

    const bestMove = findBestMove();
    if (bestMove !== -1) {
      gameBoard.highlightHint(bestMove);
    }
  }

  // Сброс игры
  resetGame() {
    gameState.reset();
    gameBoard.clear();
    this.updateGameStatus();
  }
}

// Экспортируем единственный экземпляр
export const uiManager = new UIManager();
