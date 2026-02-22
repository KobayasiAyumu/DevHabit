/**
 * モックデータモジュール
 * デモモード用のリアルなサンプルデータを提供する
 */

const MockData = (() => {
  /**
   * コミットヒートマップデータを生成する
   * 7日（曜日） × 24時間 のマトリクス
   * @returns {number[][]} ヒートマップ用の2次元配列
   */
  function generateHeatmap() {
    const data = [];
    for (let day = 0; day < 7; day++) {
      const row = [];
      for (let hour = 0; hour < 24; hour++) {
        let base = 0;
        // 平日（月〜金）の業務時間はコミット多め
        if (day >= 1 && day <= 5) {
          if (hour >= 9 && hour <= 12) base = 3 + Math.floor(Math.random() * 5);
          else if (hour >= 13 && hour <= 18) base = 4 + Math.floor(Math.random() * 6);
          else if (hour >= 20 && hour <= 23) base = 1 + Math.floor(Math.random() * 3);
          else base = Math.floor(Math.random() * 2);
        } else {
          // 週末は午後に集中
          if (hour >= 13 && hour <= 17) base = 2 + Math.floor(Math.random() * 4);
          else if (hour >= 10 && hour <= 12) base = 1 + Math.floor(Math.random() * 2);
          else base = Math.floor(Math.random() * 1);
        }
        row.push(base);
      }
      data.push(row);
    }
    return data;
  }

  /**
   * コミットストリーク関連データ
   * @returns {Object} ストリーク情報
   */
  function getStreakData() {
    return {
      current: 12,    // 現在の連続コミット日数
      best: 34,       // 最長記録
      monthlyActive: 18, // 今月の活動日
      avgPerDay: 5.3  // 1日あたりの平均コミット数
    };
  }

  /**
   * 平日/週末のコミット比率
   * @returns {Object} 比率データ
   */
  function getWeekdayRatio() {
    return {
      weekday: 78,  // 平日コミット数
      weekend: 22   // 週末コミット数
    };
  }

  /**
   * サマリーカード用データ
   * @returns {Object} 各カードの数値
   */
  function getSummary() {
    return {
      streak: 12,
      weeklyCommits: 47,
      weeklyHours: 32,
      energyLevel: 73
    };
  }

  /**
   * BGMジャンル別データ
   * @returns {Object} ジャンル名と再生時間の配列
   */
  function getGenreData() {
    return {
      labels: ['Lo-fi Hip Hop', 'Ambient', 'Classical', 'Electronica', 'Jazz', 'Post-Rock'],
      values: [35, 22, 18, 12, 8, 5],
      colors: [
        'rgba(124, 58, 237, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(168, 85, 247, 0.8)'
      ]
    };
  }

  /**
   * ジャンル×生産性相関データ
   * @returns {Object} バブルチャート用データ
   */
  function getProductivityCorrelation() {
    return [
      { genre: 'Lo-fi Hip Hop', listeningHours: 8, commits: 18, radius: 14 },
      { genre: 'Ambient', listeningHours: 5, commits: 14, radius: 11 },
      { genre: 'Classical', listeningHours: 4, commits: 12, radius: 10 },
      { genre: 'Electronica', listeningHours: 3, commits: 8, radius: 8 },
      { genre: 'Jazz', listeningHours: 2, commits: 6, radius: 7 },
      { genre: 'Post-Rock', listeningHours: 1, commits: 3, radius: 5 }
    ];
  }

  /**
   * 最近再生した曲リスト
   * @returns {Object[]} 曲情報の配列
   */
  function getRecentTracks() {
    return [
      { name: 'Midnight Drive', artist: 'ChilledCow', genre: 'Lo-fi', emoji: '🌙', color: 'rgba(124, 58, 237, 0.3)' },
      { name: 'Deep Focus', artist: 'Brain.fm', genre: 'Ambient', emoji: '🧠', color: 'rgba(59, 130, 246, 0.3)' },
      { name: 'Clair de Lune', artist: 'Debussy', genre: 'Classical', emoji: '🎹', color: 'rgba(16, 185, 129, 0.3)' },
      { name: 'Neon Lights', artist: 'Synthwave FM', genre: 'Electronica', emoji: '💡', color: 'rgba(245, 158, 11, 0.3)' },
      { name: 'Blue in Green', artist: 'Miles Davis', genre: 'Jazz', emoji: '🎷', color: 'rgba(239, 68, 68, 0.3)' },
      { name: 'Rainy Café', artist: 'Lofi Girl', genre: 'Lo-fi', emoji: '☕', color: 'rgba(124, 58, 237, 0.3)' },
      { name: 'Weightless', artist: 'Marconi Union', genre: 'Ambient', emoji: '🌊', color: 'rgba(59, 130, 246, 0.3)' },
      { name: 'Requiem K.626', artist: 'Mozart', genre: 'Classical', emoji: '🎻', color: 'rgba(16, 185, 129, 0.3)' },
      { name: 'Sunset Rider', artist: 'HOME', genre: 'Electronica', emoji: '🌅', color: 'rgba(245, 158, 11, 0.3)' },
      { name: 'Take Five', artist: 'Dave Brubeck', genre: 'Jazz', emoji: '🎺', color: 'rgba(239, 68, 68, 0.3)' },
      { name: 'Dreamy Vibes', artist: 'Kupla', genre: 'Lo-fi', emoji: '✨', color: 'rgba(124, 58, 237, 0.3)' },
      { name: 'Northern Lights', artist: 'Ólafur Arnalds', genre: 'Ambient', emoji: '🌌', color: 'rgba(59, 130, 246, 0.3)' }
    ];
  }

  /**
   * バーンアウト（燃え尽き）予測データ
   * @returns {Object} バーンアウトスコアと要因
   */
  function getBurnoutData() {
    return {
      score: 35, // 0-100、高いほどリスクが高い
      factors: [
        { label: '深夜作業比率', value: 28, color: 'var(--color-sunset)' },
        { label: '週末稼働率', value: 40, color: 'var(--color-ocean)' },
        { label: '連続稼働日数', value: 55, color: 'var(--color-emerald)' },
        { label: '平均コミット変動', value: 20, color: 'var(--color-accent-light)' }
      ]
    };
  }

  /**
   * エネルギートレンド（過去14日分）
   * @returns {Object} 日別エネルギーとコミット数
   */
  function getEnergyTrend() {
    const labels = [];
    const energyValues = [];
    const commitValues = [];
    const today = new Date();

    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      labels.push(`${d.getMonth() + 1}/${d.getDate()}`);

      // エネルギーは60〜90の間でゆらぎ、最後の数日はやや下降
      let energy = 70 + Math.floor(Math.random() * 20);
      if (i <= 2) energy -= 10;
      energyValues.push(Math.min(100, Math.max(30, energy)));

      // コミット数は3〜12程度
      commitValues.push(3 + Math.floor(Math.random() * 10));
    }

    return { labels, energyValues, commitValues };
  }

  /**
   * 活動タイムラインデータ
   * @returns {Object[]} 時系列アクティビティ
   */
  function getActivityTimeline() {
    return [
      { time: '09:15', type: 'commit', content: 'feature/auth ブランチにログイン機能を追加', color: 'var(--color-accent-light)' },
      { time: '09:42', type: 'commit', content: 'バリデーションのテストケースを追加', color: 'var(--color-accent-light)' },
      { time: '10:30', type: 'music', content: 'Lo-fi Hip Hop プレイリスト開始', color: 'var(--color-ocean)' },
      { time: '11:05', type: 'commit', content: 'APIエンドポイントのリファクタリング', color: 'var(--color-accent-light)' },
      { time: '11:20', type: 'commit', content: 'エラーハンドリングの改善', color: 'var(--color-accent-light)' },
      { time: '12:00', type: 'break', content: '昼休憩', color: 'var(--color-emerald)' },
      { time: '13:15', type: 'music', content: 'Classical プレイリストに切替', color: 'var(--color-ocean)' },
      { time: '13:30', type: 'commit', content: 'データベーススキーマの更新', color: 'var(--color-accent-light)' },
      { time: '14:15', type: 'commit', content: 'マイグレーションスクリプト追加', color: 'var(--color-accent-light)' },
      { time: '15:00', type: 'review', content: 'PR #42 のコードレビュー完了', color: 'var(--color-sunset)' },
      { time: '16:30', type: 'commit', content: 'フロントエンドのUI調整', color: 'var(--color-accent-light)' },
      { time: '17:00', type: 'break', content: '中休憩（コーヒー☕）', color: 'var(--color-emerald)' },
      { time: '17:20', type: 'commit', content: 'CSSアニメーションの追加', color: 'var(--color-accent-light)' },
      { time: '18:00', type: 'end', content: '本日の作業終了', color: 'var(--color-text-muted)' }
    ];
  }

  /**
   * 週次レポート用データ
   * @returns {Object} レポート構成データ
   */
  function getWeeklyReportData() {
    return {
      period: '2026年2月16日 〜 2月22日',
      totalCommits: 47,
      totalHours: 32,
      streak: 12,
      topLanguages: [
        { name: 'TypeScript', percentage: 42 },
        { name: 'Python', percentage: 28 },
        { name: 'Go', percentage: 18 },
        { name: 'CSS', percentage: 12 }
      ],
      topRepos: [
        { name: 'my-saas-app', commits: 22 },
        { name: 'api-gateway', commits: 15 },
        { name: 'devhabit-dashboard', commits: 10 }
      ],
      peakHour: '14:00 〜 15:00',
      topGenre: 'Lo-fi Hip Hop',
      energyAvg: 73,
      achievements: [
        '🔥 12日連続コミット達成！',
        '📈 先週比 +15% のコミット数',
        '🎯 3つのPRをマージ'
      ],
      improvements: [
        '深夜作業が3回 → 休息を意識しましょう',
        '週末の稼働率が高め → オンオフの切替を'
      ]
    };
  }

  // 公開API
  return {
    generateHeatmap,
    getStreakData,
    getWeekdayRatio,
    getSummary,
    getGenreData,
    getProductivityCorrelation,
    getRecentTracks,
    getBurnoutData,
    getEnergyTrend,
    getActivityTimeline,
    getWeeklyReportData
  };
})();
