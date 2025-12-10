const PLAYER_X = "🌸";
const PLAYER_O = "🌺";
const EMPTY_CELL = "";

let currentPlayer = PLAYER_X;
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let difficulty = "medium";
let scores = { wins: 0, draws: 0, losses: 0 };

const gameStatus = document.getElementById("game-status");
const winModal = document.getElementById("win-modal");
const loseModal = document.getElementById("lose-modal");
const drawModal = document.getElementById("draw-modal");
const promoCodeElement = document.getElementById("promo-code");
const winsCountElement = document.getElementById("wins-count");
const drawsCountElement = document.getElementById("draws-count");
const lossesCountElement = document.getElementById("losses-count");
const restartBtn = document.getElementById("restart-btn");
const hintBtn = document.getElementById("hint-btn");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");

const closeWinBtn = document.getElementById("close-win-btn");
const closeLoseBtn = document.getElementById("close-lose-btn");
const tryAgainBtn = document.getElementById("try-again-btn");
const closeDrawBtn = document.getElementById("close-draw-btn");
const shareBtn = document.getElementById("share-btn");

// УСЛОВИЯ ПОБЕДЫ
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// ИНИЦИАЛИЗАЦИЯ ИГРЫ
function initGame() {
  createBoard();
  updateGameStatus();
  loadScores();
  setupEventListeners();
  updateDifficultyButtons();
}

// СОЗДАНИЕ ИГРОВОГО ПОЛЯ
function createBoard() {
  const gameBoardElement = document.getElementById("game-board");
  gameBoardElement.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", () => handleCellClick(i));
    gameBoardElement.appendChild(cell);
  }
}

// НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ
function setupEventListeners() {
  restartBtn.addEventListener("click", resetGame);
  hintBtn.addEventListener("click", giveHint);

  difficultyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      difficulty = btn.dataset.level;
      updateDifficultyButtons();
      resetGame();
    });
  });

  closeWinBtn.addEventListener("click", () => {
    winModal.style.display = "none";
    resetGame();
  });

  closeLoseBtn.addEventListener("click", () => {
    loseModal.style.display = "none";
    resetGame();
  });

  tryAgainBtn.addEventListener("click", () => {
    loseModal.style.display = "none";
    resetGame();
  });

  closeDrawBtn.addEventListener("click", () => {
    drawModal.style.display = "none";
    resetGame();
  });

  shareBtn.addEventListener("click", sharePromoCode);
}

// ОБНОВЛЕНИЕ КНОПОК СЛОЖНОСТИ
function updateDifficultyButtons() {
  difficultyButtons.forEach((btn) => {
    if (btn.dataset.level === difficulty) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// ОБРАБОТКА КЛИКА ПО КЛЕТКЕ
function handleCellClick(index) {
  if (!gameActive || gameBoard[index] !== EMPTY_CELL) return;

  makeMove(index, PLAYER_X);

  if (checkWin(gameBoard, PLAYER_X)) {
    handleWin();
    return;
  }

  if (checkDraw()) {
    handleDraw();
    return;
  }

  // Ход компьютера
  setTimeout(() => {
    const computerMove = getComputerMove();
    if (computerMove !== -1) {
      makeMove(computerMove, PLAYER_O);

      if (checkWin(gameBoard, PLAYER_O)) {
        handleLoss();
        return;
      }

      if (checkDraw()) {
        handleDraw();
      }
    }
  }, 800);
}

// СОВЕРШЕНИЕ ХОДА
function makeMove(index, player) {
  gameBoard[index] = player;
  const cell = document.querySelector(`.cell[data-index="${index}"]`);
  cell.textContent = player;
  cell.classList.add(player === PLAYER_X ? "x" : "o");

  // Анимация появления
  cell.style.transform = "scale(0)";
  setTimeout(() => {
    cell.style.transform = "scale(1)";
  }, 100);

  updateGameStatus();
}

// ПРОВЕРКА ПОБЕДЫ
function checkWin(board, player) {
  return winningConditions.some((condition) => {
    return condition.every((index) => board[index] === player);
  });
}

// ПРОВЕРКА НИЧЬЕЙ
function checkDraw() {
  return gameBoard.every((cell) => cell !== EMPTY_CELL);
}

// ХОД КОМПЬЮТЕРА
function getComputerMove() {
  const emptyCells = gameBoard
    .map((cell, index) => (cell === EMPTY_CELL ? index : -1))
    .filter((index) => index !== -1);

  if (emptyCells.length === 0) return -1;

  switch (difficulty) {
    case "easy":
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];

    case "medium":
      if (Math.random() < 0.5) {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
      }
    case "hard":
      // 1. Проверить, может ли компьютер выиграть
      for (let i = 0; i < emptyCells.length; i++) {
        const boardCopy = [...gameBoard];
        boardCopy[emptyCells[i]] = PLAYER_O;
        if (checkWin(boardCopy, PLAYER_O)) {
          return emptyCells[i];
        }
      }

      // 2. Проверить, может ли игрок выиграть на следующем ходу
      for (let i = 0; i < emptyCells.length; i++) {
        const boardCopy = [...gameBoard];
        boardCopy[emptyCells[i]] = PLAYER_X;
        if (checkWin(boardCopy, PLAYER_X)) {
          return emptyCells[i];
        }
      }

      // 3. Занять центр, если свободен
      if (gameBoard[4] === EMPTY_CELL) {
        return 4;
      }

      // 4. Занять угол, если свободен
      const corners = [0, 2, 6, 8];
      const availableCorners = corners.filter(
        (corner) => gameBoard[corner] === EMPTY_CELL
      );
      if (availableCorners.length > 0) {
        return availableCorners[
          Math.floor(Math.random() * availableCorners.length)
        ];
      }

      // 5. Случайный ход
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
}

// ОБРАБОТКА ПОБЕДЫ
function handleWin() {
  gameActive = false;
  scores.wins++;
  saveScores();
  updateScoreDisplay();

  // Подсветка выигрышной комбинации
  highlightWinningCells(PLAYER_X);

  // Генерация промокода
  const promoCode = generatePromoCode();

  // Показать модальное окно победы
  setTimeout(() => {
    promoCodeElement.textContent = promoCode;
    winModal.style.display = "flex";

    // Отправить уведомление в Telegram
    sendTelegramNotification("win", promoCode);
  }, 1000);
}

// ОБРАБОТКА ПРОИГРЫША
function handleLoss() {
  gameActive = false;
  scores.losses++;
  saveScores();
  updateScoreDisplay();
  highlightWinningCells(PLAYER_O);

  setTimeout(() => {
    loseModal.style.display = "flex";

    sendTelegramNotification("lose");
  }, 1000);
}

// ОБРАБОТКА НИЧЬЕЙ
function handleDraw() {
  gameActive = false;
  scores.draws++;
  saveScores();
  updateScoreDisplay();

  setTimeout(() => {
    drawModal.style.display = "flex";
  }, 1000);
}

// ПОДСВЕТКА ВЫИГРЫШНОЙ КОМБИНАЦИИ
function highlightWinningCells(player) {
  const winningCombo = winningConditions.find((condition) =>
    condition.every((index) => gameBoard[index] === player)
  );

  if (winningCombo) {
    winningCombo.forEach((index) => {
      const cell = document.querySelector(`.cell[data-index="${index}"]`);
      cell.classList.add("winning");
    });
  }
}

// ГЕНЕРАЦИЯ ПРОМОКОДА
function generatePromoCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let promoCode = "";
  for (let i = 0; i < 5; i++) {
    promoCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return promoCode;
}

// ОТПРАВКА В TELEGRAM (ИМИТАЦИЯ)
function sendTelegramNotification(result, promoCode = null) {
  const message =
    result === "win"
      ? `🎉 Победа! 🎉\nПромокод выдан: ${promoCode}\n\nИгра: Цветочные крестики-нолики\nДата: ${new Date().toLocaleString(
          "ru-RU"
        )}`
      : `💖 Не расстраивайтесь! 💖\n\nПроигрыш - это часть пути к победе!\nПопробуйте ещё раз!\n\nИгра: Цветочные крестики-нолики\nДата: ${new Date().toLocaleString(
          "ru-RU"
        )}`;

  console.log(`Сообщение в Telegram: "${message}"`);
  // Для реальной отправки можно добавить обработку fetch POST на тело reuslt promoCode
}

// ОБНОВЛЕНИЕ СТАТУСА ИГРЫ
function updateGameStatus() {
  if (!gameActive) return;

  gameStatus.textContent =
    currentPlayer === PLAYER_X
      ? "Ваш ход! Поставьте цветочек 🌸"
      : "Компьютер думает...";
}

// ОБНОВЛЕНИЕ СЧЕТА
function updateScoreDisplay() {
  winsCountElement.textContent = scores.wins;
  drawsCountElement.textContent = scores.draws;
  lossesCountElement.textContent = scores.losses;
}

// ЗАГРУЗКА СЧЕТА ИЗ LOCALSTORAGE
function loadScores() {
  const savedScores = localStorage.getItem("ticTacToeScores");
  if (savedScores) {
    scores = JSON.parse(savedScores);
  }
  updateScoreDisplay();
}

// СОХРАНЕНИЕ СЧЕТА В LOCALSTORAGE
function saveScores() {
  localStorage.setItem("ticTacToeScores", JSON.stringify(scores));
}

// СБРОС ИГРЫ
function resetGame() {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = PLAYER_X;

  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("x", "o", "winning");
    cell.style.transform = "";
  });

  updateGameStatus();
}

// ПОДСКАЗКА ДЛЯ ИГРОКА
function giveHint() {
  if (!gameActive || currentPlayer !== PLAYER_X) return;

  const emptyCells = gameBoard
    .map((cell, index) => (cell === EMPTY_CELL ? index : -1))
    .filter((index) => index !== -1);

  if (emptyCells.length === 0) return;

  const bestMove = findBestMove();
  if (bestMove !== -1) {
    highlightCellHint(bestMove);
  }
}

// ПОИСК ЛУЧШЕГО ХОДА (подсказки)
function findBestMove() {
  const emptyCells = gameBoard
    .map((cell, index) => (cell === EMPTY_CELL ? index : -1))
    .filter((index) => index !== -1);

  // 1. Проверить, может ли игрок выиграть
  for (let i = 0; i < emptyCells.length; i++) {
    const boardCopy = [...gameBoard];
    boardCopy[emptyCells[i]] = PLAYER_X;
    if (checkWin(boardCopy, PLAYER_X)) {
      return emptyCells[i];
    }
  }

  // 2. Проверить, может ли компьютер выиграть (блокировка)
  for (let i = 0; i < emptyCells.length; i++) {
    const boardCopy = [...gameBoard];
    boardCopy[emptyCells[i]] = PLAYER_O;
    if (checkWin(boardCopy, PLAYER_O)) {
      return emptyCells[i];
    }
  }

  // 3. Занять центр, если свободен
  if (gameBoard[4] === EMPTY_CELL) {
    return 4;
  }

  // 4. Случайный ход
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// ПОДСВЕТКА ПОДСКАЗКИ
function highlightCellHint(index) {
  const cell = document.querySelector(`.cell[data-index="${index}"]`);
  const originalBorder = cell.style.borderColor;
  const originalBoxShadow = cell.style.boxShadow;

  cell.style.borderColor = "gold";
  cell.style.boxShadow = "0 0 15px gold";

  setTimeout(() => {
    cell.style.borderColor = originalBorder;
    cell.style.boxShadow = originalBoxShadow;
  }, 1500);
}

// ПОДЕЛИТЬСЯ ПРОМОКОДОМ
function sharePromoCode() {
  const promoCode = promoCodeElement.textContent;

  if (navigator.share) {
    navigator
      .share({
        title: "Мой промокод в игре Цветочные крестики-нолики!",
        text: `Я выиграла промокод: ${promoCode}`,
        url: window.location.href,
      })
      .then(() => console.log("Успешно поделились"))
      .catch((error) => console.log("Ошибка при обмене:", error));
  } else {
    navigator.clipboard
      .writeText(promoCode)
      .then(() => {
        alert("Промокод скопирован в буфер обмена!");
      })
      .catch((err) => {
        console.error("Ошибка копирования: ", err);
      });
  }
}

// ЗАПУСК ИГРЫ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
document.addEventListener("DOMContentLoaded", initGame);
