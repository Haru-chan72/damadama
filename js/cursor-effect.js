// js/cursor-effect.js

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    let lastX = 0;
    let lastY = 0;
    let particles = [];
    const maxParticles = 9; // 画面上に同時に表示するパーティクルの最大数

    // マウス移動イベントリスナー
    body.addEventListener('mousemove', (e) => {
        // マウスの移動距離がある程度大きい場合のみパーティクルを生成
        const dx = Math.abs(e.clientX - lastX);
        const dy = Math.abs(e.clientY - lastY);

        if (dx > 5 || dy > 5) { // 5px以上移動したらパーティクルを生成
            createParticle(e.clientX, e.clientY);
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });

    // パーティクルを生成する関数
    function createParticle(x, y) {
        // パーティクルが最大数を超えたら、最も古いものを削除
        if (particles.length >= maxParticles) {
            const oldestParticle = particles.shift(); // 配列から最初の要素を削除
            if (oldestParticle && oldestParticle.parentNode) {
                oldestParticle.parentNode.removeChild(oldestParticle); // DOMからも削除
            }
        }

        const particle = document.createElement('div');
        particle.classList.add('cursor-particle'); // CSSでスタイルを適用するためのクラス
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        // わずかなランダムサイズとランダムな色相を適用
        const size = Math.random() * 4 + 4; // 4px から 12px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        const hue = Math.random() * 60; // 0から360のランダムな色相
        particle.style.backgroundColor = `hsla(200, 90.70%, 66.30%, 0.30)`; // hsla形式で半透明で鮮やかな色

        body.appendChild(particle);
        particles.push(particle);

        // パーティクルが消えるアニメーションを適用
        // CSSアニメーションの代わりにJavaScriptでsetTimeoutを使うシンプルな方法
        setTimeout(() => {
            particle.style.opacity = '0'; // 透明にして消える
            particle.style.transform = `scale(0.3)`; // 小さくしながら消える

            // アニメーション終了後にDOMから削除
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                    // 配列からも削除（setTimeoutのタイミングで既にshiftされている可能性もあるが念のため）
                    particles = particles.filter(p => p !== particle);
                }
            }, 500); // CSS transition time (0.5s)
        }, 240); // 0.3秒後に消え始める
    }
});