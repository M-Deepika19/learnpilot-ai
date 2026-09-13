import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const userName =
        localStorage.getItem("userName") || "Learner";

    const [dashboardData, setDashboardData] = useState({
        videosWatched: 0,
        quizAttempts: 0,
        practiceAttempts: 0,
        mockInterviews: 0,
        quizAverage: 0,
        practiceAverage: 0,
        mockInterviewAverage: 0,
        learningProgress: 0
    });

    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const response = await fetch(
                "http://127.0.0.1:5000/dashboard"
            );

            const data = await response.json();

            if (data.success) {
                setDashboardData(data.statistics || {});
                setRecentActivity(
                    data.recentActivity || []
                );
            }
        } catch (error) {
            console.error(
                "Dashboard loading error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const progress = Math.round(
        dashboardData.learningProgress || 0
    );

    const formatDate = (timestamp) => {
        if (!timestamp) {
            return "";
        }

        try {
            return new Date(timestamp).toLocaleDateString(
                "en-US",
                {
                    day: "numeric",
                    month: "short"
                }
            );
        } catch {
            return "";
        }
    };

    const getActivityIcon = (type) => {
        if (type === "video") return "🎥";
        if (type === "quiz") return "🧠";
        if (type === "practice") return "💻";
        if (type === "mockInterview") return "🎤";
        if (type === "smartNotes") return "📝";
        return "📚";
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-loading">
                    <div className="loading-circle"></div>
                    <p>Loading your learning dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <header className="dashboard-navbar">
                <div
                    className="dashboard-brand"
                    onClick={() => navigate("/home")}
                >
                    <div className="dashboard-brand-logo">
                        LP
                    </div>

                    <div>
                        <h2>LearnPilotAI</h2>
                        <span>Learning Dashboard</span>
                    </div>
                </div>

                <div className="dashboard-nav-actions">
                    <button
                        className="dashboard-home-btn"
                        onClick={() => navigate("/home")}
                    >
                        Home
                    </button>

                    <button
                        className="dashboard-profile-btn"
                        onClick={() => navigate("/profile")}
                    >
                        👤 Profile
                    </button>
                </div>
            </header>

            <main className="dashboard-content">
                <section className="dashboard-hero">
                    <div className="dashboard-hero-text">
                        <span className="dashboard-eyebrow">
                            YOUR LEARNING JOURNEY
                        </span>

                        <h1>
                            Welcome back, {userName}
                        </h1>

                        <p>
                            Keep building your skills, track your
                            progress and continue learning with
                            LearnPilotAI.
                        </p>

                        <div className="dashboard-hero-actions">
                            <button
                                className="dashboard-primary-btn"
                                onClick={() =>
                                    navigate("/videos")
                                }
                            >
                                Continue Learning →
                            </button>

                            <button
                                className="dashboard-secondary-btn"
                                onClick={() =>
                                    navigate("/practice")
                                }
                            >
                                Practice Skills
                            </button>
                        </div>
                    </div>

                    <div className="progress-circle-card">
                        <div
                            className="progress-circle"
                            style={{
                                background: `conic-gradient(
                                    #38bdf8 ${progress * 3.6}deg,
                                    #173761 ${progress * 3.6}deg
                                )`
                            }}
                        >
                            <div className="progress-circle-inner">
                                <strong>
                                    {progress}%
                                </strong>
                                <span>Progress</span>
                            </div>
                        </div>

                        <p>Overall Learning Progress</p>
                    </div>
                </section>

                <section className="dashboard-stats">
                    <div className="dashboard-stat-card">
                        <div className="stat-card-icon video">
                            🎥
                        </div>

                        <div>
                            <span>Videos Watched</span>
                            <strong>
                                {dashboardData.videosWatched}
                            </strong>
                            <small>
                                Learning content completed
                            </small>
                        </div>
                    </div>

                    <div className="dashboard-stat-card">
                        <div className="stat-card-icon quiz">
                            🧠
                        </div>

                        <div>
                            <span>Quiz Average</span>
                            <strong>
                                {Math.round(
                                    dashboardData.quizAverage || 0
                                )}
                                %
                            </strong>
                            <small>
                                {dashboardData.quizAttempts} attempts
                            </small>
                        </div>
                    </div>

                    <div className="dashboard-stat-card">
                        <div className="stat-card-icon practice">
                            💻
                        </div>

                        <div>
                            <span>Practice Average</span>
                            <strong>
                                {Math.round(
                                    dashboardData.practiceAverage || 0
                                )}
                                %
                            </strong>
                            <small>
                                {dashboardData.practiceAttempts} attempts
                            </small>
                        </div>
                    </div>

                    <div className="dashboard-stat-card">
                        <div className="stat-card-icon interview">
                            🎤
                        </div>

                        <div>
                            <span>Interview Score</span>
                            <strong>
                                {Math.round(
                                    dashboardData.mockInterviewAverage || 0
                                )}
                                %
                            </strong>
                            <small>
                                {dashboardData.mockInterviews} interviews
                            </small>
                        </div>
                    </div>
                </section>

                <section className="dashboard-main-grid">
                    <div className="dashboard-panel progress-panel">
                        <div className="panel-heading">
                            <div>
                                <span className="dashboard-eyebrow">
                                    PERFORMANCE
                                </span>

                                <h2>
                                    Your Learning Overview
                                </h2>
                            </div>
                        </div>

                        <div className="performance-list">
                            <div className="performance-row">
                                <div className="performance-label">
                                    <span>🎥</span>
                                    <div>
                                        <strong>
                                            Video Learning
                                        </strong>
                                        <small>
                                            Content consumption
                                        </small>
                                    </div>
                                </div>

                                <div className="performance-value">
                                    <div className="mini-progress">
                                        <div
                                            style={{
                                                width: `${Math.min(
                                                    dashboardData.videosWatched * 10,
                                                    100
                                                )}%`
                                            }}
                                        ></div>
                                    </div>

                                    <span>
                                        {dashboardData.videosWatched}
                                    </span>
                                </div>
                            </div>

                            <div className="performance-row">
                                <div className="performance-label">
                                    <span>🧠</span>
                                    <div>
                                        <strong>
                                            Quiz Performance
                                        </strong>
                                        <small>
                                            Knowledge assessment
                                        </small>
                                    </div>
                                </div>

                                <div className="performance-value">
                                    <div className="mini-progress">
                                        <div
                                            style={{
                                                width: `${Math.min(
                                                    dashboardData.quizAverage || 0,
                                                    100
                                                )}%`
                                            }}
                                        ></div>
                                    </div>

                                    <span>
                                        {Math.round(
                                            dashboardData.quizAverage || 0
                                        )}
                                        %
                                    </span>
                                </div>
                            </div>

                            <div className="performance-row">
                                <div className="performance-label">
                                    <span>💻</span>
                                    <div>
                                        <strong>
                                            Practice
                                        </strong>
                                        <small>
                                            Skill development
                                        </small>
                                    </div>
                                </div>

                                <div className="performance-value">
                                    <div className="mini-progress">
                                        <div
                                            style={{
                                                width: `${Math.min(
                                                    dashboardData.practiceAverage || 0,
                                                    100
                                                )}%`
                                            }}
                                        ></div>
                                    </div>

                                    <span>
                                        {Math.round(
                                            dashboardData.practiceAverage || 0
                                        )}
                                        %
                                    </span>
                                </div>
                            </div>

                            <div className="performance-row">
                                <div className="performance-label">
                                    <span>🎤</span>
                                    <div>
                                        <strong>
                                            Interview Preparation
                                        </strong>
                                        <small>
                                            Career readiness
                                        </small>
                                    </div>
                                </div>

                                <div className="performance-value">
                                    <div className="mini-progress">
                                        <div
                                            style={{
                                                width: `${Math.min(
                                                    dashboardData.mockInterviewAverage || 0,
                                                    100
                                                )}%`
                                            }}
                                        ></div>
                                    </div>

                                    <span>
                                        {Math.round(
                                            dashboardData.mockInterviewAverage || 0
                                        )}
                                        %
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-panel quick-panel">
                        <div className="panel-heading">
                            <div>
                                <span className="dashboard-eyebrow">
                                    QUICK ACTIONS
                                </span>

                                <h2>
                                    Continue Learning
                                </h2>
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/videos")
                            }
                        >
                            <span>🎥</span>
                            <div>
                                <strong>Watch Videos</strong>
                                <small>
                                    Explore new topics
                                </small>
                            </div>
                            <b>→</b>
                        </button>

                        <button
                            onClick={() =>
                                navigate("/smart-notes")
                            }
                        >
                            <span>📝</span>
                            <div>
                                <strong>Smart Notes</strong>
                                <small>
                                    Create study notes
                                </small>
                            </div>
                            <b>→</b>
                        </button>

                        <button
                            onClick={() =>
                                navigate("/practice")
                            }
                        >
                            <span>💻</span>
                            <div>
                                <strong>Practice</strong>
                                <small>
                                    Improve your skills
                                </small>
                            </div>
                            <b>→</b>
                        </button>

                        <button
                            onClick={() =>
                                navigate("/mock-interview")
                            }
                        >
                            <span>🎤</span>
                            <div>
                                <strong>Mock Interview</strong>
                                <small>
                                    Prepare for interviews
                                </small>
                            </div>
                            <b>→</b>
                        </button>
                    </div>
                </section>

                <section className="dashboard-panel activity-panel">
                    <div className="panel-heading">
                        <div>
                            <span className="dashboard-eyebrow">
                                RECENT ACTIVITY
                            </span>

                            <h2>
                                Keep Track of Your Progress
                            </h2>
                        </div>

                        <button
                            className="view-all-btn"
                            onClick={() => navigate("/home")}
                        >
                            Explore →
                        </button>
                    </div>

                    {recentActivity.length === 0 ? (
                        <div className="activity-empty">
                            <div>📚</div>

                            <h3>
                                Your learning journey starts here
                            </h3>

                            <p>
                                Start watching videos, taking quizzes
                                or practicing to see your activity here.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/videos")
                                }
                            >
                                Start Learning
                            </button>
                        </div>
                    ) : (
                        <div className="activity-list">
                            {recentActivity.map(
                                (activity, index) => (
                                    <div
                                        className="activity-row"
                                        key={`${activity.timestamp}-${index}`}
                                    >
                                        <div className="activity-row-icon">
                                            {getActivityIcon(
                                                activity.type
                                            )}
                                        </div>

                                        <div className="activity-row-content">
                                            <strong>
                                                {activity.title}
                                            </strong>

                                            <span>
                                                {activity.details}
                                            </span>
                                        </div>

                                        <time>
                                            {formatDate(
                                                activity.timestamp
                                            )}
                                        </time>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Dashboard;