export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon">
          {icon}
        </div>

        {trend && (
          <span className="stat-trend">
            {trend}
          </span>
        )}
      </div>

      <div className="stat-card-content">
        <p className="stat-title">
          {title}
        </p>

        <h2 className="stat-value">
          {value}
        </h2>

        {subtitle && (
          <p className="stat-subtitle">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}