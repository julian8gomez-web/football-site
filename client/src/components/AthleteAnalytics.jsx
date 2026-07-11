function AthleteAnalytics({ approvedPlayers }) {
  const players = approvedPlayers || [];

  const totalPlayers = players.length;

  const getValidNumberValues = (fieldName) => {
    return players
      .map((player) => Number(player[fieldName]))
      .filter((value) => Number.isFinite(value) && value > 0);
  };

  const calculateAverage = (values, decimals = 1) => {
    if (values.length === 0) return "N/A";

    const total = values.reduce((sum, value) => sum + value, 0);

    return (total / values.length).toFixed(decimals);
  };

  const gpaValues = getValidNumberValues("gpa");
  const weightValues = getValidNumberValues("weight");
  const fortyValues = getValidNumberValues("fortyTime");
  const verticalValues = getValidNumberValues("vertical");
  const benchValues = getValidNumberValues("benchMax");
  const squatValues = getValidNumberValues("squatMax");

  const averageGpa = calculateAverage(gpaValues, 2);
  const averageWeight = calculateAverage(weightValues, 0);
  const averageForty = calculateAverage(fortyValues, 2);
  const averageVertical = calculateAverage(verticalValues, 1);
  const averageBench = calculateAverage(benchValues, 0);
  const averageSquat = calculateAverage(squatValues, 0);
    const getTopPlayers = (fieldName, direction = "desc", limit = 3) => {
    return players
      .filter((player) => {
        const value = Number(player[fieldName]);

        return Number.isFinite(value) && value > 0;
      })
      .sort((playerA, playerB) => {
        const valueA = Number(playerA[fieldName]);
        const valueB = Number(playerB[fieldName]);

        return direction === "asc"
          ? valueA - valueB
          : valueB - valueA;
      })
      .slice(0, limit);
  };

  const topFortyPlayers = getTopPlayers("fortyTime", "asc");
  const topVerticalPlayers = getTopPlayers("vertical", "desc");
  const topBenchPlayers = getTopPlayers("benchMax", "desc");
  const topSquatPlayers = getTopPlayers("squatMax", "desc");
  const topGpaPlayers = getTopPlayers("gpa", "desc");
  const formatRankingValue = (fieldName, value) => {
  if (fieldName === "fortyTime") {
    return `${Number(value).toFixed(2)} sec`;
  }

  if (fieldName === "vertical") {
    return `${Number(value).toFixed(1)}"`;
  }

  if (fieldName === "gpa") {
    return Number(value).toFixed(2);
  }

  return `${Number(value).toLocaleString()} lbs`;
};
    const positionCounts = {};

  players.forEach((player) => {
    const playerPositions = [
      player.position1,
      player.position2,
      ...(player.position ? player.position.split("/") : [])
    ]
      .filter(Boolean)
      .map((position) => position.trim().toUpperCase());

    const uniquePlayerPositions = [...new Set(playerPositions)];

    uniquePlayerPositions.forEach((position) => {
      positionCounts[position] = (positionCounts[position] || 0) + 1;
    });
  });

  const positionOrder = [
    "QB",
    "RB",
    "WR",
    "TE",
    "OL",
    "T",
    "G",
    "C",
    "DE",
    "DL",
    "OLB",
    "MLB",
    "LB",
    "DB",
    "CB",
    "S",
    "ATH",
    "K",
    "P",
    "LS"
  ];

  const positionBreakdown = Object.entries(positionCounts).sort(
    ([positionA], [positionB]) => {
      const indexA = positionOrder.indexOf(positionA);
      const indexB = positionOrder.indexOf(positionB);

      if (indexA === -1 && indexB === -1) {
        return positionA.localeCompare(positionB);
      }

      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    }
  );

  const highestPositionCount =
    positionBreakdown.length > 0
      ? Math.max(...positionBreakdown.map(([, count]) => count))
      : 0;

          const classCounts = {};

  players.forEach((player) => {
    if (!player.playerClass) return;

    const playerClass = String(player.playerClass).trim();

    if (!playerClass) return;

    classCounts[playerClass] = (classCounts[playerClass] || 0) + 1;
  });

  const classBreakdown = Object.entries(classCounts).sort(
    ([classA], [classB]) => Number(classA) - Number(classB)
  );

  const highestClassCount =
    classBreakdown.length > 0
      ? Math.max(...classBreakdown.map(([, count]) => count))
      : 0;
  const PerformerCard = ({
  title,
  fieldName,
  rankedPlayers
}) => {
  return (
    <div className="performer-card">
      <div className="performer-card-header">
        <p>Top Performers</p>
        <h4>{title}</h4>
      </div>

      {rankedPlayers.length === 0 ? (
        <p className="performer-empty">
          No qualifying player data is available.
        </p>
      ) : (
        <div className="performer-list">
          {rankedPlayers.map((player, index) => (
            <div className="performer-row" key={player._id}>
              <div className="performer-rank">
                {index + 1}
              </div>

              <div className="performer-player">
                <strong>
                  {player.name || "Unnamed Athlete"}
                </strong>

                <span>
                  {player.position1 ||
                    player.position ||
                    "Position N/A"}
                </span>
              </div>

              <div className="performer-value">
                {formatRankingValue(
                  fieldName,
                  player[fieldName]
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
  return (
    <div className="athlete-analytics-page">
      <div className="athlete-analytics-header">
        <p className="team-dashboard-kicker">Chapin Husky Football</p>

        <h2>Athlete Analytics</h2>

        <p>
          Review roster measurements, academics, strength numbers, and
          recruiting data.
        </p>
      </div>

      <section className="analytics-section">
  <div className="analytics-section-heading">
    <div>
      <p className="analytics-section-kicker">Roster Composition</p>
      <h3>Position Breakdown</h3>
    </div>

    <span className="analytics-section-note">
      Primary and secondary positions included
    </span>
  </div>

  {positionBreakdown.length === 0 ? (
    <div className="analytics-placeholder-card">
      <p>No position information is currently available.</p>
    </div>
  ) : (
    <div className="analytics-breakdown-card">
      {positionBreakdown.map(([position, count]) => {
        const barWidth =
          highestPositionCount > 0
            ? (count / highestPositionCount) * 100
            : 0;

        return (
          <div className="analytics-breakdown-row" key={position}>
            <div className="analytics-breakdown-label">
              <strong>{position}</strong>
              <span>
                {count} athlete{count === 1 ? "" : "s"}
              </span>
            </div>

            <div className="analytics-breakdown-track">
              <div
                className="analytics-breakdown-fill"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  )}
</section>
<section className="analytics-section">
  <div className="analytics-section-heading">
    <div>
      <p className="analytics-section-kicker">
        Leaderboard
      </p>

      <h3>Top Performers</h3>
    </div>

    <span className="analytics-section-note">
      Rankings use approved player profiles
    </span>
  </div>

  <div className="performer-grid">
    <PerformerCard
      title="Fastest 40"
      fieldName="fortyTime"
      rankedPlayers={topFortyPlayers}
    />

    <PerformerCard
      title="Highest Vertical"
      fieldName="vertical"
      rankedPlayers={topVerticalPlayers}
    />

    <PerformerCard
      title="Strongest Bench"
      fieldName="benchMax"
      rankedPlayers={topBenchPlayers}
    />

    <PerformerCard
      title="Strongest Squat"
      fieldName="squatMax"
      rankedPlayers={topSquatPlayers}
    />

    <PerformerCard
      title="Highest GPA"
      fieldName="gpa"
      rankedPlayers={topGpaPlayers}
    />
  </div>
</section>
      <section className="analytics-section">
  <div className="analytics-section-heading">
    <div>
      <p className="analytics-section-kicker">Graduation Years</p>
      <h3>Class Breakdown</h3>
    </div>

    <span className="analytics-section-note">
      Approved profiles by graduation class
    </span>
  </div>

  {classBreakdown.length === 0 ? (
    <div className="analytics-placeholder-card">
      <p>No graduation class information is currently available.</p>
    </div>
  ) : (
    <div className="analytics-breakdown-card">
      {classBreakdown.map(([playerClass, count]) => {
        const barWidth =
          highestClassCount > 0
            ? (count / highestClassCount) * 100
            : 0;

        return (
          <div className="analytics-breakdown-row" key={playerClass}>
            <div className="analytics-breakdown-label">
              <strong>Class {playerClass}</strong>

              <span>
                {count} athlete{count === 1 ? "" : "s"}
              </span>
            </div>

            <div className="analytics-breakdown-track">
              <div
                className="analytics-breakdown-fill"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  )}
</section>
    </div>
  );
}

export default AthleteAnalytics;