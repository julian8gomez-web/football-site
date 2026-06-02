import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PlayerDetailPage({ approvedPlayers, useSlug = false }) {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);

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

  const initials = (player.name || "CH")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const hasAcademics =
    player.gpa ||
    player.fortyTime ||
    player.vertical ||
    (player.benchMax !== undefined && player.benchMax !== null) ||
    (player.cleanMax !== undefined && player.cleanMax !== null) ||
    (player.squatMax !== undefined && player.squatMax !== null);

  const hasFootballStats =
    (player.passingYards !== undefined && player.passingYards !== null) ||
    (player.rushingYards !== undefined && player.rushingYards !== null) ||
    (player.tackles !== undefined && player.tackles !== null) ||
    (player.sacks !== undefined && player.sacks !== null) ||
    (player.interceptions !== undefined && player.interceptions !== null) ||
    (player.touchdowns !== undefined && player.touchdowns !== null);

  return (
    <div className="detail-page">
      <button
        className="secondary-button detail-back-btn"
        onClick={() => navigate("/")}
      >
        ← Back to Roster
      </button>

      <div className="detail-hero">
        <div className="detail-hero-inner">
          <div className="detail-avatar">
            {player.profilePicture ? (
              <img src={player.profilePicture} alt={player.name} />
            ) : (
              initials
            )}
          </div>

          <div>
            <h1 className="detail-name">{player.name}</h1>

            <div className="detail-meta">
              {player.position && <span className="detail-pill">{player.position}</span>}
              {player.playerClass && <span className="detail-pill">Class {player.playerClass}</span>}
              {player.jerseyNumber && <span className="detail-pill">#{player.jerseyNumber}</span>}
              {player.height && <span className="detail-pill">{player.height}</span>}
              {player.weight && <span className="detail-pill">{player.weight}</span>}
              {player.location && <span className="detail-pill">{player.location}</span>}
            </div>

            <div className="action-row">
              {player.hudlLink && (
                <a
                  href={player.hudlLink}
                  target="_blank"
                  rel="noreferrer"
                  className="detail-action-btn contact-btn"
                >
                  View Hudl
                </a>
              )}

              {player.twitter && (
                <a
                  href={`https://twitter.com/${player.twitter.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="detail-action-btn"
                >
                  {player.twitter}
                </a>
              )}
{player.slug && (
  <button
    className="detail-action-btn"
    type="button"
    onClick={() => {
      const profileLink = `${window.location.origin}/player/${player.slug}`;
      navigator.clipboard.writeText(profileLink);
      alert("Profile link copied!");
    }}
  >
    Copy Profile Link
  </button>
)}
              <button
                className="detail-action-btn"
                onClick={() => setShowContact(!showContact)}
                type="button"
              >
                {showContact ? "Hide Contact" : "Contact Player"}
              </button>
            </div>

            <p className="detail-subtext">
              Explore this athlete’s profile, verified measurables, academic and testing data,
              and football production stats.
            </p>
          </div>
        </div>
      </div>

      <div className={`contact-slide ${showContact ? "open" : ""}`}>
        <div className="detail-card">
          <h3 className="detail-card-title">Contact Player</h3>

          {player.phoneNumber && (
            <div className="detail-stat-row">
              <span className="detail-stat-label">Phone</span>
              <span className="detail-stat-value">
                <a href={`tel:${player.phoneNumber}`} className="player-link">
                  {player.phoneNumber}
                </a>
              </span>
            </div>
          )}

          {player.emailAddress && (
            <div className="detail-stat-row">
              <span className="detail-stat-label">Email</span>
              <span className="detail-stat-value">
                <a href={`mailto:${player.emailAddress}`} className="player-link">
                  {player.emailAddress}
                </a>
              </span>
            </div>
          )}

          {!player.phoneNumber && !player.emailAddress && (
            <p className="detail-empty">No contact information available.</p>
          )}
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3 className="detail-card-title">Player Information</h3>

          {player.position && (
            <div className="detail-stat-row">
              <span className="detail-stat-label">Position</span>
              <span className="detail-stat-value">{player.position}</span>
            </div>
          )}

          {player.playerClass && (
            <div className="detail-stat-row">
              <span className="detail-stat-label">Class</span>
              <span className="detail-stat-value">{player.playerClass}</span>
            </div>
          )}

          {player.jerseyNumber && (
            <div className="detail-stat-row">
              <span className="detail-stat-label">Jersey #</span>
              <span className="detail-stat-value">{player.jerseyNumber}</span>
            </div>
          )}

          {player.height && (
            <div className="detail-stat-row">
              <span className="detail-stat-label">Height</span>
              <span className="detail-stat-value">{player.height}</span>
            </div>
          )}

          {player.weight && (
            <div className="detail-stat-row">
              <span className="detail-stat-label">Weight</span>
              <span className="detail-stat-value">{player.weight}</span>
            </div>
          )}

          {player.location && (
            <div className="detail-stat-row">
              <span className="detail-stat-label">Location</span>
              <span className="detail-stat-value">{player.location}</span>
            </div>
          )}

          {player.ncaaId && (
            <div className="detail-stat-row">
              <span className="detail-stat-label">NCAA ID</span>
              <span className="detail-stat-value">{player.ncaaId}</span>
            </div>
          )}

          {!player.position &&
            !player.playerClass &&
            !player.jerseyNumber &&
            !player.height &&
            !player.weight &&
            !player.location &&
            !player.ncaaId && (
              <p className="detail-empty">No player information available yet.</p>
            )}
        </div>

        <div className="detail-card">
          <h3 className="detail-card-title">Academics & Testing</h3>

          {hasAcademics ? (
            <>
              {player.gpa && (
                <div className="detail-stat-row">
                  <span className="detail-stat-label">GPA</span>
                  <span className="detail-stat-value">{player.gpa}</span>
                </div>
              )}

              {player.fortyTime && (
                <div className="detail-stat-row">
                  <span className="detail-stat-label">40 Time</span>
                  <span className="detail-stat-value">{player.fortyTime}</span>
                </div>
              )}

              {player.vertical && (
                <div className="detail-stat-row">
                  <span className="detail-stat-label">Vertical</span>
                  <span className="detail-stat-value">{player.vertical}</span>
                </div>
              )}

              {player.benchMax !== undefined && player.benchMax !== null && (
                <div className="detail-stat-row">
                  <span className="detail-stat-label">Bench</span>
                  <span className="detail-stat-value">{player.benchMax}</span>
                </div>
              )}

              {player.cleanMax !== undefined && player.cleanMax !== null && (
                <div className="detail-stat-row">
                  <span className="detail-stat-label">Clean</span>
                  <span className="detail-stat-value">{player.cleanMax}</span>
                </div>
              )}

              {player.squatMax !== undefined && player.squatMax !== null && (
                <div className="detail-stat-row">
                  <span className="detail-stat-label">Squat</span>
                  <span className="detail-stat-value">{player.squatMax}</span>
                </div>
              )}
            </>
          ) : (
            <p className="detail-empty">No academic or testing info available yet.</p>
          )}
        </div>

        <div className="detail-card">
          <h3 className="detail-card-title">Football Production</h3>

          {hasFootballStats ? (
            <>
              {player.passingYards !== undefined && player.passingYards !== null && (
                <div className="detail-stat-row">
                  <span className="detail-stat-label">Passing Yards</span>
                  <span className="detail-stat-value">{player.passingYards}</span>
                </div>
              )}

              {player.rushingYards !== undefined && player.rushingYards !== null && (
                <div className="detail-stat-row">
                  <span className="detail-stat-label">Rushing Yards</span>
                  <span className="detail-stat-value">{player.rushingYards}</span>
                </div>
              )}

              {player.tackles !== undefined && player.tackles !== null && (
                <div className="detail-stat-row">
                  <span className="detail-stat-label">Tackles</span>
                  <span className="detail-stat-value">{player.tackles}</span>
                </div>
              )}

              {player.sacks !== undefined && player.sacks !== null && (
                <div className="detail-stat-row">
                  <span className="detail-stat-label">Sacks</span>
                  <span className="detail-stat-value">{player.sacks}</span>
                </div>
              )}

              {player.interceptions !== undefined && player.interceptions !== null && (
                <div className="detail-stat-row">
                  <span className="detail-stat-label">Interceptions</span>
                  <span className="detail-stat-value">{player.interceptions}</span>
                </div>
              )}

              {player.touchdowns !== undefined && player.touchdowns !== null && (
                <div className="detail-stat-row">
                  <span className="detail-stat-label">Touchdowns</span>
                  <span className="detail-stat-value">{player.touchdowns}</span>
                </div>
              )}
            </>
          ) : (
            <p className="detail-empty">No football stats available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayerDetailPage;