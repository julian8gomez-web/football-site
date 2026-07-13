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
const [expandedPlayers, setExpandedPlayers] = useState({});

const togglePlayerChanges = (playerId) => {
  setExpandedPlayers((current) => ({
    ...current,
    [playerId]: !current[playerId]
  }));
};

const formatFieldLabel = (field) =>
  field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());

const formatReviewValue = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Empty";
  }

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "Empty";
  }

  return String(value);
};

const normalizeReviewValue = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "object") {
    return value;
  }

  return String(value).trim();
};

const reviewValuesMatch = (oldValue, newValue) => {
  return JSON.stringify(normalizeReviewValue(oldValue)) ===
    JSON.stringify(normalizeReviewValue(newValue));
};

const getEffectiveChanges = (player) => {
  if (!Array.isArray(player.changes)) {
    return [];
  }

  return player.changes
    .map((change) => {
      if (change.field !== "currentSeasonStats") {
        return reviewValuesMatch(
          change.oldValue,
          change.newValue
        )
          ? null
          : change;
      }

      const seasonLabel = change.newValue?.season;
      const existingSeason = player.seasonStats?.find(
        (season) => season.season === seasonLabel
      );

      const changedStats = Object.entries(
        change.newValue?.stats || {}
      ).reduce((result, [statName, newValue]) => {
        const oldValue = existingSeason?.[statName];

        if (!reviewValuesMatch(oldValue, newValue)) {
          result[statName] = newValue;
        }

        return result;
      }, {});

      if (Object.keys(changedStats).length === 0) {
        return null;
      }

      return {
        ...change,
        newValue: {
          ...change.newValue,
          stats: changedStats
        }
      };
    })
    .filter(Boolean);
};

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
        pendingPlayers.map((p) => {
          const isExpanded = Boolean(expandedPlayers[p._id]);
          const effectiveChanges = getEffectiveChanges(p);
          const changeCount = effectiveChanges.length;

          return (
            <div key={p._id} className="card admin-review-card">
              <div className="admin-player-header">
                <div>
                  <h3>{p.name}</h3>

                  <p className="admin-player-subtext">
                    {p.position1
                      ? p.position2
                        ? `${p.position1}/${p.position2}`
                        : p.position1
                      : p.position || "No position"}{" "}
                    • Class {p.playerClass || "N/A"} • #
                    {p.jerseyNumber || "N/A"}
                  </p>
                </div>

                <div className="admin-review-summary">
                  <span
                    className={`admin-status-badge status-${p.status || "unknown"}`}
                  >
                    {p.status || "unknown"}
                  </span>

                  <span className="admin-change-count">
                    {changeCount} change
                    {changeCount === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              <div className="admin-review-toolbar">
                <button
                  type="button"
                  className="secondary-brand-btn"
                  onClick={() => togglePlayerChanges(p._id)}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? "Hide Changes" : "View Changes"}
                </button>

                <div className="action-row admin-review-actions">
                  <button
                    className="primary-brand-btn"
                    onClick={() => approvePlayer(p._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-brand-btn"
                    onClick={() => rejectPlayer(p._id)}
                  >
                    Reject
                  </button>

                  <button
                    className="primary-brand-btn"
                    type="button"
                    onClick={() => resetPlayerPassword(p._id)}
                  >
                    Reset Password
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="admin-change-panel">
                  {effectiveChanges.length > 0 ? (
                    <>
                      <h4>Requested Changes</h4>

                      {effectiveChanges.map((change, index) => (
                        <div
                          key={`${change.field}-${index}`}
                          className="admin-change-item"
                        >
                          <p className="admin-change-label">
                            <strong>
                              {formatFieldLabel(change.field)}
                            </strong>
                          </p>

                          {change.field === "currentSeasonStats" ? (
                            <div className="season-stat-review">
                              <p className="admin-change-season">
                                <strong>Season:</strong>{" "}
                                {change.newValue?.season ||
                                  "Unknown season"}
                              </p>

                              {Object.entries(
                                change.newValue?.stats || {}
                              ).map(([statName, newValue]) => {
                                const existingSeason =
                                  p.seasonStats?.find(
                                    (season) =>
                                      season.season ===
                                      change.newValue?.season
                                  );

                                const oldValue =
                                  existingSeason?.[statName];

                                return (
                                  <div
                                    key={statName}
                                    className="admin-stat-change-row"
                                  >
                                    <strong>
                                      {formatFieldLabel(statName)}
                                    </strong>

                                    <span>
                                      <span className="admin-old-value">
                                        {formatReviewValue(oldValue)}
                                      </span>

                                      <span className="admin-change-arrow">
                                        →
                                      </span>

                                      <span className="admin-new-value">
                                        {formatReviewValue(newValue)}
                                      </span>
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : change.field === "profilePicture" ? (
                            <div className="admin-picture-comparison">
                              <div>
                                <p className="admin-old-heading">
                                  Current
                                </p>

                                {change.oldValue ? (
                                  <img
                                    src={change.oldValue}
                                    alt="Current profile"
                                    className="admin-review-image"
                                  />
                                ) : (
                                  <div className="admin-empty-image">
                                    Empty
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="admin-new-heading">
                                  Requested
                                </p>

                                {change.newValue ? (
                                  <img
                                    src={change.newValue}
                                    alt="Requested profile"
                                    className="admin-review-image requested"
                                  />
                                ) : (
                                  <div className="admin-empty-image requested">
                                    Empty
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="admin-simple-change">
                              <span className="admin-old-value">
                                {formatReviewValue(change.oldValue)}
                              </span>

                              <span className="admin-change-arrow">
                                →
                              </span>

                              <span className="admin-new-value">
                                {formatReviewValue(change.newValue)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <p>
                      No actual value changes were found. The submitted
                      values match the current approved profile.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default AdminDashboard;