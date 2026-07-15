import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation
} from "react-router-dom";
import huskyHead from "./assets/husky-head.png";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import PlayerDashboard from "./components/PlayerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import TeamDashboard from "./components/TeamDashboard";
import AthleteAnalytics from "./components/AthleteAnalytics";
import PlayerDetailPage from "./components/PlayerDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ChangePasswordPage from "./components/ChangePasswordPage";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

const isPublicPlayerPage =
  location.pathname.startsWith("/player/") ||
  location.pathname.startsWith("/players/");

const isPrivateDashboardPage =
  location.pathname === "/dashboard" ||
  location.pathname === "/admin";

  const [approvedPlayers, setApprovedPlayers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [player, setPlayer] = useState(null);
  const [pendingPlayers, setPendingPlayers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
const [positionFilter, setPositionFilter] = useState("");
const [classFilter, setClassFilter] = useState("");
const [heightFilter, setHeightFilter] = useState("");
const [weightFilter, setWeightFilter] = useState("");
const [fortyFilter, setFortyFilter] = useState("");
const [verticalFilter, setVerticalFilter] = useState("");
const [adminSearchTerm, setAdminSearchTerm] = useState("");
const [adminStatusFilter, setAdminStatusFilter] = useState("");
const [adminPositionFilter, setAdminPositionFilter] = useState("");
const [adminClassFilter, setAdminClassFilter] = useState("");
const [newPassword, setNewPassword] = useState("");

 const [formData, setFormData] = useState({
  name: "",
  position: "",
  position1: "",
  position2: "",
  playerClass: "",
  height: "",
  weight: "",
  jerseyNumber: "",
  location: "",
  hudlLink: "",
  contactInfo: "",
  profilePicture: "",
  twitter: "",
  ncaaId: "",
  phoneNumber: "",
  emailAddress: "",
  gpa: "",
  fortyTime: "",
  vertical: "",
  broadJump: "",
  broadJumpFeet: "",
  broadJumpInches: "",
  benchMax: "",
  cleanMax: "",
  squatMax: "",
  passingYards: "",
  rushingYards: "",
  tackles: "",
  sacks: "",
  interceptions: "",
  touchdowns: "",
  // QB Stats
passingCompletions: "",
passingAttempts: "",
passingTouchdowns: "",
interceptionsThrown: "",

// RB Stats
carries: "",
rushingTouchdowns: "",

// WR / TE Stats
receptions: "",
receivingYards: "",
receivingTouchdowns: "",

// OL Stats
pancakeBlocks: "",
sacksAllowed: "",
gamesStarted: "",

// Defensive Stats
tacklesForLoss: "",
passBreakups: "",
forcedFumbles: "",
qbHurries: "",
});

useEffect(() => {
  console.log("API URL:", import.meta.env.VITE_API_URL);
  fetch(`${import.meta.env.VITE_API_URL}/approved-players`)
    .then((res) => res.json())
    .then((data) => setApprovedPlayers(data))
    .catch((err) => console.error("Error fetching approved players:", err));
}, []);

useEffect(() => {
  if (!message) return undefined;

  const messageTimer = window.setTimeout(() => {
    setMessage("");
  }, 5000);

  return () => {
    window.clearTimeout(messageTimer);
  };
}, [message]);

useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });
}, [location.pathname]);
const convertHeightToInches = (height) => {
  if (!height) return null;

  const match = String(height).match(/(\d+)'?\s*(\d+)?/);

  if (!match) return null;

  const feet = Number(match[1] || 0);
  const inches = Number(match[2] || 0);

  return feet * 12 + inches;
};
const filteredPlayers = approvedPlayers.filter((player) => {
  const matchesSearch = player.name
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase());

  const playerPositions = [
    player.position1,
    player.position2,
    ...(player.position ? player.position.split("/") : [])
  ]
    .filter(Boolean)
    .map((position) => position.trim().toUpperCase());

  const matchesPosition = positionFilter
    ? playerPositions.includes(positionFilter.toUpperCase())
    : true;

  const matchesClass = classFilter
    ? player.playerClass === classFilter
    : true;

  const playerHeightInches = convertHeightToInches(player.height);

  const matchesHeight = heightFilter
    ? playerHeightInches !== null &&
      playerHeightInches >= Number(heightFilter)
    : true;

  const playerWeight = Number(player.weight);

  const matchesWeight = weightFilter
    ? Number.isFinite(playerWeight) &&
      playerWeight >= Number(weightFilter)
    : true;

  const playerForty = Number(player.fortyTime);

  const matchesForty = fortyFilter
    ? Number.isFinite(playerForty) &&
      playerForty <= Number(fortyFilter)
    : true;

  const playerVertical = Number(player.vertical);

  const matchesVertical = verticalFilter
    ? Number.isFinite(playerVertical) &&
      playerVertical >= Number(verticalFilter)
    : true;

  return (
    matchesSearch &&
    matchesPosition &&
    matchesClass &&
    matchesHeight &&
    matchesWeight &&
    matchesForty &&
    matchesVertical
  );
});
const filteredPendingPlayers = pendingPlayers.filter((player) => {
  const matchesSearch = player.name
    ?.toLowerCase()
    .includes(adminSearchTerm.toLowerCase());

  const matchesStatus = adminStatusFilter
    ? player.status === adminStatusFilter
    : true;

  const matchesPosition = adminPositionFilter
    ? player.position === adminPositionFilter
    : true;

  const matchesClass = adminClassFilter
    ? player.playerClass === adminClassFilter
    : true;

  return matchesSearch && matchesStatus && matchesPosition && matchesClass;
});
 const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("displayName");
  setPlayer(null);
  setPendingPlayers([]);
  setMessage("Logged out ✅");
  navigate("/login");
};

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
  localStorage.setItem("token", data.token);

  const payload = JSON.parse(atob(data.token.split(".")[1]));
  localStorage.setItem("role", payload.role);
localStorage.setItem(
  "displayName",
  data.displayName || ""
);
  setMessage("Login successful ✅");

  if (data.mustChangePassword) {
  navigate("/change-password");
} else if (payload.role === "admin") {
  navigate("/admin");
} else {
  navigate("/dashboard");
}
}
 else {
        setMessage(data.error || "Login failed");
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }
  };

  const loadMyProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("No token found. Please log in first.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/my-profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setPlayer(data);
        let broadJumpFeet = "";
let broadJumpInches = "";

if (data.broadJump) {
  const match = data.broadJump.match(/(\d+)'?\s*(\d+)?/);

  if (match) {
    broadJumpFeet = match[1] || "";
    broadJumpInches = match[2] || "";
  }
}
let heightFeet = "";
let heightInches = "";

if (data.height) {
  const match = data.height.match(/(\d+)'?\s*(\d+)?/);

  if (match) {
    heightFeet = match[1] || "";
    heightInches = match[2] || "";
  }
}
        setFormData({
          name: data.name || "",
          position: data.position || "",
          position1: data.position1 || (data.position ? data.position.split("/")[0] || "" : ""),
          position2: data.position2 || (data.position ? data.position.split("/")[1] || "" : ""),
          playerClass: data.playerClass || "",
          height: data.height || "",
          heightFeet,
          heightInches,
          weight: data.weight || "",
          jerseyNumber: data.jerseyNumber || "",
          location: data.location || "",
          hudlLink: data.hudlLink || "",
          contactInfo: data.contactInfo || "",
          profilePicture: data.profilePicture || "",
          gpa: data.gpa || "",
          fortyTime: data.fortyTime || "",
          vertical: data.vertical || "",
          broadJump: data.broadJump || "",
          broadJumpFeet,
          broadJumpInches,
          benchMax: data.benchMax || "",
          cleanMax: data.cleanMax || "",
          squatMax: data.squatMax || "",
          passingYards: data.passingYards || "",
          rushingYards: data.rushingYards || "",
          tackles: data.tackles || "",
          sacks: data.sacks || "",
          interceptions: data.interceptions || "",
          touchdowns: data.touchdowns || "",
          // QB Stats
          passingCompletions: data.passingCompletions || "",
          passingAttempts: data.passingAttempts || "",
          passingTouchdowns: data.passingTouchdowns || "",
          interceptionsThrown: data.interceptionsThrown || "",

// RB Stats
          carries: data.carries || "",
          rushingTouchdowns: data.rushingTouchdowns || "",

// WR / TE Stats
          receptions: data.receptions || "",
          receivingYards: data.receivingYards || "",
          receivingTouchdowns: data.receivingTouchdowns || "",

// OL Stats
          pancakeBlocks: data.pancakeBlocks || "",
          sacksAllowed: data.sacksAllowed || "",
          gamesStarted: data.gamesStarted || "",

// Defensive Stats
          tacklesForLoss: data.tacklesForLoss || "",
          passBreakups: data.passBreakups || "",
          forcedFumbles: data.forcedFumbles || "",
          qbHurries: data.qbHurries || "",
          twitter: data.twitter || "",
          ncaaId: data.ncaaId || "",
          phoneNumber: data.phoneNumber || "",
          emailAddress: data.emailAddress || "",
        });
        setMessage("Profile loaded ✅");
      } else {
        setMessage(data.error || "Could not load profile");
      }
    } catch (err) {
      setMessage("Error loading profile");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  const payload = {
    name: formData.name,
    position:
      formData.position1 && formData.position2
        ? `${formData.position1}/${formData.position2}`
        : formData.position1 || "",
    position1: formData.position1,
    position2: formData.position2,
    playerClass: formData.playerClass,
    height:
  formData.heightFeet || formData.heightInches
    ? `${formData.heightFeet || 0}' ${formData.heightInches || 0}"`
    : "",
    weight: formData.weight,
    jerseyNumber: formData.jerseyNumber,
    location: "El Paso, TX",
    hudlLink: formData.hudlLink,
    contactInfo: formData.contactInfo,
    twitter: formData.twitter,
    ncaaId: formData.ncaaId,
    phoneNumber: formData.phoneNumber,
    emailAddress: formData.emailAddress,
    gpa: formData.gpa,
    fortyTime: formData.fortyTime,
    vertical: formData.vertical,
    broadJump:
  formData.broadJumpFeet || formData.broadJumpInches
    ? `${formData.broadJumpFeet || 0}' ${formData.broadJumpInches || 0}"`
    : "",

    benchMax: formData.benchMax === "" ? null : Number(formData.benchMax),
    cleanMax: formData.cleanMax === "" ? null : Number(formData.cleanMax),
    squatMax: formData.squatMax === "" ? null : Number(formData.squatMax),

    passingYards: formData.passingYards === "" ? null : Number(formData.passingYards),
    rushingYards: formData.rushingYards === "" ? null : Number(formData.rushingYards),
    tackles: formData.tackles === "" ? null : Number(formData.tackles),
    sacks: formData.sacks === "" ? null : Number(formData.sacks),
    interceptions: formData.interceptions === "" ? null : Number(formData.interceptions),
    touchdowns: formData.touchdowns === "" ? null : Number(formData.touchdowns),

    passingCompletions: formData.passingCompletions === "" ? null : Number(formData.passingCompletions),
    passingAttempts: formData.passingAttempts === "" ? null : Number(formData.passingAttempts),
    passingTouchdowns: formData.passingTouchdowns === "" ? null : Number(formData.passingTouchdowns),
    interceptionsThrown: formData.interceptionsThrown === "" ? null : Number(formData.interceptionsThrown),

    carries: formData.carries === "" ? null : Number(formData.carries),
    rushingTouchdowns: formData.rushingTouchdowns === "" ? null : Number(formData.rushingTouchdowns),

    receptions: formData.receptions === "" ? null : Number(formData.receptions),
    receivingYards: formData.receivingYards === "" ? null : Number(formData.receivingYards),
    receivingTouchdowns: formData.receivingTouchdowns === "" ? null : Number(formData.receivingTouchdowns),

    pancakeBlocks: formData.pancakeBlocks === "" ? null : Number(formData.pancakeBlocks),
    sacksAllowed: formData.sacksAllowed === "" ? null : Number(formData.sacksAllowed),
    gamesStarted: formData.gamesStarted === "" ? null : Number(formData.gamesStarted),

    tacklesForLoss: formData.tacklesForLoss === "" ? null : Number(formData.tacklesForLoss),
    passBreakups: formData.passBreakups === "" ? null : Number(formData.passBreakups),
    forcedFumbles: formData.forcedFumbles === "" ? null : Number(formData.forcedFumbles),
    qbHurries: formData.qbHurries === "" ? null : Number(formData.qbHurries)
  };

  console.log("PAYLOAD SENT:", payload);

  const res = await fetch(`${import.meta.env.VITE_API_URL}/my-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (res.ok) {
    setPlayer(data.player);
    setMessage(data.message || "Profile changes submitted for review ✅");
  } else {
    setMessage(data.error || "Update failed");
  }
};

  const handleImageUpload = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    setMessage("No token found. Please log in first.");
    return;
  }

  if (!selectedImage) {
    setMessage("Please choose an image first.");
    return;
  }

  const imageData = new FormData();
  imageData.append("image", selectedImage);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/upload-profile-picture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: imageData
    });

    const data = await res.json();

    if (res.ok) {
      setPlayer(data.player);
      setMessage(data.message || "Profile picture submitted for review ✅");
      setSelectedImage(null);
    } else {
      setMessage(data.error || "Image upload failed");
    }
  } catch (err) {
    setMessage("Error uploading image");
  }
};
const handleChangePassword = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    setMessage("No token found. Please log in again.");
    navigate("/login");
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ newPassword })
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(data.message || "Password updated ✅");
      setNewPassword("");

      const role = localStorage.getItem("role");

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      setMessage(data.error || "Could not update password");
    }
  } catch (err) {
    setMessage("Error updating password");
  }
};
  const loadPendingPlayers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("No token found. Please log in first.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/pending-players`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setPendingPlayers(data);
        setMessage("Pending players loaded ✅");
      } else {
        setMessage(data.error || "Could not load pending players");
      }
    } catch (err) {
      setMessage("Error loading pending players");
    }
  };
const approveAllPendingPlayers = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/approve-all-pending`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(data.message || "All pending players approved ✅");
      loadPendingPlayers();

      const approvedRes = await fetch(`${import.meta.env.VITE_API_URL}/approved-players`);
      const approvedData = await approvedRes.json();
      setApprovedPlayers(approvedData);
    } else {
      setMessage(data.error || "Could not approve all pending players");
    }
  } catch (err) {
    setMessage("Error approving all pending players");
  }
};
  const approvePlayer = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/approve-player/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Player approved ✅");
        loadPendingPlayers();

        const approvedRes = await fetch(`${import.meta.env.VITE_API_URL}/approved-players`);
        const approvedData = await approvedRes.json();
        setApprovedPlayers(approvedData);
      } else {
        setMessage(data.error || "Could not approve player");
      }
    } catch (err) {
      setMessage("Error approving player");
    }
  };
const resetPlayerPassword = async (playerId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/reset-password/${playerId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(
        `Password reset ✅ Email: ${data.email} | Temporary Password: ${data.tempPassword}`
      );
    } else {
      setMessage(data.error || "Could not reset password");
    }
  } catch (err) {
    setMessage("Error resetting password");
  }
};
  const rejectPlayer = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/reject-player/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Player rejected");
        loadPendingPlayers();

        const approvedRes = await fetch(`${import.meta.env.VITE_API_URL}/approved-players`);
        const approvedData = await approvedRes.json();
        setApprovedPlayers(approvedData);
      } else {
        setMessage(data.error || "Could not reject player");
      }
    } catch (err) {
      setMessage("Error rejecting player");
    }
  };
const loadAllPlayers = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    setMessage("No token found. Please log in first.");
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/all-players`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      setPendingPlayers(data);
      setMessage("All players loaded ✅");
    } else {
      setMessage(data.error || "Could not load all players");
    }
  } catch (err) {
    setMessage("Error loading all players");
  }
};
  return (
    <div className="app-container">
      {isPublicPlayerPage ? (
  <div className="public-profile-strip">
    <button
      type="button"
      className="public-profile-back"
      onClick={() => navigate("/")}
    >
      <span className="back-full-text">← Back to Roster</span>
      <span className="back-mobile-text">← Roster</span>
    </button>

    <div className="public-profile-brand">
      <img
        src={huskyHead}
        alt="Chapin Huskies logo"
        className="public-profile-brand-logo"
      />

      <span>Chapin Husky Football</span>
    </div>

    <div className="public-profile-spacer" aria-hidden="true" />
  </div>
) : (
  <>
    {!isPrivateDashboardPage && (
      <div className="app-header">
        <div className="brand-row">
          <img
            src={huskyHead}
            alt="Chapin Huskies logo"
            className="brand-logo"
          />

          <div className="brand-text">
            <h1>Chapin Husky Football</h1>

            <p className="brand-tagline">
              Built for the Dawgs
            </p>

            <p className="app-subtitle">
              Official Recruiting Player Platform
            </p>
          </div>
        </div>
      </div>
    )}

    <Navbar
      handleLogout={handleLogout}
      playerName={player?.name}
      approvedPlayerCount={approvedPlayers.length}
      compact={isPrivateDashboardPage}
    />
  </>
)}


      {message && <div className="message-box">{message}</div>}

      <Routes>
        <Route
  path="/change-password"
  element={
    <ChangePasswordPage
      newPassword={newPassword}
      setNewPassword={setNewPassword}
      handleChangePassword={handleChangePassword}
    />
  }
/>
        <Route
          path="/"
          element={
            <>
             

              <HomePage
  approvedPlayers={filteredPlayers}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  positionFilter={positionFilter}
  setPositionFilter={setPositionFilter}
  classFilter={classFilter}
  setClassFilter={setClassFilter}
  heightFilter={heightFilter}
  setHeightFilter={setHeightFilter}
  weightFilter={weightFilter}
  setWeightFilter={setWeightFilter}
  fortyFilter={fortyFilter}
  setFortyFilter={setFortyFilter}
  verticalFilter={verticalFilter}
  setVerticalFilter={setVerticalFilter}
/>
            </>
          }
        />

        <Route
          path="/login"
          element={
            <LoginPage
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              handleLogin={handleLogin}
            />
          }
        />

      <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <PlayerDashboard
  loadMyProfile={loadMyProfile}
  player={player}
  formData={formData}
  handleChange={handleChange}
  handleUpdateProfile={handleUpdateProfile}
  selectedImage={selectedImage}
  setSelectedImage={setSelectedImage}
  handleImageUpload={handleImageUpload}
/>
    </ProtectedRoute>
  }
/>

      <Route
  path="/admin"
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminDashboard
  loadPendingPlayers={loadPendingPlayers}
  pendingPlayers={filteredPendingPlayers}
  approvePlayer={approvePlayer}
  rejectPlayer={rejectPlayer}
  approveAllPendingPlayers={approveAllPendingPlayers}
  adminSearchTerm={adminSearchTerm}
  setAdminSearchTerm={setAdminSearchTerm}
  adminStatusFilter={adminStatusFilter}
  setAdminStatusFilter={setAdminStatusFilter}
  adminPositionFilter={adminPositionFilter}
  setAdminPositionFilter={setAdminPositionFilter}
  adminClassFilter={adminClassFilter}
  setAdminClassFilter={setAdminClassFilter}
  resetPlayerPassword={resetPlayerPassword}
  loadAllPlayers={loadAllPlayers}
/>
    </ProtectedRoute>
  }
/>
<Route
  path="/team-dashboard"
  element={
    <ProtectedRoute adminOnly={true}>
      <TeamDashboard approvedPlayers={approvedPlayers} />
    </ProtectedRoute>
  }
/>
<Route
  path="/team-dashboard/analytics"
  element={
    <ProtectedRoute adminOnly={true}>
      <AthleteAnalytics approvedPlayers={approvedPlayers} />
    </ProtectedRoute>
  }
/>
        <Route
          path="/players/:id"
          element={<PlayerDetailPage approvedPlayers={approvedPlayers} />}
        />
        <Route
  path="/player/:slug"
  element={<PlayerDetailPage approvedPlayers={approvedPlayers} useSlug={true} />}
/>
      </Routes>
      {!isPrivateDashboardPage && (
      <footer className="site-footer">
  <div className="site-footer-inner">
    <h3 className="site-footer-title">Chapin Husky Football</h3>
    <p className="site-footer-text">Built for the Dawgs • Athlete Profiles • Recruiting Ready</p>
    <p className="site-footer-copy">© 2026 Chapin Husky Football. All rights reserved.</p>
  </div>
</footer>
      )}
    </div>
  );
}

export default App;