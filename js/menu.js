// js/menu.js

document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menuButton');
    const globalNav = document.getElementById('globalNav');

    if (menuButton && globalNav) { // 要素が存在するか確認
        menuButton.addEventListener('click', () => {
            // is-activeクラスをトグル（追加・削除）する
            globalNav.classList.toggle('is-active');

            // メニューが開いたときにボタンのテキストを変更したい場合
            if (globalNav.classList.contains('is-active')) {
                menuButton.textContent = '▷'; // あるいはアイコンなど
            } else {
                menuButton.textContent = '◁';
            }
        });

        // メニューの外をクリックしたら閉じる処理（オプション）
        document.addEventListener('click', (e) => {
            if (!globalNav.contains(e.target) && !menuButton.contains(e.target)) {
                if (globalNav.classList.contains('is-active')) {
                    globalNav.classList.remove('is-active');
                    menuButton.textContent = '◁';
                }
            }
        });
    }
});