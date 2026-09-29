import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Stayora
      </Link>

      <div className="nav-links">

        {/* ADMIN NAVBAR */}
        {isLoggedIn && user?.role === "admin" ? (
          <>
            <Link to="/admin/dashboard">
              Admin Dashboard
            </Link>

            <span className="nav-user">
              Hi, {user?.name?.split(" ")[0]}
            </span>

            <button
              className="logout-nav-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          /* CUSTOMER NAVBAR */
          <>
            <Link to="/">
              Home
            </Link>

            <Link to="/hotels">
              Hotels
            </Link>

            {isLoggedIn && (
              <>
                <Link to="/bookings">
                  My Bookings
                </Link>

                <Link to="/profile">
                  Profile
                </Link>

                <span className="nav-user">
                  Hi, {user?.name?.split(" ")[0]}
                </span>

                <button
                  className="logout-nav-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}

            {!isLoggedIn && (
              <Link
                to="/login"
                className="login-nav-btn"
              >
                Login
              </Link>
            )}
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;