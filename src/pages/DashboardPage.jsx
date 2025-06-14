// src/pages/DashboardPage.jsx
import { useState, useEffect, useMemo } from 'react';
import StatsPage from './StatsPage';
import { getUserIdFromToken } from '../utils';
import { useNavigate } from 'react-router-dom';
import { fetchEvaluationsList } from '../services/api';
import styles from './DashboardPage.module.css';

export default function DashboardPage({ user }) {
  const [evaluations, setEvaluations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');

  const userId = getUserIdFromToken(user?.token);

  // Filter evaluations by search term (matches ouvrage, the first line in the card)
  const filteredEvaluations = useMemo(() => {
    return evaluations.filter(ev => {
      const normalizedOuvrage = (ev.ouvrage || '').replace(/:+/g, '').trim();
      const searchMatch = !searchTerm || normalizedOuvrage.toLowerCase().includes(searchTerm.toLowerCase());
      return searchMatch;
    });
  }, [evaluations, searchTerm]);

  useEffect(() => {
    setIsLoading(true);
    fetchEvaluationsList()
      .then(data => {
        setEvaluations(data);
        setError(null);
      })
      .catch(err => {
        setError("Failed to load evaluation list. Please try again later.");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectEvaluation = (id) => {
    navigate(`/mcq/${id}`);
  };

  return (
    <div className={`${styles.dashboardContainer} fade-in`}>
      <header className={styles.dashboardHeader}>
        <h1>Find Your MCQ Bank</h1>
        <p>Select your year and department to find relevant materials.</p>
      </header>

      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label htmlFor="search-input">Input your module name</label>
          <input
            id="search-input"
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #ccc', fontSize: '1rem' }}
          />
        </div>
      </div>

      <div className={styles.evaluationGrid}>
        {isLoading && <p className={styles.statusMessage}>Loading evaluations...</p>}
        {error && <p className={`${styles.statusMessage} ${styles.error}`}>{error}</p>}
        {!isLoading && !error && filteredEvaluations.length > 0 && (
          filteredEvaluations.map(ev => (
            <div key={ev.id} className={styles.evaluationCard} onClick={() => handleSelectEvaluation(ev.id)}>
              <div className={styles.cardHeader}>
                 <h3>{(ev.ouvrage || '').replace(/:+/g, '').trim()}</h3>
                 {ev.epreuve && <span className={styles.cardBadge}>{(ev.epreuve || '').replace(/:+/g, '').trim()}</span>}
              </div>
              <p className={styles.cardDetails}>
                {ev.epreuve && <span>{(ev.epreuve || '').replace(/:+/g, '').trim()}</span>}
              </p>
              <div className={styles.cardFooter}>
                <span>{(ev.total_question || '').replace(/:+/g, '').trim()} Questions</span>
                <button>Start Practice &rarr;</button>
              </div>
            </div>
          ))
        )}
        {!isLoading && !error && filteredEvaluations.length === 0 && (
          <p className={styles.statusMessage}>No evaluations found for the selected filters.</p>
        )}
      </div>

      {userId && (
        <div style={{ marginTop: '3rem' }}>
          <h2>Your Analytics</h2>
          <StatsPage userId={userId} />
        </div>
      )}
    </div>
  );
}