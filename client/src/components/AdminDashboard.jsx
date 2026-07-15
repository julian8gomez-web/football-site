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
const [showAllPlayers, setShowAllPlayers] = useState(false);

const formatActivityDate = (dateValue) => {
  if (!dateValue) return "Not recorded";

  return new Date(dateValue).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
};

const getFreshnessInfo = (dateValue) => {
  if (!dateValue) {
    return { label: "No update recorded", className: "activity-neutral" };
  }

  const ageInDays =
    (Date.now() - new Date(dateValue).getTime()) /
    (1000 * 60 * 60 * 24);

  if (ageInDays <= 7) {
    return { label: "Updated recently", className: "activity-fresh" };
  }

  if (ageInDays <= 30) {
    return { label: "Update aging", className: "activity-aging" };
  }

  return { label: "Update overdue", className: "activity-stale" };
};

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

  useEffect(() => {
    loadAllPlayers();
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

  const totalPlayersCount = pendingPlayers.length;
  const pendingCount = pendingPlayers.filter(
    (player) => player.status === "pending"
  ).length;
  const approvedCount = pendingPlayers.filter(
    (player) => player.status === "approved"
  ).length;

  const visiblePlayers = showAllPlayers
    ? pendingPlayers
    : pendingPlayers.filter(
        (player) => player.status === "pending"
      );

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-heading">
        <div>
          <h2 className="section-title">Admin Player Management</h2>
          <p className="home-intro">
            Manage player accounts, review pending updates, approve profiles,
            and reset passwords.
          </p>
        </div>
      </div>

      <section className="admin-season-strip">
        <div className="admin-season-icon" aria-hidden="true">▣</div>

        <div>
          <h3>Season Management</h3>
          <p>
            Current Season:
            <strong> {currentSeason ? currentSeason.label : "Loading..."}</strong>
          </p>
        </div>
      </section>

      <section className="admin-summary-grid">
        <div className="admin-summary-card">
          <div className="admin-summary-icon">👥</div>
          <div>
            <span>Total Players</span>
            <strong>{totalPlayersCount}</strong>
            <small>Currently loaded</small>
          </div>
        </div>

        <div className="admin-summary-card">
          <div className="admin-summary-icon">◷</div>
          <div>
            <span>Pending Updates</span>
            <strong>{pendingCount}</strong>
            <small>Needs review</small>
          </div>
        </div>

        <div className="admin-summary-card">
          <div className="admin-summary-icon">✓</div>
          <div>
            <span>Approved Players</span>
            <strong>{approvedCount}</strong>
            <small>Active profiles</small>
          </div>
        </div>
      </section>

      <div className="admin-compact-actions">
        <button
          className="admin-action-btn admin-action-secondary"
          onClick={() => {
            setShowAllPlayers(true);
            loadAllPlayers();
          }}
          type="button"
        >
          Load All Players
        </button>

        <button
          className="admin-action-btn admin-action-primary"
          onClick={approveAllPendingPlayers}
          type="button"
        >
          Approve All Pending Players
        </button>
      </div>

      <section className="admin-player-panel">
        <div className="admin-player-panel-header">
          <div>
            <h3>{showAllPlayers ? "All Players" : "Pending Players"}</h3>
            <p>
              {showAllPlayers
                ? "Search and filter the full player list."
                : "Players awaiting profile approval or update review."}
            </p>
          </div>

          <div className="admin-filter-row">
            <input
              type="text"
              placeholder="Search players..."
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

      {visiblePlayers.length === 0 ? (
        <div className="admin-empty-state">
          No players match the current search or filters.
        </div>
      ) : (
        <div className="admin-player-table">
          <div className="admin-player-table-head">
            <span>Player</span><span>Email</span><span>Grad Year</span><span>Status</span><span>Changes</span><span>Actions</span>
          </div>
          {visiblePlayers.map((p) => {
            const isExpanded = Boolean(expandedPlayers[p._id]);
            const effectiveChanges = getEffectiveChanges(p);
            const changeCount = effectiveChanges.length;
            const positionText = p.position1
              ? p.position2
                ? `${p.position1}/${p.position2}`
                : p.position1
              : p.position || "No position";
            return (
              <div key={p._id} className="admin-player-table-item">
                <div className="admin-player-table-row">
                  <div className="admin-player-cell admin-player-identity">
                    <div className="admin-player-avatar">
                      {p.profilePicture ? (
                        <img src={p.profilePicture} alt={p.name} />
                      ) : (
                        <span>{(p.name || "CH").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <strong>{p.name}</strong>
                      <small>
                        {positionText}
                        {p.jerseyNumber ? ` #${p.jerseyNumber}` : ""}
                      </small>

                      {(() => {
                        const freshness = getFreshnessInfo(
                          p.lastSubmittedAt || p.lastApprovedAt
                        );

                        return (
                          <span
                            className={`admin-player-last-update ${freshness.className}`}
                          >
                            <span className="activity-dot" />
                            {p.lastSubmittedAt
                              ? `Submitted ${formatActivityDate(p.lastSubmittedAt)}`
                              : p.lastApprovedAt
                              ? `Approved ${formatActivityDate(p.lastApprovedAt)}`
                              : freshness.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="admin-player-cell admin-player-email"><span>{p.emailAddress || p.email || "Not provided"}</span></div>
                  <div className="admin-player-cell"><span className="admin-class-badge">{p.playerClass || "N/A"}</span></div>
                  <div className="admin-player-cell"><span className={`admin-status-badge status-${p.status || "unknown"}`}>{p.status || "unknown"}</span></div>
                  <div className="admin-player-cell"><span className="admin-change-count">{changeCount}</span></div>
                  <div className="admin-player-cell admin-table-actions">
                    <button type="button" className="admin-table-btn admin-view-btn" onClick={() => togglePlayerChanges(p._id)} aria-expanded={isExpanded}>{isExpanded ? "Hide" : "View"}</button>
                    {p.status === "pending" && (
                      <>
                        <button type="button" className="admin-table-btn admin-approve-btn" onClick={() => approvePlayer(p._id)}>Approve</button>
                        <button type="button" className="admin-table-btn admin-reject-btn" onClick={() => rejectPlayer(p._id)}>Reject</button>
                      </>
                    )}
                    <button type="button" className="admin-table-btn admin-reset-btn" onClick={() => resetPlayerPassword(p._id)}>Reset Password</button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="admin-table-expanded">
                    <div className="admin-activity-summary">
                      <div>
                        <span>Last Submitted</span>
                        <strong>{formatActivityDate(p.lastSubmittedAt)}</strong>
                      </div>

                      <div>
                        <span>Last Approved</span>
                        <strong>{formatActivityDate(p.lastApprovedAt)}</strong>
                      </div>

                      <div>
                        <span>Approved By</span>
                        <strong>{p.lastApprovedBy || "Not recorded"}</strong>
                      </div>
                    </div>

                    {effectiveChanges.length > 0 ? (
                      <>
                        <h4>Requested Changes</h4>
                        {effectiveChanges.map((change, index) => (
                          <div key={`${change.field}-${index}`} className="admin-change-item">
                            <p className="admin-change-label"><strong>{formatFieldLabel(change.field)}</strong></p>
                            {change.field === "currentSeasonStats" ? (
                              <div className="season-stat-review">
                                <p className="admin-change-season"><strong>Season:</strong> {change.newValue?.season || "Unknown season"}</p>
                                {Object.entries(change.newValue?.stats || {}).map(([statName, newValue]) => {
                                  const existingSeason = p.seasonStats?.find((season) => season.season === change.newValue?.season);
                                  const oldValue = existingSeason?.[statName];
                                  return (
                                    <div key={statName} className="admin-stat-change-row">
                                      <strong>{formatFieldLabel(statName)}</strong>
                                      <span><span className="admin-old-value">{formatReviewValue(oldValue)}</span><span className="admin-change-arrow">→</span><span className="admin-new-value">{formatReviewValue(newValue)}</span></span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : change.field === "profilePicture" ? (
                              <div className="admin-picture-comparison">
                                <div><p className="admin-old-heading">Current</p>{change.oldValue ? <img src={change.oldValue} alt="Current profile" className="admin-review-image" /> : <div className="admin-empty-image">Empty</div>}</div>
                                <div><p className="admin-new-heading">Requested</p>{change.newValue ? <img src={change.newValue} alt="Requested profile" className="admin-review-image requested" /> : <div className="admin-empty-image requested">Empty</div>}</div>
                              </div>
                            ) : (
                              <div className="admin-simple-change"><span className="admin-old-value">{formatReviewValue(change.oldValue)}</span><span className="admin-change-arrow">→</span><span className="admin-new-value">{formatReviewValue(change.newValue)}</span></div>
                            )}
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="admin-no-changes-message">No actual value changes were found. The submitted values match the current approved profile.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </section>

      <section className="admin-season-footer">
        <div className="admin-season-footer-label">Season Administration</div>

        <button
          className="admin-advance-season-btn"
          type="button"
          onClick={() => {
            setSeasonConfirmText("");
            setShowSeasonConfirm(true);
          }}
          disabled={!currentSeason}
        >
          Advance Season →
        </button>

        <p>
          This will archive the current season and create a new one.
          <strong> Use with caution.</strong>
        </p>
      </section>

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
    </div>
  );
}

export default AdminDashboard;