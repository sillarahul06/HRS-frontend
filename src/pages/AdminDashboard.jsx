import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <Navbar />

      <div className="admin-dashboard">

        {/* HEADER */}
        <div className="admin-header">
          <div>
            <p className="admin-label">ADMIN</p>

            <h1>Admin Dashboard</h1>

            <p>
              Manage Stayora hotels and customer bookings.
            </p>
          </div>

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* ADMIN INFO */}
        <div className="admin-welcome">
          <div>
            <h3>
              Welcome, {user?.name || "Stayora Admin"}
            </h3>

            <p>
              You are logged in as an administrator.
            </p>
          </div>

          <span className="admin-role-badge">
            ADMIN
          </span>
        </div>

        {/* ADMIN OPTIONS */}
        <div className="admin-cards">

          {/* MANAGE HOTELS */}
          <div className="admin-card">

            <div className="admin-card-icon">
              🏨
            </div>

            <h2>Manage Hotels</h2>

            <p>
              Add new hotels, update hotel information,
              manage rooms inside each hotel, and delete
              hotels when required.
            </p>

            <Link
              to="/admin/hotels"
              className="admin-card-btn"
            >
              Manage Hotels
            </Link>

          </div>

          {/* MANAGE BOOKINGS */}
          <div className="admin-card">

            <div className="admin-card-icon">
              📋
            </div>

            <h2>Manage Bookings</h2>

            <p>
              View customer reservations and check
              booking details such as hotel, room,
              dates, guests and booking status.
            </p>

            <Link
              to="/admin/bookings"
              className="admin-card-btn"
            >
              Manage Bookings
            </Link>

          </div>

        </div>

      </div>
    </>
  );
}

export default AdminDashboard;