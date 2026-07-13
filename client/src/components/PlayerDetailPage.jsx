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
  "kickoffReturns",
  "kickoffReturnYards",
  "puntReturns",
  "puntReturnYards",
  "fieldGoalsMade",
  "fieldGoalsAttempted",
  "longestFieldGoal",
  "extraPointsMade",
  "extraPointsAttempted",
  "kickoffs",
  "touchbacks",
  "punts",
  "puntYards",
  "longestPunt",
  "puntsInside20",
  "fairCatchesForced",
  "pancakeBlocks",
  "sacksAllowed",
  "gamesStarted",
  "soloTackles",
  "tackleAssists",
  "tackles",
  "tacklesForLoss",
  "sacks",
  "interceptions",
  "passBreakups",
  "forcedFumbles",
  "fumbleRecoveries",
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

    const shouldFormatWithCommas =
      label.toLowerCase().includes("yard");

    let displayValue = value;

    if (shouldFormatWithCommas) {
      const numericValue = Number(value);

      if (Number.isFinite(numericValue)) {
        displayValue = numericValue.toLocaleString("en-US");
      }
    }

    return (
      <div className="detail-stat-row">
        <span className="detail-stat-label">{label}</span>
        <span className="detail-stat-value">{displayValue}</span>
      </div>
    );
  };

  const renderRecruitingList = (title, items, type) => {
    const cleanItems = Array.isArray(items)
      ? items
          .map((item) => String(item).trim())
          .filter(Boolean)
      : [];

    return (
      <div className={`recruiting-list-section recruiting-${type}`}>
        <div className="recruiting-list-heading">
          <h4>{title}</h4>
          <span>
            {cleanItems.length}
          </span>
        </div>

        {cleanItems.length > 0 ? (
          <ul className="recruiting-list">
            {cleanItems.map((item, index) => (
              <li key={`${title}-${index}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="recruiting-list-empty">
            None reported.
          </p>
        )}
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

  const showQB =
    positions.includes("QB") ||
    positions.includes("ATH");
  const showRB = positions.includes("RB") || positions.includes("ATH");
  const showWR =
  positions.includes("WR") ||
  positions.includes("TE") ||
  positions.includes("RB") ||
  positions.includes("ATH");
  const showOL =
    positions.includes("OL") ||
    positions.includes("T") ||
    positions.includes("G") ||
    positions.includes("C");

  const showKicker = positions.includes("K");
  const showPunter = positions.includes("P");

  const showDefense =
    positions.includes("ATH") ||
    positions.some((p) =>
      ["DB", "CB", "S", "OLB", "MLB", "LB", "DE", "DL"].includes(p)
    );

  // Match the player dashboard: hide return statistics when every
  // listed position is QB, a lineman, K, or P.
  const returnHiddenPositions = [
    "QB",
    "OL",
    "T",
    "G",
    "C",
    "DE",
    "DL",
    "DT",
    "K",
    "P"
  ];

  const showSpecialTeamsReturns =
    positions.length > 0 &&
    positions.some(
      (position) => !returnHiddenPositions.includes(position)
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
    title: "Kicking",
    show: () => showKicker,
    fields: [
      ["Field Goals Made", "fieldGoalsMade"],
      ["Field Goals Attempted", "fieldGoalsAttempted"],
      ["Longest Field Goal", "longestFieldGoal"],
      ["Extra Points Made", "extraPointsMade"],
      ["Extra Points Attempted", "extraPointsAttempted"],
      ["Kickoffs", "kickoffs"],
      ["Touchbacks", "touchbacks"]
    ]
  },

  {
    title: "Punting",
    show: () => showPunter,
    fields: [
      ["Punts", "punts"],
      ["Punt Yards", "puntYards"],
      ["Longest Punt", "longestPunt"],
      ["Punts Inside 20", "puntsInside20"],
      ["Fair Catches Forced", "fairCatchesForced"]
    ]
  },

  {
    title: "Special Teams Returns",
    show: () => showSpecialTeamsReturns,
    fields: [
      ["Kickoff Returns", "kickoffReturns"],
      ["Kickoff Return Yards", "kickoffReturnYards"],
      ["Punt Returns", "puntReturns"],
      ["Punt Return Yards", "puntReturnYards"]
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
      ["Solo Tackles", "soloTackles"],
      ["Tackle Assists", "tackleAssists"],
      ["Tackles For Loss", "tacklesForLoss"],
      ["Sacks", "sacks"],
      ["Interceptions", "interceptions"],
      ["Pass Breakups", "passBreakups"],
      ["Forced Fumbles", "forcedFumbles"],
      ["Fumble Recoveries", "fumbleRecoveries"],
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

  const calculateAverage = (yards, attempts) => {
    const totalYards = Number(yards);
    const totalAttempts = Number(attempts);

    if (
      !Number.isFinite(totalYards) ||
      !Number.isFinite(totalAttempts) ||
      totalAttempts <= 0
    ) {
      return null;
    }

    return (totalYards / totalAttempts).toFixed(1);
  };

  const calculatePassingEfficiency = () => {
    const attempts = Number(stats.passingAttempts || 0);
    const completions = Number(stats.passingCompletions || 0);
    const passingYards = Number(stats.passingYards || 0);
    const passingTouchdowns = Number(stats.passingTouchdowns || 0);
    const interceptionsThrown = Number(stats.interceptionsThrown || 0);

    return {
      completionPercentage:
        attempts > 0
          ? `${((completions / attempts) * 100).toFixed(1)}%`
          : null,

      yardsPerAttempt:
        attempts > 0
          ? (passingYards / attempts).toFixed(1)
          : null,

      touchdownInterceptionRatio:
        interceptionsThrown > 0
          ? (passingTouchdowns / interceptionsThrown).toFixed(1)
          : passingTouchdowns > 0
            ? `${passingTouchdowns}:0`
            : null
    };
  };

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
    (group) =>
      group.title !== "Defense" &&
      group.title !== "Special Teams Returns" &&
      group.title !== "Kicking" &&
      group.title !== "Punting"
  );

  const kickingGroup = visibleGroups.find(
    (group) => group.title === "Kicking"
  );

  const puntingGroup = visibleGroups.find(
    (group) => group.title === "Punting"
  );

  const specialTeamsGroup = visibleGroups.find(
    (group) => group.title === "Special Teams Returns"
  );

  const defensiveGroup = visibleGroups.find(
    (group) => group.title === "Defense"
  );

  const touchdownFields = [
    "passingTouchdowns",
    "rushingTouchdowns",
    "receivingTouchdowns"
  ];

  const hasTouchdownData = useCareerTotals
    ? touchdownFields.some((field) => careerHasField(field))
    : touchdownFields.some((field) => hasValue(stats[field]));

  const totalTouchdowns =
    Number(stats.passingTouchdowns || 0) +
    Number(stats.rushingTouchdowns || 0) +
    Number(stats.receivingTouchdowns || 0);

  const hasAthTotalYardsData =
    positions.includes("ATH") &&
    (
      (useCareerTotals &&
        (
          careerHasField("rushingYards") ||
          careerHasField("receivingYards")
        )) ||
      (!useCareerTotals &&
        (
          hasValue(stats.rushingYards) ||
          hasValue(stats.receivingYards)
        ))
    );

  const athTotalYards =
    Number(stats.rushingYards || 0) +
    Number(stats.receivingYards || 0);

  const hasTackleBreakdown = useCareerTotals
    ? careerHasField("soloTackles") ||
      careerHasField("tackleAssists")
    : hasValue(stats.soloTackles) ||
      hasValue(stats.tackleAssists);

  const hasLegacyTackles = useCareerTotals
    ? careerHasField("tackles")
    : hasValue(stats.tackles);

  const totalTackles = hasTackleBreakdown
    ? Number(stats.soloTackles || 0) +
      Number(stats.tackleAssists || 0)
    : hasLegacyTackles
      ? Number(stats.tackles || 0)
      : null;

  return (
    <>
      {offensiveGroups.length > 0 && (
        <div className="production-group-header offense-header">
          OFFENSE
        </div>
      )}

      {offensiveGroups.map((group, groupIndex) => {
        let efficiencyRows = null;

        if (group.title === "Passing") {
          const {
            completionPercentage,
            yardsPerAttempt,
            touchdownInterceptionRatio
          } = calculatePassingEfficiency();

          if (
            completionPercentage ||
            yardsPerAttempt ||
            touchdownInterceptionRatio
          ) {
            efficiencyRows = (
              <>
                {showStat(
                  "Completion Percentage",
                  completionPercentage
                )}
                {showStat(
                  "Yards Per Attempt",
                  yardsPerAttempt
                )}
                {showStat(
                  "TD-to-INT Ratio",
                  touchdownInterceptionRatio
                )}
              </>
            );
          }
        }

        if (group.title === "Rushing") {
          const yardsPerCarry = calculateAverage(
            stats.rushingYards,
            stats.carries
          );

          if (yardsPerCarry) {
            efficiencyRows = showStat(
              "Yards Per Carry",
              yardsPerCarry
            );
          }
        }

        if (group.title === "Receiving") {
          const yardsPerReception = calculateAverage(
            stats.receivingYards,
            stats.receptions
          );

          if (yardsPerReception) {
            efficiencyRows = showStat(
              "Yards Per Reception",
              yardsPerReception
            );
          }
        }

        return (
          <div
            key={group.title}
            className="production-stat-group"
          >
            <h4 className="detail-subsection-title">
              {group.title}
            </h4>

            {group.visibleFields.map(([label, field]) => (
              <div key={field}>
                {showStat(label, stats[field])}
              </div>
            ))}

            {efficiencyRows && (
              <div className="calculated-stat-section">
                <div className="calculated-stat-heading efficiency-heading">
                  Efficiency
                </div>

                {efficiencyRows}
              </div>
            )}

            {hasTouchdownData &&
              groupIndex === offensiveGroups.length - 1 && (
                <div className="calculated-stat-section total-stat-section">
                  <div className="calculated-stat-heading totals-heading">
                    Totals
                  </div>

                  {showStat("Total Touchdowns", totalTouchdowns)}

                  {hasAthTotalYardsData &&
                    showStat("Total Yards", athTotalYards)}
                </div>
              )}
          </div>
        );
      })}

      {(kickingGroup || puntingGroup) && (
        <>
          <div className="production-group-header special-teams-header">
            SPECIAL TEAMS
          </div>

          {kickingGroup && (() => {
            const fieldGoalsAttempted = Number(stats.fieldGoalsAttempted || 0);
            const fieldGoalsMade = Number(stats.fieldGoalsMade || 0);
            const extraPointsAttempted = Number(stats.extraPointsAttempted || 0);
            const extraPointsMade = Number(stats.extraPointsMade || 0);
            const kickoffs = Number(stats.kickoffs || 0);
            const touchbacks = Number(stats.touchbacks || 0);

            const fieldGoalPercentage =
              fieldGoalsAttempted > 0
                ? `${((fieldGoalsMade / fieldGoalsAttempted) * 100).toFixed(1)}%`
                : null;

            const extraPointPercentage =
              extraPointsAttempted > 0
                ? `${((extraPointsMade / extraPointsAttempted) * 100).toFixed(1)}%`
                : null;

            const touchbackPercentage =
              kickoffs > 0
                ? `${((touchbacks / kickoffs) * 100).toFixed(1)}%`
                : null;

            return (
              <div className="production-stat-group">
                <h4 className="detail-subsection-title">
                  Kicking
                </h4>

                {kickingGroup.visibleFields.map(([label, field]) => (
                  <div key={field}>
                    {showStat(
                      label,
                      field === "longestFieldGoal" && hasValue(stats[field])
                        ? `${stats[field]} yds`
                        : stats[field]
                    )}
                  </div>
                ))}

                {(fieldGoalPercentage ||
                  extraPointPercentage ||
                  touchbackPercentage) && (
                  <div className="calculated-stat-section">
                    <div className="calculated-stat-heading efficiency-heading">
                      Efficiency
                    </div>

                    {showStat("Field Goal Percentage", fieldGoalPercentage)}
                    {showStat("PAT Percentage", extraPointPercentage)}
                    {showStat("Touchback Percentage", touchbackPercentage)}
                  </div>
                )}
              </div>
            );
          })()}

          {puntingGroup && (() => {
            const punts = Number(stats.punts || 0);
            const puntYards = Number(stats.puntYards || 0);
            const puntsInside20 = Number(stats.puntsInside20 || 0);

            const puntAverage =
              punts > 0
                ? (puntYards / punts).toFixed(1)
                : null;

            const inside20Percentage =
              punts > 0
                ? `${((puntsInside20 / punts) * 100).toFixed(1)}%`
                : null;

            return (
              <div className="production-stat-group">
                <h4 className="detail-subsection-title">
                  Punting
                </h4>

                {puntingGroup.visibleFields.map(([label, field]) => (
                  <div key={field}>
                    {showStat(
                      label,
                      field === "longestPunt" && hasValue(stats[field])
                        ? `${stats[field]} yds`
                        : stats[field]
                    )}
                  </div>
                ))}

                {(puntAverage || inside20Percentage) && (
                  <div className="calculated-stat-section">
                    <div className="calculated-stat-heading efficiency-heading">
                      Efficiency
                    </div>

                    {showStat("Punt Average", puntAverage)}
                    {showStat("Inside 20 Percentage", inside20Percentage)}
                  </div>
                )}
              </div>
            );
          })()}
        </>
      )}

      {offensiveGroups.length > 0 ? (
        <>
          {specialTeamsGroup && (
            <>
              <div className="production-group-header special-teams-header">
                SPECIAL TEAMS
              </div>

              <div className="production-stat-group">
                <h4 className="detail-subsection-title">
                  Returns
                </h4>

                {specialTeamsGroup.visibleFields.map(([label, field]) => (
                  <div key={field}>
                    {showStat(label, stats[field])}
                  </div>
                ))}

                {((
                  hasValue(stats.kickoffReturns) &&
                  Number(stats.kickoffReturns) > 0 &&
                  hasValue(stats.kickoffReturnYards)
                ) || (
                  hasValue(stats.puntReturns) &&
                  Number(stats.puntReturns) > 0 &&
                  hasValue(stats.puntReturnYards)
                )) && (
                  <div className="calculated-stat-section">
                    <div className="calculated-stat-heading efficiency-heading">
                      Efficiency
                    </div>

                    {hasValue(stats.kickoffReturns) &&
                      Number(stats.kickoffReturns) > 0 &&
                      hasValue(stats.kickoffReturnYards) &&
                      showStat(
                        "Kickoff Return Average",
                        calculateAverage(
                          stats.kickoffReturnYards,
                          stats.kickoffReturns
                        )
                      )}

                    {hasValue(stats.puntReturns) &&
                      Number(stats.puntReturns) > 0 &&
                      hasValue(stats.puntReturnYards) &&
                      showStat(
                        "Punt Return Average",
                        calculateAverage(
                          stats.puntReturnYards,
                          stats.puntReturns
                        )
                      )}
                  </div>
                )}

                {(hasValue(stats.kickoffReturnYards) ||
                  hasValue(stats.puntReturnYards)) && (
                  <div className="calculated-stat-section total-stat-section">
                    <div className="calculated-stat-heading totals-heading">
                      Totals
                    </div>

                    {showStat(
                      "Total Return Yards",
                      Number(stats.kickoffReturnYards || 0) +
                        Number(stats.puntReturnYards || 0)
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {defensiveGroup && (
            <>
              <div className="production-group-header defense-header">
                DEFENSE
              </div>

              <div className="production-stat-group">
                {defensiveGroup.visibleFields.map(
                  ([label, field]) => (
                    <div key={field}>
                      {showStat(label, stats[field])}
                    </div>
                  )
                )}

                {totalTackles !== null && (
                  <div className="calculated-stat-section total-stat-section">
                    <div className="calculated-stat-heading totals-heading">
                      Totals
                    </div>

                    {showStat("Total Tackles", totalTackles)}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {defensiveGroup && (
            <>
              <div className="production-group-header defense-header">
                DEFENSE
              </div>

              <div className="production-stat-group">
                {defensiveGroup.visibleFields.map(
                  ([label, field]) => (
                    <div key={field}>
                      {showStat(label, stats[field])}
                    </div>
                  )
                )}

                {totalTackles !== null && (
                  <div className="calculated-stat-section total-stat-section">
                    <div className="calculated-stat-heading totals-heading">
                      Totals
                    </div>

                    {showStat("Total Tackles", totalTackles)}
                  </div>
                )}
              </div>
            </>
          )}

          {specialTeamsGroup && (
            <>
              <div className="production-group-header special-teams-header">
                SPECIAL TEAMS
              </div>

              <div className="production-stat-group">
                <h4 className="detail-subsection-title">
                  Returns
                </h4>

                {specialTeamsGroup.visibleFields.map(([label, field]) => (
                  <div key={field}>
                    {showStat(label, stats[field])}
                  </div>
                ))}

                {((
                  hasValue(stats.kickoffReturns) &&
                  Number(stats.kickoffReturns) > 0 &&
                  hasValue(stats.kickoffReturnYards)
                ) || (
                  hasValue(stats.puntReturns) &&
                  Number(stats.puntReturns) > 0 &&
                  hasValue(stats.puntReturnYards)
                )) && (
                  <div className="calculated-stat-section">
                    <div className="calculated-stat-heading efficiency-heading">
                      Efficiency
                    </div>

                    {hasValue(stats.kickoffReturns) &&
                      Number(stats.kickoffReturns) > 0 &&
                      hasValue(stats.kickoffReturnYards) &&
                      showStat(
                        "Kickoff Return Average",
                        calculateAverage(
                          stats.kickoffReturnYards,
                          stats.kickoffReturns
                        )
                      )}

                    {hasValue(stats.puntReturns) &&
                      Number(stats.puntReturns) > 0 &&
                      hasValue(stats.puntReturnYards) &&
                      showStat(
                        "Punt Return Average",
                        calculateAverage(
                          stats.puntReturnYards,
                          stats.puntReturns
                        )
                      )}
                  </div>
                )}

                {(hasValue(stats.kickoffReturnYards) ||
                  hasValue(stats.puntReturnYards)) && (
                  <div className="calculated-stat-section total-stat-section">
                    <div className="calculated-stat-heading totals-heading">
                      Totals
                    </div>

                    {showStat(
                      "Total Return Yards",
                      Number(stats.kickoffReturnYards || 0) +
                        Number(stats.puntReturnYards || 0)
                    )}
                  </div>
                )}
              </div>
            </>
          )}
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
          <div className="detail-card recruiting-detail-card">
            <h3 className="detail-card-title">Recruiting & Exposure</h3>

            {(player.hudlLink ||
              player.twitter ||
              player.phoneNumber ||
              player.emailAddress) && (
              <section className="recruiting-contact-section">
                <div className="recruiting-section-heading">
                  <h4>Recruiting Links & Contact</h4>
                </div>

                <div className="recruiting-contact-grid">
                  {player.hudlLink && (
                    <a
                      href={player.hudlLink}
                      target="_blank"
                      rel="noreferrer"
                      className="recruiting-action-tile"
                    >
                      <span className="recruiting-action-icon" aria-hidden="true">
                        🎥
                      </span>
                      <strong>Watch Hudl Film</strong>
                      <span className="recruiting-action-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  )}

                  {player.twitter && (
                    <a
                      href={
                        player.twitter.startsWith("http")
                          ? player.twitter
                          : `https://x.com/${player.twitter.replace("@", "")}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="recruiting-action-tile"
                    >
                      <span className="recruiting-action-icon recruiting-x-icon" aria-hidden="true">
                        𝕏
                      </span>
                      <strong>View X Profile</strong>
                      <span className="recruiting-action-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  )}

                  {player.phoneNumber && (
                    <a
                      href={`tel:${player.phoneNumber}`}
                      className="recruiting-action-tile"
                    >
                      <span className="recruiting-action-icon" aria-hidden="true">
                        ☎
                      </span>
                      <strong>Call Athlete</strong>
                      <span className="recruiting-action-detail">
                        {player.phoneNumber}
                      </span>
                    </a>
                  )}

                  {player.emailAddress && (
                    <a
                      href={`mailto:${player.emailAddress}`}
                      className="recruiting-action-tile"
                    >
                      <span className="recruiting-action-icon" aria-hidden="true">
                        ✉
                      </span>
                      <strong>Email Athlete</strong>
                      <span className="recruiting-action-detail">
                        {player.emailAddress}
                      </span>
                    </a>
                  )}
                </div>
              </section>
            )}

            <section className="recruiting-activity-section">
              <div className="recruiting-section-heading">
                <h4>Recruiting Activity</h4>
              </div>

              <div className="recruiting-activity-grid">
                {renderRecruitingList(
                  "College Offers",
                  player.collegeOffers,
                  "offers"
                )}

                {renderRecruitingList(
                  "Schools Showing Interest",
                  player.collegesOfInterest,
                  "interest"
                )}

                {renderRecruitingList(
                  "Camp History",
                  player.campsAttended,
                  "camps"
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerDetailPage;