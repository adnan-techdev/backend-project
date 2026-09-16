const Stats = ({ stats }) => {
  return (
    <div className="stats-grid">

      <div className="stat-card">
        <h3>Total</h3>
        <strong>{stats.total}</strong>
      </div>

      <div className="stat-card">
        <h3>Completed</h3>
        <strong>{stats.completed}</strong>
      </div>

      <div className="stat-card">
        <h3>Pending</h3>
        <strong>{stats.pending}</strong>
      </div>

      <div className="stat-card">
        <h3>High Priority</h3>
        <strong>{stats.highPriority}</strong>
      </div>

    </div>
  );
};

export default Stats;