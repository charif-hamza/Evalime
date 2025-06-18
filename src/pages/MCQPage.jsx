// src/pages/MCQPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchQuestionsByEvalId } from '../services/api';
import { fetchDashboardInsights } from '../services/dashboard';
import QuestionList from '../components/QuestionList';
import Button from '../components/Button';
import styles from './MCQPage.module.css';

export default function MCQPage() {
  const { evaluationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [userAnswers, setUserAnswers] = useState({});
  const [showCorrection, setShowCorrection] = useState(false);

  // Store performance data received when user clicks "Explain with AI"
  const [performanceData, setPerformanceData] = useState([]);

  const evaluation = location.state?.evaluation;
  const evaluationLabel = evaluation?.ouvrage || evaluation?.epreuve || `Evaluation ${evaluationId}`;

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

  const handleExplanation = (perf) => {
    // Avoid duplicates
    setPerformanceData(prev => {
      const exists = prev.find(p => p.question_id === perf.question_id);
      if (exists) return prev;
      return [...prev, { ...perf, topic: evaluationLabel }];
    });
  };

  const handleViewDashboard = async () => {
    try {
      const insights = await fetchDashboardInsights(performanceData.map(p => ({ ...p, topic: evaluationLabel })));
      const insightsWithLabel = { ...insights, evaluationLabel };
      localStorage.setItem('lastInsights', JSON.stringify(insightsWithLabel));
      navigate('/insights', { state: { insights: insightsWithLabel } });
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to fetch dashboard insights');
    }
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
          onExplain={handleExplanation}
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

      {/* Show dashboard button if at least one explanation has been requested */}
      {performanceData.length > 0 && (
        <Button onClick={handleViewDashboard} style={{ marginTop: '1rem' }}>
          View Dashboard
        </Button>
      )}
    </div>
  );
}