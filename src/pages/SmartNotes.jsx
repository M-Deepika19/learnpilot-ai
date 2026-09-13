import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SmartNotes.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function SmartNotes() {
  const navigate = useNavigate();

  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getVideoId = (value) => {
    const url = value.trim();

    if (!url) {
      return null;
    }

    const patterns = [
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtu\.be\/([^?&]+)/,
      /youtube\.com\/embed\/([^?&]+)/,
      /youtube\.com\/shorts\/([^?&]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);

      if (match) {
        return match[1];
      }
    }

    if (/^[A-Za-z0-9_-]{11}$/.test(url)) {
      return url;
    }

    return null;
  };

  const loadRecentVideo = () => {
    try {
      const savedVideo = JSON.parse(
        localStorage.getItem("learnpilot_video")
      );

      if (!savedVideo?.videoId) {
        setError("No recent learning video was found.");
        return;
      }

      setVideoUrl(
        savedVideo.videoUrl || savedVideo.videoId
      );

      setVideoTitle(
        savedVideo.videoTitle || "Learning Video"
      );

      setError("");
    } catch {
      setError("Unable to load recent video.");
    }
  };

  const generateNotes = async () => {
    setError("");

    const videoId = getVideoId(videoUrl);

    if (!videoId) {
      setError("Please enter a valid YouTube video URL.");
      return;
    }

    setLoading(true);
    setNotes(null);

    try {
      const response = await fetch(
        `${API_URL}/smart-notes/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            videoId,
            videoTitle:
              videoTitle.trim() || "Educational Video"
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to generate Smart Notes."
        );
      }

      setNotes(data.notes);

      localStorage.setItem(
        "learnpilot_video",
        JSON.stringify({
          videoId,
          videoUrl,
          videoTitle:
            videoTitle.trim() || "Educational Video"
        })
      );
    } catch (error) {
      setError(
        error.message ||
          "Unable to generate Smart Notes."
      );
    } finally {
      setLoading(false);
    }
  };

  const createNewNotes = () => {
    setNotes(null);
    setError("");
  };

  return (
    <div className="smart-notes-page">

      <header className="smart-notes-navbar">

        <button
          className="smart-back-button"
          onClick={() => navigate("/home")}
        >
          ← Home
        </button>

        <div className="smart-brand">
          <div className="smart-brand-logo">
            LP
          </div>

          <span>LearnPilot AI</span>
        </div>

        <button
          className="smart-profile-button"
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>

      </header>

      {!notes ? (

        <main className="smart-notes-main">

          <section className="smart-notes-hero">

            <span className="smart-eyebrow">
              AI STUDY ASSISTANT
            </span>

            <h1>
              Turn videos into
              <span> smarter notes.</span>
            </h1>

            <p>
              LearnPilot AI transforms educational videos
              into structured, easy-to-review study notes
              so you can focus on learning instead of
              writing everything down.
            </p>

          </section>

          <section className="notes-create-card">

            <div className="notes-card-top">

              <div>
                <span className="notes-card-label">
                  CREATE STUDY NOTES
                </span>

                <h2>
                  Start with your learning video
                </h2>

                <p>
                  Paste a YouTube link or continue
                  with your most recent learning video.
                </p>
              </div>

              <div className="notes-main-icon">
                📝
              </div>

            </div>

            <div className="notes-source-row">

              <button
                className="notes-source-card active"
                type="button"
              >
                <div className="source-card-icon">
                  ▶
                </div>

                <div>
                  <strong>
                    YouTube Video
                  </strong>

                  <span>
                    Generate notes from a video
                  </span>
                </div>
              </button>

              <button
                className="notes-source-card"
                type="button"
                onClick={loadRecentVideo}
              >
                <div className="source-card-icon">
                  📚
                </div>

                <div>
                  <strong>
                    Recent Learning
                  </strong>

                  <span>
                    Use your latest video
                  </span>
                </div>
              </button>

            </div>

            <div className="notes-form">

              <div className="notes-field">

                <label>
                  YouTube Video URL
                </label>

                <div className="notes-input">

                  <span>🔗</span>

                  <input
                    type="text"
                    placeholder="Paste your YouTube video URL"
                    value={videoUrl}
                    onChange={(event) => {
                      setVideoUrl(event.target.value);
                      setError("");
                    }}
                  />

                </div>

                <small>
                  Supports YouTube videos, Shorts and
                  shortened links.
                </small>

              </div>

              <div className="notes-field">

                <div className="field-label-row">

                  <label>
                    Video Title
                  </label>

                  <span>
                    Optional
                  </span>

                </div>

                <div className="notes-input">

                  <span>🎬</span>

                  <input
                    type="text"
                    placeholder="Example: Java Arrays"
                    value={videoTitle}
                    onChange={(event) =>
                      setVideoTitle(event.target.value)
                    }
                  />

                </div>

              </div>

              {error && (
                <div className="notes-error">
                  <span>!</span>
                  {error}
                </div>
              )}

              <button
                className="generate-notes-button"
                onClick={generateNotes}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="notes-spinner" />
                    Creating your notes...
                  </>
                ) : (
                  <>
                    Generate Smart Notes
                    <span>→</span>
                  </>
                )}
              </button>

            </div>

          </section>

          <section className="notes-feature-row">

            <div className="notes-feature">

              <div className="feature-number">
                01
              </div>

              <div>
                <strong>
                  Main Topics
                </strong>

                <p>
                  Quickly see what the video covers.
                </p>
              </div>

            </div>

            <div className="notes-feature">

              <div className="feature-number">
                02
              </div>

              <div>
                <strong>
                  Key Concepts
                </strong>

                <p>
                  Understand the important ideas clearly.
                </p>
              </div>

            </div>

            <div className="notes-feature">

              <div className="feature-number">
                03
              </div>

              <div>
                <strong>
                  Quick Revision
                </strong>

                <p>
                  Review summaries and important points.
                </p>
              </div>

            </div>

          </section>

        </main>

      ) : (

        <main className="notes-workspace">

          <div className="notes-workspace-header">

            <div>

              <span className="smart-eyebrow">
                AI GENERATED NOTES
              </span>

              <h1>
                {videoTitle ||
                  "Your Learning Notes"}
              </h1>

              <p>
                Your video has been transformed
                into structured study material.
              </p>

            </div>

            <button
              className="new-notes-button"
              onClick={createNewNotes}
            >
              + New Notes
            </button>

          </div>

          <div className="notes-layout">

            <aside className="notes-summary-card">

              <div className="summary-icon">
                ✨
              </div>

              <h3>
                Study smarter
              </h3>

              <p>
                Use these AI-generated notes for
                quick revision before assignments,
                tests and interviews.
              </p>

              <div className="summary-divider" />

              <span>
                LEARNPILOT AI
              </span>

            </aside>

            <div className="notes-content">

              {(notes.mainTopics || []).length > 0 && (

                <section className="notes-panel">

                  <div className="panel-heading">

                    <div className="panel-icon">
                      01
                    </div>

                    <div>
                      <span>
                        OVERVIEW
                      </span>

                      <h2>
                        Main Topics
                      </h2>
                    </div>

                  </div>

                  <div className="topic-list">

                    {notes.mainTopics.map(
                      (topic, index) => (
                        <div
                          className="topic-chip"
                          key={index}
                        >
                          {topic}
                        </div>
                      )
                    )}

                  </div>

                </section>
              )}

              {(notes.importantConcepts || []).length > 0 && (

                <section className="notes-panel">

                  <div className="panel-heading">

                    <div className="panel-icon">
                      02
                    </div>

                    <div>
                      <span>
                        UNDERSTAND
                      </span>

                      <h2>
                        Important Concepts
                      </h2>
                    </div>

                  </div>

                  <div className="concept-list">

                    {notes.importantConcepts.map(
                      (concept, index) => (

                        <article
                          className="concept-item"
                          key={index}
                        >

                          <div className="concept-dot">
                            {index + 1}
                          </div>

                          <div>
                            <h3>
                              {concept.title}
                            </h3>

                            <p>
                              {concept.description}
                            </p>
                          </div>

                        </article>

                      )
                    )}

                  </div>

                </section>
              )}

              {(notes.keyPoints || []).length > 0 && (

                <section className="notes-panel">

                  <div className="panel-heading">

                    <div className="panel-icon">
                      03
                    </div>

                    <div>
                      <span>
                        REVISION
                      </span>

                      <h2>
                        Key Points
                      </h2>
                    </div>

                  </div>

                  <div className="key-points">

                    {notes.keyPoints.map(
                      (point, index) => (

                        <div
                          className="key-point"
                          key={index}
                        >
                          <span>✓</span>
                          <p>{point}</p>
                        </div>

                      )
                    )}

                  </div>

                </section>
              )}

              {(notes.examples || []).length > 0 && (

                <section className="notes-panel">

                  <div className="panel-heading">

                    <div className="panel-icon">
                      04
                    </div>

                    <div>
                      <span>
                        PRACTICAL
                      </span>

                      <h2>
                        Examples
                      </h2>
                    </div>

                  </div>

                  <div className="example-list">

                    {notes.examples.map(
                      (example, index) => (

                        <article
                          className="example-item"
                          key={index}
                        >

                          <h3>
                            {example.title}
                          </h3>

                          <p>
                            {example.description}
                          </p>

                          {example.code && (
                            <pre>
                              <code>
                                {example.code}
                              </code>
                            </pre>
                          )}

                        </article>

                      )
                    )}

                  </div>

                </section>
              )}

              <section className="notes-panel summary-panel">

                <div className="panel-heading">

                  <div className="panel-icon">
                    05
                  </div>

                  <div>
                    <span>
                      FINAL TAKEAWAY
                    </span>

                    <h2>
                      Summary
                    </h2>
                  </div>

                </div>

                <p className="summary-text">
                  {notes.summary ||
                    "No summary was generated."}
                </p>

              </section>

            </div>

          </div>

        </main>

      )}

    </div>
  );
}
export default SmartNotes;