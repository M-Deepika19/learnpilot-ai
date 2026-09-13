import React from "react";

export default function QuestionCard({
  question,
  index = 0,
  selectedAnswer,
  onSelect,
  showResult = false
}) {
  const questionText =
    typeof question === "string"
      ? question
      : question?.question || "";

  const options =
    Array.isArray(question?.options)
      ? question.options
      : [];

  const correctAnswer =
    question?.correctAnswer !== undefined
      ? Number(question.correctAnswer)
      : -1;

  const explanation =
    typeof question?.explanation === "string"
      ? question.explanation
      : "";

  const questionNumber = index + 1;

  const handleSelect = (optionIndex) => {
    if (showResult) {
      return;
    }

    if (onSelect) {
      onSelect(
        question?.id ?? index,
        optionIndex
      );
    }
  };

  const getOptionClass = (optionIndex) => {
    let className = "question-option";

    if (selectedAnswer === optionIndex) {
      className += " selected";
    }

    if (showResult) {
      if (
        optionIndex === correctAnswer
      ) {
        className += " correct";
      }

      if (
        selectedAnswer === optionIndex &&
        optionIndex !== correctAnswer
      ) {
        className += " wrong";
      }
    }

    return className;
  };

  return (
    <div className="question-card">
      <div className="question-card-header">
        <span className="question-number">
          Question {questionNumber}
        </span>
      </div>

      <h2 className="question-text">
        {questionText}
      </h2>

      <div className="question-options">
        {options.map(
          (option, optionIndex) => (
            <button
              key={`${option}-${optionIndex}`}
              type="button"
              className={getOptionClass(
                optionIndex
              )}
              onClick={() =>
                handleSelect(optionIndex)
              }
              disabled={showResult}
            >
              <span className="option-letter">
                {String.fromCharCode(
                  65 + optionIndex
                )}
              </span>

              <span className="option-text">
                {option}
              </span>

              {showResult &&
                optionIndex ===
                  correctAnswer && (
                  <span className="option-status">
                    ✓
                  </span>
                )}
            </button>
          )
        )}
      </div>

      {showResult && explanation && (
        <div className="question-explanation">
          <h3>Explanation</h3>

          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}