let starsBalance = 0;
let tonBalance = 0.00;
let currentCurrency = 'STARS';
let currentMultiplier = 1.1;
let minesCount = 3;
let wheelSpinning = false;

// Переключение основных вкладок (1: Игры, 2: Пополнение, 3: Вывод, 4: Промокод)
function switchTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById('tab-' + tabId).classList.add('active');
    element.classList.add('active');
}

// Переключение мини-игр внутри вкладки «Игры»
function switchGame(gameId, element) {
    document.querySelectorAll('.sub-game-screen').forEach(scr => scr.classList.remove('active'));
    document.querySelectorAll('.g-nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById('game-' + gameId).classList.add('active');
    element.classList.add('active');
}

// Выбор валюты для ставок
function setGameCurrency(curr, element) {
    currentCurrency = curr;
    document.querySelectorAll('.curr-tab-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    
    const icon = curr === 'STARS' ? '⭐' : '💎';
    document.getElementById('bet-currency-icon').innerText = icon;
    updateWheelButton();
}

// Управление ставкой (- / +)
function changeBet(delta) {
    const input = document.getElementById('current-bet-input');
    let val = parseInt(input.value) || 1;
    val += delta;
    if (val < 1) val = 1;
    input.value = val;
    updateWheelButton();
}

function updateWheelButton() {
    const bet = document.getElementById('current-bet-input').value;
    const icon = currentCurrency === 'STARS' ? '⭐' : '💎';
    document.getElementById('wheel-btn-val').innerText = `${bet} ${icon}`;
}

// Логика Монетки (без клоуна)
function playCoin(side) {
    const bet = parseFloat(document.getElementById('current-bet-input').value) || 0;
    if (!checkBalance(bet)) return;
    
    deductBalance(bet);
    
    const outcomes = ['eagle', 'tails', 'edge'];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];
    
    if (result === side) {
        let mult = (side === 'edge') ? 5 : 2;
        let win = bet * mult;
        addBalance(win);
        alert(`🎉 Победа! Выпало ${result}. Вы выиграли ${win}`);
    } else {
        alert(`😢 Проигрыш. Выпало ${result}`);
    }
}

// Логика Слотов
function playSlots() {
    const bet = parseFloat(document.getElementById('current-bet-input').value) || 0;
    if (!checkBalance(bet)) return;
    
    deductBalance(bet);
    
    const reels = [
        Math.floor(Math.random() * 5) + 1,
        Math.floor(Math.random() * 5) + 1,
        Math.floor(Math.random() * 5) + 1
    ];
    
    // Выводим символы на экран слотов
    const reelElements = document.querySelectorAll('.slot-reel');
    reelElements.forEach((el, index) => {
        el.innerText = reels[index];
    });
    
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
        let win = bet * 10;
        addBalance(win);
        alert(`🎉 ДЖЕКПОТ! Вы выиграли ${win} ${currentCurrency}`);
    } else {
        alert('😢 Не повезло, крутите еще!');
    }
}

// Генерация сетки мин
function initMinesGrid() {
    const grid = document.getElementById('mines-grid');
    grid.innerHTML = '';
    for (let i = 0; i < 24; i++) {
        const cell = document.createElement('div');
        cell.className = 'mine-cell';
        grid.appendChild(cell);
    }
}
function changeMines(delta) {
    minesCount += delta;
    if (minesCount < 1) minesCount = 1;
    if (minesCount > 20) minesCount = 20;
    document.getElementById('mines-count').innerText = minesCount;
}
function startMines() {
    const bet = parseFloat(document.getElementById('current-bet-input').value) || 0;
    if (!checkBalance(bet)) return;
    deductBalance(bet);
    alert(`Игра началась! Мины расставлены (${minesCount} шт.).`);
}

// Логика Колеса
function setMultiplier(mult, element) {
    currentMultiplier = mult;
    document.querySelectorAll('.mult-btn').forEach(b => b.classList.remove('active'));
    element.classList.add('active');
}

function spinWheel() {
    if (wheelSpinning) return;
    const bet = parseFloat(document.getElementById('current-bet-input').value) || 0;
    if (!checkBalance(bet)) return;

    deductBalance(bet);
    wheelSpinning = true;

    const wheel = document.getElementById('wheel-element');
    const randomDeg = 1800 + Math.floor(Math.random() * 360);
    wheel.style.transform = `rotate(${randomDeg}deg)`;

    setTimeout(() => {
        wheelSpinning = false;
        const winChance = (1 / currentMultiplier) * 0.45;
        const isWin = Math.random() < winChance;
        const centerVal = document.getElementById('wheel-center-val');

        if (isWin) {
            const win = +(bet * currentMultiplier).toFixed(2);
            addBalance(win);
            centerVal.innerText = `+${win}`;
            alert(`🎉 Победа на колесе! Выигрыш: ${win}`);
        } else {
            centerVal.innerText = `0`;
            alert('😢 Выпало NO LOOT!');
        }
    }, 2000);
}

// Баланс функции
function checkBalance(amount) {
    if (currentCurrency === 'STARS') {
        if (amount > starsBalance) { alert('Недостаточно Stars!'); return false; }
    } else {
        if (amount > tonBalance) { alert('Недостаточно TON!'); return false; }
    }
    return true;
}

function deductBalance(amount) {
    if (currentCurrency === 'STARS') starsBalance -= amount;
    else tonBalance -= amount;
    updateBalances();
}

function addBalance(amount) {
    if (currentCurrency === 'STARS') starsBalance += amount;
    else tonBalance += amount;
    updateBalances();
}

function updateBalances() {
    document.getElementById('stars-balance').innerText = starsBalance;
    document.getElementById('ton-balance').innerText = tonBalance.toFixed(2);
    document.getElementById('withdraw-stars').innerText = starsBalance;
    document.getElementById('withdraw-ton').innerText = tonBalance.toFixed(2);
}

// Заглушки пополнения, вывода и промокода
function buyStars(amount) {
    starsBalance += amount;
    updateBalances();
    alert(`Успешно добавлено ${amount} ⭐!`);
}
function depositTon() {
    tonBalance += 1.0;
    updateBalances();
    alert('Тестовый депозит 1 TON зачислен!');
}
function withdrawFunds() {
    const amount = parseFloat(document.getElementById('withdraw-amount').value) || 0;
    if (amount <= 0) { alert('Введите сумму для вывода'); return; }
    alert('Запрос на вывод отправлен в обработку!');
}
function activatePromo() {
    const code = document.getElementById('promo-input').value.trim();
    if (!code) { alert('Введите промокод'); return; }
    starsBalance += 50;
    updateBalances();
    alert('Промокод активирован! Получено 50 ⭐');
}

// Инициализация
window.onload = function() {
    updateBalances();
    initMinesGrid();
};