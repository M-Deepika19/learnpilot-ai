import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Learn() {
    const [videoUrl, setVideoUrl] = useState("");
    const navigate = useNavigate();

    const extractVideoId = (url) => {
        if (!url) return null;

        const value = url.trim();

        const patterns = [
            /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
            /(?:youtu\.be\/)([^?&\s]+)/,
            /(?:youtube\.com\/embed\/)([^?&\s]+)/,
            /(?:youtube\.com\/shorts\/)([^?&\s]+)/
        ];

        for (const pattern of patterns) {
            const match = value.match(pattern);

            if (match && match[1]) {
                return match[1].substring(0, 11);
            }
        }

        if (/^[A-Za-z0-9_-]{11}$/.test(value)) {
            return value;
        }

        return null;
    };

    const startLearning = () => {
        const videoId = extractVideoId(videoUrl);

        if (!videoId) {
            alert("Please enter a valid YouTube video URL.");
            return;
        }

        localStorage.setItem(
            "learnpilot_video",
            JSON.stringify({
                videoId,
                videoUrl
            })
        );

        navigate(
            `/video-player?v=${videoId}&title=${encodeURIComponent("Learning Video")}`
        );
    };

    return (
        <div className="learn-page">
            <section className="learn-hero">
                <div className="learn-content">
                    <div className="learn-badge">
                        AI POWERED LEARNING
                    </div>

                    <h1>
                        Learn From Any
                        <span> YouTube Video</span>
                    </h1>

                    <p>
                        Watch educational videos, ask AI questions,
                        generate quizzes, create smart notes and
                        improve your learning experience.
                    </p>

                    <div className="video-search-box">
                        <input
                            type="text"
                            placeholder="Paste a YouTube video URL..."
                            value={videoUrl}
                            onChange={(e) =>
                                setVideoUrl(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    startLearning();
                                }
                            }}
                        />

                        <button
                            className="start-learning-btn"
                            onClick={startLearning}
                        >
                            Start Learning →
                        </button>
                    </div>

                    <div className="learning-features">
                        <span>🎥 Watch</span>
                        <span>🤖 Ask AI</span>
                        <span>📝 Smart Notes</span>
                        <span>🧠 Quiz</span>
                    </div>
                </div>

                <div className="learn-visual-card">
                    <div className="visual-top">
                        <span>LEARNPILOT AI</span>
                        <span className="online-dot"></span>
                    </div>

                    <div className="video-preview">
                        <div className="play-button">
                            ▶
                        </div>
                    </div>

                    <div className="visual-content">
                        <h3>Your Interactive Learning Space</h3>

                        <p>
                            Watch, understand, practice and improve
                            with AI-powered learning tools.
                        </p>

                        <div className="visual-progress">
                            <div className="progress-header">
                                <span>Learning Progress</span>
                                <span>78%</span>
                            </div>

                            <div className="progress-track">
                                <div className="progress-value"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="learn-tools-section">
                <div className="section-heading">
                    <span>LEARNING EXPERIENCE</span>

                    <h2>
                        Everything You Need to Learn Better
                    </h2>

                    <p>
                        LearnPilot gives you powerful AI tools
                        in one learning workspace.
                    </p>
                </div>

                <div className="learn-tools-grid">
                    <div className="learn-tool-card">
                        <div className="tool-icon">🎥</div>

                        <h3>Video Learning</h3>

                        <p>
                            Learn directly from YouTube educational
                            videos.
                        </p>
                    </div>

                    <div className="learn-tool-card">
                        <div className="tool-icon">🤖</div>

                        <h3>Ask AI</h3>

                        <p>
                            Ask questions and understand difficult
                            concepts instantly.
                        </p>
                    </div>

                    <div className="learn-tool-card">
                        <div className="tool-icon">📝</div>

                        <h3>Smart Notes</h3>

                        <p>
                            Convert video content into structured
                            study notes.
                        </p>
                    </div>

                    <div className="learn-tool-card">
                        <div className="tool-icon">🧠</div>

                        <h3>AI Quiz</h3>

                        <p>
                            Test your understanding with AI-generated
                            questions.
                        </p>
                    </div>

                    <div className="learn-tool-card">
                        <div className="tool-icon">💻</div>

                        <h3>Practice</h3>

                        <p>
                            Improve aptitude, mathematics, reasoning
                            and coding skills.
                        </p>
                    </div>

                    <div className="learn-tool-card">
                        <div className="tool-icon">🎤</div>

                        <h3>Mock Interview</h3>

                        <p>
                            Prepare for company-focused interviews
                            with AI.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Learn;