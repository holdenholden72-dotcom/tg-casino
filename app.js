let starsBalance = 0;
let tonBalance = 0.0;
let currentCurrency = 'STARS'; // По умолчанию

// Функция переключения вкладок
function switchTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById('tab-' + tabId).classList.add('active');
    element.classList.add('active');
}

// Проверка минимальных ставок
function checkMinBet(amount, currency) {
    if (currency === 'STARS' && amount < 1) {
        alert('Минимальная ставка для Stars: 1 ⭐');
        return false;
    }
    if (currency === 'TON' && amount < 0.1) {
        alert('Минимальная ставка для TON: 0.1 💎');
        return false;
    }
    return true;
}

// Открытие игры
function openGame(gameName) {
    if (gameName === 'wheel') {
        alert('Запуск игры Wheel!');
    } else {
        alert('Эта игра скоро будет доступна!');
    }
}

// Заглушки пополнения и вывода
function buyStars(amount) {
    alert('Пополнение Stars начнется через Telegram счета.');
}

function depositTon() {
    alert('Подключение TON Connect кошелька...');
}

function withdrawFunds() {
    const amount = parseFloat(document.getElementById('withdraw-amount').value) || 0;
    if (amount <= 0) {
        alert('Введите корректную сумму для вывода');
        return;
    }
    alert('Запрос на вывод отправлен!');
}

// Обновление цифр баланса на экране
function updateBalances() {
    document.getElementById('stars-balance').innerText = starsBalance;
    document.getElementById('ton-balance').innerText = tonBalance.toFixed(2);
    document.getElementById('withdraw-stars').innerText = starsBalance;
    document.getElementById('withdraw-ton').innerText = tonBalance.toFixed(2);
}

// Инициализация при запуске
window.onload = function() {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }
    updateBalances();
};