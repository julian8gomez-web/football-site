import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({
  handleLogout,
  playerName,
  approvedPlayerCount = 0,
  compact = false
}) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const displayName = localStorage.getItem("displayName");

  const accountLabel =
  role === "admin"
    ? displayName || "Admin"
    : playerName || (token ? "Player" : "");

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const dashboardPath =
    role === "admin" ? "/admin" : "/dashboard";

  const dashboardLabel =
    role === "admin" ? "Admin Dashboard" : "Player Dashboard";

  return (
    <nav className={`navbar ${compact ? "navbar-compact" : ""}`}>
      <div className="navbar-left">
        <Link to="/">
          <button type="button">Home</button>
        </Link>
      </div>

      {!compact && (
        <Link to="/" className="navbar-recruiting-title">
          <strong>Recruiting Profiles</strong>
          <span>
            {approvedPlayerCount} Verified Athlete
            {approvedPlayerCount === 1 ? "" : "s"}
          </span>
        </Link>
      )}

      {compact && (
        <div className="navbar-private-title">
          <strong>
            {role === "admin" ? "Admin Workspace" : "Player Workspace"}
          </strong>
          {accountLabel && <span>{accountLabel}</span>}
        </div>
      )}

      <button
        type="button"
        className="navbar-menu-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((current) => !current)}
      >
        ☰
      </button>

      <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
        {token ? (
          <>
            {!compact && accountLabel && (
              <span className="navbar-account-name">
                {accountLabel}
              </span>
            )}

            <Link to={dashboardPath}>
              <button type="button">{dashboardLabel}</button>
            </Link>

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
    </nav>
  );
}

export default Navbar;
