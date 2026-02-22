/**
 * 作業BGM分析モジュール
 * ジャンル別パイチャート、生産性相関バブルチャート、最近の再生リストを管理する
 */

const BgmAnalysis = (() => {
    let genreChart = null;
    let productivityChart = null;

    /**
     * ジャンル別リスニングのドーナツチャートを描画する
     * @param {Object} genreData - ジャンルデータ
     */
    function renderGenreChart(genreData) {
        const ctx = document.getElementById('chart-genre').getContext('2d');

        if (genreChart) genreChart.destroy();

        genreChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: genreData.labels,
                datasets: [{
                    data: genreData.values,
                    backgroundColor: genreData.colors,
                    borderColor: genreData.colors.map(c => c.replace('0.8', '1')),
                    borderWidth: 2,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '55%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#94a3b8',
                            font: { family: "'Inter', sans-serif", size: 11 },
                            padding: 12,
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
    }

    /**
     * ジャンル×生産性の相関バブルチャートを描画する
     * @param {Object[]} correlationData - 相関データ配列
     */
    function renderProductivityChart(correlationData) {
        const ctx = document.getElementById('chart-productivity').getContext('2d');

        if (productivityChart) productivityChart.destroy();

        const colors = [
            'rgba(124, 58, 237, 0.6)',
            'rgba(59, 130, 246, 0.6)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(245, 158, 11, 0.6)',
            'rgba(239, 68, 68, 0.6)',
            'rgba(168, 85, 247, 0.6)'
        ];

        productivityChart = new Chart(ctx, {
            type: 'bubble',
            data: {
                datasets: correlationData.map((item, i) => ({
                    label: item.genre,
                    data: [{ x: item.listeningHours, y: item.commits, r: item.radius }],
                    backgroundColor: colors[i],
                    borderColor: colors[i].replace('0.6', '1'),
                    borderWidth: 2,
                    hoverBackgroundColor: colors[i].replace('0.6', '0.8')
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'リスニング時間 (h)',
                            color: '#64748b',
                            font: { family: "'Inter', sans-serif", size: 11 }
                        },
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        ticks: {
                            color: '#64748b',
                            font: { family: "'JetBrains Mono', monospace", size: 10 }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'コミット数',
                            color: '#64748b',
                            font: { family: "'Inter', sans-serif", size: 11 }
                        },
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        ticks: {
                            color: '#64748b',
                            font: { family: "'JetBrains Mono', monospace", size: 10 }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#94a3b8',
                            font: { family: "'Inter', sans-serif", size: 10 },
                            padding: 10,
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
                        padding: 12,
                        callbacks: {
                            label: function (context) {
                                const d = context.raw;
                                return `${context.dataset.label}: ${d.y}コミット / ${d.x}h`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    /**
     * 最近再生した曲のリストを表示する
     * @param {Object[]} tracks - 曲データ配列
     */
    function renderTrackList(tracks) {
        const container = document.getElementById('track-list');
        container.innerHTML = '';

        tracks.forEach((track, i) => {
            const item = document.createElement('div');
            item.className = 'track-item';
            item.style.animationDelay = `${i * 0.05}s`;
            item.innerHTML = `
        <div class="track-art" style="background:${track.color}">
          ${track.emoji}
        </div>
        <div class="track-info">
          <div class="track-name">${track.name}</div>
          <div class="track-artist">${track.artist}</div>
        </div>
        <span class="track-genre-tag" style="background:${track.color};color:var(--color-text)">${track.genre}</span>
      `;
            container.appendChild(item);
        });
    }

    /**
     * BGM分析セクション全体を初期化する
     * @param {boolean} isDemo - デモモードかどうか
     */
    function init(isDemo = true) {
        if (isDemo) {
            renderGenreChart(MockData.getGenreData());
            renderProductivityChart(MockData.getProductivityCorrelation());
            renderTrackList(MockData.getRecentTracks());
        }
    }

    return { init, renderGenreChart, renderProductivityChart, renderTrackList };
})();
