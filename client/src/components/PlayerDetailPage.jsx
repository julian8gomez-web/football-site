import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SEASON_STAT_FIELDS = [
  "passingCompletions",
  "passingAttempts",
  "passingYards",
  "passingTouchdowns",
  "interceptionsThrown",
  "carries",
  "rushingYards",
  "rushingTouchdowns",
  "receptions",
  "receivingYards",
  "receivingTouchdowns",
  "pancakeBlocks",
  "sacksAllowed",
  "gamesStarted",
  "tackles",
  "tacklesForLoss",
  "sacks",
  "interceptions",
  "passBreakups",
  "forcedFumbles",
  "qbHurries",
  "touchdowns"
];

function PlayerDetailPage({ approvedPlayers, useSlug = false }) {
  const { id, slug } = useParams();
  const navigate = useNavigate();
    useEffect(() => {
    const scrollToPlayerProfile = () => {
      if (window.innerWidth <= 760) {
        const playerProfile = document.querySelector(".detail-hero");

        playerProfile?.scrollIntoView({
          behavior: "auto",
          block: "start"
        });
      }
    };

    const animationFrame = window.requestAnimationFrame(
      scrollToPlayerProfile
    );

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [id, slug]);
  const [activeTab, setActiveTab] = useState("football");
  const [showPreviousSeasons, setShowPreviousSeasons] = useState(false);

  const player = useSlug
    ? approvedPlayers.find((p) => p.slug === slug)
    : approvedPlayers.find((p) => p._id === id);

  if (!player) {
    return (
      <div className="card">
        <p>Player not found.</p>
        <button className="secondary-button" onClick={() => navigate("/")}>
          Back to Roster
        </button>
      </div>
    );
  }

  const positions = [
    player.position1,
    player.position2,
    ...(player.position ? player.position.split("/") : [])
  ]
    .filter(Boolean)
    .map((p) => p.trim().toUpperCase());

  const initials = (player.name || "CH")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showStat = (label, value) => {
    if (value === undefined || value === null || value === "") return null;

    return (
      <div className="detail-stat-row">
        <span className="detail-stat-label">{label}</span>
        <span className="detail-stat-value">{value}</span>
      </div>
    );
  };

  const hasValue = (value) =>
    value !== undefined && value !== null && value !== "";

  const hasAnyStats = (stats, fields) =>
    fields.some((field) => hasValue(stats?.[field]));

  const seasonStats = Array.isArray(player.seasonStats)
    ? [...player.seasonStats]
    : [];

  seasonStats.sort((a, b) => {
    const aYear = Number.parseInt(a.season, 10) || 0;
    const bYear = Number.parseInt(b.season, 10) || 0;
    return bYear - aYear;
  });

  const currentSeasonStats =
    seasonStats.find((season) => season.isCurrent) || seasonStats[0] || null;

  const previousSeasonStats = seasonStats.filter(
    (season) => season._id !== currentSeasonStats?._id && season !== currentSeasonStats
  );

  const careerTotals = SEASON_STAT_FIELDS.reduce((totals, field) => {
    totals[field] = seasonStats.reduce((sum, season) => {
      const value = Number(season?.[field]);
      return Number.isFinite(value) ? sum + value : sum;
    }, 0);

    return totals;
  }, {});

  const careerHasField = (field) =>
    seasonStats.some((season) => hasValue(season?.[field]));

  const careerHasAny = (fields) => fields.some(careerHasField);

  const showQB = positions.includes("QB");
  const showRB = positions.includes("RB") || positions.includes("ATH");
  const showWR =
    positions.includes("WR") ||
    positions.includes("TE") ||
    positions.includes("ATH");
  const showOL =
    positions.includes("OL") ||
    positions.includes("T") ||
    positions.includes("G") ||
    positions.includes("C");

  const showDefense =
    positions.includes("ATH") ||
    positions.some((p) =>
      ["DB", "CB", "S", "OLB", "MLB", "LB", "DE", "DL"].includes(p)
    );
const STAT_GROUPS = [
  {
    title: "Passing",
    show: () => showQB,
    fields: [
      ["Completions", "passingCompletions"],
      ["Attempts", "passingAttempts"],
      ["Passing Yards", "passingYards"],
      ["Passing TDs", "passingTouchdowns"],
      ["Interceptions Thrown", "interceptionsThrown"]
    ]
  },

  {
    title: "Rushing",
    show: () => showQB || showRB,
    fields: [
      ["Carries", "carries"],
      ["Rushing Yards", "rushingYards"],
      ["Rushing TDs", "rushingTouchdowns"]
    ]
  },

  {
    title: "Receiving",
    show: () => showWR,
    fields: [
      ["Receptions", "receptions"],
      ["Receiving Yards", "receivingYards"],
      ["Receiving TDs", "receivingTouchdowns"]
    ]
  },

  {
    title: "Offensive Line",
    show: () => showOL,
    fields: [
      ["Games Started", "gamesStarted"],
      ["Pancake Blocks", "pancakeBlocks"],
      ["Sacks Allowed", "sacksAllowed"]
    ]
  },

  {
    title: "Defense",
    show: () => showDefense,
    fields: [
      ["Tackles", "tackles"],
      ["Tackles For Loss", "tacklesForLoss"],
      ["Sacks", "sacks"],
      ["Interceptions", "interceptions"],
      ["Pass Breakups", "passBreakups"],
      ["Forced Fumbles", "forcedFumbles"],
      ["QB Hurries", "qbHurries"]
    ]
  }
];
  const renderProductionStats = (stats, useCareerTotals = false) => {
  if (!stats) {
    return (
      <p className="detail-empty">
        Football statistics have not been submitted yet.
      </p>
    );
  }

  const fieldHasData = (field) => {
    if (useCareerTotals) {
      return careerHasField(field);
    }

    return hasValue(stats[field]);
  };

  const visibleGroups = STAT_GROUPS.map((group) => ({
    ...group,
    visibleFields: group.fields.filter(([, field]) =>
      fieldHasData(field)
    )
  })).filter(
    (group) =>
      group.show() &&
      group.visibleFields.length > 0
  );

  if (visibleGroups.length === 0) {
    return (
      <p className="detail-empty">
        Football statistics have not been submitted yet.
      </p>
    );
  }

  const offensiveGroups = visibleGroups.filter(
    (group) => group.title !== "Defense"
  );

  const defensiveGroup = visibleGroups.find(
    (group) => group.title === "Defense"
  );

  return (
    <>
      {offensiveGroups.length > 0 && (
        <div className="production-group-header offense-header">
          OFFENSE
        </div>
      )}

      {offensiveGroups.map((group) => (
        <div
          key={group.title}
          style={{ marginBottom: "20px" }}
        >
          <h4 className="detail-subsection-title">
            {group.title}
          </h4>

          {group.visibleFields.map(([label, field]) => (
            <div key={field}>
              {showStat(label, stats[field])}
            </div>
          ))}
        </div>
      ))}

      {defensiveGroup && (
        <>
          <div className="production-group-header defense-header">
            DEFENSE
          </div>

          <div>
            {defensiveGroup.visibleFields.map(
              ([label, field]) => (
                <div key={field}>
                  {showStat(label, stats[field])}
                </div>
              )
            )}
          </div>
        </>
      )}
    </>
  );
};

  return (
    <div className="detail-page">

      <div className="detail-hero">
        <div className="detail-hero-inner">
          <div className="detail-avatar">
            {player.profilePicture ? (
              <img src={player.profilePicture} alt={player.name} />
            ) : (
              initials
            )}
          </div>

          <div className="detail-hero-content">
            <h1 className="detail-name">{player.name}</h1>

            <p className="detail-role-line">
  {player.position || "Position"}
  {player.playerClass && ` • Class of ${player.playerClass}`}
</p>

<p className="detail-school-line">
  Capt. John L. Chapin High School
</p>

            <div className="detail-meta">
  {player.jerseyNumber && (
    <div className="detail-meta-item">
      <small>Jersey</small>
      <strong>#{player.jerseyNumber}</strong>
    </div>
  )}

  {player.height && (
    <div className="detail-meta-item">
      <small>Height</small>
      <strong>{player.height}</strong>
    </div>
  )}

  {player.weight && (
    <div className="detail-meta-item">
      <small>Weight</small>
      <strong>{player.weight} lbs</strong>
    </div>
  )}

  {player.location && (
    <div className="detail-meta-item">
      <small>Location</small>
      <strong>{player.location}</strong>
    </div>
  )}

  {player.ncaaId && (
    <div className="detail-meta-item">
      <small>NCAA ID</small>
      <strong>{player.ncaaId}</strong>
    </div>
  )}
</div>

            <div className="action-row">
  {player.hudlLink && (
    <a
      href={player.hudlLink}
      target="_blank"
      rel="noreferrer"
      className="detail-action-btn hudl-action-btn"
    >
      Watch Film
    </a>
  )}

  {player.slug && (
    <button
      className="detail-action-btn copy-action-btn"
      type="button"
      onClick={async () => {
  const profileLink = `${window.location.origin}/player/${player.slug}`;

  await navigator.clipboard.writeText(profileLink);

  const toast = document.createElement("div");

  toast.className = "copy-toast";

  toast.textContent = "✅ Recruiting profile copied";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2200);
}}
    >
      Copy Profile
    </button>
  )}
</div>
          </div>
        </div>
      </div>

      

      
      <div className="profile-tabs">
        <button
          type="button"
          className={activeTab === "football" ? "profile-tab active" : "profile-tab"}
          onClick={() => setActiveTab("football")}
        >
          Football Production
        </button>
        <button
          type="button"
          className={activeTab === "testing" ? "profile-tab active" : "profile-tab"}
          onClick={() => setActiveTab("testing")}
        >
          Athletic Testing
        </button>
        
        <button
          type="button"
          className={activeTab === "academics" ? "profile-tab active" : "profile-tab"}
          onClick={() => setActiveTab("academics")}
        >
          Academics
        </button>
        <button
          type="button"
          className={activeTab === "recruiting" ? "profile-tab active" : "profile-tab"}
          onClick={() => setActiveTab("recruiting")}
        >
          Recruiting & Exposure
        </button>
      </div>

      <div className="detail-grid">
        

        {activeTab === "testing" && (
          <div className="detail-card">
            <h3 className="detail-card-title">Athletic Testing</h3>
            {showStat(
              "40-Yard Dash",
              player.fortyTime ? `${player.fortyTime} sec` : ""
            )}
            {showStat("Vertical", player.vertical ? `${player.vertical}\"` : "")}
            {showStat("Broad Jump", player.broadJump)}
            {showStat(
              "Bench Press",
              player.benchMax ? `${player.benchMax} lbs` : ""
            )}
            {showStat(
              "Power Clean",
              player.cleanMax ? `${player.cleanMax} lbs` : ""
            )}
            {showStat(
              "Back Squat",
              player.squatMax ? `${player.squatMax} lbs` : ""
            )}
          </div>
        )}

        {activeTab === "football" && (
          <div className="detail-card">
            <h3 className="detail-card-title">Football Production</h3>

            <section className="season-production-section current-season-section">
              <div className="season-production-heading">
                <div>
                  <p className="season-production-kicker">Current Season</p>
                  <h4>{currentSeasonStats?.season || "No current season"}</h4>
                </div>
                {currentSeasonStats?.isCurrent && (
                  <span className="season-current-badge">Current</span>
                )}
              </div>

              {renderProductionStats(currentSeasonStats)}
            </section>

            <section className="season-production-section career-totals-section">
              <div className="season-production-heading">
                <div>
                  <p className="season-production-kicker">Career Totals</p>
                  <h4>{seasonStats.length} season{seasonStats.length === 1 ? "" : "s"}</h4>
                </div>
              </div>

              {seasonStats.length > 0 ? (
                renderProductionStats(careerTotals, true)
              ) : (
                <p className="detail-empty">
                  Career totals are not available yet.
                </p>
              )}
            </section>

            {previousSeasonStats.length > 0 && (
              <section className="season-production-section previous-seasons-section">
                <button
                  type="button"
                  className="previous-seasons-toggle"
                  onClick={() => setShowPreviousSeasons(!showPreviousSeasons)}
                  aria-expanded={showPreviousSeasons}
                >
                  {showPreviousSeasons ? "Hide" : "View"} Previous Seasons
                  <span>{showPreviousSeasons ? "▲" : "▼"}</span>
                </button>

                {showPreviousSeasons && (
                  <div className="previous-seasons-list">
                    {previousSeasonStats.map((season) => (
                      <div
                        className="previous-season-card"
                        key={season._id || season.season}
                      >
                        <h4>{season.season}</h4>
                        {renderProductionStats(season)}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {activeTab === "academics" && (
          <div className="detail-card">
            <h3 className="detail-card-title">Academics</h3>
            {showStat("GPA", player.gpa)}
            {showStat("NCAA ID", player.ncaaId)}
          </div>
        )}

        {activeTab === "recruiting" && (
          <div className="detail-card">
            <h3 className="detail-card-title">Recruiting & Exposure</h3>
            {showStat("Hudl", player.hudlLink)}
            {showStat("Twitter / X", player.twitter)}
            {showStat("Phone", player.phoneNumber)}
            {showStat("Email", player.emailAddress)}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerDetailPage;