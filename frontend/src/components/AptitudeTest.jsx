import React, { useState, useEffect } from 'react';
import aptitudeData from '../data/aptitudeData.json';
import { useNavigate } from 'react-router-dom';
import './AptitudeTest.css';

const AptitudeTest = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeTest = () => {
      const quantitative = [...aptitudeData.quantitative].sort(() => 0.5 - Math.random()).slice(0, 15);
      const logical = [...aptitudeData.logical].sort(() => 0.5 - Math.random()).slice(0, 7);
      const verbal = [...aptitudeData.verbal].sort(() => 0.5 - Math.random()).slice(0, 8);
      const allQuestions = [...quantitative, ...logical, ...verbal].sort(() => 0.5 - Math.random());

      setQuestions(allQuestions);

      const initialAnswers = {};
      allQuestions.forEach(q => {
        initialAnswers[q.id] = null;
      });
      setAnswers(initialAnswers);
    };

    initializeTest();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 && !testSubmitted) {
      handleSubmit();
      return;
    }

    if (!testSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeLeft, testSubmitted]);

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    let attempted = 0;

    questions.forEach(question => {
      if (answers[question.id] !== null) {
        attempted++;
        if (answers[question.id] === question.answer) {
          correct++;
        }
      }
    });

    const percentage = (correct / questions.length) * 100;
    const timeTaken = 30 * 60 - timeLeft;
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    setResults({
      total: questions.length,
      attempted,
      notAttempted: questions.length - attempted,
      correct,
      wrong: attempted - correct,
      percentage: percentage.toFixed(2),
      timeTaken: `${minutes} minutes ${seconds} seconds`
    });

    setTestSubmitted(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return <div className="loading">Loading questions...</div>;
  }

  if (testSubmitted) {
    return (
      <div className="aptitude-results">
        <h2>Aptitude Test Results</h2>
        <div className="results-grid">
          <div className="result-item"><span className="result-label">Total Questions:</span><span className="result-value">{results.total}</span></div>
          <div className="result-item"><span className="result-label">Attempted:</span><span className="result-value">{results.attempted}</span></div>
          <div className="result-item"><span className="result-label">Not Attempted:</span><span className="result-value">{results.notAttempted}</span></div>
          <div className="result-item"><span className="result-label">Correct Answers:</span><span className="result-value correct">{results.correct}</span></div>
          <div className="result-item"><span className="result-label">Wrong Answers:</span><span className="result-value wrong">{results.wrong}</span></div>
          <div className="result-item"><span className="result-label">Percentage:</span><span className="result-value percentage">{results.percentage}%</span></div>
          <div className="result-item"><span className="result-label">Time Taken:</span><span className="result-value">{results.timeTaken}</span></div>
        </div>

        <h3>Wrong Answer Explanations</h3>
        <div className="explanations">
  {questions.map((q, index) => {
    const userAnswer = answers[q.id];
    if (userAnswer !== null && userAnswer !== q.answer) {
      return (
        <div key={q.id} className="explanation-item" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <p><strong>Q{index + 1}:</strong> {q.question}</p>
          <p><strong>Your Answer:</strong> {q.options[userAnswer]}</p>
          <p><strong>Correct Answer:</strong> {q.options[q.answer]}</p>
          <p><strong>Explanation:</strong> {q.explanation}</p>
        </div>
      );
    }
    return null;
  })}
</div>


            <div className="result-buttons" style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
  <button className="home-button" onClick={() => navigate('/home')}>Home</button>
  <button className="retry-button" onClick={() => navigate('/aptitude-intro')}>Take Test Again</button>
</div>
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionCategory = currentQuestion.id <= 15 ? 'Quantitative Aptitude' :
                          currentQuestion.id <= 22 ? 'Logical Reasoning' : 'Verbal Ability';

  return (
    <div className="aptitude-test">
      <div className="test-header">
        <h2>Aptitude Test</h2>
        <div className="timer">Time Left: {formatTime(timeLeft)}</div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
      </div>

      <div className="question-counter">
        Question {currentQuestionIndex + 1} of {questions.length}
        <span className="question-category">({questionCategory})</span>
      </div>

      <div className="question-container">
        <div className="question-text">{currentQuestion.question}</div>
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`option ${answers[currentQuestion.id] === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(currentQuestion.id, index)}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Previous</button>
        <button onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} disabled={currentQuestionIndex === questions.length - 1}>Skip</button>
        {currentQuestionIndex < questions.length - 1 ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <button onClick={handleSubmit} className="submit-button">Submit Test</button>
        )}
      </div>

      <div className="question-palette">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className={`palette-item ${currentQuestionIndex === index ? 'current' : ''} ${answers[q.id] !== null ? 'answered' : ''}`}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AptitudeTest;