// src/components/Question.jsx
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './Question.module.css';
import { getExplanation } from '../services/gemini';

function Question({ question, index, userAnswer, onSelect, showCorrection }) {
  const [explanation, setExplanation] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);

  async function handleExplainClick() {
    setShowExplanation(true);
    if (!explanation) {
      try {
        const selectedIds = Array.isArray(userAnswer) ? userAnswer : [];
        const selectedChoices = choices.filter(c => selectedIds.includes(c.choice_id)).map(c => c.identifier).join(', ') || 'Aucune';
        const correctChoices = choices.filter(c => c.is_correct).map(c => `${c.identifier}`).join(', ');
        const choixList = choices.map(c => `${c.identifier}. ${c.text}`).join('\n');

        const prompt = `Tu es un professeur de QCM. Explique (en français, de manière concise et pédagogique) pourquoi les réponses correctes à la question suivante sont justes et pourquoi les autres ne le sont pas.\n\nQuestion : ${question.question_text}\n\nChoix possibles :\n${choixList}\n\nRéponse(s) correcte(s) : ${correctChoices}.\nRéponse(s) choisie(s) par l'étudiant : ${selectedChoices}.\n\nFournis une explication claire et encourageante pour aider l'étudiant à comprendre.`;
        const aiExplanation = await getExplanation(prompt);
        setExplanation(aiExplanation);
      } catch (error) {
        console.error('Error getting explanation:', error);
        setExplanation('Sorry, I was unable to get an explanation.');
      }
    }
  }

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
    <div className={`${styles.questionCard}`} data-aos="fade-up">
      <div className={styles.questionHeader}>
        <span className={styles.questionNumber}>Question {index + 1}</span>
      </div>
      <p className={styles.questionText}>{question.question_text}</p>
      {question.question_image_url && (
        <div className={styles.questionImageContainer}>
          <img
            src={question.question_image_url}
            alt="Question visual"
            className={styles.questionImage}
          />
        </div>
      )}
      <ul className={styles.choicesList}>
        {choices.map((choice) => {
          let choiceClass = styles.choice;
          let icon = null;

          if (showCorrection) {
            if (choice.is_correct) {
              choiceClass += ` ${styles.correct}`;
              icon = '✓';
            } else if (isSelected(choice.choice_id)) {
              choiceClass += ` ${styles.incorrect}`;
              icon = '✗';
            }
          } else if (isSelected(choice.choice_id)) {
            choiceClass += ` ${styles.selected}`;
          }
          return (
            <li key={choice.choice_id}>
              <button
                className={choiceClass}
                onClick={() => !showCorrection && onSelect(question.question_id, choice.choice_id)}
                disabled={showCorrection}
              >
                <span className={styles.choiceIdentifier}>{choice.identifier}</span>
                <span className={styles.choiceText}>{choice.text}</span>
                {icon && <span className={styles.statusIcon}>{icon}</span>}
                {choice.image_url && (
                  <img
                    src={choice.image_url}
                    alt={`Choice ${choice.identifier} visual`}
                    className={styles.choiceImage}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <div className={styles.explanationSection}>
        <button onClick={handleExplainClick} className={styles.explainButton} disabled={showExplanation}>
          {showExplanation ? 'Explanation' : 'Explain with AI'}
        </button>
        {showExplanation && (
          <div className={styles.explanationContent}>
            <h4>Correction :</h4>
            <p>{choices.filter(c => c.is_correct).map(c => c.identifier).join(', ')}</p>
            <h4>AI Explanation:</h4>
            {explanation ? (
              <ReactMarkdown className="prose prose-slate dark:prose-invert max-w-none">
                {explanation}
              </ReactMarkdown>
            ) : (
              <p>Loading explanation...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Question;