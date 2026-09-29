import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import API_URL from "../api";
function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const hotelId = searchParams.get("hotel");
  const roomId = searchParams.get("room");

  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    specialRequest: "",
  });

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hotelId || !roomId) {
      setError("Hotel or room information is missing.");
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`${API_URL}/hotels/${hotelId}`),
      fetch(`${API_URL}/rooms/${roomId}`),
    ])
      .then(async ([hotelResponse, roomResponse]) => {
        if (!hotelResponse.ok) {
          throw new Error("Hotel not found.");
        }

        if (!roomResponse.ok) {
          throw new Error("Room not found.");
        }

        const hotelData = await hotelResponse.json();
        const roomData = await roomResponse.json();

        setHotel(hotelData);
        setRoom(roomData);

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Unable to load booking details.");
        setLoading(false);
      });
  }, [hotelId, roomId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) {
      return 0;
    }

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);

    const difference =
      checkOutDate.getTime() - checkInDate.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  const nights = calculateNights();

  const totalAmount =
    room && nights > 0
      ? nights * room.price
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!formData.checkIn || !formData.checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);

    if (checkOutDate <= checkInDate) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    if (Number(formData.guests) > room.capacity) {
      setError(
        `This room can accommodate maximum ${room.capacity} guests.`
      );
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hotel: hotelId,
            room: roomId,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            guests: Number(formData.guests),
            specialRequest: formData.specialRequest,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create booking."
        );
      }

      alert("Booking confirmed successfully!");

      navigate("/bookings");
    } catch (err) {
      console.error(err);
      setError(err.message || "Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="booking-page">
          <div className="no-hotels">
            <div className="no-hotels-icon">⏳</div>
            <h2>Loading booking details...</h2>
            <p>Getting your selected hotel and room.</p>
          </div>
        </main>
      </>
    );
  }

  if (error && (!hotel || !room)) {
    return (
      <>
        <Navbar />

        <main className="booking-page">
          <div className="no-hotels">
            <div className="no-hotels-icon">⚠️</div>
            <h2>Unable to load booking</h2>
            <p>{error}</p>

            <Link to="/hotels" className="hotel-view-btn">
              Back to Hotels
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="booking-page">
        <div className="page-heading">
          <span className="heading-small">
            COMPLETE YOUR RESERVATION
          </span>

          <h1>Book Your Stay</h1>

          <p>
            Enter your stay details and confirm your reservation.
          </p>
        </div>

        <div className="booking-layout">

          {/* BOOKING FORM */}

          <section className="booking-card">
            <h2>Guest Details</h2>

            <div className="booking-user">
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="booking-date-grid">

                <div className="form-group">
                  <label>Check-in</label>

                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Check-out</label>

                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    min={
                      formData.checkIn ||
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    required
                  />
                </div>

              </div>

              <div className="form-group">
                <label>Guests</label>

                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                >
                  {Array.from(
                    { length: room.capacity },
                    (_, index) => index + 1
                  ).map((number) => (
                    <option
                      key={number}
                      value={number}
                    >
                      {number}{" "}
                      {number === 1
                        ? "Guest"
                        : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Special Request</label>

                <textarea
                  name="specialRequest"
                  value={formData.specialRequest}
                  onChange={handleChange}
                  placeholder="Any special requests? (Optional)"
                  rows="4"
                />
              </div>

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={bookingLoading}
              >
                {bookingLoading
                  ? "Confirming Booking..."
                  : "Confirm Booking"}
              </button>

            </form>
          </section>


          {/* BOOKING SUMMARY */}

          <aside className="booking-summary">

            <div className="booking-summary-image">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85"
                alt={hotel.name}
              />
            </div>

            <div className="booking-summary-content">

              <span className="heading-small">
                YOUR SELECTION
              </span>

              <h2>{hotel.name}</h2>

              <p className="booking-location">
                📍 {hotel.location}
              </p>

              <div className="booking-room">
                <strong>{room.roomType}</strong>

                <span>
                  Up to {room.capacity} guests
                </span>
              </div>

              <div className="booking-price-row">
                <span>Price per night</span>

                <strong>
                  ₹{room.price.toLocaleString()}
                </strong>
              </div>

              {nights > 0 && (
                <>
                  <div className="booking-price-row">

                    <span>
                      {nights}{" "}
                      {nights === 1
                        ? "night"
                        : "nights"}
                    </span>

                    <span>
                      ₹
                      {(
                        room.price * nights
                      ).toLocaleString()}
                    </span>

                  </div>

                  <div className="booking-total">

                    <span>Total</span>

                    <strong>
                      ₹
                      {totalAmount.toLocaleString()}
                    </strong>

                  </div>
                </>
              )}

            </div>
          </aside>

        </div>
      </main>
    </>
  );
}

export default Booking;