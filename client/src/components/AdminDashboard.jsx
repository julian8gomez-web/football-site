import { useEffect, useState } from "react";

function AdminDashboard({
  loadPendingPlayers,
  pendingPlayers,
  approvePlayer,
  rejectPlayer,
  approveAllPendingPlayers,
  adminSearchTerm,
  setAdminSearchTerm,
  adminStatusFilter,
  setAdminStatusFilter,
  adminPositionFilter,
  setAdminPositionFilter,
  adminClassFilter,
  setAdminClassFilter,
  resetPlayerPassword,
  loadAllPlayers,
}) {
  const [currentSeason, setCurrentSeason] = useState(null);
const [showSeasonConfirm, setShowSeasonConfirm] = useState(false);
const [seasonConfirmText, setSeasonConfirmText] = useState("");
const nextSeasonStartYear = currentSeason
  ? currentSeason.startYear + 1
  : null;

const nextSeasonLabel = nextSeasonStartYear
  ? `${nextSeasonStartYear}-${nextSeasonStartYear + 1}`
  : "";
  
  const advanceSeason = async () => {
  const token = localStorage.getItem("token");

  if (!token || !currentSeason) return;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/start-new-season`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          startYear: currentSeason.startYear + 1
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Could not advance the season.");
      return;
    }

    setCurrentSeason(data.currentSeason || data.season);
    setShowSeasonConfirm(false);
    setSeasonConfirmText("");

    alert(data.message || "Season advanced successfully.");
  } catch (err) {
    console.error("Advance season error:", err);
    alert("Error connecting to the server.");
  }
};
  useEffect(() => {
    const loadCurrentSeason = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/season/current`
        );
        const data = await res.json();

        if (res.ok) {
          setCurrentSeason(data);
        }
      } catch (err) {
        console.error("Failed to load current season:", err);
      }
    };

    loadCurrentSeason();
  }, []);

  const uniqueStatuses = [...new Set(
    pendingPlayers
      .map((p) => p.status)
      .filter(Boolean)
  )];

  const uniquePositions = [...new Set(
    pendingPlayers
      .map((p) => p.position)
      .filter(Boolean)
  )];

  const uniqueClasses = [...new Set(
    pendingPlayers
      .map((p) => p.playerClass)
      .filter(Boolean)
  )];

  return (
    <div>
      <h2 className="section-title">Admin Player Management</h2>
<p className="home-intro">
  Manage player accounts, review pending updates, approve profiles, and reset passwords.
</p>
<div className="card" style={{ marginBottom: "20px" }}>
  <h3>Season Management</h3>
  <p className="small-text">
    Current Season: {currentSeason ? currentSeason.label : "Loading..."}
  </p>

  <div className="action-row">
    <button
  className="primary-brand-btn"
  type="button"
  onClick={() => {
    setSeasonConfirmText("");
    setShowSeasonConfirm(true);
  }}
  disabled={!currentSeason}
>
  Advance to Next Season
</button>
  </div>
</div>
{showSeasonConfirm && (
  <div className="season-modal-overlay">
    <div className="season-modal">
      <h3>Advance to Next Season</h3>

      <p>
        Current Season:
        <strong> {currentSeason?.label}</strong>
      </p>

      <p>
        Next Season:
        <strong> {nextSeasonLabel}</strong>
      </p>

      <div className="season-warning-box">
        <strong>This action will:</strong>

        <p>Lock the {currentSeason?.label} season.</p>
        <p>Create the {nextSeasonLabel} season.</p>
        <p>Create blank season statistics for every player.</p>
      </div>

      <label className="season-confirm-label">
        Type <strong>ADVANCE</strong> to confirm:
      </label>

      <input
        type="text"
        value={seasonConfirmText}
        onChange={(e) =>
          setSeasonConfirmText(e.target.value.toUpperCase())
        }
        placeholder="Type ADVANCE"
      />

      <div className="action-row season-modal-actions">
        <button
          type="button"
          className="secondary-brand-btn"
          onClick={() => {
            setShowSeasonConfirm(false);
            setSeasonConfirmText("");
          }}
        >
          Cancel
        </button>

        <button
  type="button"
  className="primary-brand-btn"
  onClick={advanceSeason}
  disabled={seasonConfirmText !== "ADVANCE"}
>
  Advance Season
</button>
      </div>
    </div>
  </div>
)}

      <div className="action-row" style={{ marginBottom: "20px" }}>
  <button className="load-button primary-brand-btn" onClick={loadPendingPlayers}>
    Load Pending Players
  </button>

  <button
    className="load-button primary-brand-btn"
    onClick={loadAllPlayers}
    type="button"
  >
    Load All Players
  </button>

  <button
    className="load-button primary-brand-btn"
    onClick={approveAllPendingPlayers}
    type="button"
  >
    Approve All Pending Players
  </button>
</div>

      <div className="card" style={{ marginBottom: "24px" }}>
        <div className="form-stack">
          <input
            type="text"
            placeholder="Search by player name"
            value={adminSearchTerm}
            onChange={(e) => setAdminSearchTerm(e.target.value)}
          />

          <select
            value={adminStatusFilter}
            onChange={(e) => setAdminStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={adminPositionFilter}
            onChange={(e) => setAdminPositionFilter(e.target.value)}
          >
            <option value="">All Positions</option>
            {uniquePositions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>

          <select
            value={adminClassFilter}
            onChange={(e) => setAdminClassFilter(e.target.value)}
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

      {pendingPlayers.length === 0 ? (
        <p>No pending players right now.</p>
      ) : (
        pendingPlayers.map((p) => (
          <div key={p._id} className="card">
            <div className="admin-player-header">
  <div>
    <h3>{p.name}</h3>
    <p className="admin-player-subtext">
      {p.position1
  ? p.position2
    ? `${p.position1}/${p.position2}`
    : p.position1
  : p.position || "No position"}{" "}
• Class {p.playerClass || "N/A"} • #{p.jerseyNumber || "N/A"}
    </p>
  </div>

  <span className={`admin-status-badge status-${p.status || "unknown"}`}>
    {p.status || "unknown"}
  </span>
</div>

            {p.changes && p.changes.length > 0 ? (
              <div style={{ marginTop: "16px" }}>
                <h4 style={{ marginBottom: "12px" }}>Requested Changes</h4>

                {p.changes.map((change, index) => (
  <div
    key={index}
    style={{
      padding: "12px 0",
      borderBottom: "1px solid #e5e7eb"
    }}
  >
    <p style={{ marginBottom: "8px" }}>
      <strong>{change.field}</strong>
    </p>

    {change.field === "currentSeasonStats" ? (
  <div className="season-stat-review">
    <p style={{ marginBottom: "10px" }}>
      <strong>Season:</strong>{" "}
      {change.newValue?.season || "Unknown season"}
    </p>

    {Object.entries(change.newValue?.stats || {}).map(
      ([statName, newValue]) => {
        const existingSeason = p.seasonStats?.find(
          (season) =>
            season.season === change.newValue?.season
        );

        const oldValue = existingSeason?.[statName];

        const formattedLabel = statName
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (letter) => letter.toUpperCase());

        return (
          <div
            key={statName}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              padding: "8px 0",
              borderBottom: "1px solid var(--brand-border)"
            }}
          >
            <strong>{formattedLabel}</strong>

            <span>
              <span style={{ color: "var(--brand-muted)" }}>
                {oldValue !== undefined &&
                oldValue !== null &&
                oldValue !== ""
                  ? String(oldValue)
                  : "Empty"}
              </span>

              {" → "}

              <span
                style={{
                  color: "var(--brand-navy)",
                  fontWeight: "700"
                }}
              >
                {newValue !== undefined &&
                newValue !== null &&
                newValue !== ""
                  ? String(newValue)
                  : "Empty"}
              </span>
            </span>
          </div>
        );
      }
    )}
  </div>
) : change.field === "profilePicture" ? (
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          alignItems: "flex-start"
        }}
      >
        <div>
          <p style={{ marginBottom: "8px", color: "#6b7280", fontWeight: "600" }}>
            Current
          </p>
          {change.oldValue ? (
            <img
              src={change.oldValue}
              alt="Current profile"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "16px",
                border: "1px solid #d6e2f0"
              }}
            />
          ) : (
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "16px",
                border: "1px solid #d6e2f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
                background: "#f8fbff"
              }}
            >
              Empty
            </div>
          )}
        </div>

        <div>
          <p style={{ marginBottom: "8px", color: "#0b2545", fontWeight: "700" }}>
            Requested
          </p>
          {change.newValue ? (
            <img
              src={change.newValue}
              alt="Requested profile"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "16px",
                border: "2px solid #6f9dcd"
              }}
            />
          ) : (
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "16px",
                border: "2px solid #6f9dcd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0b2545",
                background: "#eef5fc"
              }}
            >
              Empty
            </div>
          )}
        </div>
      </div>
    ) : (
      <p style={{ margin: 0 }}>
        <span style={{ color: "#6b7280" }}>
          {change.oldValue !== undefined &&
          change.oldValue !== null &&
          change.oldValue !== ""
            ? String(change.oldValue)
            : "Empty"}
        </span>
        {" → "}
        <span style={{ color: "#0b2545", fontWeight: "700" }}>
          {change.newValue !== undefined &&
          change.newValue !== null &&
          change.newValue !== ""
            ? String(change.newValue)
            : "Empty"}
        </span>
      </p>
    )}
  </div>
))}
              </div>
            ) : (
              <p>No pending field changes found.</p>
            )}

            <div className="action-row">
              <button className="primary-brand-btn" onClick={() => approvePlayer(p._id)}>
                Approve
              </button>
              <button className="reject-brand-btn" onClick={() => rejectPlayer(p._id)}>
                Reject
              </button>
              <button className="primary-brand-btn"
              type="button" onClick={() => resetPlayerPassword(p._id)}>
              Reset Password
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;