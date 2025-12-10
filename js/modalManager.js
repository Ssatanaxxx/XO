import { DOM_ELEMENTS } from "./config.js";

// Управление модальными окнами
export class ModalManager {
  constructor() {
    this.elements = DOM_ELEMENTS;
  }

  // Показать модальное окно победы
  showWinModal(promoCode) {
    const modal = this.elements.winModal();
    const promoElement = this.elements.promoCodeElement();

    if (modal && promoElement) {
      promoElement.textContent = promoCode;
      modal.style.display = "flex";
    }
  }

  // Показать модальное окно проигрыша
  showLoseModal() {
    const modal = this.elements.loseModal();
    if (modal) {
      modal.style.display = "flex";
    }
  }

  // Показать модальное окно ничьей
  showDrawModal() {
    const modal = this.elements.drawModal();
    if (modal) {
      modal.style.display = "flex";
    }
  }

  // Закрыть все модальные окна
  closeAllModals() {
    const modals = [
      this.elements.winModal(),
      this.elements.loseModal(),
      this.elements.drawModal(),
    ];

    modals.forEach((modal) => {
      if (modal) modal.style.display = "none";
    });
  }

  // Настройка обработчиков для модальных окон
  setupModalHandlers(resetCallback) {
    const closeWinBtn = this.elements.closeWinBtn();
    const closeLoseBtn = this.elements.closeLoseBtn();
    const tryAgainBtn = this.elements.tryAgainBtn();
    const closeDrawBtn = this.elements.closeDrawBtn();
    const shareBtn = this.elements.shareBtn();

    if (closeWinBtn) {
      closeWinBtn.addEventListener("click", () => {
        this.closeAllModals();
        resetCallback();
      });
    }

    if (closeLoseBtn) {
      closeLoseBtn.addEventListener("click", () => {
        this.closeAllModals();
        resetCallback();
      });
    }

    if (tryAgainBtn) {
      tryAgainBtn.addEventListener("click", () => {
        this.closeAllModals();
        resetCallback();
      });
    }

    if (closeDrawBtn) {
      closeDrawBtn.addEventListener("click", () => {
        this.closeAllModals();
        resetCallback();
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener("click", this.sharePromoCode.bind(this));
    }
  }

  // Поделиться промокодом
  sharePromoCode() {
    const promoElement = this.elements.promoCodeElement();
    if (!promoElement) return;

    const promoCode = promoElement.textContent;

    if (navigator.share) {
      navigator.share({
        title: "Мой промокод в игре Цветочные крестики-нолики!",
        text: `Я выиграла промокод: ${promoCode}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard
        .writeText(promoCode)
        .then(() => alert("Промокод скопирован в буфер обмена!"))
        .catch((err) => console.error("Ошибка копирования: ", err));
    }
  }
}

// Экспортируем единственный экземпляр
export const modalManager = new ModalManager();

// Функции для удобства
export const showWinModal = (promoCode) => modalManager.showWinModal(promoCode);
export const showLoseModal = () => modalManager.showLoseModal();
export const showDrawModal = () => modalManager.showDrawModal();
