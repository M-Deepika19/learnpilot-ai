import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  generateQuiz,
  saveQuizResult
} from "../../services/quizService";

import "./QuizPage.css";

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    videoId,
    videoTitle,
    userId: stateUserId
  } = location.state || {};

  const userId =
    stateUserId ||
    localStorage.getItem("userId") ||
    null;

  const [screen, setScreen] = useState("intro");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [loading, setLoading] = useState(false);
  const [savingResult, setSavingResult] = useState(false);

  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    setScreen("intro");
    setQuestions([]);
    setAnswers({});
    setCurrentQuestion(0);
    setLoading(false);
    setSavingResult(false);
    setError("");
    setResult(null);
    setStartTime(null);
  }, [videoId]);

  const answeredCount = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);

  const progress = useMemo(() => {
    if (questions.length === 0) {
      return 0;
    }

    return Math.round(
      ((currentQuestion + 1) / questions.length) * 100
    );
  }, [currentQuestion, questions.length]);

  const selectedAnswer = answers[currentQuestion];

  const getPerformanceAnalysis = (percentage) => {
    if (percentage >= 90) {
      return {
        level: "Outstanding!",
        message:
          "You demonstrated excellent understanding of the topic.",
        recommendation:
          "You are ready to move on to more advanced concepts and practice."
      };
    }

    if (percentage >= 75) {
      return {
        level: "Very Good!",
        message:
          "You have a strong understanding of the topic.",
        recommendation:
          "Review the questions you missed and continue practicing."
      };
    }

    if (percentage >= 50) {
      return {
        level: "Good Effort!",
        message:
          "You understand the basics, but some concepts need more review.",
        recommendation:
          "Review your Smart Notes and retry the quiz to improve your score."
      };
    }

    return {
      level: "Keep Practicing!",
      message:
        "You need more practice with the concepts covered in this quiz.",
      recommendation:
        "Review the video and Smart Notes before attempting the quiz again."
    };
  };

  const handleBackToVideo = () => {
    navigate(-1);
  };

  const startQuiz = async () => {
    if (!videoId) {
      setError(
        "No video selected. Please go back and select a video."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("Generating Quiz...");
      console.log("Video ID:", videoId);
      console.log("Video Title:", videoTitle);

      const data = await generateQuiz(
        videoId,
        videoTitle
      );

      console.log("Quiz response:", data);

      if (!data || data.success === false) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Quiz generation service failed."
        );
      }

      const quizQuestions = Array.isArray(data)
        ? data
        : data?.questions;

      if (
        !Array.isArray(quizQuestions) ||
        quizQuestions.length !== 5
      ) {
        throw new Error(
          "The AI quiz must contain exactly 5 questions."
        );
      }

      const normalizedQuestions =
        quizQuestions.map((question, index) => {
          if (!question || typeof question !== "object") {
            throw new Error(
              `Question ${index + 1} has an invalid format.`
            );
          }

          if (
            typeof question.question !== "string" ||
            question.question.trim() === ""
          ) {
            throw new Error(
              `Question ${index + 1} is missing question text.`
            );
          }

          if (
            !Array.isArray(question.options) ||
            question.options.length !== 4
          ) {
            throw new Error(
              `Question ${index + 1} must contain exactly 4 options.`
            );
          }

          const options = question.options.map((option) =>
            String(option).trim()
          );

          if (options.some((option) => !option)) {
            throw new Error(
              `Question ${index + 1} contains an empty option.`
            );
          }

          const correctAnswer = Number(
            question.correctAnswer
          );

          if (
            !Number.isInteger(correctAnswer) ||
            correctAnswer < 0 ||
            correctAnswer > 3
          ) {
            throw new Error(
              `Question ${index + 1} has an invalid correct answer.`
            );
          }

          return {
            id: question.id || index + 1,
            question: question.question.trim(),
            options,
            correctAnswer,
            explanation:
              typeof question.explanation === "string"
                ? question.explanation.trim()
                : ""
          };
        });

      setQuestions(normalizedQuestions);
      setAnswers({});
      setCurrentQuestion(0);
      setResult(null);
      setStartTime(Date.now());
      setScreen("quiz");
    } catch (err) {
      console.error(
        "Quiz generation error:",
        err
      );

      setError(
        err.message ||
          "Unable to generate the quiz."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (optionIndex) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion]: optionIndex
    }));
  };

  const goPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );
    }
  };

  const goNext = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );
    }
  };

  const goToQuestion = (questionIndex) => {
    setCurrentQuestion(questionIndex);
  };

  const openReview = () => {
    if (
      Object.keys(answers).length !==
      questions.length
    ) {
      setError(
        "Please answer all five questions before reviewing."
      );
      return;
    }

    setError("");
    setScreen("review");
  };

  const calculateResult = async () => {
    if (questions.length === 0) {
      return;
    }

    let score = 0;

    questions.forEach((question, index) => {
      const selected = answers[index];

      if (
        selected !== undefined &&
        Number(selected) ===
          Number(question.correctAnswer)
      ) {
        score += 1;
      }
    });

    const totalQuestions =
      questions.length;

    const percentage =
      totalQuestions > 0
        ? Math.round(
            (score / totalQuestions) * 100
          )
        : 0;

    const wrongAnswers =
      totalQuestions - score;

    const elapsedSeconds = startTime
      ? Math.max(
          0,
          Math.floor(
            (Date.now() - startTime) / 1000
          )
        )
      : 0;

    const minutes = Math.floor(
      elapsedSeconds / 60
    );

    const seconds =
      elapsedSeconds % 60;

    const timeTaken =
      `${minutes}m ${String(seconds).padStart(
        2,
        "0"
      )}s`;

    const analysis =
      getPerformanceAnalysis(
        percentage
      );

    const resultData = {
      score,
      totalQuestions,
      percentage,
      correctAnswers: score,
      wrongAnswers,
      timeTaken,
      analysisLevel: analysis.level,
      analysisMessage: analysis.message,
      recommendation: analysis.recommendation
    };

    setResult(resultData);
    setScreen("result");

    try {
      setSavingResult(true);

      if (!userId) {
        throw new Error(
          "User session not found. Please log in again."
        );
      }

      await saveQuizResult({
        userId: Number(userId),
        videoId,
        videoTitle,
        score,
        totalQuestions
      });

      console.log(
        "Quiz result saved successfully."
      );
    } catch (err) {
      console.error(
        "Quiz result save error:",
        err
      );

      setError(
        err.message ||
          "Quiz completed, but the result could not be saved."
      );
    } finally {
      setSavingResult(false);
    }
  };

  const tryAgain = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
    setError("");
    setStartTime(Date.now());
    setScreen("quiz");
  };

  const reviewAnswers = () => {
    setError("");
    setScreen("answers");
  };

  if (!videoId) {
    return (
      <div className="quiz-page">
        <div className="quiz-empty">
          <div className="quiz-empty-icon">
            🧠
          </div>

          <h2>No Video Selected</h2>

          <p>
            Please return to the video page
            and select a video first.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={handleBackToVideo}
          >
            ← Back to Video
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-page-topbar">
        <button
          type="button"
          className="back-button"
          onClick={handleBackToVideo}
        >
          ← Back to Video
        </button>

        <span className="quiz-brand">
          LearnPilot
        </span>
      </div>

      {error && (
        <div className="quiz-error">
          ❌ {error}
        </div>
      )}

      {screen === "intro" && (
        <div className="quiz-intro-card">
          <div className="quiz-intro-icon">
            🧠
          </div>

          <span className="quiz-label">
            VIDEO ASSESSMENT
          </span>

          <h1>Test Your Understanding</h1>

          <p className="quiz-video-title">
            {videoTitle || "Selected Video"}
          </p>

          <div className="quiz-info-grid">
            <div className="quiz-info-item">
              <span>📝</span>
              <strong>5 Questions</strong>
              <small>Multiple Choice</small>
            </div>

            <div className="quiz-info-item">
              <span>🤖</span>
              <strong>AI Generated</strong>
              <small>Based on Video</small>
            </div>

            <div className="quiz-info-item">
              <span>📊</span>
              <strong>Instant Score</strong>
              <small>After Submission</small>
            </div>
          </div>

          <div className="quiz-rules">
            <h3>Before You Begin</h3>

            <div className="quiz-rule">
              <span>✓</span>
              <p>
                Answer all five questions carefully.
              </p>
            </div>

            <div className="quiz-rule">
              <span>✓</span>
              <p>
                Questions are generated for this selected video.
              </p>
            </div>

            <div className="quiz-rule">
              <span>✓</span>
              <p>
                You can review your answers before final submission.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="start-quiz-button"
            onClick={startQuiz}
            disabled={loading}
          >
            {loading
              ? "Generating Quiz..."
              : "Start Quiz"}
          </button>
        </div>
      )}

      {screen === "quiz" &&
        questions.length > 0 && (
          <div className="quiz-layout">
            <div className="quiz-main-card">
              <div className="quiz-question-header">
                <div>
                  <span className="question-label">
                    QUESTION
                  </span>

                  <h2>
                    {currentQuestion + 1}
                    <span>
                      {" / "}
                      {questions.length}
                    </span>
                  </h2>
                </div>

                <div className="quiz-progress-text">
                  {answeredCount} of{" "}
                  {questions.length} answered
                </div>
              </div>

              <div className="quiz-progress-track">
                <div
                  className="quiz-progress-fill"
                  style={{
                    width: `${progress}%`
                  }}
                />
              </div>

              <div className="question-content">
                <h1>
                  {questions[currentQuestion].question}
                </h1>

                <div className="options-list">
                  {questions[
                    currentQuestion
                  ].options.map(
                    (option, index) => {
                      const isSelected =
                        selectedAnswer === index;

                      return (
                        <button
                          type="button"
                          key={index}
                          className={`quiz-option ${
                            isSelected
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            selectAnswer(index)
                          }
                        >
                          <span className="option-letter">
                            {String.fromCharCode(
                              65 + index
                            )}
                          </span>

                          <span className="option-text">
                            {option}
                          </span>

                          <span className="option-radio">
                            {isSelected ? "✓" : ""}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="quiz-navigation">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={goPrevious}
                  disabled={
                    currentQuestion === 0
                  }
                >
                  ← Previous
                </button>

                {currentQuestion ===
                questions.length - 1 ? (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={openReview}
                  >
                    Review Answers →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={goNext}
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>

            <aside className="quiz-sidebar">
              <div className="sidebar-card">
                <h3>Questions</h3>

                <div className="question-grid">
                  {questions.map(
                    (_, index) => {
                      const answered =
                        answers[index] !==
                        undefined;

                      const active =
                        currentQuestion ===
                        index;

                      return (
                        <button
                          type="button"
                          key={index}
                          className={`question-number ${
                            active
                              ? "active"
                              : ""
                          } ${
                            answered
                              ? "answered"
                              : ""
                          }`}
                          onClick={() =>
                            goToQuestion(index)
                          }
                        >
                          {index + 1}
                        </button>
                      );
                    }
                  )}
                </div>

                <div className="sidebar-legend">
                  <span>
                    <i className="legend-active"></i>
                    Current
                  </span>

                  <span>
                    <i className="legend-answered"></i>
                    Answered
                  </span>
                </div>
              </div>

              <div className="sidebar-tip">
                <span>💡</span>

                <div>
                  <strong>Quick Tip</strong>

                  <p>
                    Read each option carefully before choosing.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}

      {screen === "review" && (
        <div className="review-card">
          <div className="review-header">
            <span className="quiz-label">
              FINAL REVIEW
            </span>

            <h1>Review Your Answers</h1>

            <p>
              Check your responses before submitting.
            </p>
          </div>

          <div className="review-summary">
            <div>
              <strong>{answeredCount}</strong>
              <span>Answered</span>
            </div>

            <div>
              <strong>
                {questions.length -
                  answeredCount}
              </strong>
              <span>Unanswered</span>
            </div>

            <div>
              <strong>{questions.length}</strong>
              <span>Total</span>
            </div>
          </div>

          <div className="review-list">
            {questions.map(
              (question, index) => {
                const answered =
                  answers[index] !== undefined;

                return (
                  <button
                    type="button"
                    key={
                      question.id || index
                    }
                    className="review-item"
                    onClick={() => {
                      setCurrentQuestion(
                        index
                      );
                      setScreen("quiz");
                    }}
                  >
                    <span
                      className={`review-number ${
                        answered
                          ? "review-answered"
                          : "review-unanswered"
                      }`}
                    >
                      {index + 1}
                    </span>

                    <span className="review-question">
                      {question.question}
                    </span>

                    <span className="review-status">
                      {answered
                        ? "✓ Answered"
                        : "○ Not Answered"}
                    </span>

                    <span>→</span>
                  </button>
                );
              }
            )}
          </div>

          <div className="review-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                setScreen("quiz")
              }
            >
              ← Back to Quiz
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={calculateResult}
            >
              Submit Quiz
            </button>
          </div>
        </div>
      )}

      {screen === "result" && result && (
        <div className="result-card">
          <div className="result-icon">
            {result.percentage >= 90
              ? "🏆"
              : result.percentage >= 75
              ? "🎉"
              : result.percentage >= 50
              ? "👍"
              : "📚"}
          </div>

          <span className="quiz-label">
            QUIZ COMPLETE
          </span>

          <h1>{result.analysisLevel}</h1>

          <p>
            Your final performance summary
          </p>

          <div className="score-circle">
            <strong>
              {result.percentage}%
            </strong>

            <span>
              {result.score} /{" "}
              {result.totalQuestions}
            </span>
          </div>

          <div className="result-stats">
            <div className="result-stat">
              <span>✅</span>
              <strong>
                {result.correctAnswers}
              </strong>
              <small>Correct</small>
            </div>

            <div className="result-stat">
              <span>❌</span>
              <strong>
                {result.wrongAnswers}
              </strong>
              <small>Incorrect</small>
            </div>

            <div className="result-stat">
              <span>⏱️</span>
              <strong>
                {result.timeTaken}
              </strong>
              <small>Time</small>
            </div>
          </div>

          <div className="score-analysis">
            <div className="score-analysis-header">
              <span className="quiz-label">
                SCORE ANALYSIS
              </span>

              <h2>
                {result.analysisLevel}
              </h2>

              <p>
                {result.analysisMessage}
              </p>
            </div>

            <div className="score-analysis-details">
              <div className="analysis-item">
                <span className="analysis-icon">
                  🎯
                </span>

                <div>
                  <strong>Accuracy</strong>
                  <p>{result.percentage}%</p>
                </div>
              </div>

              <div className="analysis-item">
                <span className="analysis-icon">
                  ✅
                </span>

                <div>
                  <strong>Correct</strong>
                  <p>
                    {result.correctAnswers}
                  </p>
                </div>
              </div>

              <div className="analysis-item">
                <span className="analysis-icon">
                  ❌
                </span>

                <div>
                  <strong>Incorrect</strong>
                  <p>
                    {result.wrongAnswers}
                  </p>
                </div>
              </div>
            </div>

            <div className="recommendation-box">
              <span className="recommendation-icon">
                💡
              </span>

              <div>
                <strong>
                  Recommended Next Step
                </strong>

                <p>
                  {result.recommendation}
                </p>
              </div>
            </div>
          </div>

          <div className="result-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={reviewAnswers}
            >
              Review Answers
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={tryAgain}
            >
              Try Again
            </button>
          </div>

          {savingResult && (
            <p className="saving-result">
              Saving quiz result...
            </p>
          )}
        </div>
      )}

      {screen === "answers" && result && (
        <div className="answers-page">
          <div className="answers-header">
            <span className="quiz-label">
              ANSWER REVIEW
            </span>

            <h1>Review Your Answers</h1>

            <p>
              See which answers were correct and understand the explanations.
            </p>
          </div>

          <div className="answers-list">
            {questions.map(
              (question, index) => {
                const selected =
                  answers[index];

                const correct = Number(
                  question.correctAnswer
                );

                const isCorrect =
                  selected !== undefined &&
                  Number(selected) === correct;

                return (
                  <div
                    key={
                      question.id || index
                    }
                    className={`answer-review-card ${
                      isCorrect
                        ? "answer-correct"
                        : "answer-wrong"
                    }`}
                  >
                    <div className="answer-review-top">
                      <span>
                        Question {index + 1}
                      </span>

                      <strong>
                        {isCorrect
                          ? "✓ Correct"
                          : "✕ Incorrect"}
                      </strong>
                    </div>

                    <h3>
                      {question.question}
                    </h3>

                    <div className="answer-comparison">
                      <div className="your-answer">
                        <span>
                          Your Answer
                        </span>

                        <p>
                          {selected !==
                          undefined
                            ? question.options[
                                selected
                              ]
                            : "Not Answered"}
                        </p>
                      </div>

                      <div className="correct-answer">
                        <span>
                          Correct Answer
                        </span>

                        <p>
                          {question.options[
                            correct
                          ]}
                        </p>
                      </div>
                    </div>

                    {question.explanation && (
                      <div className="answer-explanation">
                        <strong>
                          💡 Explanation
                        </strong>

                        <p>
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>

          <div className="answers-footer">
            <button
              type="button"
              className="primary-button"
              onClick={() =>
                setScreen("result")
              }
            >
              ← Back to Result
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;