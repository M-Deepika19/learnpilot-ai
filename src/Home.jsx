import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    const userName = localStorage.getItem("userName") || "Learner";

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");

        navigate("/login");
    };

    return (
        <div className="home-page">
            <header className="home-navbar">
                <div className="brand">
                    <div className="brand-logo">LP</div>
                    <h2>LearnPilotAI</h2>
                </div>

                <div className="nav-actions">
                    <button
                        className="profile-nav-btn"
                        onClick={() => navigate("/profile")}
                    >
                        👤 Profile
                    </button>

                    <button
                        className="logout-nav-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="home-content">
                <section className="hero-section">
                    <div className="hero-text">
                        <p className="welcome-text">
                            Welcome back, {userName}
                        </p>

                        <h1>
                            Learn smarter.
                            <br />
                            Build your future.
                        </h1>

                        <p className="hero-description">
                            Learn from videos, generate smart notes, practice
                            coding, solve problems, test your knowledge and
                            prepare for interviews with AI.
                        </p>

                        <button
                            className="primary-button"
                            onClick={() => navigate("/videos")}
                        >
                            Start Learning →
                        </button>
                    </div>

                    <div className="hero-card">
                        <div className="hero-card-icon">🚀</div>

                        <h2>Your Learning Journey</h2>

                        <p>
                            Track your progress and improve your skills every
                            day.
                        </p>

                        <div className="progress-bar">
                            <div className="progress-fill"></div>
                        </div>

                        <span>Keep learning and growing!</span>
                    </div>
                </section>

                <section className="features-section">
                    <h2>Explore LearnPilotAI</h2>

                    <div className="features-grid">

                        <div
                            className="feature-card"
                            onClick={() => navigate("/videos")}
                        >
                            <div className="feature-icon">🎥</div>
                            <h3>Video Learning</h3>
                            <p>
                                Search and learn from educational videos.
                            </p>
                        </div>

                        <div
                            className="feature-card"
                            onClick={() => navigate("/smart-notes")}
                        >
                            <div className="feature-icon">📝</div>
                            <h3>Smart Notes</h3>
                            <p>
                                Generate AI-powered notes from your learning.
                            </p>
                        </div>

                        <div
                            className="feature-card"
                            onClick={() => navigate("/practice")}
                        >
                            <div className="feature-icon">💻</div>
                            <h3>Practice</h3>
                            <p>
                                Improve your coding and problem-solving skills.
                            </p>
                        </div>

                        <div
                            className="feature-card"
                            onClick={() => navigate("/video-quiz")}
                        >
                            <div className="feature-icon">🧠</div>
                            <h3>AI Quiz</h3>
                            <p>
                                Test your knowledge with generated quizzes.
                            </p>
                        </div>

                        <div
                            className="feature-card"
                            onClick={() => navigate("/mock-interview")}
                        >
                            <div className="feature-icon">🎤</div>
                            <h3>Mock Interview</h3>
                            <p>
                                Practice company-focused interview questions.
                            </p>
                        </div>

                        <div
                            className="feature-card"
                            onClick={() => navigate("/dashboard")}
                        >
                            <div className="feature-icon">📊</div>
                            <h3>Dashboard</h3>
                            <p>
                                Track scores, progress and recent activity.
                            </p>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
}
export default Home;