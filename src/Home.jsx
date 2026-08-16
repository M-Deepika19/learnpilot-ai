import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const handleSearchCourses = () => {
    navigate("/videos");  // ✅ Goes to Module 2
  };

  const handleMyLearning = () => {
    alert("Coming Soon - My Learning Dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <h1>LearnPilotAI</h1>
      <h2>Welcome to LearnPilotAI!</h2>
      <p>Start Learning Today</p>

      <button onClick={handleSearchCourses}>
        🔍 Search Courses
      </button>

      <button onClick={handleMyLearning}>
        📊 My Learning
      </button>

      <button onClick={() => navigate("/profile")}>
        👤 Profile
      </button>

      <button onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}

export default Home;