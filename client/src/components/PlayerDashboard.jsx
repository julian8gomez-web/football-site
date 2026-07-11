import { useState } from "react";
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
  const hasPendingUpdates =
  
    player &&
    player.pendingUpdates &&
    Object.keys(player.pendingUpdates).length > 0;
const [imageSrc, setImageSrc] = useState(null);
const [showCrop, setShowCrop] = useState(false);
const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
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

  return (
    <div>
      <h2 className="section-title">Player Dashboard</h2>

      <button className="load-button" onClick={loadMyProfile}>
        Load My Profile
      </button>

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
                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />

                <select
                  name="position1"
                  value={formData.position1}
                  onChange={handleChange}
                >
                  <option value="">Position 1</option>

                  {footballPositions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>

                <select
                  name="position2"
                  value={formData.position2}
                  onChange={handleChange}
                >
                  <option value="">
                    {formData.position1 === "ATH"
                      ? "Special Teams Position (Optional)"
                      : "Position 2 (Optional)"}
                  </option>

                  {secondaryPositionOptions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>

                <input name="playerClass" placeholder="Class / Graduation Year" value={formData.playerClass} onChange={handleChange} />
                <input
  type="number"
  name="heightFeet"
  placeholder="Height Feet"
  value={formData.heightFeet}
  onChange={handleChange}
/>

<input
  type="number"
  name="heightInches"
  placeholder="Height Inches"
  value={formData.heightInches}
  onChange={handleChange}
/>
                <input type="number" name="weight" placeholder="Weight (lbs)" value={formData.weight} onChange={handleChange} />
                <input name="jerseyNumber" placeholder="Jersey Number" value={formData.jerseyNumber} onChange={handleChange} />
               
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
</div>
            </div>
            )}

            {activeTab === "testing" && (
  <div className="card">
    <h3 className="detail-section-title">Athletic Testing</h3>

    <div className="form-stack">
      <input type="number" step="0.01" name="fortyTime" placeholder="40-Yard Dash (sec)" value={formData.fortyTime} onChange={handleChange} />
      <input type="number" step="0.1" name="vertical" placeholder="Vertical (in)" value={formData.vertical} onChange={handleChange} />
      <input
  name="broadJumpFeet"
  placeholder="Broad Jump Feet"
  value={formData.broadJumpFeet}
  onChange={handleChange}
/>

<input
  name="broadJumpInches"
  placeholder="Broad Jump Inches"
  value={formData.broadJumpInches}
  onChange={handleChange}
/>
      <input type="number" name="benchMax" placeholder="Bench Press (lbs)" value={formData.benchMax} onChange={handleChange} />
      <input type="number" name="squatMax" placeholder="Back Squat (lbs)" value={formData.squatMax} onChange={handleChange} />
      <input type="number" name="cleanMax" placeholder="Power Clean (lbs)" value={formData.cleanMax} onChange={handleChange} />
    </div>
  </div>
)}

{activeTab === "academics" && (
  <div className="card">
    <h3 className="detail-section-title">Academics</h3>

    <div className="form-stack">
      <input name="gpa" placeholder="GPA" value={formData.gpa} onChange={handleChange} />
      <input name="ncaaId" placeholder="NCAA ID" value={formData.ncaaId} onChange={handleChange} />
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
          isAthlete;

        const showOL =
          positions.includes("OL") ||
          positions.includes("T") ||
          positions.includes("G") ||
          positions.includes("C");

        const showDefense =
          isAthlete ||
          positions.some((p) =>
            ["DB", "CB", "S", "OLB", "MLB", "LB", "DE", "DL"].includes(p)
          );

        return (
          <>
            {showQB && (
              <div className="stat-group">
                <h4>Passing</h4>
                <input name="passingAttempts" placeholder="Passing Attempts" value={formData.passingAttempts} onChange={handleChange} />
                <input name="passingCompletions" placeholder="Completions" value={formData.passingCompletions} onChange={handleChange} />
                <input name="passingYards" placeholder="Passing Yards" value={formData.passingYards} onChange={handleChange} />
                <input name="passingTouchdowns" placeholder="Passing TDs" value={formData.passingTouchdowns} onChange={handleChange} />
                <input name="interceptionsThrown" placeholder="Interceptions Thrown" value={formData.interceptionsThrown} onChange={handleChange} />
              </div>
            )}

            {(showQB || showRB) && (
              <div className="stat-group">
                <h4>Rushing</h4>
                <input name="carries" placeholder="Carries" value={formData.carries} onChange={handleChange} />
                <input name="rushingYards" placeholder="Rushing Yards" value={formData.rushingYards} onChange={handleChange} />
                <input name="rushingTouchdowns" placeholder="Rushing TDs" value={formData.rushingTouchdowns} onChange={handleChange} />
              </div>
            )}

            {showWR && (
              <div className="stat-group">
                <h4>Receiving</h4>
                <input name="receptions" placeholder="Receptions" value={formData.receptions} onChange={handleChange} />
                <input name="receivingYards" placeholder="Receiving Yards" value={formData.receivingYards} onChange={handleChange} />
                <input name="receivingTouchdowns" placeholder="Receiving TDs" value={formData.receivingTouchdowns} onChange={handleChange} />
              </div>
            )}

            {showOL && (
              <div className="stat-group">
                <h4>Offensive Line</h4>
                <input name="gamesStarted" placeholder="Games Started" value={formData.gamesStarted} onChange={handleChange} />
                <input name="pancakeBlocks" placeholder="Pancake Blocks" value={formData.pancakeBlocks} onChange={handleChange} />
                <input name="sacksAllowed" placeholder="Sacks Allowed" value={formData.sacksAllowed} onChange={handleChange} />
              </div>
            )}

            {showDefense && (
              <div className="stat-group">
                <h4>Defense</h4>
                <input name="tackles" placeholder="Tackles" value={formData.tackles} onChange={handleChange} />
                <input name="tacklesForLoss" placeholder="Tackles For Loss" value={formData.tacklesForLoss} onChange={handleChange} />
                <input name="sacks" placeholder="Sacks" value={formData.sacks} onChange={handleChange} />
                <input name="interceptions" placeholder="Interceptions" value={formData.interceptions} onChange={handleChange} />
                <input name="passBreakups" placeholder="Pass Breakups" value={formData.passBreakups} onChange={handleChange} />
                <input name="forcedFumbles" placeholder="Forced Fumbles" value={formData.forcedFumbles} onChange={handleChange} />
                <input name="qbHurries" placeholder="QB Hurries" value={formData.qbHurries} onChange={handleChange} />
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