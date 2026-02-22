/**
 * エネルギー管理モジュール
 * 燃え尽き予測ゲージ、エネルギートレンド、活動タイムラインを管理する
 */

const EnergyManagement = (() => {
    let energyTrendChart = null;

    /**
     * バーンアウト（燃え尽き）予測ゲージを描画する
     * @param {Object} burnoutData - バーンアウトデータ
     */
    function renderBurnoutGauge(burnoutData) {
        const score = burnoutData.score;
        const fillEl = document.getElementById('burnout-fill');
        const needleEl = document.getElementById('burnout-needle');
        const scoreEl = document.querySelector('.burnout-score');
        const alertEl = document.getElementById('burnout-alert');
        const factorsEl = document.getElementById('burnout-factors');
        const card = document.getElementById('burnout-card');

        // ゲージのfill（arc path全体の長さ ≒ 251.3）
        const totalLength = 251.3;
        const fillOffset = totalLength * (1 - score / 100);

        setTimeout(() => {
            fillEl.style.strokeDashoffset = fillOffset;
        }, 300);

        // 針の角度（-90° → +90° の範囲、score 0=左端、100=右端）
        const angle = -90 + (score / 100) * 180;
        setTimeout(() => {
            needleEl.style.transform = `rotate(${angle}deg)`;
        }, 300);

        // スコアのカウントアップ
        CommitAnalysis.animateNumber(scoreEl, score, 1200);

        // アラートメッセージ
        alertEl.className = 'burnout-alert';
        if (score < 30) {
            alertEl.classList.add('alert-low');
            alertEl.textContent = '✅ 良好な状態です。このペースを維持しましょう！';
        } else if (score < 60) {
            alertEl.classList.add('alert-medium');
            alertEl.textContent = '⚠️ やや疲労の兆候があります。適度な休憩を心がけましょう。';
        } else {
            alertEl.classList.add('alert-high');
            alertEl.textContent = '🚨 燃え尽きリスクが高まっています！休息を最優先にしてください。';
        }

        // 要因バー
        factorsEl.innerHTML = '';
        burnoutData.factors.forEach(factor => {
            const item = document.createElement('div');
            item.className = 'burnout-factor';
            item.innerHTML = `
        <span class="burnout-factor-label">${factor.label}</span>
        <div class="burnout-factor-bar">
          <div class="burnout-factor-fill" style="width:0%;background:${factor.color}"></div>
        </div>
      `;
            factorsEl.appendChild(item);

            // アニメーション
            setTimeout(() => {
                item.querySelector('.burnout-factor-fill').style.width = factor.value + '%';
            }, 500);
        });

        // カードのボーダーカラーをスコアに応じて変更
        if (score >= 60) {
            card.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        } else if (score >= 30) {
            card.style.borderColor = 'rgba(245, 158, 11, 0.2)';
        }
    }

    /**
     * エネルギートレンドの折れ線チャートを描画する
     * @param {Object} trendData - トレンドデータ
     */
    function renderEnergyTrend(trendData) {
        const ctx = document.getElementById('chart-energy-trend').getContext('2d');

        if (energyTrendChart) energyTrendChart.destroy();

        energyTrendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendData.labels,
                datasets: [
                    {
                        label: 'エネルギー',
                        data: trendData.energyValues,
                        borderColor: 'rgba(124, 58, 237, 1)',
                        backgroundColor: (context) => {
                            const chart = context.chart;
                            const { ctx: c, chartArea } = chart;
                            if (!chartArea) return 'rgba(124, 58, 237, 0.1)';
                            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                            gradient.addColorStop(0, 'rgba(124, 58, 237, 0.3)');
                            gradient.addColorStop(1, 'rgba(124, 58, 237, 0.0)');
                            return gradient;
                        },
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(124, 58, 237, 1)',
                        pointBorderColor: 'rgba(124, 58, 237, 1)',
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        yAxisID: 'y'
                    },
                    {
                        label: 'コミット数',
                        data: trendData.commitValues,
                        borderColor: 'rgba(59, 130, 246, 0.8)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: false,
                        tension: 0.4,
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointBackgroundColor: 'rgba(59, 130, 246, 0.8)',
                        pointBorderColor: 'rgba(59, 130, 246, 0.8)',
                        pointRadius: 2,
                        pointHoverRadius: 5,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        ticks: {
                            color: '#64748b',
                            font: { family: "'JetBrains Mono', monospace", size: 10 },
                            maxRotation: 0
                        }
                    },
                    y: {
                        position: 'left',
                        min: 0,
                        max: 100,
                        title: {
                            display: true,
                            text: 'エネルギー (%)',
                            color: '#64748b',
                            font: { family: "'Inter', sans-serif", size: 11 }
                        },
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        ticks: {
                            color: '#64748b',
                            font: { family: "'JetBrains Mono', monospace", size: 10 }
                        }
                    },
                    y1: {
                        position: 'right',
                        min: 0,
                        title: {
                            display: true,
                            text: 'コミット数',
                            color: '#64748b',
                            font: { family: "'Inter', sans-serif", size: 11 }
                        },
                        grid: { drawOnChartArea: false },
                        ticks: {
                            color: '#64748b',
                            font: { family: "'JetBrains Mono', monospace", size: 10 }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#94a3b8',
                            font: { family: "'Inter', sans-serif", size: 11 },
                            padding: 16,
                            usePointStyle: true,
                            pointStyleWidth: 8
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        titleColor: '#f1f5f9',
                        bodyColor: '#94a3b8',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12
                    }
                },
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    /**
     * 活動タイムラインを描画する
     * @param {Object[]} activities - アクティビティ配列
     */
    function renderTimeline(activities) {
        const container = document.getElementById('activity-timeline');
        container.innerHTML = '';

        activities.forEach((activity, i) => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.style.opacity = '0';
            item.style.transform = 'translateX(-10px)';

            item.innerHTML = `
        <span class="timeline-time">${activity.time}</span>
        <span class="timeline-dot" style="background:${activity.color}"></span>
        <span class="timeline-content">${activity.content}</span>
      `;
            container.appendChild(item);

            // スタガーアニメーション
            setTimeout(() => {
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100 + i * 60);
        });
    }

    /**
     * エネルギー管理セクション全体を初期化する
     * @param {boolean} isDemo - デモモードかどうか
     */
    function init(isDemo = true) {
        if (isDemo) {
            renderBurnoutGauge(MockData.getBurnoutData());
            renderEnergyTrend(MockData.getEnergyTrend());
            renderTimeline(MockData.getActivityTimeline());
        }
    }

    return { init, renderBurnoutGauge, renderEnergyTrend, renderTimeline };
})();
