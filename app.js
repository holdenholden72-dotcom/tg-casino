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
        // Скрываем все вкладки и показываем экран колеса
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById('game-wheel-screen').classList.add('active');
    } else {
        alert('Эта игра скоро будет доступна!');
    }
}

// Закрытие игры и возврат в меню
function closeGame() {
    document.getElementById('game-wheel-screen').classList.remove('active');
    document.getElementById('tab-games').classList.add('active');
}

// Логика вращения колеса
function spinWheel() {
    const bet = parseFloat(document.getElementById('wheel-bet').value) || 0;
    
    // Проверка минимальной ставки (1 звезда или 0.1 тон)
    if (bet < 1) {
        alert('Минимальная ставка: 1 ⭐ (или от 0.1 💎)');
        return;
    }

    if (bet > starsBalance) {
        alert('Недостаточно средств на балансе!');
        return;
    }

    // Списываем ставку для примера со звёздами
    starsBalance -= bet;
    updateBalances();

    alert('Колесо крутится...');

    setTimeout(() => {
        // Рандомный выигрыш (например, х2 или проигрыш)
        const win = Math.random() > 0.5;
        if (win) {
            const reward = bet * 2;
            starsBalance += reward;
            alert(`Поздравляем! Вы выиграли ${reward} ⭐!`);
        } else {
            alert('К сожалению, вы проиграли :(');
        }
        updateBalances();
    }, 1500);
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