// src/pages/MCQPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuestionsByEvalId } from '../services/api';
import QuestionList from '../components/QuestionList';
import Button from '../components/Button';
import styles from './MCQPage.module.css';

export default function MCQPage() {
  const { evaluationId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [userAnswers, setUserAnswers] = useState({});
  const [showCorrection, setShowCorrection] = useState(false);

  useEffect(() => {
    if (!evaluationId) return;
    setIsLoading(true);
    setError(null);
    setQuestions(null);
    setUserAnswers({});
    setShowCorrection(false);

    fetchQuestionsByEvalId(evaluationId)
      .then(data => {
        setQuestions(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        setError(err.message);
        setQuestions([]);
      })
      .finally(() => setIsLoading(false));
  }, [evaluationId]);

  const handleCheckAnswers = () => {
    setShowCorrection(true);
  };

  return (
    <div className={`${styles.mcqContainer} fade-in`}>
      <button onClick={() => navigate('/dashboard')} className={styles.backButton}>
        &larr; Back to Dashboard
      </button>

      <div className={`question-list-animate${questions ? ' show' : ''}`}>
        <QuestionList
          questions={questions}
          isLoading={isLoading}
          error={error}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          showCorrection={showCorrection}
        />
      </div>

      {questions && Array.isArray(questions) && questions.length > 0 && !showCorrection && (
        <Button
          onClick={handleCheckAnswers}
        >
          Check All Answers
        </Button>
      )}

      {showCorrection && (
        <div className={`${styles.correctionMessage} correction-animate`}>
          Correction displayed! Green = correct, Red = your wrong answer.
        </div>
      )}
    </div>
  );
}