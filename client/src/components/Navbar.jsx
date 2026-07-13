import { Link } from "react-router-dom";

function Navbar({
  handleLogout,
  clearMessage,
  message,
  playerName,
  approvedPlayerCount
}) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const accountLabel =
    playerName ||
    (role === "admin" ? "Admin" : token ? "Player" : "");

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <button type="button">Home</button>
        </Link>

        {message && (
          <button
            type="button"
            className="secondary-button"
            onClick={clearMessage}
          >
            Clear Message
          </button>
        )}
      </div>

      <Link to="/" className="navbar-recruiting-title">
        <strong>Recruiting Profiles</strong>
        <span>
          {approvedPlayerCount} Verified Athlete
          {approvedPlayerCount === 1 ? "" : "s"}
        </span>
      </Link>

      <div className="navbar-right">
        {token ? (
          <>
            {accountLabel && (
              <span className="navbar-account-name">
                {accountLabel}
              </span>
            )}

            {role === "admin" ? (
              <Link to="/admin">
                <button type="button">Admin Dashboard</button>
              </Link>
            ) : (
              <Link to="/dashboard">
                <button type="button">Player Dashboard</button>
              </Link>
            )}

            <button
              type="button"
              className="secondary-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button type="button">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
