// Сервис для работы с Telegram
export class TelegramService {
  constructor() {
    this.isEnabled = false;
    this.botToken = null;
    this.chatId = null;
  }

  // Настройка бота
  setup(botToken, chatId) {
    this.botToken = botToken;
    this.chatId = chatId;
    this.isEnabled = !!botToken && !!chatId;
  }

  // Отправка уведомления
  async sendNotification(result, promoCode = null) {
    if (!this.isEnabled) {
      this.logToConsole(result, promoCode);
      return false;
    }

    try {
      const message = this.formatMessage(result, promoCode);
      const response = await fetch(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: this.chatId,
            text: message,
            parse_mode: "HTML",
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error("Ошибка отправки в Telegram:", error);
      this.logToConsole(result, promoCode);
      return false;
    }
  }

  // Форматирование сообщения
  formatMessage(result, promoCode) {
    const date = new Date().toLocaleString("ru-RU");

    if (result === "win") {
      return (
        `🎉 <b>Победа!</b> 🎉\n\n` +
        `Промокод: <code>${promoCode}</code>\n` +
        `Игра: Цветочные крестики-нолики\n` +
        `Дата: ${date}`
      );
    } else {
      return (
        `💖 <b>Не расстраивайтесь!</b> 💖\n\n` +
        `Проигрыш - это часть пути к победе!\n` +
        `Попробуйте ещё раз!\n\n` +
        `Игра: Цветочные крестики-нолики\n` +
        `Дата: ${date}`
      );
    }
  }

  // Логирование в консоль (для разработки)
  logToConsole(result, promoCode) {
    const message = this.formatMessage(result, promoCode)
      .replace(/<[^>]*>/g, "") // Удаляем HTML теги
      .replace(/&nbsp;/g, " ");

    console.log(`Telegram сообщение (имитация):\n${message}`);
  }
}

// Экспортируем единственный экземпляр
export const telegramService = new TelegramService();

// Функция для удобства
export const sendTelegramNotification = (result, promoCode = null) => {
  return telegramService.sendNotification(result, promoCode);
};
