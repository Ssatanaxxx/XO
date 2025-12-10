import { gameState } from "./gameState.js";
import { handleCellClick } from "./gameLogic.js";

// Управление игровым полем
export class GameBoardManager {
  constructor() {
    this.cells = [];
  }

  // Создание игрового поля
  create() {
    const gameBoardElement = document.getElementById("game-board");
    gameBoardElement.innerHTML = "";
    this.cells = [];

    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      cell.addEventListener("click", () => handleCellClick(i));

      gameBoardElement.appendChild(cell);
      this.cells.push(cell);
    }
  }

  // Обновление клетки
  updateCell(index, symbol) {
    const cell = this.cells[index];
    if (!cell) return;

    cell.textContent = symbol;
    cell.classList.add(symbol === "🌸" ? "x" : "o");

    // Анимация появления
    cell.style.transform = "scale(0)";
    setTimeout(() => {
      cell.style.transform = "scale(1)";
    }, 100);
  }

  // Подсветка выигрышной комбинации
  highlightWinningCells(winningIndices) {
    if (!winningIndices) return;

    winningIndices.forEach((index) => {
      const cell = this.cells[index];
      if (cell) {
        cell.classList.add("winning");
      }
    });
  }

  // Подсветка подсказки
  highlightHint(index) {
    const cell = this.cells[index];
    if (!cell) return;

    const originalBorder = cell.style.borderColor;
    const originalBoxShadow = cell.style.boxShadow;

    cell.style.borderColor = "gold";
    cell.style.boxShadow = "0 0 15px gold";

    setTimeout(() => {
      cell.style.borderColor = originalBorder;
      cell.style.boxShadow = originalBoxShadow;
    }, 1500);
  }

  // Очистка поля
  clear() {
    this.cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("x", "o", "winning");
      cell.style.transform = "";
    });
  }

  // Получение всех клеток
  getCells() {
    return this.cells;
  }
}

// Экспортируем единственный экземпляр
export const gameBoard = new GameBoardManager();
