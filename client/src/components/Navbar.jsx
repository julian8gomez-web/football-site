import { Link } from "react-router-dom";

function Navbar({ handleLogout, clearMessage }) {
  return (
    <div className="navbar">
      <Link to="/"><button>Home</button></Link>
      <Link to="/login"><button>Login</button></Link>
      <Link to="/dashboard"><button>Player Dashboard</button></Link>
      <Link to="/admin"><button>Admin Dashboard</button></Link>
      <button className="secondary-button" onClick={handleLogout}>Logout</button>
      <button className="secondary-button" onClick={clearMessage}>Clear Message</button>
    </div>
  );
}

export default Navbar;