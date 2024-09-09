document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('clickMe');
    
    button.addEventListener('click', () => {
        alert('你点击了按钮!');
    });
});