// ハンバーガーメニュー制御スクリプト

// メニュー内のリンククリック時にメニューを自動的に閉じる
document.querySelectorAll('.menu-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        // リンククリック時にチェックボックスを未チェック状態にして閉じる
        document.getElementById('menu-toggle').checked = false;
        
        // スムーススクロール
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// メニュー背景クリック時に閉じる（拡張オプション）
document.querySelector('.menu-nav').addEventListener('click', (e) => {
    if (e.target === document.querySelector('.menu-nav')) {
        document.getElementById('menu-toggle').checked = false;
    }
});

// ページ読み込み時のメニュー初期化
window.addEventListener('load', () => {
    // メニューボタンが正しく表示されるか確認
    const menuButton = document.querySelector('.menu-button');
    if (menuButton) {
        menuButton.style.opacity = '1';
    }
});

// ウィンドウリサイズ時に、メニューが開いていたら小画面で自動的に閉じる
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.getElementById('menu-toggle').checked = false;
    }
});
