localStorage.clear();

// Очищаем локальное хранилище
localStorage.setItem('balance', 0);
localStorage.setItem('starsBalance', 0);
localStorage.setItem('tonBalance', 0);

// Инициализация Telegram WebApp
const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) {
    tg.expand();
    tg.ready();
}

// Переменные баланса (объявляем один единственный раз!)
let balance = 0;
let starsBalance = 0;
let tonBalance = 0;
let currentCurrency = 'STARS';

// Элементы UI
const starsEl = document.getElementById('stars-balance');
const tonEl = document.getElementById('ton-balance');
const betInput = document.getElementById('bet-amount');
function updateBalances() {
    starsEl.textContent = starsBalance;
    tonEl.textContent = tonBalance.toFixed(1);
    updateRingBetDisplay();
}

function setCurrency(type) {
    currentCurrency = type;
    document.getElementById('curr-stars').classList.toggle('active', type === 'STARS');
    document.getElementById('curr-ton').classList.toggle('active', type === 'TON');
    document.getElementById('curr-icon-label').textContent = type === 'STARS' ? '⭐' : '💎';
    updateRingBetDisplay();
}

function changeBet(val) {
    let current = parseInt(betInput.value) || 0;
    if (current + val >= 1) betInput.value = current + val;
    updateRingBetDisplay();
}

function getBet() {
    const bet = parseFloat(betInput.value) || 0;
    
    // Проверяем в зависимости от текущей валюты
    if (currentCurrency === 'STARS') {
        if (bet < 5) {
            alert('Минимальная ставка для Stars: 1 ⭐');
            return 0;
        }
    } else if (currentCurrency === 'TON') {
        if (bet < 0.5) {
            alert('Минимальная ставка для TON: 0.1 💎');
            return 0;
        }
    }
    
    if (bet <= 0) {
        alert('Введите корректную ставку');
        return 0;
    }
    
    return bet;
}

function payBet(amount) {
    if (currentCurrency === 'STARS') starsBalance -= amount;
    else tonBalance -= amount;
    updateBalances();
}

function addWin(amount) {
    if (currentCurrency === 'STARS') starsBalance += amount;
    else tonBalance += amount;
    updateBalances();
}

// Переключение навигации
function switchGame(game) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.game-screen').forEach(s => s.classList.add('hidden'));

    if (game === 'coin') {
        document.querySelectorAll('.nav-btn')[0].classList.add('active');
        document.getElementById('game-coin').classList.remove('hidden');
    } else if (game === 'slots') {
        document.querySelectorAll('.nav-btn')[1].classList.add('active');
        document.getElementById('game-slots').classList.remove('hidden');
    } else if (game === 'mines') {
        document.querySelectorAll('.nav-btn')[2].classList.add('active');
        document.getElementById('game-mines').classList.remove('hidden');
        if (!minesActive) initMinesBoard();
    } else if (game === 'ring') {
        document.querySelectorAll('.nav-btn')[3].classList.add('active');
        document.getElementById('game-ring').classList.remove('hidden');
        updateRingBetDisplay();
    }
}

/* --- 1. МОНЕТКА --- */
let isCoinPlaying = false;
function playCoin(choice) {
    if (isCoinPlaying) return;
    const bet = getBet();
    if (!bet) return;

    payBet(bet);
    isCoinPlaying = true;

    const coin = document.getElementById('coin-display');
    const status = document.getElementById('coin-status');
    
    coin.classList.add('spinning');
    status.textContent = 'Подбрасываем...';

    setTimeout(() => {
        coin.classList.remove('spinning');
        isCoinPlaying = false;

        const rand = Math.random() * 100;
        let result = rand < 47.5 ? 'eagle' : rand < 95 ? 'tails' : 'edge';

        const icons = { eagle: '🦅', tails: '👑', edge: '🪙' };
        const names = { eagle: 'Орёл', tails: 'Решка', edge: 'Ребро' };
        coin.textContent = icons[result];

        const history = document.getElementById('coin-history');
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = icons[result];
        history.prepend(chip);
        if (history.children.length > 5) history.removeChild(history.lastChild);

        let mult = result === 'edge' ? 5 : 2;

        if (choice === result) {
            const win = bet * mult;
            addWin(win);
            status.textContent = `🎉 Выиграл ${win} (${names[result]})!`;
        } else {
            status.textContent = `❌ Выпало: ${names[result]}`;
        }
    }, 1000);
}

/* --- 2. СЛОТЫ --- */
let isSlotsPlaying = false;
const slotItems = ['🍋', '🍒', '7️⃣', '💎', '🔔'];
function playSlots() {
    if (isSlotsPlaying) return;
    const bet = getBet();
    if (!bet) return;

    payBet(bet);
    isSlotsPlaying = true;
    const status = document.getElementById('slots-status');
    status.textContent = 'Крутим...';

    const r1 = document.getElementById('reel1');
    const r2 = document.getElementById('reel2');
    const r3 = document.getElementById('reel3');

    let interval = setInterval(() => {
        r1.textContent = slotItems[Math.floor(Math.random() * slotItems.length)];
        r2.textContent = slotItems[Math.floor(Math.random() * slotItems.length)];
        r3.textContent = slotItems[Math.floor(Math.random() * slotItems.length)];
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        isSlotsPlaying = false;

        const res1 = slotItems[Math.floor(Math.random() * slotItems.length)];
        const res2 = slotItems[Math.floor(Math.random() * slotItems.length)];
        const res3 = slotItems[Math.floor(Math.random() * slotItems.length)];

        r1.textContent = res1;
        r2.textContent = res2;
        r3.textContent = res3;

        if (res1 === res2 && res2 === res3) {
            const win = bet * 5;
            addWin(win);
            status.textContent = `🔥 ВЫИГРЫШ! +${win}!`;
        } else {
            status.textContent = '❌ Проигрыш! Выпали разные.';
        }
    }, 1200);
}

/* --- 3. МИНЫ (7x7 = 49 ячеек) --- */
let minesActive = false;
let minePositions = [];
let openedSafeCells = 0;
let minesBet = 0;
let minesCount = 3;

function changeMinesCount(val) {
    if (minesActive) return;
    const input = document.getElementById('mines-count-input');
    let current = parseInt(input.value) || 3;
    let updated = current + val;
    if (updated >= 1 && updated <= 48) {
        input.value = updated;
        minesCount = updated;
    }
}

function initMinesBoard() {
    const grid = document.getElementById('mines-grid');
    grid.innerHTML = '';
    for (let i = 0; i < 49; i++) {
        const cell = document.createElement('div');
        cell.className = 'mine-cell';
        cell.dataset.index = i;
        cell.onclick = () => clickMineCell(i);
        grid.appendChild(cell);
    }
}

function getMinesMultiplier(opened, totalMines) {
    let mult = 1;
    for (let i = 0; i < opened; i++) {
        mult *= (49 - i) / (49 - totalMines - i);
    }
    return mult;
}

function handleMinesBtn() {
    if (minesActive) {
        const mult = getMinesMultiplier(openedSafeCells, minesCount);
        const win = minesBet * mult;
        addWin(win);
        document.getElementById('mines-status').textContent = `💰 Забрал +${win.toFixed(2)} (${mult.toFixed(2)}x)!`;
        endMines();
    } else {
        const bet = getBet();
        if (!bet) return;

        payBet(bet);
        minesBet = bet;
        minesActive = true;
        openedSafeCells = 0;

        minePositions = [];
        while (minePositions.length < minesCount) {
            let r = Math.floor(Math.random() * 49);
            if (!minePositions.includes(r)) minePositions.push(r);
        }

        initMinesBoard();
        
        const btn = document.getElementById('mines-action-btn');
        btn.textContent = '💰 Забрать 0.00';
        btn.classList.add('take-btn');
        document.getElementById('mines-status').textContent = 'Открывай безопасные ячейки!';
    }
}

function clickMineCell(index) {
    if (!minesActive) return;
    const cells = document.querySelectorAll('.mine-cell');
    const cell = cells[index];

    if (cell.classList.contains('opened') || cell.classList.contains('boom')) return;

    if (minePositions.includes(index)) {
        cell.textContent = '💣';
        cell.classList.add('boom');
        document.getElementById('mines-status').textContent = '💥 БУМ! Ты попал на мину.';
        
        minePositions.forEach(pos => {
            cells[pos].textContent = '💣';
            cells[pos].classList.add('boom');
        });
        endMines();
    } else {
        cell.textContent = '💎';
        cell.classList.add('opened');
        openedSafeCells++;

        const mult = getMinesMultiplier(openedSafeCells, minesCount);
        const currentWin = minesBet * mult;
        
        const btn = document.getElementById('mines-action-btn');
        btn.textContent = `💰 Забрать ${currentWin.toFixed(2)} (${mult.toFixed(2)}x)`;
        document.getElementById('mines-status').textContent = `Открыто: ${openedSafeCells} | Выигрыш: ${currentWin.toFixed(2)}`;

        if (openedSafeCells === 49 - minesCount) {
            addWin(currentWin);
            document.getElementById('mines-status').textContent = `🏆 ИДЕАЛЬНО! Выигрыш: ${currentWin.toFixed(2)}`;
            endMines();
        }
    }
}

function endMines() {
    minesActive = false;
    const btn = document.getElementById('mines-action-btn');
    btn.textContent = '🚀 Начать игру';
    btn.classList.remove('take-btn');
}

/* --- 4. РУЛЕТКА (КОЛЬЦО) --- */
let ringMultiplier = 1.1;
let isRingSpinning = false;
let ringRotation = 0;

function updateRingBetDisplay() {
    const bet = parseFloat(betInput.value) || 0;
    const icon = currentCurrency === 'STARS' ? '⭐' : '💎';
    
    const winAmountEl = document.getElementById('ring-win-amount');
    const btnAmountEl = document.getElementById('ring-btn-amount');
    
    if (winAmountEl) winAmountEl.textContent = `+${(bet * ringMultiplier).toFixed(1)}${icon}`;
    if (btnAmountEl) btnAmountEl.textContent = `${bet}${icon}`;
}

function setRingMultiplier(mult, btnElement) {
    if (isRingSpinning) return;
    ringMultiplier = mult;

    document.querySelectorAll('.mult-btn').forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    document.getElementById('ring-mult-text').textContent = `${mult}x`;
    
    const winPercent = Math.min(0.95 / mult, 0.95);
    const blueLength = 440 * winPercent;
    const darkLength = 440 - blueLength;

    const winSector = document.getElementById('win-sector-ring');
    const loseSector = document.getElementById('lose-sector-ring');
    
    if (winSector && loseSector) {
        winSector.setAttribute('stroke-dasharray', `${blueLength} ${darkLength}`);
        loseSector.setAttribute('stroke-dasharray', `${darkLength} ${blueLength}`);
        loseSector.setAttribute('stroke-dashoffset', `-${blueLength}`);
    }

    updateRingBetDisplay();
}

function playRingRoulette() {
    if (isRingSpinning) return;
    const bet = getBet();
    if (!bet) return;

    payBet(bet);
    isRingSpinning = true;
    document.getElementById('ring-status').textContent = 'Вращение...';

    const winChance = 0.95 / ringMultiplier;
    const isWin = Math.random() < winChance;
    const winAngleRange = 360 * winChance;

    let targetAngle = isWin ? 
        (Math.random() * (winAngleRange - 10) + 5) : 
        (winAngleRange + Math.random() * (360 - winAngleRange - 10) + 5);

    ringRotation += (5 * 360) + (360 - (ringRotation % 360)) + (360 - targetAngle);
    document.getElementById('ring-wheel').style.transform = `rotate(${ringRotation}deg)`;

    setTimeout(() => {
        isRingSpinning = false;
        const icon = currentCurrency === 'STARS' ? '⭐' : '💎';
        
        if (isWin) {
            const win = bet * ringMultiplier;
            addWin(win);
            document.getElementById('ring-status').textContent = `🎉 Победа! +${win.toFixed(1)}${icon}`;
        } else {
            document.getElementById('ring-status').textContent = '❌ Увы, выпал NO LOOT!';
        }
    }, 3500);
}

// Старт при загрузке
initMinesBoard();
setRingMultiplier(1.1, document.querySelector('.mult-btn.active'));
window.addEventListener('DOMContentLoaded', () => {
    starsBalance = 0;
    tonBalance = 0;
    if (typeof updateBalances === 'function') {
        updateBalances();
    } else {
        const sEl = document.getElementById('stars-balance');
        const tEl = document.getElementById('ton-balance');
        if (sEl) sEl.textContent = '0';
        if (tEl) tEl.textContent = '0.0';
    }
});