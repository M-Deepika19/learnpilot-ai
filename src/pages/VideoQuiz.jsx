import { useEffect, useState } from "react";
import QuestionCard from "../components/QuestionCard";
import "./VideoQuiz.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export default function VideoQuiz() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      const savedVideo = JSON.parse(
        localStorage.getItem("learnpilot_video") ||
          "null"
      );

      if (savedVideo) {
        setVideoUrl(
          savedVideo.videoUrl ||
            savedVideo.videoId ||
            ""
        );

        setVideoTitle(
          savedVideo.videoTitle ||
            ""
        );
      }
    } catch (error) {
      console.error(
        "Unable to load saved video:",
        error
      );
    }
  }, []);

  const getSavedVideo = () => {
    try {
      return JSON.parse(
        localStorage.getItem(
          "learnpilot_video"
        ) || "null"
      );
    } catch (error) {
      console.error(
        "Unable to read saved video:",
        error
      );
      return null;
    }
  };

  const getVideoId = (value) => {
    const url = String(value || "").trim();

    if (!url) {
      return null;
    }

    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\s]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?\s&]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?\s&]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?\s&]+)/i
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);

      if (match) {
        return match[1];
      }
    }

    if (
      /^[A-Za-z0-9_-]{11}$/.test(
        url
      )
    ) {
      return url;
    }

    return null;
  };

  const generateQuiz = async () => {
    const savedVideo = getSavedVideo();

    const videoId =
      getVideoId(videoUrl) ||
      savedVideo?.videoId ||
      null;

    const finalVideoTitle =
      videoTitle.trim() ||
      savedVideo?.videoTitle ||
      "Educational Video";

    if (!videoId) {
      setErrorMessage(
        "Please select a video or enter a valid YouTube video URL."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setQuestions([]);
    setAnswers({});
    setResult(null);

    try {
      const response = await fetch(
        `${API_URL}/video-quiz/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json"
          },
          body: JSON.stringify({
            videoId,
            videoTitle:
              finalVideoTitle
          })
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      let data;

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        data =
          await response.json();
      } else {
        const text =
          await response.text();

        throw new Error(
          text ||
            `Server returned HTTP ${response.status}`
        );
      }

      console.log(
        "Video Quiz response:",
        data
      );

      if (
        !response.ok ||
        data?.success !== true
      ) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Unable to generate quiz. Server returned HTTP ${response.status}.`
        );
      }

      if (
        !Array.isArray(
          data.questions
        ) ||
        data.questions.length !== 5
      ) {
        throw new Error(
          "The AI quiz must contain exactly 5 questions."
        );
      }

      const formattedQuestions =
        data.questions.map(
          (question, index) => {
            const questionText =
              typeof question?.question ===
              "string"
                ? question.question.trim()
                : "";

            const options =
              Array.isArray(
                question?.options
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
                question?.correctAnswer
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
                question?.id ||
                index + 1,
              question:
                questionText,
              options,
              correctAnswer,
              explanation:
                typeof question?.explanation ===
                "string"
                  ? question.explanation.trim()
                  : ""
            };
          }
        );

      setVideoUrl(
        savedVideo?.videoUrl ||
          `https://www.youtube.com/watch?v=${videoId}`
      );

      setVideoTitle(
        finalVideoTitle
      );

      localStorage.setItem(
        "learnpilot_video",
        JSON.stringify({
          videoId,
          videoUrl:
            savedVideo?.videoUrl ||
            `https://www.youtube.com/watch?v=${videoId}`,
          videoTitle:
            finalVideoTitle
        })
      );

      setQuestions(
        formattedQuestions
      );
    } catch (error) {
      console.error(
        "Video quiz error:",
        error
      );

      if (
        error instanceof TypeError &&
        error.message ===
          "Failed to fetch"
      ) {
        setErrorMessage(
          `Cannot connect to LearnPilot AI server at ${API_URL}. Make sure Flask is running on port 5000.`
        );
      } else {
        setErrorMessage(
          error.message ||
            "Unable to generate video quiz."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (
    questionId,
    optionIndex
  ) => {
    if (result !== null) {
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

  const submitQuiz = async () => {
    if (
      Object.keys(answers)
        .length !==
      questions.length
    ) {
      setErrorMessage(
        "Please answer all questions before submitting."
      );
      return;
    }

    let correct = 0;

    questions.forEach(
      (question) => {
        if (
          Number(
            answers[question.id]
          ) ===
          Number(
            question.correctAnswer
          )
        ) {
          correct += 1;
        }
      }
    );

    const total =
      questions.length;

    const percentage =
      Math.round(
        (correct / total) *
          100
      );

    setResult({
      correct,
      percentage
    });

    setErrorMessage("");

    localStorage.setItem(
      "quizScore",
      `${percentage}%`
    );

    const dashboardData =
      JSON.parse(
        localStorage.getItem(
          "learnpilot_dashboard"
        ) || "{}"
      );

    dashboardData.quizAverage =
      percentage;

    dashboardData.lastQuizScore =
      percentage;

    localStorage.setItem(
      "learnpilot_dashboard",
      JSON.stringify(
        dashboardData
      )
    );

    try {
      await fetch(
        `${API_URL}/dashboard/save-quiz-score`,
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
        "Quiz dashboard save error:",
        error
      );
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setErrorMessage("");

    const savedVideo =
      getSavedVideo();

    setVideoUrl(
      savedVideo?.videoUrl ||
        savedVideo?.videoId ||
        ""
    );

    setVideoTitle(
      savedVideo?.videoTitle ||
        ""
    );
  };

  const clearVideo = () => {
    setVideoUrl("");
    setVideoTitle("");
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setErrorMessage("");

    localStorage.removeItem(
      "learnpilot_video"
    );
  };

  const answeredCount =
    Object.keys(answers).length;

  return (
    <div className="video-quiz-page">
      <div className="video-quiz-topbar">
        <div className="quiz-brand">
          <div className="quiz-brand-logo">
            LP
          </div>

          <span>
            LearnPilot AI
          </span>
        </div>
      </div>

      {questions.length === 0 && (
        <div className="quiz-setup-wrapper">
          <div className="quiz-hero">
            <div className="quiz-hero-badge">
              AI-POWERED LEARNING
            </div>

            <h1>
              Video Quiz
            </h1>

            <p>
              Transform educational
              YouTube videos into
              intelligent, interactive
              quizzes designed to test
              and strengthen your
              understanding.
            </p>
          </div>

          <div className="quiz-setup-card">
            <div className="setup-card-header">
              <div>
                <div className="setup-label">
                  CREATE A QUIZ
                </div>

                <h2>
                  Generate Your AI Quiz
                </h2>

                <p>
                  Paste a YouTube video or
                  use your recently selected
                  learning video and let
                  LearnPilot AI create
                  personalized questions.
                </p>
              </div>

              <div className="setup-icon">
                🧠
              </div>
            </div>

            <div className="quiz-input-section">
              <label>
                YouTube Video URL
              </label>

              <div className="quiz-input-wrapper">
                <span>🔗</span>

                <input
                  type="text"
                  placeholder="Paste your YouTube video URL or video ID"
                  value={videoUrl}
                  onChange={(event) =>
                    setVideoUrl(
                      event.target.value
                    )
                  }
                />
              </div>

              <small>
                Supports YouTube videos,
                Shorts, embed links and
                video IDs.
              </small>
            </div>

            <div className="quiz-input-section">
              <label>
                Video Title
                <span className="optional-label">
                  Optional
                </span>
              </label>

              <div className="quiz-input-wrapper">
                <span>🎬</span>

                <input
                  type="text"
                  placeholder="Enter video title"
                  value={videoTitle}
                  onChange={(event) =>
                    setVideoTitle(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            {videoUrl && (
              <div className="selected-video-message">
                <span>🎥</span>

                <div>
                  <strong>
                    Video ready
                  </strong>

                  <p>
                    {videoTitle ||
                      "Selected educational video"}
                  </p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="quiz-error">
                {errorMessage}
              </div>
            )}

            <button
              type="button"
              className="generate-quiz-button"
              onClick={
                generateQuiz
              }
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner" />
                  Generating Your Quiz...
                </>
              ) : (
                "Generate AI Quiz"
              )}
            </button>

            {videoUrl && (
              <button
                type="button"
                className="clear-video-button"
                onClick={
                  clearVideo
                }
              >
                Clear Selected Video
              </button>
            )}

            <div className="quiz-benefits">
              <div className="benefit-item">
                <span>🧠</span>

                <div>
                  <strong>
                    AI Generated
                  </strong>

                  <p>
                    Intelligent questions
                    created from your video.
                  </p>
                </div>
              </div>

              <div className="benefit-item">
                <span>🎯</span>

                <div>
                  <strong>
                    Knowledge Check
                  </strong>

                  <p>
                    Test your understanding
                    and identify weak areas.
                  </p>
                </div>
              </div>

              <div className="benefit-item">
                <span>📊</span>

                <div>
                  <strong>
                    Track Progress
                  </strong>

                  <p>
                    Review your score and
                    monitor learning progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {questions.length > 0 &&
        result === null && (
          <div className="active-quiz-wrapper">
            <div className="active-quiz-header">
              <div>
                <span>
                  AI GENERATED QUIZ
                </span>

                <h1>
                  Test Your Knowledge
                </h1>

                <p>
                  {videoTitle ||
                    "Selected Video"}
                </p>
              </div>

              <div className="question-count-card">
                <strong>
                  {questions.length}
                </strong>

                <span>
                  Questions
                </span>
              </div>
            </div>

            <div className="quiz-progress-container">
              <div className="quiz-progress-labels">
                <span>
                  Progress
                </span>

                <strong>
                  {answeredCount} /{" "}
                  {questions.length}{" "}
                  Answered
                </strong>
              </div>

              <div className="quiz-progress-track">
                <div
                  className="quiz-progress-fill"
                  style={{
                    width: `${
                      (answeredCount /
                        questions.length) *
                      100
                    }%`
                  }}
                />
              </div>
            </div>

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
            </div>

            <div className="submit-area">
              <button
                type="button"
                className="generate-quiz-button submit-quiz-button"
                onClick={
                  submitQuiz
                }
              >
                Submit Quiz
              </button>
            </div>
          </div>
        )}

      {result !== null && (
        <div className="quiz-result-wrapper">
          <div className="quiz-result-card">
            <div className="result-success-icon">
              ✓
            </div>

            <div className="result-label">
              QUIZ COMPLETED
            </div>

            <h1>
              Great Work!
            </h1>

            <p>
              Here is your performance
              summary.
            </p>

            <div className="result-score-ring">
              <div>
                <strong>
                  {result.percentage}%
                </strong>

                <span>
                  Score
                </span>
              </div>
            </div>

            <div className="result-stats">
              <div>
                <strong>
                  {result.correct}
                </strong>

                <span>
                  Correct
                </span>
              </div>

              <div>
                <strong>
                  {questions.length -
                    result.correct}
                </strong>

                <span>
                  Incorrect
                </span>
              </div>

              <div>
                <strong>
                  {questions.length}
                </strong>

                <span>
                  Total Questions
                </span>
              </div>
            </div>

            <div className="result-actions">
              <button
                type="button"
                className="generate-quiz-button"
                onClick={
                  resetQuiz
                }
              >
                Take Another Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}