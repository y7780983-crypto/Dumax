// Photo Editor System
let canvas = null;
let ctx = null;
let originalImage = null;
let currentImageData = null;
let imageLoaded = false;
let filterType = 'none';
let history = [];
let historyIndex = -1;
let rotation = 0;
let flipped = false;

document.addEventListener('DOMContentLoaded', () => {
    initPhotoEditor();
});

function initPhotoEditor() {
    canvas = document.getElementById('imageCanvas');
    ctx = canvas.getContext('2d');

    // Load image button
    document.getElementById('loadImageBtn').addEventListener('click', loadImage);

    // Filter buttons
    document.querySelectorAll('.filter-buttons .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-buttons .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterType = btn.dataset.filter;
            applyFilters();
        });
    });

    // Sliders
    document.getElementById('brightnessSlider').addEventListener('input', (e) => {
        document.getElementById('brightnessValue').textContent = e.target.value;
        applyFilters();
    });

    document.getElementById('contrastSlider').addEventListener('input', (e) => {
        document.getElementById('contrastValue').textContent = e.target.value;
        applyFilters();
    });

    document.getElementById('saturateSlider').addEventListener('input', (e) => {
        document.getElementById('saturateValue').textContent = e.target.value;
        applyFilters();
    });

    // Actions
    document.getElementById('rotateBtn').addEventListener('click', rotateImage);
    document.getElementById('flipBtn').addEventListener('click', flipImage);
    document.getElementById('addTextBtn').addEventListener('click', addTextToImage);
    document.getElementById('addFrameBtn').addEventListener('click', addFrameToImage);
    document.getElementById('undoBtn').addEventListener('click', undoAction);
    document.getElementById('redoBtn').addEventListener('click', redoAction);
    document.getElementById('saveImageBtn').addEventListener('click', saveImage);
}

function loadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                originalImage = img;
                imageLoaded = true;

                // Set canvas size
                const maxWidth = 800;
                const maxHeight = 600;
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = (maxHeight / height) * width;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;

                // Reset state
                rotation = 0;
                flipped = false;
                history = [];
                historyIndex = -1;
                filterType = 'none';

                // Reset sliders
                document.getElementById('brightnessSlider').value = 100;
                document.getElementById('contrastSlider').value = 100;
                document.getElementById('saturateSlider').value = 100;
                document.getElementById('brightnessValue').textContent = '100';
                document.getElementById('contrastValue').textContent = '100';
                document.getElementById('saturateValue').textContent = '100';

                // Reset filter buttons
                document.querySelectorAll('.filter-buttons .filter-btn').forEach(b => b.classList.remove('active'));
                document.querySelector('.filter-buttons .filter-btn[data-filter="none"]').classList.add('active');

                // Draw image
                drawImage();

                // Enable buttons
                document.getElementById('saveImageBtn').disabled = false;
                document.getElementById('undoBtn').disabled = false;
                document.getElementById('redoBtn').disabled = false;

                showToast('عکس با موفقیت بارگذاری شد', 'success');

                // Save initial state
                saveHistory();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    input.click();
}

function drawImage(applyFilters = true) {
    if (!originalImage) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);

    if (flipped) {
        ctx.scale(-1, 1);
    }

    ctx.rotate(rotation * Math.PI / 180);

    // Draw image centered
    const imgWidth = originalImage.width;
    const imgHeight = originalImage.height;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const width = imgWidth * scale;
    const height = imgHeight * scale;
    const x = -width / 2;
    const y = -height / 2;

    ctx.drawImage(originalImage, x, y, width, height);

    // Restore context for filters
    ctx.restore();

    // Apply filters
    if (applyFilters) {
        applyFiltersToCanvas();
    }
}

function applyFiltersToCanvas() {
    if (!imageLoaded) return;

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Get filter values
    const brightness = parseInt(document.getElementById('brightnessSlider').value) / 100;
    const contrast = parseInt(document.getElementById('contrastSlider').value) / 100;
    const saturate = parseInt(document.getElementById('saturateSlider').value) / 100;

    // توجه: متن ارسالی شما دقیقاً همین‌جا قطع شده بود.
    // ادامه‌ی این تابع (اعمال brightness/contrast/saturate روی پیکسل‌ها،
    // putImageData) و همچنین توابع زیر در پیام شما نبودند:
    // applyFilters, rotateImage, flipImage, addTextToImage,
    // addFrameToImage, saveHistory, undoAction, redoAction, saveImage
    // و همچنین صادرات (window.xxx) در انتهای فایل.
    // لطفاً باقی‌مانده‌ی photo-editor.js را ارسال کنید تا کامل شود.
}
