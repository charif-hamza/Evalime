// src/pages/MCQPage.jsx
import { useState, useEffect } from 'react';
import Toast from '../components/Toast';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuestionsByEvalId, submitAnswers } from '../services/api';
import { getUserIdFromToken } from '../utils';
import QuestionList from '../components/QuestionList';
import styles from './MCQPage.module.css';

export default function MCQPage({ user }) {
  const { evaluationId } = useParams();
  const navigate = useNavigate();
  const userId = getUserIdFromToken(user?.token);

  const [questions, setQuestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [userAnswers, setUserAnswers] = useState({});
  const [showCorrection, setShowCorrection] = useState(false);
  const [showToast, setShowToast] = useState(false);

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
    if (userId) {
      const answers = Object.entries(userAnswers).flatMap(([qId, choices]) =>
        (Array.isArray(choices) ? choices : []).map(choiceId => ({
          question_id: parseInt(qId, 10),
          choice_id: choiceId
        }))
      );
      if (answers.length > 0) {
        submitAnswers(userId, answers).catch(() => {});
      }
    }
    setShowCorrection(true);
    setShowToast(true);
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
        <button
          className={`${styles.checkAnswersBtn} btn-animate`}
          onClick={handleCheckAnswers}
        >
          Check All Answers
        </button>
      )}

      {showCorrection && (
        <div className={`${styles.correctionMessage} correction-animate`}>
          Correction displayed! Green = correct, Red = your wrong answer.
        </div>
      )}
      {showToast && (
        <Toast message="🍀 You just pushed your accuracy! View dashboard ▸" onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}