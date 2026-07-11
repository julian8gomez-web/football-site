import { useNavigate } from "react-router-dom";
function TeamDashboard({ approvedPlayers }) {
  const navigate = useNavigate();
      const players = approvedPlayers || [];

  const totalPlayers = players.length;

  const playersWithGpa = players.filter(
    (player) =>
      player.gpa !== undefined &&
      player.gpa !== null &&
      player.gpa !== "" &&
      Number.isFinite(Number(player.gpa))
  );

  const averageGpa =
    playersWithGpa.length > 0
      ? (
          playersWithGpa.reduce(
            (total, player) => total + Number(player.gpa),
            0
          ) / playersWithGpa.length
        ).toFixed(2)
      : "N/A";

  const playersWithWeight = players.filter(
    (player) =>
      player.weight !== undefined &&
      player.weight !== null &&
      player.weight !== "" &&
      Number.isFinite(Number(player.weight))
  );

  const averageWeight =
    playersWithWeight.length > 0
      ? Math.round(
          playersWithWeight.reduce(
            (total, player) => total + Number(player.weight),
            0
          ) / playersWithWeight.length
        )
      : "N/A";

  const playersWithForty = players.filter(
    (player) =>
      player.fortyTime !== undefined &&
      player.fortyTime !== null &&
      player.fortyTime !== "" &&
      Number.isFinite(Number(player.fortyTime))
  );

  const averageForty =
    playersWithForty.length > 0
      ? (
          playersWithForty.reduce(
            (total, player) => total + Number(player.fortyTime),
            0
          ) / playersWithForty.length
        ).toFixed(2)
      : "N/A";

  const playersWithVertical = players.filter(
    (player) =>
      player.vertical !== undefined &&
      player.vertical !== null &&
      player.vertical !== "" &&
      Number.isFinite(Number(player.vertical))
  );

  const averageVertical =
    playersWithVertical.length > 0
      ? (
          playersWithVertical.reduce(
            (total, player) => total + Number(player.vertical),
            0
          ) / playersWithVertical.length
        ).toFixed(1)
      : "N/A";
  return (
    <div className="team-dashboard-page">
      <div className="team-dashboard-header">
        <p className="team-dashboard-kicker">
          Chapin Husky Football
        </p>

        <h2>Team Dashboard</h2>

        <p>
          Internal coaching and recruiting management tools.
        </p>
      </div>
        <div className="analytics-summary-grid">
  <div className="analytics-summary-card">
    <small>Approved Athletes</small>
    <strong>{totalPlayers}</strong>
    <span>Active recruiting profiles</span>
  </div>

  <div className="analytics-summary-card">
    <small>Average GPA</small>
    <strong>{averageGpa}</strong>
    <span>
      Based on {playersWithGpa.length} athlete
      {playersWithGpa.length === 1 ? "" : "s"}
    </span>
  </div>

  <div className="analytics-summary-card">
    <small>Average Weight</small>
    <strong>
      {averageWeight === "N/A" ? "N/A" : `${averageWeight} lbs`}
    </strong>
    <span>
      Based on {playersWithWeight.length} athlete
      {playersWithWeight.length === 1 ? "" : "s"}
    </span>
  </div>

  <div className="analytics-summary-card">
    <small>Average 40 Time</small>
    <strong>
      {averageForty === "N/A" ? "N/A" : `${averageForty} sec`}
    </strong>
    <span>
      Based on {playersWithForty.length} athlete
      {playersWithForty.length === 1 ? "" : "s"}
    </span>
  </div>

  <div className="analytics-summary-card">
    <small>Average Vertical</small>
    <strong>
      {averageVertical === "N/A" ? "N/A" : `${averageVertical}"`}
    </strong>
    <span>
      Based on {playersWithVertical.length} athlete
      {playersWithVertical.length === 1 ? "" : "s"}
    </span>
  </div>
</div>
      <div className="team-dashboard-grid">
        <div
  className="team-dashboard-card team-dashboard-card-clickable"
  onClick={() => navigate("/team-dashboard/analytics")}
>
  <h3>Athlete Analytics</h3>

  <p>
    Review roster measurements, performance statistics,
    position breakdowns, and team leaderboards.
  </p>

  <span>Open Analytics →</span>
</div>

        <div className="team-dashboard-card">
          <h3>Recruiting Board</h3>

          <p>
            Organize athletes, recruiting priorities, evaluations,
            and coaching notes.
          </p>

          <span>Coming Soon</span>
        </div>

        <div className="team-dashboard-card">
          <h3>Roster Management</h3>

          <p>
            Manage athlete profiles, graduation classes, positions,
            and roster information.
          </p>

          <span>Coming Soon</span>
        </div>

        <div className="team-dashboard-card">
          <h3>Export Tools</h3>

          <p>
            Prepare recruiting data, roster reports, and athlete
            information for future exports.
          </p>

          <span>Coming Soon</span>
        </div>

        <div className="team-dashboard-card">
          <h3>Internal Recruiting Score</h3>

          <p>
            Future internal evaluation system for coaches and
            authorized staff.
          </p>

          <span>Planned Feature</span>
        </div>
      </div>
    </div>
  );
}

export default TeamDashboard;