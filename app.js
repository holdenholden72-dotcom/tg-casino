let starsBalance = 100;
let tonBalance = 0.00;
let currentCurrency = 'STARS';
let currentMultiplier = 1.1;
let currentDegStop = 280;
let minesCount = 5;
let wheelSpinning = false;
let minesGameActive = false;
let minePositions = [];

function switchTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    element.classList.add('active');
}

function switchGame(gameId, element) {
    document.querySelectorAll('.sub-game-screen').forEach(scr => scr.classList.remove('active'));
    document.querySelectorAll('.g-nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('game-' + gameId).classList.add('active');
    element.classList.add('active');
    if (gameId === 'mines' && !minesGameActive) initMinesGrid();
}

function setGameCurrency(curr, element) {
    currentCurrency = curr;
    document.querySelectorAll('.curr-tab-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    document.getElementById('bet-currency-icon').innerText = (curr === 'STARS') ? '⭐' : '💎';
    updateWheelButton();
}

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
    const icon = (currentCurrency === 'STARS') ? '⭐' : '💎';
    document.getElementById('wheel-btn-val').innerText = `${bet} ${icon}`;
}

// 1. МОНЕТКА
function playCoin(side) {
    const bet = parseFloat(document.getElementById('current-bet-input').value) || 0;
    if (!checkBalance(bet)) return;
    deductBalance(bet);

    const flipper = document.getElementById('coin-flipper');
    flipper.classList.add('coin-animating');

    setTimeout(() => {
        flipper.classList.remove('coin-animating');
        const outcomes = ['eagle', 'tails', 'edge'];
        const result = outcomes[Math.floor(Math.random() * outcomes.length)];
        
        let icons = { eagle: '🦅', tails: '👑', edge: '🪙' };
        flipper.innerHTML = `<div class="coin-side">${icons[result]}</div>`;

        if (result === side) {
            let mult = (side === 'edge') ? 5 : 2;
            let win = bet * mult;
            addBalance(win);
            alert(`🎉 Победа! Выпал ${icons[result]}. Вы выиграли ${win}`);
        } else {
            alert(`😢 Проигрыш! Выпал ${icons[result]}`);
        }
    }, 600);
}

// 2. СЛОТЫ (Фрукты)
const fruits = ['🍒', '🍋', '🍇', '🔔', '💎'];
function playSlots() {
    const bet = parseFloat(document.getElementById('current-bet-input').value) || 0;
    if (!checkBalance(bet)) return;
    deductBalance(bet);

    const r1 = document.getElementById('reel-1');
    const r2 = document.getElementById('reel-2');
    const r3 = document.getElementById('reel-3');

    r1.classList.add('slot-animating');
    r2.classList.add('slot-animating');
    r3.classList.add('slot-animating');

    setTimeout(() => {
        r1.classList.remove('slot-animating');
        r2.classList.remove('slot-animating');
        r3.classList.remove('slot-animating');

        const f1 = fruits[Math.floor(Math.random() * fruits.length)];
        const f2 = fruits[Math.floor(Math.random() * fruits.length)];
        const f3 = fruits[Math.floor(Math.random() * fruits.length)];

        r1.innerText = f1;
        r2.innerText = f2;
        r3.innerText = f3;

        if (f1 === f2 && f2 === f3) {
            let win = bet * 15;
            addBalance(win);
            alert(`🎉 ДЖЕКПОТ! 3 в ряд (${f1})! Выигрыш: ${win}`);
        } else {
            alert('😢 Не повезло, попробуйте еще раз!');
        }
    }, 800);
}

// 3. МИНЫ (7x7 = 49 клеток)
function initMinesGrid() {
    const grid = document.getElementById('mines-grid');
    grid.innerHTML = '';
    for (let i = 0; i < 49; i++) {
        const cell = document.createElement('div');
        cell.className = 'mine-cell';
        cell.innerText = '❓';
        cell.onclick = () => clickMineCell(i, cell);
        grid.appendChild(cell);
    }
}

function changeMines(delta) {
    if (minesGameActive) return;
    minesCount += delta;
    if (minesCount < 1) minesCount = 1;
    if (minesCount > 40) minesCount = 40;
    document.getElementById('mines-count').innerText = minesCount;
}

function startMinesGame() {
    const bet = parseFloat(document.getElementById('current-bet-input').value) || 0;
    if (!checkBalance(bet)) return;
    deductBalance(bet);

    minesGameActive = true;
    document.getElementById('mines-action-btn').innerText = 'Игра идет... (кликайте)';
    
    // Генерируем мины
    minePositions = [];
    while(minePositions.length < minesCount) {
        let pos = Math.floor(Math.random() * 49);
        if(!minePositions.includes(pos)) minePositions.push(pos);
    }
    initMinesGrid();
}

function clickMineCell(index, cell) {
    if (!minesGameActive) {
        alert('Сначала нажмите "Начать игру"!');
        return;
    }
    if (cell.classList.contains('gem') || cell.classList.contains('boom')) return;

    if (minePositions.includes(index)) {
        cell.classList.add('boom');
        cell.innerText = '💣';
        alert('💥 Вы подорвались на мине! Игра окончена.');
        minesGameActive = false;
        document.getElementById('mines-action-btn').innerText = '🚀 Начать игру';
    } else {
        cell.classList.add('gem');
        cell.innerText = '💎';
    }
}

// 4. КОЛЕСО (Динамическое под шансы)
function setMultiplier(mult, deg, element) {
    currentMultiplier = mult;
    currentDegStop = deg;
    document.querySelectorAll('.mult-btn').forEach(b => b.classList.remove('active'));
    element.classList.add('active');

    // Меняем цвет градиента колеса в зависимости от шанса
    const wheel = document.getElementById('wheel-element');
    wheel.style.background = `conic-gradient(#2563eb 0deg ${deg}deg, #1f2937 ${deg}deg 360deg)`;
    document.getElementById('wheel-sub-text').innerText = mult + 'x';
}

function spinWheel() {
    if (wheelSpinning) return;
    const bet = parseFloat(document.getElementById('current-bet-input').value) || 0;
    if (!checkBalance(bet)) return;

    deductBalance(bet);
    wheelSpinning = true;

    const wheel = document.getElementById('wheel-element');
    const randomTurns = 1800 + currentDegStop;
    wheel.style.transform = `rotate(${randomTurns}deg)`;

    setTimeout(() => {
        wheelSpinning = false;
        const winChance = (1 / currentMultiplier) * 0.48;
        const isWin = Math.random() < winChance;
        const centerVal = document.getElementById('wheel-center-val');

        if (isWin) {
            let win = +(bet * currentMultiplier).toFixed(2);
            addBalance(win);
            centerVal.innerText = `+${win}`;
            alert(`🎉 Победа! Вы выиграли ${win}`);
        } else {
            centerVal.innerText = `0`;
            alert('😢 Выпало NO LOOT!');
        }
    }, 1500);
}

// Баланс и общие функции
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

function buyStars(amount) { starsBalance += amount; updateBalances(); alert(`+${amount} ⭐ зачислено!`); }
function depositTon() { tonBalance += 1.0; updateBalances(); alert('+1.0 💎 TON зачислено!'); }
function withdrawFunds() {
    const amount = parseFloat(document.getElementById('withdraw-amount').value) || 0;
    if (amount <= 0) { alert('Введите корректную сумму'); return; }
    alert('Запрос на вывод отправлен!');
}
function activatePromo() {
    const code = document.getElementById('promo-input').value.trim();
    if (!code) { alert('Введите промокод'); return; }
    starsBalance += 50;
    updateBalances();
    alert('Промокод активирован! Получено 50 ⭐');
}

window.onload = function() {
    updateBalances();
    initMinesGrid();
};