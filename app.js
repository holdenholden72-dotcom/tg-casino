// Функция переключения вкладок внизу экрана
function switchTab(tabId, element) {
    // Убираем класс active у всех вкладок
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убираем active у кнопок меню
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Включаем нужную вкладку
    document.getElementById('tab-' + tabId).classList.add('active');
    
ра    // Подсвечиваем нажатую кнопку
    element.classList.add('active');
}

// Заглушка для открытия игры из карточки
function openGame(gameName) {
    if (gameName === 'wheel') {
        alert('Запуск игры Wheel!');
        // Здесь можно будет сделать показ экрана игры
    }
}