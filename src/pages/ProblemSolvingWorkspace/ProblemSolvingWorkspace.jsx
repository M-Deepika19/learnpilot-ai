import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generatePracticeQuestions } from "../../services/problemSolvingService";
import "./ProblemSolvingWorkspace.css";
const topicMap = {
  aptitude: [
    { name: "Percentages", icon: "📊", description: "Percentage calculations and applications" },
    { name: "Profit and Loss", icon: "💰", description: "Business mathematics and calculations" },
    { name: "Time and Work", icon: "⏱️", description: "Work efficiency and time problems" },
    { name: "Time, Speed and Distance", icon: "🚗", description: "Speed, distance and travel problems" },
    { name: "Ratio and Proportion", icon: "⚖️", description: "Ratios, proportions and comparisons" },
    { name: "Simple Interest", icon: "🏦", description: "Interest and financial calculations" },
    { name: "Compound Interest", icon: "📈", description: "Growth and compound calculations" },
    { name: "Averages", icon: "🔢", description: "Average and mean calculations" },
    { name: "Probability", icon: "🎲", description: "Chance and probability questions" },
    { name: "Permutation and Combination", icon: "🧩", description: "Arrangement and selection problems" }
  ],
  mathematics: [
    { name: "Algebra", icon: "➗", description: "Expressions and algebraic reasoning" },
    { name: "Linear Equations", icon: "📐", description: "Solve linear mathematical equations" },
    { name: "Quadratic Equations", icon: "🔺", description: "Quadratic equations and roots" },
    { name: "Geometry", icon: "📏", description: "Shapes, angles and geometric problems" },
    { name: "Mensuration", icon: "📦", description: "Area, volume and measurement" },
    { name: "Number System", icon: "🔢", description: "Numbers and mathematical properties" },
    { name: "Statistics", icon: "📊", description: "Data analysis and statistical concepts" },
    { name: "Probability", icon: "🎲", description: "Probability and chance calculations" },
    { name: "Trigonometry", icon: "📐", description: "Angles and trigonometric concepts" },
    { name: "Sets", icon: "⭕", description: "Set theory and logical relationships" }
  ],
  reasoning: [
    { name: "Number Series", icon: "🔢", description: "Identify number patterns" },
    { name: "Coding-Decoding", icon: "🔐", description: "Logical coding patterns" },
    { name: "Blood Relations", icon: "👨‍👩‍👧", description: "Family relationship reasoning" },
    { name: "Directions", icon: "🧭", description: "Direction and distance reasoning" },
    { name: "Analogy", icon: "🔗", description: "Find logical relationships" },
    { name: "Odd One Out", icon: "🔍", description: "Identify the different item" },
    { name: "Syllogism", icon: "🧠", description: "Logical statement reasoning" },
    { name: "Logical Puzzles", icon: "🧩", description: "Solve structured logical puzzles" },
    { name: "Statement and Conclusion", icon: "💭", description: "Analyze statements logically" },
    { name: "Data Sufficiency", icon: "📋", description: "Determine sufficient information" }
  ],
  problemSolving: [
    { name: "Word Problems", icon: "📝", description: "Solve real-world mathematical problems" },
    { name: "Data Interpretation", icon: "📊", description: "Analyze tables and charts" },
    { name: "Puzzles", icon: "🧩", description: "Practice challenging puzzles" },
    { name: "Daily Life Problems", icon: "🏠", description: "Solve practical situations" },
    { name: "Decision Making", icon: "🎯", description: "Choose the best solution" },
    { name: "Critical Thinking", icon: "💡", description: "Analyze problems carefully" },
    { name: "Multi-Step Problems", icon: "🪜", description: "Solve problems step by step" },
    { name: "Pattern Problems", icon: "🔄", description: "Identify logical patterns" },
    { name: "Case-Based Problems", icon: "📚", description: "Analyze real-world cases" },
    { name: "Mixed Problem Solving", icon: "🚀", description: "Practice different problem types" }
  ]
};

const categoryList = [
  {
    key: "aptitude",
    label: "Aptitude",
    icon: "🎯",
    description: "Numerical and quantitative skills"
  },
  {
    key: "mathematics",
    label: "Mathematics",
    icon: "➗",
    description: "Mathematical concepts and equations"
  },
  {
    key: "reasoning",
    label: "Logical Reasoning",
    icon: "🧠",
    description: "Logic and analytical thinking"
  },
  {
    key: "problemSolving",
    label: "Problem Solving",
    icon: "💡",
    description: "Real-world problem-solving skills"
  }
];

const ProblemSolvingWorkspace = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("aptitude");
  const [topic, setTopic] = useState("Percentages");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [workingNotes, setWorkingNotes] = useState({});

  const topics = useMemo(() => {
    return topicMap[category] || [];
  }, [category]);

  const selectedTopic = useMemo(() => {
    return topics.find((item) => item.name === topic);
  }, [topics, topic]);

  const handleCategoryChange = (value) => {
    const firstTopic = topicMap[value][0];

    setCategory(value);
    setTopic(firstTopic.name);
    setQuestions([]);
    setAnswers({});
    setChecked({});
    setScore(0);
    setError("");
    setWorkingNotes({});
  };

  const handleGenerate = async () => {
    if (!category || !topic) {
      setError("Please select a category and topic.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setQuestions([]);
      setAnswers({});
      setChecked({});
      setScore(0);
      setWorkingNotes({});

      const data = await generatePracticeQuestions(category, topic);

      const generatedQuestions = Array.isArray(data)
        ? data
        : data.questions;

      if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error("No practice questions were generated.");
      }

      const formattedQuestions = generatedQuestions.map((question, index) => ({
        id: question.id || index + 1,
        question: question.question || question.text || "Question unavailable",
        options: Array.isArray(question.options) ? question.options : [],
        correctAnswer:
          question.correctAnswer !== undefined
            ? Number(question.correctAnswer)
            : -1,
        explanation: question.explanation || ""
      }));

      setQuestions(formattedQuestions);
    } catch (err) {
      setError(
        err.message || "Unable to generate practice questions."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionIndex, optionIndex) => {
    if (checked[questionIndex]) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [questionIndex]: optionIndex
    }));
  };

  const handleCheckAnswer = (questionIndex) => {
    if (
      answers[questionIndex] === undefined ||
      checked[questionIndex]
    ) {
      return;
    }

    const question = questions[questionIndex];

    if (
      answers[questionIndex] === question.correctAnswer
    ) {
      setScore((previous) => previous + 1);
    }

    setChecked((previous) => ({
      ...previous,
      [questionIndex]: true
    }));
  };

  const handleNewPractice = () => {
    setQuestions([]);
    setAnswers({});
    setChecked({});
    setScore(0);
    setError("");
    setWorkingNotes({});
  };

  return (
    <div className="problem-page">
      <header className="problem-navbar">
        <div className="problem-brand">
          <div className="problem-logo">LP</div>

          <div>
            <h2>LearnPilot</h2>
            <span>Problem Solving Workspace</span>
          </div>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/workspace")}
        >
          ← Back
        </button>
      </header>

      <main className="problem-container">
        <section className="problem-hero">
          <div className="problem-hero-content">
            <span className="hero-label">
              SMART PRACTICE
            </span>
            <h1>Practice Session</h1>

            <p>
              Select a learning category, choose your topic and
              practice questions with your own working space.
            </p>
          </div>

          <div className="hero-illustration">
            <span>🧠</span>
            <span>💡</span>
            <span>📚</span>
          </div>
        </section>

        <section className="category-section">
          <div className="section-heading">
            <div>
              <span>STEP 1</span>
              <h2>Choose Your Category</h2>
            </div>
          </div>

          <div className="category-grid">
            {categoryList.map((item) => (
              <button
                key={item.key}
                className={`category-card ${
                  category === item.key ? "active" : ""
                }`}
                onClick={() =>
                  handleCategoryChange(item.key)
                }
              >
                <div className="category-icon">
                  {item.icon}
                </div>

                <div className="category-content">
                  <h3>{item.label}</h3>
                  <p>{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="topic-section">
          <div className="section-heading">
            <div>
              <span>STEP 2</span>
              <h2>Choose Your Topic</h2>
            </div>
          </div>

          <div className="topic-layout">
            <div className="topic-list">
              {topics.map((item) => (
                <button
                  key={item.name}
                  className={`topic-card ${
                    topic === item.name ? "selected" : ""
                  }`}
                  onClick={() => setTopic(item.name)}
                >
                  <span className="topic-icon">
                    {item.icon}
                  </span>

                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                  </div>
                </button>
              ))}
            </div>

            <div className="topic-preview">
              <div className="preview-icon">
                {selectedTopic?.icon}
              </div>

              <span>SELECTED TOPIC</span>

              <h2>{selectedTopic?.name}</h2>

              <p>
                {selectedTopic?.description}
              </p>

              <button
                className="generate-button"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading
                  ? "Generating Questions..."
                  : "Generate Questions"}
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="problem-error">
            {error}
          </div>
        )}

        {questions.length > 0 && (
          <section className="questions-section">
            <div className="questions-header">
              <div>
                <span>{topic}</span>
                <h2>Practice Questions</h2>
                <p>
                  Solve each question and use the workspace for
                  your calculations.
                </p>
              </div>

              <div className="score-card">
                <span>Current Score</span>
                <strong>
                  {score} / {questions.length}
                </strong>
              </div>
            </div>

            <div className="questions-list">
              {questions.map((question, index) => {
                const selected = answers[index];
                const isChecked = checked[index];

                const isCorrect =
                  isChecked &&
                  selected === question.correctAnswer;

                return (
                  <article
                    className="question-card"
                    key={question.id}
                  >
                    <div className="question-top">
                      <span className="question-number">
                        QUESTION {index + 1}
                      </span>

                      {isChecked && (
                        <span
                          className={`status ${
                            isCorrect
                              ? "status-correct"
                              : "status-wrong"
                          }`}
                        >
                          {isCorrect
                            ? "Correct"
                            : "Incorrect"}
                        </span>
                      )}
                    </div>

                    <h3>{question.question}</h3>

                    <div className="question-workspace">
                      <div className="workspace-title">
                        <span>✍️</span>
                        <strong>My Working Space</strong>
                      </div>

                      <textarea
                        placeholder="Write your calculations, steps or ideas here..."
                        value={workingNotes[index] || ""}
                        onChange={(event) =>
                          setWorkingNotes((previous) => ({
                            ...previous,
                            [index]: event.target.value
                          }))
                        }
                      />
                    </div>

                    <div className="options-list">
                      {question.options.map(
                        (option, optionIndex) => {
                          const selectedOption =
                            selected === optionIndex;

                          const correctOption =
                            isChecked &&
                            optionIndex ===
                              question.correctAnswer;

                          const wrongOption =
                            isChecked &&
                            selectedOption &&
                            optionIndex !==
                              question.correctAnswer;

                          return (
                            <button
                              key={optionIndex}
                              className={`option-button ${
                                selectedOption
                                  ? "selected"
                                  : ""
                              } ${
                                correctOption
                                  ? "correct"
                                  : ""
                              } ${
                                wrongOption
                                  ? "wrong"
                                  : ""
                              }`}
                              onClick={() =>
                                handleSelectAnswer(
                                  index,
                                  optionIndex
                                )
                              }
                              disabled={isChecked}
                            >
                              <span className="option-letter">
                                {String.fromCharCode(
                                  65 + optionIndex
                                )}
                              </span>

                              <span>{option}</span>
                            </button>
                          );
                        }
                      )}
                    </div>

                    {!isChecked && (
                      <button
                        className="check-button"
                        onClick={() =>
                          handleCheckAnswer(index)
                        }
                        disabled={selected === undefined}
                      >
                        Check Answer
                      </button>
                    )}

                    {isChecked && (
                      <div
                        className={`answer-feedback ${
                          isCorrect
                            ? "feedback-correct"
                            : "feedback-wrong"
                        }`}
                      >
                        <strong>
                          {isCorrect
                            ? "✓ Great work!"
                            : "✕ Review your answer"}
                        </strong>

                        {!isCorrect && (
                          <p>
                            Correct answer:{" "}
                            {
                              question.options[
                                question.correctAnswer
                              ]
                            }
                          </p>
                        )}

                        {question.explanation && (
                          <p>
                            {question.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <div className="final-section">
              <div>
                <span>FINAL SCORE</span>
                <h2>
                  {score} / {questions.length}
                </h2>
              </div>

              <button
                className="new-practice-button"
                onClick={handleNewPractice}
              >
                Start New Practice
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProblemSolvingWorkspace;