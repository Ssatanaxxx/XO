// Вспомогательные функции
export function generatePromoCode(length = 5) {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let promoCode = "";

  for (let i = 0; i < length; i++) {
    promoCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return promoCode;
}

// Дебаунс функция
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Форматирование времени
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}
