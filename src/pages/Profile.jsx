import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  const bookings =
    JSON.parse(
      localStorage.getItem("stayoraBookings")
    ) || [];

  const userBookings = bookings.filter(
    (booking) =>
      booking.userEmail === user.email
  );

  const confirmedBookings =
    userBookings.filter(
      (booking) =>
        booking.status === "Confirmed"
    );

  const firstLetter =
    user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <>
      <Navbar />

      <main className="profile-page">

        <div className="profile-heading">
          <span className="heading-small">
            YOUR ACCOUNT
          </span>

          <h1>Profile</h1>

          <p>
            Manage your Stayora account information.
          </p>
        </div>

        <div className="profile-layout">

          <section className="profile-card">

            <div className="profile-avatar">
              {firstLetter}
            </div>

            <h2>{user?.name}</h2>

            <p>{user?.email}</p>

            <div className="profile-stats">

              <div>
                <strong>
                  {userBookings.length}
                </strong>

                <span>Bookings</span>
              </div>

              <div>
                <strong>
                  {confirmedBookings.length}
                </strong>

                <span>Active</span>
              </div>

            </div>

          </section>

          <section className="profile-details">

            <h2>Personal information</h2>

            <div className="profile-form">

              <div className="form-group">
                <label>Full name</label>

                <input
                  value={user?.name || ""}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Email address</label>

                <input
                  value={user?.email || ""}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Account type</label>

                <input
                  value="Customer"
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Member since</label>

                <input
                  value="2026"
                  readOnly
                />
              </div>

            </div>

            <Link
              to="/hotels"
              className="edit-profile-btn"
            >
              Explore Hotels
            </Link>

          </section>

        </div>

      </main>
    </>
  );
}

export default Profile;