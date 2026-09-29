import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import API_URL from "../api";
function MyBookings() {
  const { token } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const fetchBookings = async () => {
    if (!token) {
      setError("Please login to view your bookings.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/bookings/my`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load bookings."
        );
      }

      setBookings(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    setCancellingId(bookingId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/bookings/${bookingId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to cancel booking."
        );
      }

      // Update the booking on screen
      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: "Cancelled",
              }
            : booking
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

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

        <main className="bookings-page">
          <div className="no-hotels">
            <div className="no-hotels-icon">⏳</div>

            <h2>Loading your bookings...</h2>

            <p>
              Getting your reservations from Stayora.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bookings-page">
        <div className="page-heading">
          <span className="heading-small">
            YOUR STAYORA RESERVATIONS
          </span>

          <h1>My Bookings</h1>

          <p>
            View and manage your hotel reservations.
          </p>
        </div>

        {error && (
          <div className="auth-error booking-page-error">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="no-hotels">
            <div className="no-hotels-icon">🏨</div>

            <h2>No bookings yet</h2>

            <p>
              You haven't made any hotel reservations yet.
            </p>

            <Link
              to="/hotels"
              className="hotel-view-btn"
            >
              Explore Hotels
            </Link>
          </div>
        ) : (
          <div className="booking-list">
            {bookings.map((booking) => {
              const isCancelled =
                booking.status === "Cancelled";

              return (
                <article
                  className="my-booking-card"
                  key={booking._id}
                >
                  <div className="my-booking-image">
                    <img
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85"
                      alt={
                        booking.hotel?.name ||
                        "Hotel"
                      }
                    />
                  </div>

                  <div className="my-booking-content">
                    <div className="my-booking-header">
                      <div>
                        <span className="heading-small">
                          HOTEL RESERVATION
                        </span>

                        <h2>
                          {booking.hotel?.name ||
                            "Hotel"}
                        </h2>

                        <p>
                          📍{" "}
                          {booking.hotel?.location ||
                            "Location unavailable"}
                        </p>
                      </div>

                      <span
                        className={
                          isCancelled
                            ? "booking-status cancelled"
                            : "booking-status confirmed"
                        }
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="my-booking-details">
                      <div>
                        <span>Room</span>

                        <strong>
                          {booking.room?.roomType ||
                            "Room"}
                        </strong>
                      </div>

                      <div>
                        <span>Check-in</span>

                        <strong>
                          {formatDate(
                            booking.checkIn
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Check-out</span>

                        <strong>
                          {formatDate(
                            booking.checkOut
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Guests</span>

                        <strong>
                          {booking.guests}
                        </strong>
                      </div>
                    </div>

                    {booking.specialRequest && (
                      <div className="booking-request">
                        <span>Special Request</span>

                        <p>
                          {booking.specialRequest}
                        </p>
                      </div>
                    )}

                    <div className="my-booking-footer">
                      <div>
                        <span>Total Amount</span>

                        <strong>
                          ₹
                          {booking.totalAmount?.toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </div>

                      {!isCancelled && (
                        <button
                          className="cancel-booking-btn"
                          onClick={() =>
                            handleCancel(
                              booking._id
                            )
                          }
                          disabled={
                            cancellingId ===
                            booking._id
                          }
                        >
                          {cancellingId ===
                          booking._id
                            ? "Cancelling..."
                            : "Cancel Booking"}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

export default MyBookings;