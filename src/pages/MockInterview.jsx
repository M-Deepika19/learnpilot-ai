import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MockInterview.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function MockInterview() {
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [topic, setTopic] = useState("");

  const [interviewId, setInterviewId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [scores, setScores] = useState([]);

  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  const currentQuestion =
    questions[currentQuestionIndex];

  const averageScore =
    scores.length > 0
      ? scores.reduce(
          (total, score) => total + Number(score || 0),
          0
        ) / scores.length
      : 0;

  const startInterview = async () => {
    if (!company.trim()) {
      setError("Please select a company.");
      return;
    }

    if (!role.trim()) {
      setError("Please enter your target role.");
      return;
    }

    if (!topic.trim()) {
      setError("Please enter an interview topic.");
      return;
    }

    setLoading(true);
    setError("");
    setFeedback(null);
    setCompleted(false);
    setQuestions([]);
    setScores([]);
    setCurrentQuestionIndex(0);
    setAnswer("");

    try {
      const response = await fetch(
        `${API_URL}/mock-interview/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            company: company.trim(),
            role: role.trim(),
            topic: topic.trim()
          })
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        throw new Error(
          text ||
            `Server returned HTTP ${response.status}`
        );
      }

      if (!response.ok || data.success !== true) {
        throw new Error(
          data.error ||
            data.message ||
            `Unable to start interview. HTTP ${response.status}`
        );
      }

      if (
        !Array.isArray(data.questions) ||
        data.questions.length !== 5
      ) {
        throw new Error(
          "AI must generate exactly 5 interview questions."
        );
      }

      const formattedQuestions = data.questions.map(
        (question, index) => ({
          id: Number(question.id || index + 1),
          question:
            question.question ||
            `Interview Question ${index + 1}`,
          category:
            question.category || topic.trim(),
          difficulty:
            question.difficulty || "Medium"
        })
      );

      setInterviewId(data.interviewId || "");
      setQuestions(formattedQuestions);
      setCurrentQuestionIndex(0);
      setAnswer("");
      setFeedback(null);
    } catch (err) {
      console.error(
        "Mock interview start error:",
        err
      );

      if (
        err instanceof TypeError &&
        err.message === "Failed to fetch"
      ) {
        setError(
          `Cannot connect to LearnPilot AI server at ${API_URL}. Make sure Flask is running on port 5000.`
        );
      } else {
        setError(
          err.message ||
            "Unable to start the mock interview."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError(
        "Please enter your answer before submitting."
      );
      return;
    }

    if (!interviewId) {
      setError(
        "Interview session is missing. Please start a new interview."
      );
      return;
    }

    if (!currentQuestion) {
      setError("Interview question not found.");
      return;
    }

    setEvaluating(true);
    setError("");
    setFeedback(null);

    try {
      const response = await fetch(
        `${API_URL}/mock-interview/submit-answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            interviewId,
            questionId: Number(
              currentQuestion.id
            ),
            answer: answer.trim()
          })
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        throw new Error(
          text ||
            `Server returned HTTP ${response.status}`
        );
      }

      if (!response.ok || data.success !== true) {
        throw new Error(
          data.error ||
            data.message ||
            `Answer evaluation failed with HTTP ${response.status}`
        );
      }

      const evaluation = {
        score: Number(data.score || 0),
        feedback: data.feedback || "",
        strengths: Array.isArray(data.strengths)
          ? data.strengths
          : [],
        improvements:
          typeof data.improvements === "string"
            ? data.improvements
            : ""
      };

      setFeedback(evaluation);

      setScores((previousScores) => {
        const updatedScores = [...previousScores];

        updatedScores[currentQuestionIndex] =
          evaluation.score;

        return updatedScores;
      });
    } catch (err) {
      console.error(
        "Mock interview answer error:",
        err
      );

      if (
        err instanceof TypeError &&
        err.message === "Failed to fetch"
      ) {
        setError(
          `Cannot connect to LearnPilot AI server at ${API_URL}. Make sure Flask is running on port 5000.`
        );
      } else {
        setError(
          err.message ||
            "Unable to evaluate your answer."
        );
      }
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!feedback) {
      setError(
        "Please submit your answer before continuing."
      );
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(
        (previousIndex) => previousIndex + 1
      );
      setAnswer("");
      setFeedback(null);
      setError("");
      return;
    }

    const finalScores = [...scores];

    if (
      typeof finalScores[currentQuestionIndex] !==
      "number"
    ) {
      finalScores[currentQuestionIndex] =
        Number(feedback.score || 0);
    }

    const validScores = finalScores.filter(
      (score) =>
        typeof score === "number" &&
        Number.isFinite(score)
    );

    if (validScores.length !== 5) {
      setError(
        "Please answer and submit all 5 interview questions."
      );
      return;
    }

    const finalAverage =
      validScores.reduce(
        (total, score) =>
          total + Number(score),
        0
      ) / validScores.length;

    setScores(finalScores);

    try {
      const response = await fetch(
        `${API_URL}/mock-interview/save-score`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            interviewId,
            score: Number(
              finalAverage.toFixed(2)
            )
          })
        }
      );

      const data = await response.json();

      if (!response.ok || data.success !== true) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to save interview score."
        );
      }

      setCompleted(true);
      setError("");
    } catch (err) {
      console.error(
        "Mock interview score error:",
        err
      );

      setError(
        err.message ||
          "Unable to save interview score."
      );
    }
  };

  const restartInterview = () => {
    setInterviewId("");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswer("");
    setFeedback(null);
    setScores([]);
    setCompleted(false);
    setError("");
  };

  const getScoreClass = (score) => {
    if (score >= 80) {
      return "excellent";
    }

    if (score >= 60) {
      return "good";
    }

    if (score >= 40) {
      return "average";
    }

    return "needs-work";
  };

  if (completed) {
    return (
      <div className="mock-interview-page">
        <header className="mock-interview-navbar">
          <div className="mock-brand">
            <div className="mock-brand-icon">
              LP
            </div>

            <div>
              <h2>LearnPilotAI</h2>
              <span>AI Mock Interview</span>
            </div>
          </div>

          <button
            type="button"
            className="mock-back-button"
            onClick={() => navigate("/home")}
          >
            ← Home
          </button>
        </header>

        <main className="mock-result-container">
          <section className="mock-result-card">
            <div className="result-icon">
              🎯
            </div>

            <p className="result-label">
              INTERVIEW COMPLETED
            </p>

            <h1>Great work!</h1>

            <p className="result-description">
              Your AI mock interview has been completed.
              Review your overall performance below.
            </p>

            <div
              className={`overall-score ${getScoreClass(
                averageScore
              )}`}
            >
              <strong>
                {Math.round(averageScore)}
              </strong>
              <span>/100</span>
            </div>

            <p className="overall-score-text">
              Overall Interview Score
            </p>

            <div className="score-breakdown">
              {scores.map((score, index) => (
                <div
                  className="score-item"
                  key={index}
                >
                  <span>
                    Question {index + 1}
                  </span>

                  <strong>
                    {Math.round(score || 0)}%
                  </strong>
                </div>
              ))}
            </div>

            <div className="result-actions">
              <button
                type="button"
                className="result-primary-button"
                onClick={restartInterview}
              >
                Start New Interview
              </button>

              <button
                type="button"
                className="result-secondary-button"
                onClick={() => navigate("/dashboard")}
              >
                View Dashboard
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mock-interview-page">
        <header className="mock-interview-navbar">
          <div className="mock-brand">
            <div className="mock-brand-icon">
              LP
            </div>

            <div>
              <h2>LearnPilotAI</h2>
              <span>AI Mock Interview</span>
            </div>
          </div>

          <button
            type="button"
            className="mock-back-button"
            onClick={() => navigate("/home")}
          >
            ← Home
          </button>
        </header>

        <main className="mock-setup-container">
          <section className="mock-setup-hero">
            <div className="setup-badge">
              <span>●</span>
              AI-POWERED INTERVIEW
            </div>

            <h1>
              Practice interviews.
              <br />
              Build confidence.
            </h1>

            <p>
              Prepare for real technical interviews with
              company-focused questions and AI-powered
              feedback on every answer.
            </p>
          </section>

          <section className="mock-setup-card">
            <div className="setup-card-header">
              <div className="setup-header-icon">
                🎤
              </div>

              <div>
                <h2>Configure Your Interview</h2>
                <p>
                  Choose your target company, role and
                  interview topic.
                </p>
              </div>
            </div>

            <div className="mock-form">
              <div className="mock-field">
                <label htmlFor="company">
                  Target Company
                </label>

                <select
                  id="company"
                  value={company}
                  onChange={(event) =>
                    setCompany(event.target.value)
                  }
                >
                  <option value="">
                    Select a company
                  </option>
                  <option value="Zoho">
                    Zoho
                  </option>
                  <option value="Accenture">
                    Accenture
                  </option>
                  <option value="Deloitte">
                    Deloitte
                  </option>
                  <option value="Mindtree">
                    Mindtree
                  </option>
                  <option value="HCL">
                    HCL
                  </option>
                  <option value="Infosys">
                    Infosys
                  </option>
                  <option value="TCS">
                    TCS
                  </option>
                </select>
              </div>

              <div className="mock-field">
                <label htmlFor="role">
                  Target Role
                </label>

                <input
                  id="role"
                  type="text"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value)
                  }
                  placeholder="Example: Java Developer"
                />
              </div>

              <div className="mock-field">
                <label htmlFor="topic">
                  Interview Topic
                </label>

                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(event) =>
                    setTopic(event.target.value)
                  }
                  placeholder="Example: Java, OOP, SQL, DSA"
                />
              </div>

              {error && (
                <div className="mock-error">
                  {error}
                </div>
              )}

              <button
                type="button"
                className="start-interview-button"
                onClick={startInterview}
                disabled={loading}
              >
                {loading
                  ? "Generating Interview..."
                  : "Start AI Mock Interview →"}
              </button>
            </div>

            <div className="interview-features">
              <div>
                <span>✓</span>
                <p>5 AI-generated questions</p>
              </div>

              <div>
                <span>✓</span>
                <p>Answer-by-answer evaluation</p>
              </div>

              <div>
                <span>✓</span>
                <p>Personalized feedback</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="mock-interview-page">
      <header className="mock-interview-navbar">
        <div className="mock-brand">
          <div className="mock-brand-icon">
            LP
          </div>

          <div>
            <h2>LearnPilotAI</h2>
            <span>AI Mock Interview</span>
          </div>
        </div>

        <div className="interview-nav-right">
          <div className="interview-company">
            {company}
          </div>

          <button
            type="button"
            className="mock-back-button"
            onClick={() => navigate("/home")}
          >
            Exit
          </button>
        </div>
      </header>

      <main className="mock-session-container">
        <div className="session-top">
          <div>
            <span className="session-label">
              MOCK INTERVIEW
            </span>

            <h1>{role}</h1>

            <p>
              {company} · {topic}
            </p>
          </div>

          <div className="session-progress">
            <span>
              Question {currentQuestionIndex + 1} of{" "}
              {questions.length}
            </span>

            <div className="session-progress-track">
              <div
                className="session-progress-fill"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) /
                      questions.length) *
                    100
                  }%`
                }}
              />
            </div>
          </div>
        </div>

        <section className="interview-question-card">
          <div className="question-meta">
            <span className="question-category">
              {currentQuestion.category}
            </span>

            <span
              className={`question-difficulty ${String(
                currentQuestion.difficulty
              ).toLowerCase()}`}
            >
              {currentQuestion.difficulty}
            </span>
          </div>

          <div className="question-number-large">
            {String(
              currentQuestionIndex + 1
            ).padStart(2, "0")}
          </div>

          <h2>
            {currentQuestion.question}
          </h2>

          <p className="answer-instruction">
            Take your time and answer as if you were
            speaking to a real interviewer.
          </p>

          <textarea
            value={answer}
            onChange={(event) =>
              setAnswer(event.target.value)
            }
            placeholder="Type your interview answer here..."
            disabled={evaluating || !!feedback}
          />

          {!feedback && (
            <button
              type="button"
              className="evaluate-answer-button"
              onClick={submitAnswer}
              disabled={evaluating}
            >
              {evaluating
                ? "AI is evaluating your answer..."
                : "Submit Answer for AI Evaluation"}
            </button>
          )}

          {error && (
            <div className="mock-error session-error">
              {error}
            </div>
          )}

          {feedback && (
            <div className="answer-feedback">
              <div className="feedback-score-row">
                <div>
                  <span className="feedback-label">
                    AI SCORE
                  </span>

                  <div
                    className={`feedback-score ${getScoreClass(
                      feedback.score
                    )}`}
                  >
                    {Math.round(
                      feedback.score
                    )}
                    <span>/100</span>
                  </div>
                </div>

                <div className="feedback-score-ring">
                  <div
                    className="feedback-ring-inner"
                    style={{
                      "--score":
                        `${feedback.score}%`
                    }}
                  >
                    {Math.round(
                      feedback.score
                    )}%
                  </div>
                </div>
              </div>

              <div className="feedback-section">
                <h3>AI Feedback</h3>

                <p>
                  {feedback.feedback ||
                    "No detailed feedback was returned."}
                </p>
              </div>

              {feedback.strengths.length >
                0 && (
                <div className="feedback-section">
                  <h3>Your Strengths</h3>

                  <div className="feedback-list strengths-list">
                    {feedback.strengths.map(
                      (strength, index) => (
                        <div
                          key={index}
                          className="feedback-list-item"
                        >
                          <span>✓</span>
                          <p>{strength}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {feedback.improvements && (
                <div className="feedback-section">
                  <h3>Areas to Improve</h3>

                  <div className="improvement-box">
                    <p>
                      {feedback.improvements}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="next-question-button"
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex ===
                questions.length - 1
                  ? "Finish Interview →"
                  : "Next Question →"}
              </button>
            </div>
          )}
        </section>

        <div className="session-footer">
          <div>
            <span>Interview Progress</span>

            <strong>
              {currentQuestionIndex + 1}/
              {questions.length}
            </strong>
          </div>

          <div>
            <span>Answered</span>

            <strong>
              {
                scores.filter(
                  (score) =>
                    typeof score === "number"
                ).length
              }
              /{questions.length}
            </strong>
          </div>

          <div>
            <span>Target Company</span>

            <strong>{company}</strong>
          </div>
        </div>
      </main>
    </div>
  );
}
export default MockInterview;