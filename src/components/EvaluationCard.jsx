import styles from './EvaluationCard.module.css';

export default function EvaluationCard({ evaluation, onSelect }) {
  const formatString = (str) => (str || '').replace(/:+/g, '').trim();

  return (
    <div className={styles.evaluationCard} onClick={() => onSelect(evaluation.id)}>
      <div className={styles.cardHeader}>
        <h3>{formatString(evaluation.ouvrage)}</h3>
        {evaluation.epreuve && <span className={styles.cardBadge}>{formatString(evaluation.epreuve)}</span>}
      </div>
      <p className={styles.cardDetails}>
        {evaluation.epreuve && <span>{formatString(evaluation.epreuve)}</span>}
      </p>
      <div className={styles.cardFooter}>
        <span>{formatString(evaluation.total_question)} Questions</span>
        <button>Start Practice &rarr;</button>
      </div>
    </div>
  );
} 