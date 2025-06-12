// src/components/QuestionList.jsx
import Question from './Question';
import styles from './QuestionList.module.css';

function QuestionList({ questions, isLoading, error, userAnswers, setUserAnswers, showCorrection }) {

  // Allow multiple answers per question
  const handleSelectAnswer = (questionId, choiceId) => {
    setUserAnswers(prev => {
      const prevAnswers = prev[questionId] || [];
      // Toggle selection
      const alreadySelected = prevAnswers.includes(choiceId);
      return {
        ...prev,
        [questionId]: alreadySelected
          ? prevAnswers.filter(id => id !== choiceId)
          : [...prevAnswers, choiceId]
      };
    });
  };

  if (isLoading) {
    return <div className={styles.statusMessage}>Loading questions...</div>;
  }
  if (error) {
    return <div className={`${styles.statusMessage} ${styles.error}`}>Error: {error}</div>;
  }
  if (questions === null) {
    // This state is now handled on the dashboard/MCQ page
    return null;
  }
  if (!Array.isArray(questions) || questions.length === 0) {
    return <div className={styles.statusMessage}>No questions found for this evaluation.</div>;
  }
  
  return (
    <div className={styles.listContainer}>
      {questions.map((q, index) => (
        <Question
          key={q.question_id || index}
          question={q}
          index={index}
          userAnswer={userAnswers[q.question_id] || []}
          onSelect={handleSelectAnswer}
          showCorrection={showCorrection}
        />
      ))}
    </div>
  );
}

export default QuestionList;