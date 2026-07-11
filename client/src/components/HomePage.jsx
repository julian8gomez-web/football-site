import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage({
  approvedPlayers,
  searchTerm,
  setSearchTerm,
  positionFilter,
  setPositionFilter,
  classFilter,
  setClassFilter,
  heightFilter,
  setHeightFilter,
  weightFilter,
  setWeightFilter,
  fortyFilter,
  setFortyFilter,
  verticalFilter,
  setVerticalFilter
}) {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const [draftPosition, setDraftPosition] = useState(positionFilter);
  const [draftClass, setDraftClass] = useState(classFilter);
  const [draftHeight, setDraftHeight] = useState(heightFilter);
  const [draftWeight, setDraftWeight] = useState(weightFilter);
  const [draftForty, setDraftForty] = useState(fortyFilter);
  const [draftVertical, setDraftVertical] = useState(verticalFilter);
  const applyFilters = () => {
  setPositionFilter(draftPosition);
  setClassFilter(draftClass);
  setHeightFilter(draftHeight);
  setWeightFilter(draftWeight);
  setFortyFilter(draftForty);
  setVerticalFilter(draftVertical);

  setShowFilters(false);
};

const resetFilters = () => {
  setSearchTerm("");

  setDraftPosition("");
  setDraftClass("");
  setDraftHeight("");
  setDraftWeight("");
  setDraftForty("");
  setDraftVertical("");

  setPositionFilter("");
  setClassFilter("");
  setHeightFilter("");
  setWeightFilter("");
  setFortyFilter("");
  setVerticalFilter("");

  setShowFilters(false);
};
const heightOptions = [
  { label: "Any", value: "" },
  { label: `5'8"+`, value: "68" },
  { label: `5'10"+`, value: "70" },
  { label: `6'0"+`, value: "72" },
  { label: `6'2"+`, value: "74" },
  { label: `6'4"+`, value: "76" }
];

const weightOptions = [
  { label: "Any", value: "" },
  { label: "150+", value: "150" },
  { label: "175+", value: "175" },
  { label: "200+", value: "200" },
  { label: "225+", value: "225" },
  { label: "250+", value: "250" }
];

const fortyOptions = [
  { label: "Any", value: "" },
  { label: "≤ 4.40", value: "4.40" },
  { label: "≤ 4.50", value: "4.50" },
  { label: "≤ 4.60", value: "4.60" },
  { label: "≤ 4.70", value: "4.70" },
  { label: "≤ 4.80", value: "4.80" }
];

const verticalOptions = [
  { label: "Any", value: "" },
  { label: `20"+`, value: "20" },
  { label: `25"+`, value: "25" },
  { label: `30"+`, value: "30" },
  { label: `35"+`, value: "35" },
  { label: `40"+`, value: "40" }
];
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
      <div className="roster-header">
  <p className="roster-kicker">Chapin Husky Football</p>
  <h2>Recruiting Profiles</h2>
  <p>
    {approvedPlayers.length} approved athlete
    {approvedPlayers.length === 1 ? "" : "s"} available for review.
  </p>
</div>

      <div className="roster-filter-card">
  <div className="roster-filter-header">
    <div>
      <h3>Recruiting Filters</h3>
      <p>
        Find athletes by name, position, graduation class, or measurable.
      </p>
    </div>

    <strong>
      {approvedPlayers.length} athlete
      {approvedPlayers.length === 1 ? "" : "s"} found
    </strong>
  </div>

  <div className="filter-search-row">
    <input
      type="text"
      placeholder="Search by player name"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    <button
      type="button"
      className="filter-toggle-btn"
      onClick={() => setShowFilters(!showFilters)}
    >
      {showFilters ? "Hide Filters ▲" : "More Filters ▼"}
    </button>
  </div>

  {showFilters && (
    <div className="advanced-filter-panel">
      <div className="advanced-filter-grid">
        <div className="filter-field">
          <label htmlFor="position-filter">Position</label>

          <select
            id="position-filter"
            value={draftPosition}
            onChange={(e) => setDraftPosition(e.target.value)}
          >
            <option value="">All Positions</option>

            {uniquePositions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="class-filter">Graduation Class</label>

          <select
            id="class-filter"
            value={draftClass}
            onChange={(e) => setDraftClass(e.target.value)}
          >
            <option value="">All Classes</option>

            {uniqueClasses.map((playerClass) => (
              <option key={playerClass} value={playerClass}>
                {playerClass}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="height-filter">Minimum Height</label>

          <select
            id="height-filter"
            value={draftHeight}
            onChange={(e) => setDraftHeight(e.target.value)}
          >
            {heightOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="weight-filter">Minimum Weight</label>

          <select
            id="weight-filter"
            value={draftWeight}
            onChange={(e) => setDraftWeight(e.target.value)}
          >
            {weightOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="forty-filter">Maximum 40 Time</label>

          <select
            id="forty-filter"
            value={draftForty}
            onChange={(e) => setDraftForty(e.target.value)}
          >
            {fortyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="vertical-filter">Minimum Vertical</label>

          <select
            id="vertical-filter"
            value={draftVertical}
            onChange={(e) => setDraftVertical(e.target.value)}
          >
            {verticalOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="advanced-filter-actions">
        <button
          type="button"
          className="filter-apply-btn"
          onClick={applyFilters}
        >
          Apply Filters
        </button>

        <button
          type="button"
          className="filter-reset-btn"
          onClick={resetFilters}
        >
          Reset All
        </button>
      </div>
    </div>
  )}
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
const formatNumber = (value) => {
  if (value === undefined || value === null || value === "") return "N/A";

  const num = Number(value);

  if (Number.isNaN(num)) return value;

  return num.toLocaleString();
};

const positions = [
  p.position1,
  p.position2,
  ...(p.position ? p.position.split("/") : [])
]
  .filter(Boolean)
  .map((pos) => pos.trim().toUpperCase());

let featureLabel = "VERT";
let featureValue = p.vertical ? `${p.vertical}"` : "N/A";

if (positions.includes("QB")) {
  featureLabel = "PASS YDS";
  featureValue = formatNumber(p.passingYards);

} else if (positions.includes("RB")) {
  featureLabel = "RUSH YDS";
  featureValue = formatNumber(p.rushingYards);

} else if (positions.includes("WR") || positions.includes("TE")) {
  featureLabel = "REC YDS";
  featureValue = formatNumber(p.receivingYards);

} else if (
  positions.includes("OL") ||
  positions.includes("T") ||
  positions.includes("G") ||
  positions.includes("C")
) {
  featureLabel = "PANCAKES";
  featureValue = formatNumber(p.pancakeBlocks);

} else if (positions.includes("DE")) {

  if (Number(p.sacks) > 0) {
    featureLabel = "SACKS";
    featureValue = formatNumber(p.sacks);
  } else {
    featureLabel = "TACKLES";
    featureValue = formatNumber(p.tackles);
  }

} else if (positions.includes("DL")) {

  if (Number(p.sacks) > 0) {
    featureLabel = "SACKS";
    featureValue = formatNumber(p.sacks);
  } else {
    featureLabel = "TACKLES";
    featureValue = formatNumber(p.tackles);
  }

} else if (
  positions.includes("OLB") ||
  positions.includes("MLB") ||
  positions.includes("LB")
) {
  featureLabel = "TACKLES";
  featureValue = formatNumber(p.tackles);

} else if (
  positions.includes("DB") ||
  positions.includes("CB") ||
  positions.includes("S")
) {
  featureLabel = "INT";
  featureValue = formatNumber(p.interceptions);

} else if (positions.includes("ATH")) {
  featureLabel = "ALL-PURP YDS";

  const totalYards =
    Number(p.rushingYards || 0) +
    Number(p.receivingYards || 0) +
    Number(p.passingYards || 0);

  featureValue = totalYards > 0
    ? formatNumber(totalYards)
    : "N/A";
}
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
                  <div className="player-card-position-line">
  {p.position1 && <span>{p.position1}</span>}
  {p.position1 && p.position2 && <span>•</span>}
  {p.position2 && <span>{p.position2}</span>}
  {!p.position1 && !p.position2 && <span>{p.position || "Position N/A"}</span>}
</div>

<div className="player-card-class-line">
  {p.playerClass && <span>Class {p.playerClass}</span>}
  {p.jerseyNumber && <span>•</span>}
  {p.jerseyNumber && <span>#{p.jerseyNumber}</span>}
</div>
                </div>

               <div className="player-card-body">
  <div className="player-card-measurables">

  {p.height && (
    <div className="player-measure">
      <small>HT</small>
      <strong>{p.height}</strong>
    </div>
  )}

  {p.weight && (
    <div className="player-measure">
      <small>WT</small>
      <strong>{p.weight}</strong>
    </div>
  )}

  {p.fortyTime && (
    <div className="player-measure">
      <small>40</small>
      <strong>{p.fortyTime}</strong>
    </div>
  )}

  <div className="player-measure featured-measure">
  <small>{featureLabel}</small>
  <strong>{featureValue}</strong>
</div>

</div>

  <p className="player-card-link-text">View Profile →</p>
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