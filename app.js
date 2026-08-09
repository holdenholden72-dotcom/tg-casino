let starsBalance = 0;
let tonBalance = 0.0;
let gameCurrency = 'STARS';
let currentMultiplier = 1.1;
let wheelSpinning = false;

// Функция переключения вкладок внизу экрана
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

// Управление валютой в игре Wheel
function setCurrency(curr, element) {
    gameCurrency = curr;
    document.querySelectorAll('.curr-btn').forEach(b => b.classList.remove('active'));
    element.classList.add('active');
    updateSpinButton();
}

// Управление множителем
function setMultiplier(mult, element) {
    currentMultiplier = mult;
    document.querySelectorAll('.mult-item').forEach(m => m.classList.remove('active'));
    element.classList.add('active');
}

// Изменение суммы ставки кнопками -/+
function changeBet(delta) {
    const input = document.getElementById('wheel-bet');
    let val = parseInt(input.value) || 1;
    val += delta;
    const minVal = (gameCurrency === 'STARS') ? 1 : 0.1;
    if (val < minVal) val = minVal;
    input.value = val;
    updateSpinButton();
}

// Обновление текста на кнопке ставки
function updateSpinButton() {
    const bet = document.getElementById('wheel-bet').value;
    const currSymbol = (gameCurrency === 'STARS') ? '⭐' : '💎';
    document.getElementById('btn-bet-val').innerText = `${bet} ${currSymbol}`;
}

// Открытие игры Wheel
function openGame(gameName) {
    if (gameName === 'wheel') {
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

// Вращение колеса с анимацией
function spinWheel() {
    if (wheelSpinning) return;
    
    const bet = parseFloat(document.getElementById('wheel-bet').value) || 0;
    const minLimit = (gameCurrency === 'STARS') ? 1 : 0.1;

    if (bet < minLimit) {
        alert(`Минимальная ставка: ${minLimit} ${gameCurrency === 'STARS' ? '⭐' : '💎'}`);
        return;
    }

    if (gameCurrency === 'STARS' && bet > starsBalance) {
        alert('Недостаточно Stars на балансе!');
        return;
    }
    if (gameCurrency === 'TON' && bet > tonBalance) {
        alert('Недостаточно TON на балансе!');
        return;
    }

    // Списание ставки
    if (gameCurrency === 'STARS') starsBalance -= bet;
    else tonBalance -= bet;
    updateBalances();

    wheelSpinning = true;
    const wheel = document.getElementById('wheel-element');
    
    // Рандомный поворот колеса
    const randomDeg = 1800 + Math.floor(Math.random() * 360);
    wheel.style.transform = `rotate(${randomDeg}deg)`;

    setTimeout(() => {
        wheelSpinning = false;
        const winChance = 1 / currentMultiplier * 0.45; 
        const isWin = Math.random() < winChance;
        const centerText = document.getElementById('wheel-center-val');
        
        if (isWin) {
            const reward = +(bet * currentMultiplier).toFixed(2);
            if (gameCurrency === 'STARS') starsBalance += reward;
            else tonBalance += reward;

            centerText.innerHTML = `+${reward}`;
            alert(`🎉 Поздравляем! Вы выиграли ${reward} ${gameCurrency === 'STARS' ? '⭐' : '💎'}!`);
        } else {
            centerText.innerHTML = `0`;
            alert('😢 К сожалению, выпало NO LOOT. Попробуйте еще раз!');
        }
        updateBalances();
    }, 2000);
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

// Обновление балансов на экране
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