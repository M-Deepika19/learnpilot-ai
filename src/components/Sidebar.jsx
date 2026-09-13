import { NavLink } from "react-router-dom";
export default function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "▦",
    },
    {
      name: "Learn",
      path: "/learn",
      icon: "▶",
    },
    {
      name: "Smart Notes",
      path: "/smart-notes",
      icon: "📝",
    },
    {
      name: "Video Quiz",
      path: "/video-quiz",
      icon: "❓",
    },
    {
      name: "Practice",
      path: "/practice",
      icon: "✦",
    },
    {
      name: "Compiler",
      path: "/compiler",
      icon: "</>",
    },
    {
      name: "Mock Interview",
      path: "/mock-interview",
      icon: "🎯",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          LP
        </div>

        <div>
          <h2>LearnPilot</h2>
          <p>AI Learning Platform</p>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-progress">
          <p>Your Learning Journey</p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: "65%" }}
            />
          </div>

          <span>Keep learning every day</span>
        </div>
      </div>
    </aside>
  );
}