import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

function PlayerDashboard({
  loadMyProfile,
  player,
  formData,
  handleChange,
  handleUpdateProfile,
  selectedImage,
  setSelectedImage,
  handleImageUpload
}) {
  const [activeTab, setActiveTab] = useState("personal");
  const workspaceRef = useRef(null);
  const hasPendingUpdates =
  
    player &&
    player.pendingUpdates &&
    Object.keys(player.pendingUpdates).length > 0;
const [imageSrc, setImageSrc] = useState(null);
const [showCrop, setShowCrop] = useState(false);
const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

const handleWholeNumberChange = (event) => {
  const digitsOnly = event.target.value.replace(/[^0-9]/g, "");

  event.target.value = digitsOnly;
  handleChange(event);
};
const footballPositions = [
  "QB",
  "RB",
  "WR",
  "TE",
  "ATH",
  "OL",
  "T",
  "G",
  "C",
  "DE",
  "DL",
  "LB",
  "OLB",
  "MLB",
  "DB",
  "CB",
  "S",
  "K",
  "P",
  "LS"
];

const specialTeamsPositions = ["K", "P", "LS"];

const secondaryPositionOptions =
  formData.position1 === "ATH"
    ? specialTeamsPositions
    : footballPositions.filter(
        (position) => position !== formData.position1
      );

useEffect(() => {
  if (!player || !workspaceRef.current) return;

  const scrollTimer = window.setTimeout(() => {
    workspaceRef.current?.scrollIntoView({
      behavior: "auto",
      block: "start"
    });
  }, 0);

  return () => window.clearTimeout(scrollTimer);
}, [player]);

  return (
    <div
      ref={workspaceRef}
      id="player-dashboard-workspace"
      className="private-dashboard-workspace player-dashboard-workspace"
    >
      <div className="private-dashboard-heading">
        <h2 className="section-title">Player Dashboard</h2>
        <p>Update your recruiting profile and season information.</p>
      </div>

      {!player && (
        <div className="message-box">
          Loading your profile...
        </div>
      )}

      {player && (
        <div>
          {hasPendingUpdates && (
            <div className="message-box" style={{ borderLeft: "5px solid #f59e0b" }}>
              <strong>Pending Review:</strong> You have profile changes waiting for admin approval.
            </div>
          )}
<div className="profile-tabs">
  <button
    type="button"
    className={activeTab === "personal" ? "profile-tab active" : "profile-tab"}
    onClick={() => setActiveTab("personal")}
  >
    Personal
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
    className={activeTab === "football" ? "profile-tab active" : "profile-tab"}
    onClick={() => setActiveTab("football")}
  >
    Football Production
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
          <form onSubmit={handleUpdateProfile} className="form-stack">
            {activeTab === "personal" && (
            <div className="card">
              <h3 className="detail-section-title">Basic Information</h3>

              <div className="form-stack">
                <label className="profile-input-field">
                  <span>Name</span>
                  <input name="name" value={formData.name} onChange={handleChange} />
                </label>

                <label className="profile-input-field">
                  <span>Primary Position</span>
                  <select
                    name="position1"
                    value={formData.position1}
                    onChange={handleChange}
                  >
                    <option value="">Select Position 1</option>

                    {footballPositions.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="profile-input-field">
                  <span>
                    {formData.position1 === "ATH"
                      ? "Special Teams Position (Optional)"
                      : "Secondary Position (Optional)"}
                  </span>
                  <select
                    name="position2"
                    value={formData.position2}
                    onChange={handleChange}
                  >
                    <option value="">Select Position 2</option>

                    {secondaryPositionOptions.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="profile-input-field">
                  <span>Graduation Class</span>
                  <input name="playerClass" value={formData.playerClass} onChange={handleChange} />
                </label>
                <label className="profile-input-field">
                  <span>Height — Feet</span>
                  <input
                    type="number"
                    name="heightFeet"
                    value={formData.heightFeet}
                    onChange={handleChange}
                  />
                </label>

<label className="profile-input-field">
                  <span>Height — Inches</span>
                  <input
                    type="number"
                    name="heightInches"
                    value={formData.heightInches}
                    onChange={handleChange}
                  />
                </label>
                <label className="profile-input-field">
                  <span>Weight (lbs)</span>
                  <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
                </label>
                <label className="profile-input-field">
                  <span>Jersey Number</span>
                  <input name="jerseyNumber" value={formData.jerseyNumber} onChange={handleChange} />
                </label>
               
              </div>
            </div>
            )}
            {activeTab === "recruiting" && (
            <div className="card">
              <h3 className="detail-section-title">Recruiting & Exposure</h3>

              <div className="form-stack">
  <input
    name="hudlLink"
    placeholder="Hudl Link"
    value={formData.hudlLink}
    onChange={handleChange}
  />

  <input
    name="twitter"
    placeholder="Twitter / X"
    value={formData.twitter}
    onChange={handleChange}
  />

  <input
    name="phoneNumber"
    placeholder="Phone Number"
    value={formData.phoneNumber}
    onChange={handleChange}
  />

  <input
    name="emailAddress"
    placeholder="Email Address"
    value={formData.emailAddress}
    onChange={handleChange}
  />

  <div className="stat-group">
  <h4>College Offers</h4>

  <p className="detail-empty" style={{ marginTop: 0 }}>
    List verified college offers. Enter one school per line.
  </p>

  <textarea
    name="collegeOffers"
    placeholder={"Example:\nUTEP\nNew Mexico State"}
    value={formData.collegeOffers}
    onChange={handleChange}
    rows="5"
  />
</div>

  <div className="stat-group">
    <h4>Camps Attended</h4>
    <p className="detail-empty" style={{ marginTop: 0 }}>
      Enter one camp per line.
    </p>
    <textarea
      name="campsAttended"
      placeholder={"Example:\nUTEP Prospect Camp\nTexas Tech Mega Camp"}
      value={formData.campsAttended}
      onChange={handleChange}
      rows="5"
    />
  </div>

  <div className="stat-group">
    <h4>Schools Showing Interest</h4>
    <p className="detail-empty" style={{ marginTop: 0 }}>
      List schools that have contacted you, invited you to visit or attend a camp,
      sent recruiting information, or otherwise shown direct recruiting interest.
      Enter one school per line.
    </p>
    <textarea
      name="collegesOfInterest"
      placeholder={"Example:\nBaylor\nTCU\nTexas State"}
      value={formData.collegesOfInterest}
      onChange={handleChange}
      rows="5"
    />
  </div>
</div>
            </div>
            )}

            {activeTab === "testing" && (
  <div className="card">
    <h3 className="detail-section-title">Athletic Testing</h3>

    <div className="form-stack">
      <label className="profile-input-field">
        <span>40-Yard Dash (seconds)</span>
        <input type="number" step="0.01" name="fortyTime" value={formData.fortyTime} onChange={handleChange} />
      </label>
      <label className="profile-input-field">
        <span>Vertical Jump (inches)</span>
        <input type="number" step="0.1" name="vertical" value={formData.vertical} onChange={handleChange} />
      </label>
      <label className="profile-input-field">
        <span>Broad Jump — Feet</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          name="broadJumpFeet"
          value={formData.broadJumpFeet}
          onChange={handleWholeNumberChange}
        />
      </label>

<label className="profile-input-field">
        <span>Broad Jump — Inches</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          name="broadJumpInches"
          value={formData.broadJumpInches}
          onChange={handleWholeNumberChange}
        />
      </label>
      <label className="profile-input-field">
        <span>Bench Press Max (lbs)</span>
        <input type="number" name="benchMax" value={formData.benchMax} onChange={handleChange} />
      </label>
      <label className="profile-input-field">
        <span>Back Squat Max (lbs)</span>
        <input type="number" name="squatMax" value={formData.squatMax} onChange={handleChange} />
      </label>
      <label className="profile-input-field">
        <span>Power Clean Max (lbs)</span>
        <input type="number" name="cleanMax" value={formData.cleanMax} onChange={handleChange} />
      </label>
    </div>
  </div>
)}

{activeTab === "academics" && (
  <div className="card">
    <h3 className="detail-section-title">Academics</h3>

    <div className="form-stack">
      <label className="profile-input-field">
        <span>GPA</span>
        <input name="gpa" value={formData.gpa} onChange={handleChange} />
      </label>
      <label className="profile-input-field">
        <span>NCAA ID</span>
        <input name="ncaaId" value={formData.ncaaId} onChange={handleChange} />
      </label>
    </div>
  </div>
)}

            {activeTab === "football" && (
  <div className="card">
    <h3 className="detail-section-title">Football Production</h3>

    <div className="form-stack">
      {(() => {
        const positions = [
          formData.position1,
          formData.position2
        ]
          .filter(Boolean)
          .map((p) => p.trim().toUpperCase());

        const isAthlete = positions.includes("ATH");

        const showQB =
          positions.includes("QB") ||
          isAthlete;

        const showRB =
          positions.includes("RB") ||
          isAthlete;

        const showWR =
  positions.includes("WR") ||
  positions.includes("TE") ||
  positions.includes("RB") ||
  isAthlete;

        const showOL =
          positions.includes("OL") ||
          positions.includes("T") ||
          positions.includes("G") ||
          positions.includes("C");

        const showKicker = positions.includes("K");
        const showPunter = positions.includes("P");

        const showDefense =
          isAthlete ||
          positions.some((p) =>
            ["DB", "CB", "S", "OLB", "MLB", "LB", "DE", "DL"].includes(p)
          );

        // Hide return-stat inputs when every selected position is one
        // that would not normally return kicks or punts.
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

        return (
          <>
            {showQB && (
              <div className="stat-group">
                <h4>Passing</h4>
                <label className="stat-input-field">

                  <span>Passing Attempts</span>

                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="passingAttempts"  value={formData.passingAttempts} onChange={handleWholeNumberChange} />

                </label>
                <label className="stat-input-field">

                  <span>Completions</span>

                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="passingCompletions"  value={formData.passingCompletions} onChange={handleWholeNumberChange} />

                </label>
                <label className="stat-input-field">

                  <span>Passing Yards</span>

                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="passingYards"  value={formData.passingYards} onChange={handleWholeNumberChange} />

                </label>
                <label className="stat-input-field">

                  <span>Passing TDs</span>

                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="passingTouchdowns"  value={formData.passingTouchdowns} onChange={handleWholeNumberChange} />

                </label>
                <label className="stat-input-field">

                  <span>Interceptions Thrown</span>

                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="interceptionsThrown"  value={formData.interceptionsThrown} onChange={handleWholeNumberChange} />

                </label>
              </div>
            )}

            {(showQB || showRB) && (
              <div className="stat-group">
                <h4>Rushing</h4>
                <label className="stat-input-field">

                  <span>Carries</span>

                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="carries"  value={formData.carries} onChange={handleWholeNumberChange} />

                </label>
                <label className="stat-input-field">

                  <span>Rushing Yards</span>

                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="rushingYards"  value={formData.rushingYards} onChange={handleWholeNumberChange} />

                </label>
                <label className="stat-input-field">

                  <span>Rushing TDs</span>

                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="rushingTouchdowns"  value={formData.rushingTouchdowns} onChange={handleWholeNumberChange} />

                </label>
              </div>
            )}

            {showWR && (
              <div className="stat-group">
                <h4>Receiving</h4>
                <label className="stat-input-field">

                  <span>Receptions</span>

                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="receptions"  value={formData.receptions} onChange={handleWholeNumberChange} />

                </label>
                <label className="stat-input-field">

                  <span>Receiving Yards</span>

                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="receivingYards"  value={formData.receivingYards} onChange={handleWholeNumberChange} />

                </label>
                <label className="stat-input-field">

                  <span>Receiving TDs</span>

                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="receivingTouchdowns"  value={formData.receivingTouchdowns} onChange={handleWholeNumberChange} />

                </label>
              </div>
            )}

            {showSpecialTeamsReturns && (
              <div className="stat-group">
                <h4>Special Teams Returns</h4>

                <label className="stat-input-field">


                  <span>Kickoff Returns</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="kickoffReturns"
                  
                  value={formData.kickoffReturns}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Kickoff Return Yards</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="kickoffReturnYards"
                  
                  value={formData.kickoffReturnYards}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Punt Returns</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="puntReturns"
                  
                  value={formData.puntReturns}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Punt Return Yards</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="puntReturnYards"
                  
                  value={formData.puntReturnYards}
                  onChange={handleWholeNumberChange}
                />


                </label>
              </div>
            )}

            {showKicker && (
              <div className="stat-group">
                <h4>Kicking</h4>

                <label className="stat-input-field">


                  <span>Field Goals Made</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="fieldGoalsMade"
                  
                  value={formData.fieldGoalsMade}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Field Goals Attempted</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="fieldGoalsAttempted"
                  
                  value={formData.fieldGoalsAttempted}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Longest Field Goal (yards)</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="longestFieldGoal"
                  
                  value={formData.longestFieldGoal}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Extra Points Made</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="extraPointsMade"
                  
                  value={formData.extraPointsMade}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Extra Points Attempted</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="extraPointsAttempted"
                  
                  value={formData.extraPointsAttempted}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Kickoffs</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="kickoffs"
                  
                  value={formData.kickoffs}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Touchbacks</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="touchbacks"
                  
                  value={formData.touchbacks}
                  onChange={handleWholeNumberChange}
                />


                </label>
              </div>
            )}

            {showPunter && (
              <div className="stat-group">
                <h4>Punting</h4>

                <label className="stat-input-field">


                  <span>Punts</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="punts"
                  
                  value={formData.punts}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Punt Yards</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="puntYards"
                  
                  value={formData.puntYards}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Longest Punt (yards)</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="longestPunt"
                  
                  value={formData.longestPunt}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Punts Inside the 20</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="puntsInside20"
                  
                  value={formData.puntsInside20}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Fair Catches Forced</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="fairCatchesForced"
                  
                  value={formData.fairCatchesForced}
                  onChange={handleWholeNumberChange}
                />


                </label>
              </div>
            )}

            {showOL && (
              <div className="stat-group">
                <h4>Offensive Line</h4>
                <label className="stat-input-field">

                  <span>Games Started</span>

                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="gamesStarted"  value={formData.gamesStarted} onChange={handleWholeNumberChange} />

                </label>
                <label className="stat-input-field">

                  <span>Pancake Blocks</span>

                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="pancakeBlocks"  value={formData.pancakeBlocks} onChange={handleWholeNumberChange} />

                </label>
                <label className="stat-input-field">

                  <span>Sacks Allowed</span>

                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="sacksAllowed"  value={formData.sacksAllowed} onChange={handleWholeNumberChange} />

                </label>
              </div>
            )}

            {showDefense && (
              <div className="stat-group">
                <h4>Defense</h4>

                <label className="stat-input-field">


                  <span>Solo Tackles</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="soloTackles"
                  
                  value={formData.soloTackles}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Tackle Assists</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="tackleAssists"
                  
                  value={formData.tackleAssists}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Tackles For Loss</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="tacklesForLoss"
                  
                  value={formData.tacklesForLoss}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Sacks</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="sacks"
                  
                  value={formData.sacks}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Interceptions</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="interceptions"
                  
                  value={formData.interceptions}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Pass Breakups</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="passBreakups"
                  
                  value={formData.passBreakups}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Forced Fumbles</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="forcedFumbles"
                  
                  value={formData.forcedFumbles}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>Fumble Recoveries</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="fumbleRecoveries"
                  
                  value={formData.fumbleRecoveries}
                  onChange={handleWholeNumberChange}
                />


                </label>

                <label className="stat-input-field">


                  <span>QB Hurries</span>


                  <input type="text" inputMode="numeric" pattern="[0-9]*"
                  name="qbHurries"
                  
                  value={formData.qbHurries}
                  onChange={handleWholeNumberChange}
                />


                </label>
              </div>
            )}

            {positions.length === 0 && (
              <p className="detail-empty">
                Select Position 1 and/or Position 2 in the Personal tab to see the correct football stat fields.
              </p>
            )}
          </>
        );
      })()}
    </div>
  </div>
)}

            <div className="card">
  <h3 className="detail-section-title">Profile Photo</h3>

  <div className="form-stack">
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          const previewUrl = URL.createObjectURL(file);
          setImageSrc(previewUrl);
          setShowCrop(true);
        }
      }}
    />

    {showCrop && imageSrc && (
      <div style={{ marginTop: "12px" }}>
        <p style={{ marginBottom: "8px", fontWeight: "700" }}>
          Drag to center your face, then save the crop.
        </p>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "300px",
            background: "#111827",
            borderRadius: "16px",
            overflow: "hidden"
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(croppedArea, croppedPixels) => {
              setCroppedAreaPixels(croppedPixels);
            }}
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
            Zoom
          </label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>

        <div className="action-row" style={{ marginTop: "12px" }}>
          <button
            type="button"
            className="primary-brand-btn"
            onClick={async () => {
              if (!croppedAreaPixels) return;

              const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

              if (!croppedBlob) return;

              const croppedFile = new File(
                [croppedBlob],
                "cropped-profile.jpg",
                { type: "image/jpeg" }
              );

              setSelectedImage(croppedFile);
              setShowCrop(false);
            }}
          >
            Save Crop
          </button>

          <button
            type="button"
            className="secondary-brand-btn"
            onClick={() => {
              setShowCrop(false);
              setImageSrc(null);
              setSelectedImage(null);
              setZoom(1);
              setCrop({ x: 0, y: 0 });
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    )}

    {selectedImage && !showCrop && (
      <div style={{ marginTop: "12px" }}>
        <p style={{ marginBottom: "6px", fontWeight: "600" }}>
          Cropped Preview:
        </p>
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Cropped preview"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "16px",
            border: "1px solid #d6e2f0"
          }}
        />
      </div>
    )}

    <button
      type="button"
      onClick={handleImageUpload}
      className="secondary-brand-btn"
    >
      Upload Profile Picture
    </button>
  </div>
</div>

            <button type="submit" className="primary-brand-btn">Save Profile</button>
          </form>

          <div className="card">
            <h3>{player.name}</h3>
            <p><strong>Status:</strong> {player.status || "N/A"}</p>
            <p><strong>Position:</strong> {player.position || "N/A"}</p>
            <p><strong>Class:</strong> {player.playerClass || "N/A"}</p>
            <p><strong>Height:</strong> {player.height || "N/A"}</p>
            <p><strong>Weight:</strong> {player.weight || "N/A"}</p>
            <p><strong>Jersey #:</strong> {player.jerseyNumber || "N/A"}</p>
            <p><strong>Location:</strong> El Paso, TX</p>
            <p><strong>Profile Picture:</strong> {player.profilePicture || "N/A"}</p>
          </div>

          {hasPendingUpdates && (
            
            <div className="card">
              <h3>Pending Changes Waiting for Approval</h3>

              {Object.entries(player.pendingUpdates).map(([field, value]) => (
                <div
                  key={field}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid #e5e7eb"
                  }}
                >
                  <p style={{ marginBottom: "6px" }}>
                    <strong>{field}</strong>
                  </p>
                  <p style={{ margin: 0 }}>
                    <span style={{ color: "#6b7280" }}>
                      Current:{" "}
                      {player[field] !== undefined && player[field] !== null && player[field] !== ""
                        ? String(player[field])
                        : "Empty"}
                    </span>
                    <br />
                    <span style={{ color: "#0b2545", fontWeight: "700" }}>
                      Requested:{" "}
                      {value !== undefined && value !== null && value !== ""
                        ? String(value)
                        : "Empty"}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PlayerDashboard;