import { useState } from "react";
import QuestionCard from "../components/QuestionCard";
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const topics = {
  aptitude: [
    "Percentages",
    "Profit and Loss",
    "Time and Work",
    "Time and Distance",
    "Ratio and Proportion"
  ],
  mathematics: [
    "Algebra",
    "Probability",
    "Permutations",
    "Geometry",
    "Number System"
  ],
  reasoning: [
    "Logical Reasoning",
    "Coding Decoding",
    "Blood Relations",
    "Series",
    "Puzzles"
  ],
  problemSolving: [
    "Algorithms",
    "Data Structures",
    "Programming Logic",
    "Complexity",
    "Problem Analysis"
  ]
};

export default function Practice() {
  const [category, setCategory] =
    useState("aptitude");

  const [topic, setTopic] = useState(
    topics.aptitude[0]
  );

  const [questions, setQuestions] =
    useState([]);

  const [answers, setAnswers] =
    useState({});

  const [score, setScore] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const generateQuestions =
    async () => {
      if (!category || !topic) {
        setError(
          "Please select a category and topic."
        );
        return;
      }

      setLoading(true);
      setError("");
      setQuestions([]);
      setAnswers({});
      setScore(null);

      try {
        const response = await fetch(
          `${API_URL}/practice/generate`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              category,
              topic
            })
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data ||
          data.success !== true
        ) {
          throw new Error(
            data?.error ||
              data?.message ||
              "Unable to generate practice questions."
          );
        }

        if (
          !Array.isArray(
            data.questions
          ) ||
          data.questions.length !== 5
        ) {
          throw new Error(
            "The AI must generate exactly 5 practice questions."
          );
        }

        const formattedQuestions =
          data.questions.map(
            (question, index) => {
              if (
                !question ||
                typeof question !==
                  "object"
              ) {
                throw new Error(
                  `Question ${
                    index + 1
                  } has an invalid format.`
                );
              }

              const questionText =
                typeof question.question ===
                  "string"
                  ? question.question.trim()
                  : "";

              const options =
                Array.isArray(
                  question.options
                )
                  ? question.options.map(
                      (option) =>
                        String(
                          option
                        ).trim()
                    )
                  : [];

              const correctAnswer =
                Number(
                  question.correctAnswer
                );

              if (!questionText) {
                throw new Error(
                  `Question ${
                    index + 1
                  } is missing question text.`
                );
              }

              if (
                options.length !== 4 ||
                options.some(
                  (option) =>
                    !option
                )
              ) {
                throw new Error(
                  `Question ${
                    index + 1
                  } must contain exactly 4 valid options.`
                );
              }

              if (
                !Number.isInteger(
                  correctAnswer
                ) ||
                correctAnswer < 0 ||
                correctAnswer > 3
              ) {
                throw new Error(
                  `Question ${
                    index + 1
                  } has an invalid correct answer.`
                );
              }

              return {
                id:
                  question.id ||
                  index + 1,
                question:
                  questionText,
                options,
                correctAnswer,
                explanation:
                  typeof question.explanation ===
                    "string"
                    ? question.explanation.trim()
                    : ""
              };
            }
          );

        setQuestions(
          formattedQuestions
        );
      } catch (error) {
        console.error(
          "Practice generation error:",
          error
        );

        setError(
          error.message ||
            "Unable to generate practice questions."
        );
      } finally {
        setLoading(false);
      }
    };

  const selectCategory = (
    value
  ) => {
    setCategory(value);
    setTopic(
      topics[value][0]
    );
    setQuestions([]);
    setAnswers({});
    setScore(null);
    setError("");
  };

  const selectAnswer = (
    questionId,
    optionIndex
  ) => {
    if (score !== null) {
      return;
    }

    setAnswers(
      (previous) => ({
        ...previous,
        [questionId]:
          optionIndex
      })
    );
  };

  const submitPractice =
    async () => {
      if (
        questions.length === 0
      ) {
        return;
      }

      if (
        Object.keys(answers)
          .length !==
        questions.length
      ) {
        setError(
          "Please answer all questions before submitting."
        );
        return;
      }

      let correct = 0;

      questions.forEach(
        (question) => {
          const selected =
            Number(
              answers[question.id]
            );

          const expected =
            Number(
              question.correctAnswer
            );

          if (
            selected === expected
          ) {
            correct += 1;
          }
        }
      );

      const total =
        questions.length;

      const percentage =
        Math.round(
          (correct / total) * 100
        );

      const result = {
        correct,
        total,
        percentage
      };

      setScore(result);
      setError("");

      const dashboardData =
        JSON.parse(
          localStorage.getItem(
            "learnpilot_dashboard"
          )
        ) || {};

      dashboardData.practiceAverage =
        percentage;

      dashboardData.lastPracticeScore =
        percentage;

      localStorage.setItem(
        "learnpilot_dashboard",
        JSON.stringify(
          dashboardData
        )
      );

      try {
        await fetch(
          `${API_URL}/dashboard/save-practice-score`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              score: correct,
              total
            })
          }
        );
      } catch (error) {
        console.error(
          "Practice score save error:",
          error
        );
      }
    };

  const startAgain = () => {
    setQuestions([]);
    setAnswers({});
    setScore(null);
    setError("");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>
            Practice Center
          </h1>

          <p>
            Improve your aptitude,
            mathematics, reasoning
            and problem-solving skills.
          </p>
        </div>
      </div>

      {error && (
        <div className="practice-error">
          {error}
        </div>
      )}

      {questions.length === 0 &&
        score === null && (
          <div className="practice-start-card">
            <h2>
              Create Practice Questions
            </h2>

            <div className="form-grid">
              <div className="form-group">
                <label>
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    selectCategory(
                      event.target.value
                    )
                  }
                >
                  <option value="aptitude">
                    Aptitude
                  </option>

                  <option value="mathematics">
                    Mathematics
                  </option>

                  <option value="reasoning">
                    Reasoning
                  </option>

                  <option value="problemSolving">
                    Problem Solving
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Topic
                </label>

                <select
                  value={topic}
                  onChange={(event) =>
                    setTopic(
                      event.target.value
                    )
                  }
                >
                  {topics[
                    category
                  ].map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={
                generateQuestions
              }
              disabled={loading}
            >
              {loading
                ? "Generating..."
                : "Generate Questions"}
            </button>
          </div>
        )}

      {questions.length > 0 &&
        score === null && (
          <div className="questions-container">
            {questions.map(
              (question, index) => (
                <QuestionCard
                  key={
                    question.id ||
                    index
                  }
                  question={
                    question
                  }
                  index={index}
                  selectedAnswer={
                    answers[
                      question.id
                    ]
                  }
                  onSelect={
                    selectAnswer
                  }
                  showResult={false}
                />
              )
            )}

            <div className="practice-submit-area">
              <button
                type="button"
                className="primary-button submit-practice-button"
                onClick={
                  submitPractice
                }
              >
                Submit Practice
              </button>
            </div>
          </div>
        )}

      {score !== null && (
        <div className="score-card">
          <div className="score-icon">
            {score.percentage >= 80
              ? "🏆"
              : score.percentage >=
                50
              ? "👍"
              : "📚"}
          </div>

          <h2>
            Practice Completed
          </h2>

          <div className="score-number">
            {score.percentage}%
          </div>

          <p>
            You answered{" "}
            <strong>
              {score.correct}
            </strong>{" "}
            out of{" "}
            <strong>
              {score.total}
            </strong>{" "}
            questions correctly.
          </p>

          <div className="score-summary">
            <div>
              <strong>
                {score.correct}
              </strong>
              <span>
                Correct
              </span>
            </div>

            <div>
              <strong>
                {score.total -
                  score.correct}
              </strong>
              <span>
                Incorrect
              </span>
            </div>

            <div>
              <strong>
                {score.total}
              </strong>
              <span>
                Total
              </span>
            </div>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={
              startAgain
            }
          >
            Practice Again
          </button>
        </div>
      )}
    </div>
  );
}