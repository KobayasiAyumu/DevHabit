/**
 * コミットパターン分析モジュール
 * ヒートマップ描画、ストリーク表示、平日/週末比率チャートを管理する
 */

const CommitAnalysis = (() => {
    let weekdayChart = null;

    /**
     * ヒートマップを描画する（Canvas使用）
     * @param {number[][]} data - 7×24 のコミット数マトリクス
     */
    function renderHeatmap(data) {
        const canvas = document.getElementById('heatmap-canvas');
        const ctx = canvas.getContext('2d');
        const container = canvas.parentElement;

        // 高DPI対応
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        const width = rect.width - 60; // ラベル分のパディング
        const height = 200;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);

        const cellW = width / 24;
        const cellH = height / 7;
        const gap = 2;

        // 最大値を取得（色のスケーリング用）
        const maxVal = Math.max(...data.flat(), 1);

        // セルを描画
        for (let day = 0; day < 7; day++) {
            for (let hour = 0; hour < 24; hour++) {
                const val = data[day][hour];
                const intensity = val / maxVal;

                // アクセントカラー（紫）のグラデーション
                const r = Math.round(10 + intensity * 114);  // 10 → 124
                const g = Math.round(14 + intensity * 44);   // 14 → 58
                const b = Math.round(26 + intensity * 211);  // 26 → 237

                ctx.fillStyle = val === 0
                    ? 'rgba(255, 255, 255, 0.03)'
                    : `rgba(${r}, ${g}, ${b}, ${0.2 + intensity * 0.8})`;

                const x = hour * cellW + gap / 2;
                const y = day * cellH + gap / 2;
                const w = cellW - gap;
                const h = cellH - gap;

                ctx.beginPath();
                ctx.roundRect(x, y, w, h, 4);
                ctx.fill();
            }
        }

        // 曜日ラベル
        const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
        const labelsY = document.getElementById('heatmap-labels-y');
        labelsY.innerHTML = '';
        dayLabels.forEach(label => {
            const span = document.createElement('span');
            span.textContent = label;
            span.style.height = cellH + 'px';
            span.style.display = 'flex';
            span.style.alignItems = 'center';
            labelsY.appendChild(span);
        });

        // 時間ラベル
        const labelsX = document.getElementById('heatmap-labels-x');
        labelsX.innerHTML = '';
        for (let h = 0; h < 24; h += 3) {
            const span = document.createElement('span');
            span.textContent = `${h}時`;
            labelsX.appendChild(span);
        }

        // 凡例
        renderHeatmapLegend(maxVal);
    }

    /**
     * ヒートマップの凡例を生成する
     * @param {number} maxVal - 最大コミット数
     */
    function renderHeatmapLegend(maxVal) {
        const container = document.getElementById('heatmap-legend-colors');
        container.innerHTML = '';
        const steps = 5;
        for (let i = 0; i < steps; i++) {
            const intensity = i / (steps - 1);
            const div = document.createElement('div');
            div.className = 'heatmap-legend-color';
            if (i === 0) {
                div.style.background = 'rgba(255, 255, 255, 0.03)';
            } else {
                const r = Math.round(10 + intensity * 114);
                const g = Math.round(14 + intensity * 44);
                const b = Math.round(26 + intensity * 211);
                div.style.background = `rgba(${r}, ${g}, ${b}, ${0.3 + intensity * 0.7})`;
            }
            container.appendChild(div);
        }
    }

    /**
     * ストリーク（連続コミット日数）を表示する
     * @param {Object} streakData - ストリーク関連データ
     */
    function renderStreak(streakData) {
        const numberEl = document.getElementById('streak-number');
        const bestEl = document.getElementById('streak-best');
        const monthlyEl = document.getElementById('streak-monthly');
        const avgEl = document.getElementById('streak-avg');
        const progressEl = document.getElementById('streak-progress');

        // SVG stroke-gradient を追加
        const svg = document.querySelector('.streak-svg');
        if (!svg.querySelector('#streak-gradient')) {
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.setAttribute('id', 'streak-gradient');
            gradient.innerHTML = `
        <stop offset="0%" style="stop-color:#a78bfa" />
        <stop offset="100%" style="stop-color:#f97316" />
      `;
            defs.appendChild(gradient);
            svg.prepend(defs);
        }

        // プログレスリングアニメーション（最大30日換算）
        const circumference = 326.7;
        const progress = Math.min(streakData.current / 30, 1);
        const offset = circumference * (1 - progress);

        setTimeout(() => {
            progressEl.style.stroke = 'url(#streak-gradient)';
            progressEl.style.strokeDashoffset = offset;
        }, 300);

        // 数値のカウントアップアニメーション
        animateNumber(numberEl, streakData.current, 800);
        bestEl.textContent = streakData.best + '日';
        monthlyEl.textContent = streakData.monthlyActive + '日';
        avgEl.textContent = streakData.avgPerDay.toFixed(1);
    }

    /**
     * 平日/週末比率のドーナツチャートを描画する
     * @param {Object} ratio - 平日・週末の比率
     */
    function renderWeekdayRatio(ratio) {
        const ctx = document.getElementById('chart-weekday-ratio').getContext('2d');

        if (weekdayChart) weekdayChart.destroy();

        weekdayChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['平日', '週末'],
                datasets: [{
                    data: [ratio.weekday, ratio.weekend],
                    backgroundColor: [
                        'rgba(124, 58, 237, 0.8)',
                        'rgba(59, 130, 246, 0.8)'
                    ],
                    borderColor: [
                        'rgba(124, 58, 237, 1)',
                        'rgba(59, 130, 246, 1)'
                    ],
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        titleColor: '#f1f5f9',
                        bodyColor: '#94a3b8',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        callbacks: {
                            label: function (context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1200,
                    easing: 'easeOutQuart'
                }
            }
        });

        // ラベル表示
        const labelsContainer = document.getElementById('ratio-labels');
        labelsContainer.innerHTML = `
      <div class="ratio-label">
        <span class="ratio-dot" style="background:rgba(124,58,237,0.8)"></span>
        <span>平日 ${ratio.weekday}%</span>
      </div>
      <div class="ratio-label">
        <span class="ratio-dot" style="background:rgba(59,130,246,0.8)"></span>
        <span>週末 ${ratio.weekend}%</span>
      </div>
    `;
    }

    /**
     * 数値をカウントアップアニメーションで表示する
     * @param {HTMLElement} el - 表示先のDOM要素
     * @param {number} target - 目標値
     * @param {number} duration - アニメーション時間(ms)
     */
    function animateNumber(el, target, duration) {
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutQuart
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * eased);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    /**
     * コミット分析セクション全体を初期化する
     * @param {boolean} isDemo - デモモードかどうか
     */
    function init(isDemo = true) {
        if (isDemo) {
            const heatmapData = MockData.generateHeatmap();
            const streakData = MockData.getStreakData();
            const ratioData = MockData.getWeekdayRatio();

            renderHeatmap(heatmapData);
            renderStreak(streakData);
            renderWeekdayRatio(ratioData);
        }
    }

    // ウィンドウリサイズ時にヒートマップを再描画
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const heatmapData = MockData.generateHeatmap();
            renderHeatmap(heatmapData);
        }, 250);
    });

    return { init, renderHeatmap, renderStreak, renderWeekdayRatio, animateNumber };
})();
