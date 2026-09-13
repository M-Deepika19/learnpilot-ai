import { useNavigate } from "react-router-dom";
export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div
          className="brand"
          onClick={() => navigate("/")}
          role="button"
          tabIndex="0"
        >
          <div className="brand-icon">L</div>

          <div>
            <h1>LearnPilot</h1>
            <p>Learn. Practice. Improve.</p>
          </div>
        </div>
      </div>

      <div className="header-right">
        <button
          className="header-nav-btn"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        <button
          className="header-nav-btn"
          onClick={() => navigate("/learn")}
        >
          Learn
        </button>

        <button
          className="profile-btn"
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}