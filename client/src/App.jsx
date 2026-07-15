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
const [profileBaseline, setProfileBaseline] = useState(null);

 const [formData, setFormData] = useState({
  name: "",
  position: "",
  position1: "",
  position2: "",
  playerClass: "",
  height: "",
  heightFeet: "",
  heightInches: "",
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
  collegeOffers: "",
  campsAttended: "",
  collegesOfInterest: "",
  gpa: "",
  fortyTime: "",
  vertical: "",
  broadJump: "",
  broadJumpFeet: "",
  broadJumpInches: "",
  benchMax: "",
  cleanMax: "",
  squatMax: "",
  passingCompletions: "",
  passingAttempts: "",
  passingYards: "",
  passingTouchdowns: "",
  interceptionsThrown: "",
  carries: "",
  rushingYards: "",
  rushingTouchdowns: "",
  receptions: "",
  receivingYards: "",
  receivingTouchdowns: "",
  kickoffReturns: "",
  kickoffReturnYards: "",
  puntReturns: "",
  puntReturnYards: "",
  fieldGoalsMade: "",
  fieldGoalsAttempted: "",
  longestFieldGoal: "",
  extraPointsMade: "",
  extraPointsAttempted: "",
  kickoffs: "",
  touchbacks: "",
  punts: "",
  puntYards: "",
  longestPunt: "",
  puntsInside20: "",
  fairCatchesForced: "",
  pancakeBlocks: "",
  sacksAllowed: "",
  gamesStarted: "",
  soloTackles: "",
  tackleAssists: "",
  tackles: "",
  tacklesForLoss: "",
  sacks: "",
  interceptions: "",
  passBreakups: "",
  forcedFumbles: "",
  fumbleRecoveries: "",
  qbHurries: "",
  touchdowns: ""
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
  setProfileBaseline(null);
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

  const seasonStatFields = [
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

  const recruitingArrayFields = [
    "collegeOffers",
    "campsAttended",
    "collegesOfInterest"
  ];

  const parseMeasurement = (value) => {
    if (!value) {
      return { feet: "", inches: "" };
    }

    const match = String(value).match(/(\d+)'?\s*(\d+)?/);

    return {
      feet: match?.[1] || "",
      inches: match?.[2] || ""
    };
  };

  const valueForInput = (value) =>
    value === undefined || value === null ? "" : String(value);

  const arraysToTextarea = (value) =>
    Array.isArray(value) ? value.join("\\n") : "";

  const normalizeFormValue = (value) =>
    value === undefined || value === null ? "" : String(value);

  const loadMyProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("No token found. Please log in first.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/my-profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Could not load profile");
        return;
      }

      const currentSeasonStats =
        Array.isArray(data.seasonStats)
          ? data.seasonStats.find((season) => season.isCurrent) ||
            data.seasonStats[0] ||
            {}
          : {};

      const pendingUpdates = data.pendingUpdates || {};
      const pendingSeasonStats =
        pendingUpdates.currentSeasonStats?.stats || {};

      const approvedHeight = parseMeasurement(data.height);
      const approvedBroadJump = parseMeasurement(data.broadJump);

      const mergedHeight =
        pendingUpdates.height !== undefined
          ? parseMeasurement(pendingUpdates.height)
          : approvedHeight;

      const mergedBroadJump =
        pendingUpdates.broadJump !== undefined
          ? parseMeasurement(pendingUpdates.broadJump)
          : approvedBroadJump;

      const loadedForm = {
        name: valueForInput(
          pendingUpdates.name ?? data.name
        ),
        position: valueForInput(
          pendingUpdates.position ?? data.position
        ),
        position1: valueForInput(
          pendingUpdates.position1 ??
            data.position1 ??
            data.position?.split("/")?.[0]
        ),
        position2: valueForInput(
          pendingUpdates.position2 ??
            data.position2 ??
            data.position?.split("/")?.[1]
        ),
        playerClass: valueForInput(
          pendingUpdates.playerClass ?? data.playerClass
        ),
        height: valueForInput(
          pendingUpdates.height ?? data.height
        ),
        heightFeet: mergedHeight.feet,
        heightInches: mergedHeight.inches,
        weight: valueForInput(
          pendingUpdates.weight ?? data.weight
        ),
        jerseyNumber: valueForInput(
          pendingUpdates.jerseyNumber ?? data.jerseyNumber
        ),
        location: valueForInput(
          pendingUpdates.location ?? data.location
        ),
        hudlLink: valueForInput(
          pendingUpdates.hudlLink ?? data.hudlLink
        ),
        contactInfo: valueForInput(
          pendingUpdates.contactInfo ?? data.contactInfo
        ),
        profilePicture: valueForInput(data.profilePicture),
        twitter: valueForInput(
          pendingUpdates.twitter ?? data.twitter
        ),
        ncaaId: valueForInput(
          pendingUpdates.ncaaId ?? data.ncaaId
        ),
        phoneNumber: valueForInput(
          pendingUpdates.phoneNumber ?? data.phoneNumber
        ),
        emailAddress: valueForInput(
          pendingUpdates.emailAddress ?? data.emailAddress
        ),
        collegeOffers: arraysToTextarea(
          pendingUpdates.collegeOffers ?? data.collegeOffers
        ),
        campsAttended: arraysToTextarea(
          pendingUpdates.campsAttended ?? data.campsAttended
        ),
        collegesOfInterest: arraysToTextarea(
          pendingUpdates.collegesOfInterest ??
            data.collegesOfInterest
        ),
        gpa: valueForInput(
          pendingUpdates.gpa ?? data.gpa
        ),
        fortyTime: valueForInput(
          pendingUpdates.fortyTime ?? data.fortyTime
        ),
        vertical: valueForInput(
          pendingUpdates.vertical ?? data.vertical
        ),
        broadJump: valueForInput(
          pendingUpdates.broadJump ?? data.broadJump
        ),
        broadJumpFeet: mergedBroadJump.feet,
        broadJumpInches: mergedBroadJump.inches,
        benchMax: valueForInput(
          pendingUpdates.benchMax ?? data.benchMax
        ),
        cleanMax: valueForInput(
          pendingUpdates.cleanMax ?? data.cleanMax
        ),
        squatMax: valueForInput(
          pendingUpdates.squatMax ?? data.squatMax
        )
      };

      for (const field of seasonStatFields) {
        loadedForm[field] = valueForInput(
          pendingSeasonStats[field] ??
            currentSeasonStats[field] ??
            data[field]
        );
      }

      setPlayer(data);
      setFormData(loadedForm);
      setProfileBaseline(loadedForm);
      setMessage("Profile loaded ✅");
    } catch (err) {
      console.error("Load profile error:", err);
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

    if (!token) {
      setMessage("No token found. Please log in again.");
      return;
    }

    if (!profileBaseline) {
      setMessage("Profile is still loading. Please try again.");
      return;
    }

    const currentValues = {
      ...formData,
      position:
        formData.position1 && formData.position2
          ? `${formData.position1}/${formData.position2}`
          : formData.position1 || "",
      height:
        formData.heightFeet || formData.heightInches
          ? `${formData.heightFeet || 0}' ${formData.heightInches || 0}"`
          : "",
      broadJump:
        formData.broadJumpFeet || formData.broadJumpInches
          ? `${formData.broadJumpFeet || 0}' ${formData.broadJumpInches || 0}"`
          : "",
      location: "El Paso, TX"
    };

    const baselineValues = {
      ...profileBaseline,
      position:
        profileBaseline.position1 && profileBaseline.position2
          ? `${profileBaseline.position1}/${profileBaseline.position2}`
          : profileBaseline.position1 || "",
      height:
        profileBaseline.heightFeet ||
        profileBaseline.heightInches
          ? `${profileBaseline.heightFeet || 0}' ${
              profileBaseline.heightInches || 0
            }"`
          : "",
      broadJump:
        profileBaseline.broadJumpFeet ||
        profileBaseline.broadJumpInches
          ? `${profileBaseline.broadJumpFeet || 0}' ${
              profileBaseline.broadJumpInches || 0
            }"`
          : "",
      location: "El Paso, TX"
    };

    const payload = {};

    const profileFields = [
      "name",
      "position",
      "position1",
      "position2",
      "playerClass",
      "height",
      "weight",
      "jerseyNumber",
      "location",
      "hudlLink",
      "contactInfo",
      "twitter",
      "ncaaId",
      "phoneNumber",
      "emailAddress",
      "collegeOffers",
      "campsAttended",
      "collegesOfInterest",
      "gpa",
      "fortyTime",
      "vertical",
      "broadJump",
      "benchMax",
      "cleanMax",
      "squatMax"
    ];

    for (const field of profileFields) {
      const currentValue = normalizeFormValue(
        currentValues[field]
      );

      const baselineValue = normalizeFormValue(
        baselineValues[field]
      );

      if (currentValue === baselineValue) {
        continue;
      }

      if (recruitingArrayFields.includes(field)) {
        payload[field] = currentValue
          .split(/\r?\n/)
          .map((item) => item.trim())
          .filter(Boolean);
      } else if (
        ["benchMax", "cleanMax", "squatMax"].includes(field)
      ) {
        payload[field] =
          currentValue === "" ? null : Number(currentValue);
      } else {
        payload[field] = currentValue;
      }
    }

    for (const field of seasonStatFields) {
      const currentValue = normalizeFormValue(
        currentValues[field]
      );

      const baselineValue = normalizeFormValue(
        baselineValues[field]
      );

      if (currentValue === baselineValue) {
        continue;
      }

      // Critical frontend safety:
      // blank football fields are never submitted.
      if (currentValue === "") {
        continue;
      }

      payload[field] = Number(currentValue);
    }

    if (Object.keys(payload).length === 0) {
      setMessage("No new changes to submit.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/my-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Update failed");
        return;
      }

      setPlayer(data.player);
      setProfileBaseline({ ...currentValues });
      setMessage(
        data.message ||
          "Profile changes submitted for review ✅"
      );
    } catch (err) {
      console.error("Update profile error:", err);
      setMessage("Error updating profile");
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
      setMessage(
        data.message ||
          "Profile picture submitted for review ✅"
      );
      setSelectedImage(null);
      await loadMyProfile();
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