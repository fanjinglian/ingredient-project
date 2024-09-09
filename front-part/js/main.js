document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('clickMe');
    
    button.addEventListener('click', () => {
        alert('你点击了按钮!');
    });
});

// 获取元素
const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const captureButton = document.getElementById('capture');
const ingredients = document.getElementById('ingredients');
const analyzeButton = document.getElementById('analyze');
const analysisResult = document.getElementById('analysis-result');

// 访问摄像头
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error("摄像头访问失败:", err);
    }
}

// 拍照
function capturePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    photo.src = canvas.toDataURL('image/jpeg');
    photo.style.display = 'block';
    
    // 里可以添加OCR逻辑来提取文本
    // 暂时用模拟数据
   
}

// 分析配料
async function analyzeIngredients() {
    const ingredientsText = ingredients.value;
    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredients: ingredientsText }),
        });
        if (!response.ok) {
            throw new Error('网络响应不正常');
        }
        const result = await response.json();
        analysisResult.textContent = result.analysis;
    } catch (error) {
        console.error('分析过程错:', error);
        analysisResult.textContent = '分析失败，请稍后再试。';
    }
}

// 如果实现了OCR功能，可以添加类似的函数来处理图片上传和文字识别
async function processImage(imageData) {
    try {
        const response = await fetch('/ocr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData }),
        });
        if (!response.ok) {
            throw new Error('网络响应不正常');
        }
        const result = await response.json();
        ingredients.value = result.text;
    } catch (error) {
        console.error('OCR处理失败:', error);
        ingredients.value = '图片处理失败，请手动输入配料表。';
    }
}

// 事件监听
startCamera();
captureButton.addEventListener('click', async () => {
    canvas.width = camera.videoWidth;
    canvas.height = camera.videoHeight;
    canvas.getContext('2d').drawImage(camera, 0, 0);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    photo.src = imageDataUrl;
    photo.style.display = 'block'; // 确保照片可见

    // 发送图片数据到后端进行分析
    try {
        const response = await fetch('/analyze_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageDataUrl }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        // 显示分析结果
        analysisResult.innerHTML = `<p>${result.ingredients}</p>`;
        analysisResult.style.display = 'block'; // 确保结果可见
    } catch (error) {
        console.error('Error:', error);
        analysisResult.innerHTML = '<p>分析失败，请重试。</p>';
    }
});

// 事件监听
analyzeButton.addEventListener('click', analyzeIngredients);