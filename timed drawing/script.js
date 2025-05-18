document.addEventListener('DOMContentLoaded', () => {
    // Основные элементы
    const startBtn = document.getElementById('startBtn');
    const timeBtn = document.getElementById('timeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const timer = document.getElementById('timer');
    const imageContainer = document.getElementById('imageContainer');
    const brushSize = document.getElementById('brushSize');
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colors = document.querySelectorAll('.color');

    // Состояние приложения
    let isRunning = false;
    let countdown;
    let currentTime = 45;
    let time = 45;
    let currentColor = '#000000';

    // Инициализация Canvas
    function initCanvas() {
        canvas.width = 800;
        canvas.height = 400;
        clearCanvas();
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize.value;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    // Очистка холста
    function clearCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Обработчики событий
    startBtn.addEventListener('click', startDrawingSession);
    timeBtn.addEventListener('click', toggleTimer);
    clearBtn.addEventListener('click', confirmClearCanvas);
    brushSize.addEventListener('input', updateBrushSize);

    // Выбор цвета
    colors.forEach(color => {
        color.addEventListener('click', function() {
            colors.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentColor = this.getAttribute('data-color');
            ctx.strokeStyle = currentColor;
        });
    });

    function confirmClearCanvas() {
        if(confirm("Очистить холст?")) {
            clearCanvas();
        }
    }

    function startDrawingSession() {
        if(isRunning) {
            clearInterval(countdown);
            isRunning = false;
            brushSize.disabled = true;
            return;
        }

        isRunning = true;
        brushSize.disabled = false;
        currentTime = time;
        updateTimerDisplay();
        showRandomImage();
        startCountdown();
    }

    function toggleTimer() {
        if(isRunning) return;
        time = time === 45 ? 35 : 45;
        currentTime = time;
        updateTimerDisplay();
    }

const UNSPLASH_ACCESS_KEY = 'PF4kfdKj7NdJIsETo9TIFXI0WZSE4YRhbYi9WotV8C0';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

async function showRandomImage() {
    try {
        const response = await fetch(
            `${UNSPLASH_API_URL}/photos/random?client_id=${UNSPLASH_ACCESS_KEY}` +
            `&query=rabbit bunny puppy kitten fish foal` +
            `&orientation=landscape` +
            `&color=white`, 
            {
                method: 'GET',
                headers: {
                    'Accept-Version': 'v1'
                }
            }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const photoData = await response.json();

        const imgUrl = `${photoData.urls.raw}&w=800&h=600&fit=crop&q=80`;
        const photographer = photoData.user.name;

        imageContainer.innerHTML = `
            <div class="image-info">
                <div class="image-title">Фото: ${photoData.alt_description || 'Животное на белом фоне'}</div>
                <div class="photographer">Автор: ${photographer}</div>
            </div>
            <img src="${imgUrl}" alt="${photoData.alt_description || ''}" class="unsplash-image">
        `;

    } catch (error) {
        console.error('Ошибка загрузки:', error);
        imageContainer.innerHTML = `
            <div class="error">
                Ошибка загрузки. Попробуйте позже.
                ${error.message}
            </div>
        `;
    }
}


    function startCountdown() {
        clearInterval(countdown);
        countdown = setInterval(() => {
            currentTime--;
            updateTimerDisplay();
            
            if(currentTime <= 0) {
                clearInterval(countdown);
                isRunning = false;
                brushSize.disabled = true;
                setTimeout(() => alert("Время вышло!"), 50);
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function updateBrushSize() {
        ctx.lineWidth = this.value;
    }

    // Логика рисования
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function getCanvasCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    canvas.addEventListener('mousedown', (e) => {
        if(!isRunning) return;
        isDrawing = true;
        const pos = getCanvasCoordinates(e);
        [lastX, lastY] = [pos.x, pos.y];
    });

    canvas.addEventListener('mousemove', (e) => {
        if(!isDrawing || !isRunning) return;
        const pos = getCanvasCoordinates(e);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        
        [lastX, lastY] = [pos.x, pos.y];
    });

    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    // Инициализация
    initCanvas();
    colors[0].classList.add('active'); // Активируем черный цвет по умолчанию
    updateTimerDisplay();
});

