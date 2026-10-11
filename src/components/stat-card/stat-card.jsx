import React from 'react';

export function StatCard({
  title,
  value,
  icon: Icon,
  color = 'var(--accent-amber)',
  trendText,
}) {
  return (
    <div className="stat-card">
      <div>
        <span className="stat-label">{title}</span>
        <div className="stat-value">{value}</div>
        {trendText && (
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: '4px',
              display: 'block',
            }}
          >
            {trendText}
          </span>
        )}
      </div>
      <div
        className="stat-icon-wrapper"
        style={{
          background: `rgba(${
            color === 'var(--accent-amber)' ? '245, 158, 11' : '6, 182, 212'
          }, 0.12)`,
          color,
        }}
      >
        {Icon && <Icon size={22} />}
      </div>
    </div>
  );
}

export default StatCard;
