import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function AdminBookings() {
  const { token } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to fetch bookings"
        );
      }

      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="admin-page">
          <p>Loading bookings...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="admin-page">

        <div className="admin-page-header">
          <div>
            <Link
              to="/admin/dashboard"
              className="admin-back-link"
            >
              ← Admin Dashboard
            </Link>

            <p className="admin-label">BOOKINGS</p>

            <h1>Manage Bookings</h1>

            <p>
              View customer reservations and booking details.
            </p>
          </div>
        </div>

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="admin-empty">
            No bookings found.
          </div>
        ) : (
          <div className="admin-bookings-list">

            {bookings.map((booking) => (
              <div
                className="admin-booking-card"
                key={booking._id}
              >

                <div className="admin-booking-header">

                  <div>
                    <h2>
                      {booking.hotel?.name ||
                        "Hotel unavailable"}
                    </h2>

                    <p className="booking-location">
                      📍{" "}
                      {booking.hotel?.location ||
                        "Location unavailable"}
                    </p>
                  </div>

                  <span
                    className={
                      booking.status === "Cancelled"
                        ? "booking-status cancelled"
                        : "booking-status confirmed"
                    }
                  >
                    {booking.status}
                  </span>

                </div>

                <div className="admin-booking-grid">

                  <div>
                    <span>Customer</span>
                    <strong>
                      {booking.user?.name ||
                        "Customer"}
                    </strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>
                      {booking.user?.email ||
                        "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>Room</span>
                    <strong>
                      {booking.room?.roomType ||
                        "Room unavailable"}
                    </strong>
                  </div>

                  <div>
                    <span>Guests</span>
                    <strong>
                      {booking.guests}
                    </strong>
                  </div>

                  <div>
                    <span>Check-in</span>
                    <strong>
                      {formatDate(booking.checkIn)}
                    </strong>
                  </div>

                  <div>
                    <span>Check-out</span>
                    <strong>
                      {formatDate(booking.checkOut)}
                    </strong>
                  </div>

                  <div>
                    <span>Total Amount</span>
                    <strong>
                      ₹{booking.totalAmount}
                    </strong>
                  </div>

                  <div>
                    <span>Booking Date</span>
                    <strong>
                      {formatDate(booking.createdAt)}
                    </strong>
                  </div>

                </div>

                {booking.specialRequest && (
                  <div className="admin-special-request">
                    <strong>Special Request:</strong>

                    <p>
                      {booking.specialRequest}
                    </p>
                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    </>
  );
}

export default AdminBookings;