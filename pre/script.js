document.addEventListener('DOMContentLoaded', () => {

    /* --- 定数定義 --- */
    const ANIMATION_TIME = 2500;
    const LOADER = document.getElementById('initial-loader');
    const MAIN_CONTENT = document.getElementById('main-content');
    const SKILL_LEVELS = document.querySelectorAll('.skill-level');
    const SKILL_SECTION = document.getElementById('skills');
    const WORKS_LIST = document.querySelectorAll('.work-item > div[data-work-id]');
    const HISTORY_SECTION = document.getElementById('history');
    const TIMELINE_NODES = document.querySelectorAll('.timeline-node');
    
    
    /* --- 初期化処理: HTMLデータから WORKS/SKILLS のプレビューを生成 --- */
    function initializeContentFromHTML() {
        WORKS_LIST.forEach(workElement => {
            const techString = workElement.dataset.tech;
            const techBadgesContainer = workElement.querySelector('.tech-badges');
            const mediaContainer = workElement.querySelector('.media-container');

            // 1. プレビュー用バッジを生成
            if (techString) {
                const techs = techString.split(',').map(t => t.trim());
                const badgesHtml = techs.slice(0, 2).map((tech, index) => {
                    const type = index === 0 ? 'primary' : 'secondary';
                    return `<span class="badge ${type}">${tech}</span>`;
                }).join('');
                techBadgesContainer.innerHTML = badgesHtml;
            }

            // 2. WORKSカードのサムネイル（最初のスライド）を生成
            const types = workElement.dataset.mediaTypes || 'img';
            const srcs = workElement.dataset.mediaSrcs || '';
            
            if (srcs) {
                const firstType = types.split(',')[0].trim();
                const firstSrc = srcs.split(',')[0].trim();
                
                let content;
                if (firstType === 'iframe') {
                    content = `<iframe src="${firstSrc}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                } else {
                    // 画像がない場合はダミーテキストを表示
                    content = firstSrc ? `<img src="${firstSrc}" alt="サムネイル">` : `<p style="display: flex; align-items: center; justify-content: center; height: 100%; color: #aaa;">No Image</p>`;
                }

                mediaContainer.innerHTML = `<div class="media-item active" data-index="0">${content}</div>`;
            }
        });
    }


    /* --- サイト起動アニメーション制御 --- */
    const hideLoader = () => {
        LOADER.classList.add('hidden');
        MAIN_CONTENT.classList.add('loaded');
    };
    setTimeout(hideLoader, ANIMATION_TIME);


    /* --- Intersection Observer 設定 (SKILLS, HISTORY) --- */

    // 1. SKILLSゲージアニメーション (既存ロジックを維持)
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                SKILL_LEVELS.forEach(level => {
                    level.style.width = level.getAttribute('data-level');
                    level.classList.add('animated');
                });
                skillObserver.unobserve(SKILL_SECTION);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.5 });

    if (SKILL_SECTION) { skillObserver.observe(SKILL_SECTION); }

    // 2. HISTORY右スライドインアニメーション
    const historyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // is-visibleクラスを付与し、CSSのtransition-delayで時間差スライドインをトリガー
                
                TIMELINE_NODES.forEach((node, index) => { // 💡 index を利用
                    // 0.2s * (要素のインデックス + 1) を計算し、カスタムプロパティに設定
                    // 例: 1番目 (index 0) は 0.2s, 5番目 (index 4) は 1.0s
                    const delay = (index + 1) * 0.2; 

                    // 安定して順番どおりに遅延を適用するため、各要素に直接 transitionDelay を設定
                    // （CSSカスタムプロパティ + 's' の組合せでブラウザ差が出ることがあるため）
                    node.style.transitionDelay = `${delay}s`;

                    // アニメーションをトリガーするクラスを付与
                    node.classList.add('is-visible');
                });
                observer.unobserve(HISTORY_SECTION);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    if (HISTORY_SECTION) {
        // サイト起動アニメーションの後に監視を開始
        setTimeout(() => {
            historyObserver.observe(HISTORY_SECTION);
        }, ANIMATION_TIME + 500);
    }


    /* --- Introのメッセージアニメーション時間調整 (既存ロジックを維持) --- */
    const messageBox = document.querySelector('.rpg-message');
    if (messageBox) {
        const textLength = messageBox.textContent.length;
        const animationDuration = Math.min(3, textLength * 0.05) + 's';
        messageBox.style.animationDuration = animationDuration;
    }


    /* --- モーダル共通機能とスタイル動的追加 (既存ロジックを維持) --- */
    const createModal = (id) => {
        const modal = document.createElement('div');
        modal.id = id;
        modal.innerHTML = `<div class="modal-content"><span class="close-btn">&times;</span><h3 class="rpg-title" style="font-size: 1.8rem;"></h3><div class="modal-body-content"></div></div>`;
        document.body.appendChild(modal);
        return modal;
    };

    const modalStyles = document.createElement('style');
    modalStyles.innerHTML = `
        #work-detail-modal, #skill-detail-modal {
            display: none; position: fixed; z-index: 2000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto;
            background-color: rgba(0,0,0,0.8); justify-content: center; align-items: center;
        }
        .modal-content {
            background: #1e1e2e; border: 3px solid var(--primary-color); border-radius: 10px; padding: 30px; width: 80%; max-width: 600px; position: relative;
            transform: scale(0.8); opacity: 0; transition: all 0.3s ease-out;
        }
        .show-animation { transform: scale(1); opacity: 1; }
        .hide-animation { transform: scale(0.9); opacity: 0; }
        .close-btn { color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer; position: absolute; top: 10px; right: 20px; }
        .close-btn:hover { color: var(--secondary-color); }
        .modal-body-content { max-height: 70vh; overflow-y: auto; padding-right: 15px; } 
    `;
    document.head.appendChild(modalStyles);


    /* --- WORKS スライドショー制御ロジックの追加 --- */

    // 💡 スライドショーメディアのHTMLを生成するヘルパー関数
    function createMediaElements(typesString, srcsString, isModal = false) {
        const types = typesString.split(',').map(t => t.trim());
        const srcs = srcsString.split(',').map(s => s.trim());
        
        if (!srcs.length || srcs[0] === '') return { mediaHtml: '', count: 0 };

        let mediaHtml = '';
        let currentId = Math.random().toString(36).substring(7); // ユニークIDを生成

        srcs.forEach((src, index) => {
            let content;
            const type = types[index] || 'img';
            const activeClass = index === 0 ? ' active' : '';
            
            if (type === 'iframe') {
                // iframeはautoplay=0をつけて、クリックされるまで再生しないようにする
                content = `<iframe src="${src}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            } else {
                content = `<img src="${src}" alt="スクリーンショット ${index + 1}">`;
            }
            
            mediaHtml += `<div class="media-item${activeClass}" data-index="${index}">${content}</div>`;
        });
        
        // スライドが2枚以上あればボタンを追加
        if (srcs.length > 1) {
            mediaHtml += `
                <button class="slider-control prev-btn" data-target="${currentId}">&#10094;</button>
                <button class="slider-control next-btn" data-target="${currentId}">&#10095;</button>
            `;
        }

        const containerClass = isModal ? 'modal-media-container' : 'media-container';
        return { 
            mediaHtml: `<div class="${containerClass}" data-slider-id="${currentId}">${mediaHtml}</div>`, 
            count: srcs.length 
        };
    }

    // 💡 スライド切り替え実行ロジック
    function slideMedia(sliderId, direction) {
        const container = document.querySelector(`[data-slider-id="${sliderId}"]`);
        if (!container) return;

        const items = container.querySelectorAll('.media-item');
        let activeItem = container.querySelector('.media-item.active');
        let currentIndex = parseInt(activeItem.dataset.index);
        let nextIndex = currentIndex + direction;

        if (nextIndex >= items.length) {
            nextIndex = 0; // ループの最初へ
        } else if (nextIndex < 0) {
            nextIndex = items.length - 1; // ループの最後へ
        }

        activeItem.classList.remove('active');
        items[nextIndex].classList.add('active');
    }

    // 💡 グローバルなクリックイベントでスライドボタンを処理
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('slider-control')) {
            const sliderId = e.target.dataset.target;
            const direction = e.target.classList.contains('next-btn') ? 1 : -1;
            slideMedia(sliderId, direction);
        }
    });

    /* --- WORKS モーダル機能 --- */
    const workModal = createModal('work-detail-modal');
    workModal.querySelector('.close-btn').onclick = () => { workModal.querySelector('.modal-content').classList.add('hide-animation'); setTimeout(() => workModal.style.display = 'none', 300); };
    
    window.showWorkDetail = (workId) => {
        const workElement = document.querySelector(`div[data-work-id="${workId}"]`);
        if (!workElement) return;

        const workData = workElement.dataset;
        const workTitle = workElement.querySelector('.item-title').textContent;
        const workBody = workElement.querySelector('.project-summary').innerHTML;
        
        const modalContent = workModal.querySelector('.modal-content');

        // 💡 スライドショーメディアの生成
        const { mediaHtml } = createMediaElements(workData.mediaTypes, workData.mediaSrcs, true);

        // 技術バッジの生成
        const techs = workData.tech ? workData.tech.split(',').map(t => t.trim()) : [];
        const techBadgesHtml = techs.map(t => `<span class="badge primary">${t}</span>`).join('');
        
        modalContent.querySelector('.rpg-title').textContent = workTitle;
        modalContent.querySelector('.modal-body-content').innerHTML = `
            ${mediaHtml}
            
            <div class="work-detail-info" style="margin-top: 20px; border-bottom: 1px dashed var(--border-color); padding-bottom: 10px;">
                <p style="font-family: DotGothic16, monospace; margin-bottom: 5px; color: var(--secondary-color);">制作時期: <span style="color: #fff;">${workData.period || '未定'}</span></p>
                <p style="font-family: DotGothic16, monospace; color: var(--secondary-color);">担当箇所: <span style="color: #fff;">${workData.role || '不明'}</span></p>
            </div>
            
            <p style="margin-top: 15px;">${workBody}</p>
            <h4 style="color: var(--secondary-color); margin-top: 15px; font-family: DotGothic16, monospace;">技術スタック</h4>
            <div class="tech-badges" style="margin-bottom: 20px;">${techBadgesHtml}</div>
            <a href="${workData.link}" target="_blank" class="command-btn" style="display: block; text-align: center;">詳細サイトへ ▶︎</a>
        `;

        workModal.style.display = 'flex';
        modalContent.classList.remove('hide-animation');
        modalContent.classList.add('show-animation');
    };


    /* --- SKILL詳細モーダル機能 (既存ロジックを維持) --- */
    const skillModal = createModal('skill-detail-modal');
    skillModal.querySelector('.close-btn').onclick = () => { skillModal.querySelector('.modal-content').classList.add('hide-animation'); setTimeout(() => skillModal.style.display = 'none', 300); };

    window.showSkillDetail = (skillId) => {
        const skillElement = document.querySelector(`div[data-skill-id="${skillId}"]`);
        if (!skillElement) return;

        const skillData = skillElement.dataset;
        const skillTitle = skillElement.querySelector('p').textContent;
        const modalContent = skillModal.querySelector('.modal-content');
        
        const relatedWorks = skillData.relatedWorks ? skillData.relatedWorks.split(',').map(wId => wId.trim()) : [];
        
        const relatedWorksHtml = relatedWorks
            .map(wId => {
                const workEl = document.querySelector(`div[data-work-id="${wId}"]`);
                if (!workEl) return '';
                const title = workEl.querySelector('.item-title').textContent;
                const link = workEl.dataset.link;
                return `<a href="${link}" target="_blank">${title}</a>`;
            })
            .join('');

        modalContent.querySelector('.rpg-title').textContent = skillTitle;
        modalContent.querySelector('.modal-body-content').innerHTML = `
            <div class="skill-detail-area">
                <div class="status-info"><span class="status-label">熟練度:</span><span class="status-value">${skillData.level}</span></div>
                <div class="status-info"><span class="status-label">使用年数:</span><span class="status-value">${skillData.years}</span></div>
                <p style="margin-top: 15px; margin-bottom: 20px;">${skillData.description}</p>
                
                <div class="related-works">
                    <h4>関連開発実績 (WORKS)</h4>
                    <div class="related-works-list">${relatedWorksHtml || '<p>関連する実績はありません。</p>'}</div>
                </div>
            </div>
        `;
        
        skillModal.style.display = 'flex';
        modalContent.classList.remove('hide-animation');
        modalContent.classList.add('show-animation'); 
    };
    
    // 初期化関数を実行
    initializeContentFromHTML();
});