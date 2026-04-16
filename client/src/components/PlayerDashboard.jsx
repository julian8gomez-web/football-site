import { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropimage";

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
  const hasPendingUpdates =
  
    player &&
    player.pendingUpdates &&
    Object.keys(player.pendingUpdates).length > 0;
const [imageSrc, setImageSrc] = useState(null);
const [showCrop, setShowCrop] = useState(false);
const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
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

          <form onSubmit={handleUpdateProfile} className="form-stack">
            <div className="card">
              <h3 className="detail-section-title">Basic Information</h3>

              <div className="form-stack">
                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />

                <select name="position1" value={formData.position1} onChange={handleChange}>
                  <option value="">Position 1</option>
                  <option value="QB">QB</option>
                  <option value="RB">RB</option>
                  <option value="TE">TE</option>
                  <option value="ATH">ATH</option>
                  <option value="WR">WR</option>
                  <option value="DB">DB</option>
                  <option value="S">S</option>
                  <option value="OLB">OLB</option>
                  <option value="MLB">MLB</option>
                  <option value="OL">OL</option>
                  <option value="T">T</option>
                  <option value="G">G</option>
                  <option value="C">C</option>
                  <option value="DE">DE</option>
                  <option value="DL">DL</option>
                </select>

                <select name="position2" value={formData.position2} onChange={handleChange}>
                  <option value="">Position 2 (Optional)</option>
                  <option value="QB">QB</option>
                  <option value="RB">RB</option>
                  <option value="TE">TE</option>
                  <option value="ATH">ATH</option>
                  <option value="WR">WR</option>
                  <option value="DB">DB</option>
                  <option value="S">S</option>
                  <option value="OLB">OLB</option>
                  <option value="MLB">MLB</option>
                  <option value="OL">OL</option>
                  <option value="T">T</option>
                  <option value="G">G</option>
                  <option value="C">C</option>
                  <option value="DE">DE</option>
                  <option value="DL">DL</option>
                </select>

                <input name="playerClass" placeholder="Class / Graduation Year" value={formData.playerClass} onChange={handleChange} />
                <input name="height" placeholder="Height" value={formData.height} onChange={handleChange} />
                <input name="weight" placeholder="Weight" value={formData.weight} onChange={handleChange} />
                <input name="jerseyNumber" placeholder="Jersey Number" value={formData.jerseyNumber} onChange={handleChange} />
                <input name="hudlLink" placeholder="Hudl Link" value={formData.hudlLink} onChange={handleChange} />
              </div>
            </div>

            <div className="card">
              <h3 className="detail-section-title">Contact & IDs</h3>

              <div className="form-stack">
                <input name="twitter" placeholder="Twitter / X" value={formData.twitter} onChange={handleChange} />
                <input name="ncaaId" placeholder="NCAA ID" value={formData.ncaaId} onChange={handleChange} />
                <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
                <input name="emailAddress" placeholder="Email Address" value={formData.emailAddress} onChange={handleChange} />
              </div>
            </div>

            <div className="card">
              <h3 className="detail-section-title">Academics & Testing</h3>

              <div className="form-stack">
                <input name="gpa" placeholder="GPA" value={formData.gpa} onChange={handleChange} />
                <input name="fortyTime" placeholder="40 Time" value={formData.fortyTime} onChange={handleChange} />
                <input name="vertical" placeholder="Vertical" value={formData.vertical} onChange={handleChange} />
                <input name="benchMax" placeholder="Bench Max" value={formData.benchMax} onChange={handleChange} />
                <input name="cleanMax" placeholder="Clean Max" value={formData.cleanMax} onChange={handleChange} />
                <input name="squatMax" placeholder="Squat Max" value={formData.squatMax} onChange={handleChange} />
              </div>
            </div>

            <div className="card">
              <h3 className="detail-section-title">Football Stats</h3>

              <div className="form-stack">
                <input name="passingYards" placeholder="Passing Yards" value={formData.passingYards} onChange={handleChange} />
                <input name="rushingYards" placeholder="Rushing Yards" value={formData.rushingYards} onChange={handleChange} />
                <input name="tackles" placeholder="Tackles" value={formData.tackles} onChange={handleChange} />
                <input name="sacks" placeholder="Sacks" value={formData.sacks} onChange={handleChange} />
                <input name="interceptions" placeholder="Interceptions" value={formData.interceptions} onChange={handleChange} />
                <input name="touchdowns" placeholder="Touchdowns" value={formData.touchdowns} onChange={handleChange} />
              </div>
            </div>

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