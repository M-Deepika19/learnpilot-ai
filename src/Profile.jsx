import { useNavigate } from "react-router-dom";
import "./Profile.css";
function Profile() {
    const navigate = useNavigate();

    const userName = localStorage.getItem("userName") || "Learner";
    const userEmail = localStorage.getItem("userEmail") || "Not available";
    const userId = localStorage.getItem("userId") || "N/A";

    const handleLogout = () => {
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        alert("Logged out successfully");
        navigate("/login");
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-avatar">
                        {userName.charAt(0).toUpperCase()}
                    </div>

                    <h2>{userName}</h2>

                    <p className="profile-role">
                        LearnPilot AI Student
                    </p>

                    <div className="profile-status">
                        <span className="status-badge">Active</span>
                    </div>

                    <div className="profile-info">
                        <div className="info-item">
                            <span>Name</span>
                            <strong>{userName}</strong>
                        </div>

                        <div className="info-item">
                            <span>Email</span>
                            <strong>{userEmail}</strong>
                        </div>

                        <div className="info-item">
                            <span>User ID</span>
                            <strong>{userId}</strong>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button
                            className="dashboard-button"
                            onClick={() => navigate("/dashboard")}
                        >
                            View Learning Dashboard
                        </button>

                        <button
                            className="settings-button"
                            onClick={() => navigate("/settings")}
                        >
                            Account Settings
                        </button>
                    </div>

                    <div className="profile-footer">
                        <button
                            className="back-button"
                            onClick={() => navigate("/home")}
                        >
                            ← Back to Home
                        </button>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Profile;