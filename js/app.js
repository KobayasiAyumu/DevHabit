/**
 * メインアプリケーションモジュール
 * 全モジュールの初期化、設定管理、イベントハンドリングを統括する
 */

const App = (() => {
    /**
     * 設定をLocalStorageから読み込む
     * @returns {Object} 設定オブジェクト
     */
    function loadSettings() {
        const defaults = {
            githubToken: '',
            githubUsername: '',
            spotifyToken: '',
            demoMode: true
        };

        try {
            const saved = localStorage.getItem('devhabit-settings');
            if (saved) {
                return { ...defaults, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('設定の読み込みに失敗:', e);
        }

        return defaults;
    }

    /**
     * 設定をLocalStorageに保存する
     * @param {Object} settings - 設定オブジェクト
     */
    function saveSettings(settings) {
        try {
            localStorage.setItem('devhabit-settings', JSON.stringify(settings));
        } catch (e) {
            console.warn('設定の保存に失敗:', e);
        }
    }

    /**
     * サマリーカードの数値をカウントアップアニメーションで表示する
     * @param {Object} summary - サマリーデータ
     */
    function animateSummaryCards(summary) {
        const cards = [
            { id: 'summary-streak', value: summary.streak },
            { id: 'summary-commits', value: summary.weeklyCommits },
            { id: 'summary-hours', value: summary.weeklyHours },
            { id: 'summary-energy', value: summary.energyLevel }
        ];

        cards.forEach((card, i) => {
            const el = document.querySelector(`#${card.id} .summary-value`);
            const cardEl = document.getElementById(card.id);

            // スタガーアニメーション
            cardEl.style.opacity = '0';
            cardEl.style.transform = 'translateY(20px)';

            setTimeout(() => {
                cardEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                cardEl.style.opacity = '1';
                cardEl.style.transform = 'translateY(0)';
                CommitAnalysis.animateNumber(el, card.value, 1000);
            }, 200 + i * 100);
        });
    }

    /**
     * 設定モーダルに関するイベントをバインドする
     */
    function bindSettingsEvents() {
        const modal = document.getElementById('modal-settings');
        const settings = loadSettings();

        // フォームに既存の設定を反映
        document.getElementById('input-github-token').value = settings.githubToken;
        document.getElementById('input-github-username').value = settings.githubUsername;
        document.getElementById('input-spotify-token').value = settings.spotifyToken;
        document.getElementById('input-demo-mode').checked = settings.demoMode;

        // 設定ボタン
        document.getElementById('btn-settings').addEventListener('click', () => {
            modal.style.display = 'flex';
        });

        // 閉じるボタン
        document.getElementById('btn-close-settings').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // キャンセルボタン
        document.getElementById('btn-cancel-settings').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // オーバーレイクリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });

        // 保存ボタン
        document.getElementById('btn-save-settings').addEventListener('click', () => {
            const newSettings = {
                githubToken: document.getElementById('input-github-token').value,
                githubUsername: document.getElementById('input-github-username').value,
                spotifyToken: document.getElementById('input-spotify-token').value,
                demoMode: document.getElementById('input-demo-mode').checked
            };

            saveSettings(newSettings);
            modal.style.display = 'none';

            // デモバッジの表示切替
            const demoBadge = document.getElementById('demo-badge');
            demoBadge.style.display = newSettings.demoMode ? 'flex' : 'none';

            // データを再読み込み
            initModules(newSettings.demoMode);
        });
    }

    /**
     * 各分析モジュールを初期化する
     * @param {boolean} isDemo - デモモードかどうか
     */
    function initModules(isDemo = true) {
        if (isDemo) {
            const summary = MockData.getSummary();
            animateSummaryCards(summary);
        }

        CommitAnalysis.init(isDemo);
        BgmAnalysis.init(isDemo);
        EnergyManagement.init(isDemo);
        WeeklyReport.init();
    }

    /**
     * ローディングスクリーンを非表示にする
     */
    function hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 800);
    }

    /**
     * Lucideアイコンを初期化する
     */
    function initIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * アプリケーションを起動する
     */
    function init() {
        // アイコン初期化
        initIcons();

        // 設定読み込み
        const settings = loadSettings();
        const isDemo = settings.demoMode;

        // デモバッジ表示
        const demoBadge = document.getElementById('demo-badge');
        demoBadge.style.display = isDemo ? 'flex' : 'none';

        // モジュール初期化
        initModules(isDemo);

        // イベントバインド
        bindSettingsEvents();

        // ローディング非表示
        hideLoading();
    }

    // DOM読み込み完了時に初期化
    document.addEventListener('DOMContentLoaded', init);

    return { init };
})();
