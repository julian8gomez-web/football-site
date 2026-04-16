import { useNavigate } from "react-router-dom";

function HomePage({
  approvedPlayers,
  searchTerm,
  setSearchTerm,
  positionFilter,
  setPositionFilter,
  classFilter,
  setClassFilter
}) {
  const navigate = useNavigate();

  const uniquePositions = [...new Set(
    approvedPlayers
      .map((p) => p.position)
      .filter(Boolean)
  )];

  const uniqueClasses = [...new Set(
    approvedPlayers
      .map((p) => p.playerClass)
      .filter(Boolean)
  )];

  return (
    <div>
      <h2 className="section-title">Approved Players</h2>
      <p className="home-intro">
        View approved Chapin Husky Football player profiles below.
      </p>

      <div className="card" style={{ marginBottom: "24px" }}>
        <div className="form-stack">
          <input
            type="text"
            placeholder="Search by player name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #b8cbe3" }}
          >
            <option value="">All Positions</option>
            {uniquePositions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #b8cbe3" }}
          >
            <option value="">All Classes</option>
            {uniqueClasses.map((playerClass) => (
              <option key={playerClass} value={playerClass}>
                {playerClass}
              </option>
            ))}
          </select>
        </div>
      </div>

      {approvedPlayers.length === 0 ? (
        <p>No approved players match your search/filter.</p>
      ) : (
        <div className="roster-grid">
          {approvedPlayers.map((p) => {
            const initials = p.name
              ? p.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "CH";

            return (
              <div
                key={p._id}
                className="player-card"
                onClick={() => navigate(`/players/${p._id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="player-card-top">
                  <div className="player-avatar">
                    {p.profilePicture ? (
                      <img src={p.profilePicture} alt={p.name} />
                    ) : (
                      initials
                    )}
                  </div>
                  <h3 className="player-name">{p.name}</h3>
                  <div className="player-badges">
  {p.position && <span className="player-badge">{p.position}</span>}
  {p.playerClass && <span className="player-badge">{p.playerClass}</span>}
  {p.jerseyNumber && <span className="player-badge">#{p.jerseyNumber}</span>}
</div>
                </div>

               <div className="player-card-body">
  <p className="player-card-link-text">Click to view full profile</p>
</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HomePage;