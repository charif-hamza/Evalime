// src/components/Question.jsx
import styles from './Question.module.css';

function Question({ question, index, userAnswer, onSelect, showCorrection }) {
  if (!question) return null;

  const choices = Array.isArray(question.choices)
    ? question.choices.map((c, idx) => ({
        choice_id: c.choice_id || c.id || idx,
        identifier: c.identifier,
        text: c.text || c.choice_text,
        is_correct: c.is_correct !== undefined ? c.is_correct : c.is_correct_solution,
      }))
    : [];

  // userAnswer is now an array of selected choice_ids
  const isSelected = (choice_id) => Array.isArray(userAnswer) && userAnswer.includes(choice_id);

  return (
    <div className={`${styles.questionCard} fadeInUp`}>
      <div className={styles.questionHeader}>
        <span className={styles.questionNumber}>Question {index + 1}</span>
      </div>
      <p className={styles.questionText}>{question.question_text}</p>
      {question.question_image_url && (
        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
          <img
            src={question.question_image_url}
            alt="Question visual"
            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          />
        </div>
      )}
      <ul className={styles.choicesList}>
        {choices.map((choice) => {
          let choiceClass = styles.choice;
          if (showCorrection) {
            if (choice.is_correct) choiceClass += ` ${styles.correct}`;
            else if (isSelected(choice.choice_id)) choiceClass += ` ${styles.incorrect}`;
          } else if (isSelected(choice.choice_id)) {
            choiceClass += ` ${styles.selected}`;
          }
          return (
            <li
              key={choice.choice_id}
              className={choiceClass}
              onClick={() => !showCorrection && onSelect(question.question_id, choice.choice_id)}
              style={{ cursor: showCorrection ? 'default' : 'pointer' }}
            >
              <span className={styles.choiceIdentifier} style={{ marginRight: '1rem' }}>{choice.identifier}</span>
              <span className={styles.choiceText}>{choice.text}</span>
              {choice.image_url && (
                <img
                  src={choice.image_url}
                  alt={`Choice ${choice.identifier} visual`}
                  style={{
                    display: 'block',
                    maxWidth: '200px',
                    maxHeight: '120px',
                    marginTop: '0.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                  }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Question;