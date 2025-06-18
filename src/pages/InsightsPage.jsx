import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './DashboardPage.module.css'; // Re-use existing styling for simplicity

export default function InsightsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [insights, setInsights] = useState(() => state?.insights || null);

  useEffect(() => {
    if (!insights) {
      // Try to restore from localStorage
      const stored = localStorage.getItem('lastInsights');
      if (stored) {
        try {
          setInsights(JSON.parse(stored));
          return;
        } catch (_) {
          // ignore
        }
      }
      navigate('/dashboard');
    }
  }, [insights, navigate]);

  if (!insights) return null;

  const { total_questions, correct, incorrect, accuracy, topic_breakdown, strengths, blind_spots, evaluationLabel } = insights;

  return (
    <div className={`${styles.dashboardContainer} fade-in`}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>&larr; Back</button>
      <header className={styles.dashboardHeader}>
        <h1>Your Performance Insights</h1>
        <p>{evaluationLabel}</p>
      </header>

      <section className={styles.statsSection}>
        <div className={styles.statCard}>
          <h2>Total Questions</h2>
          <p>{total_questions}</p>
        </div>
        <div className={styles.statCard}>
          <h2>Correct</h2>
          <p>{correct}</p>
        </div>
        <div className={styles.statCard}>
          <h2>Incorrect</h2>
          <p>{incorrect}</p>
        </div>
        <div className={styles.statCard}>
          <h2>Accuracy</h2>
          <p>{Math.round(accuracy * 100)}%</p>
        </div>
      </section>

      <section className={styles.topicSection}>
        <h2>Topic Breakdown</h2>
        <div className={styles.topicGrid}>
          {topic_breakdown.map(tb => {
            const label = tb.topic && tb.topic !== 'Unknown' ? tb.topic : 'Misc';
            return (
              <div key={label} className={styles.topicCard}>
                <h3>{label}</h3>
                <p>{tb.correct}/{tb.total} correct</p>
                <div className={styles.progressBarWrapper}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${tb.accuracy * 100}%`, backgroundColor: tb.status === 'strength' ? '#22c55e' : tb.status === 'blind-spot' ? '#ef4444' : '#facc15' }}
                  />
                </div>
                <small>{Math.round(tb.accuracy * 100)}% accuracy</small>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.summarySection}>
        <h2>At a Glance</h2>
        <div className={styles.summaryLists}>
          <div>
            <h3>Strengths</h3>
            <ul>
              {strengths.length > 0 ? strengths.map(t => <li key={t}>✅ {t}</li>) : <li>No strong areas yet.</li>}
            </ul>
          </div>
          <div>
            <h3>Blind-spots</h3>
            <ul>
              {blind_spots.length > 0 ? blind_spots.map(t => <li key={t}>⚠️ {t}</li>) : <li>No blind-spots detected.</li>}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
} 