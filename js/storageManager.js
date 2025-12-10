// Управление LocalStorage
export class StorageManager {
  constructor(storageKey = "ticTacToeScores") {
    this.storageKey = storageKey;
  }

  // Сохранение счета
  saveScores(scores) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(scores));
      return true;
    } catch (error) {
      console.error("Ошибка сохранения в localStorage:", error);
      return false;
    }
  }

  // Загрузка счета
  loadScores() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Ошибка загрузки из localStorage:", error);
      return null;
    }
  }

  // Очистка сохраненных данных
  clear() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error("Ошибка очистки localStorage:", error);
      return false;
    }
  }
}

// Экспортируем единственный экземпляр
export const storageManager = new StorageManager();
