import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import huskyHead from "./assets/husky-head.png";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import PlayerDashboard from "./components/PlayerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import PlayerDetailPage from "./components/PlayerDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ChangePasswordPage from "./components/ChangePasswordPage";

function App() {
  const navigate = useNavigate();

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
  benchMax: "",
  cleanMax: "",
  squatMax: "",
  passingYards: "",
  rushingYards: "",
  tackles: "",
  sacks: "",
  interceptions: "",
  touchdowns: ""
});

useEffect(() => {
  console.log("API URL:", import.meta.env.VITE_API_URL);
  fetch(`${import.meta.env.VITE_API_URL}/approved-players`)
    .then((res) => res.json())
    .then((data) => setApprovedPlayers(data))
    .catch((err) => console.error("Error fetching approved players:", err));
}, []);

const filteredPlayers = approvedPlayers.filter((player) => {
  const matchesSearch = player.name
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesPosition = positionFilter
    ? player.position === positionFilter
    : true;

  const matchesClass = classFilter
    ? player.playerClass === classFilter
    : true;

  return matchesSearch && matchesPosition && matchesClass;
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
        setFormData({
          name: data.name || "",
          position: data.position || "",
          playerClass: data.playerClass || "",
          height: data.height || "",
          weight: data.weight || "",
          jerseyNumber: data.jerseyNumber || "",
          location: data.location || "",
          hudlLink: data.hudlLink || "",
          contactInfo: data.contactInfo || "",
          profilePicture: data.profilePicture || "",
          gpa: data.gpa || "",
          fortyTime: data.fortyTime || "",
          vertical: data.vertical || "",
          benchMax: data.benchMax || "",
          cleanMax: data.cleanMax || "",
          squatMax: data.squatMax || "",
          passingYards: data.passingYards || "",
          rushingYards: data.rushingYards || "",
          tackles: data.tackles || "",
          sacks: data.sacks || "",
          interceptions: data.interceptions || "",
          touchdowns: data.touchdowns || "",
          position1: data.position ? data.position.split("/")[0] || "" : "",
          position2: data.position ? data.position.split("/")[1] || "" : "",
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

  const res = await fetch(`${import.meta.env.VITE_API_URL}/my-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
   body: JSON.stringify({
  name: formData.name,
  position:
    formData.position1 && formData.position2
      ? `${formData.position1}/${formData.position2}`
      : formData.position1 || "",
  playerClass: formData.playerClass,
  height: formData.height,
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
  benchMax: formData.benchMax === "" ? null : Number(formData.benchMax),
cleanMax: formData.cleanMax === "" ? null : Number(formData.cleanMax),
squatMax: formData.squatMax === "" ? null : Number(formData.squatMax),
passingYards: formData.passingYards === "" ? null : Number(formData.passingYards),
rushingYards: formData.rushingYards === "" ? null : Number(formData.rushingYards),
tackles: formData.tackles === "" ? null : Number(formData.tackles),
sacks: formData.sacks === "" ? null : Number(formData.sacks),
interceptions: formData.interceptions === "" ? null : Number(formData.interceptions),
touchdowns: formData.touchdowns === "" ? null : Number(formData.touchdowns),
})
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

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="brand-row">
          <img src={huskyHead} alt="Chapin Huskies logo" className="brand-logo" />
          <div className="brand-text">
            <h1>Chapin Husky Football</h1>
            <p className="app-subtitle">Official Player Profile Platform</p>
          </div>
        </div>
      </div>

      <Navbar handleLogout={handleLogout} clearMessage={() => setMessage("")} />

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
              <div className="hero-banner">
                <h2>Built for the Dawgs</h2>
                <p>
                  Welcome to the Chapin Husky Football player platform. Explore approved player
                  profiles, track athlete information, and manage player updates through a
                  clean recruiting-focused system built for our program.
                </p>
              </div>

              <HomePage
  approvedPlayers={filteredPlayers}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  positionFilter={positionFilter}
  setPositionFilter={setPositionFilter}
  classFilter={classFilter}
  setClassFilter={setClassFilter}
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
  adminSearchTerm={adminSearchTerm}
  setAdminSearchTerm={setAdminSearchTerm}
  adminStatusFilter={adminStatusFilter}
  setAdminStatusFilter={setAdminStatusFilter}
  adminPositionFilter={adminPositionFilter}
  setAdminPositionFilter={setAdminPositionFilter}
  adminClassFilter={adminClassFilter}
  setAdminClassFilter={setAdminClassFilter}
/>
    </ProtectedRoute>
  }
/>

        <Route
          path="/players/:id"
          element={<PlayerDetailPage approvedPlayers={approvedPlayers} />}
        />
      </Routes>
      <footer className="site-footer">
  <div className="site-footer-inner">
    <h3 className="site-footer-title">Chapin Husky Football</h3>
    <p className="site-footer-text">Built for the Dawgs • Athlete Profiles • Recruiting Ready</p>
    <p className="site-footer-copy">© 2026 Chapin Husky Football. All rights reserved.</p>
  </div>
</footer>
    </div>
  );
}

export default App;