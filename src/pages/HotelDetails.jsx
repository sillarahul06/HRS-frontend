import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API_URL from "../api";
function HotelDetails() {
  const [searchParams] = useSearchParams();
  const hotelId = searchParams.get("hotel");

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hotelId) {
      setError("Hotel ID is missing.");
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`${API_URL}/hotels/${hotelId}`),
      fetch(`${API_URL}/rooms`),
    ])
      .then(async ([hotelResponse, roomsResponse]) => {
        if (!hotelResponse.ok) {
          throw new Error("Hotel not found");
        }

        if (!roomsResponse.ok) {
          throw new Error("Unable to load rooms");
        }

        const hotelData = await hotelResponse.json();
        const roomsData = await roomsResponse.json();

        setHotel(hotelData);

        // Room API uses populate("hotel")
        const hotelRooms = roomsData.filter(
          (room) => room.hotel && room.hotel._id === hotelId
        );

        setRooms(hotelRooms);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load hotel details.");
        setLoading(false);
      });
  }, [hotelId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="details-page">
          <div className="no-hotels">
            <div className="no-hotels-icon">⏳</div>
            <h2>Loading hotel...</h2>
            <p>Getting hotel details from Stayora.</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !hotel) {
    return (
      <>
        <Navbar />
        <main className="details-page">
          <div className="no-hotels">
            <div className="no-hotels-icon">⚠️</div>
            <h2>Hotel not found</h2>
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

      <main className="details-page">
        <section className="hotel-detail-header">
          <div className="hotel-detail-image">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85"
              alt={hotel.name}
            />
          </div>

          <div className="hotel-detail-content">
            <span className="heading-small">STAYORA HOTEL</span>

            <h1>{hotel.name}</h1>

            <p className="hotel-location">
              📍 {hotel.location}
            </p>

            <div className="detail-rating">
              ★ {hotel.rating}
            </div>

            <p className="hotel-detail-description">
              {hotel.description}
            </p>

            <div className="hotel-features">
              <span>✓ Comfortable Rooms</span>
              <span>✓ Free Wi-Fi</span>
              <span>✓ 24/7 Support</span>
            </div>
          </div>
        </section>

        <section className="rooms-section">
          <div className="page-heading">
            <span className="heading-small">CHOOSE YOUR ROOM</span>
            <h2>Available Rooms</h2>
            <p>
              Select a room that suits your stay and continue with your
              reservation.
            </p>
          </div>

          {rooms.length > 0 ? (
            <div className="room-cards">
              {rooms.map((room) => (
                <article className="room-card" key={room._id}>
                  <div className="room-card-top">
                    <div>
                      <h3>{room.roomType}</h3>
                      <p>
                        👥 Up to {room.capacity} guests
                      </p>
                    </div>

                    <span
                      className={
                        room.available
                          ? "room-available"
                          : "room-unavailable"
                      }
                    >
                      {room.available ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <div className="room-card-bottom">
                    <div className="room-price">
                      <strong>
                        ₹{room.price.toLocaleString()}
                      </strong>
                      <small> / night</small>
                    </div>

                    {room.available ? (
                      <Link
                        to={`/booking?hotel=${hotel._id}&room=${room._id}`}
                        className="hotel-view-btn"
                      >
                        Reserve Room
                      </Link>
                    ) : (
                      <button className="hotel-view-btn" disabled>
                        Not Available
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-hotels">
              <div className="no-hotels-icon">🛏️</div>
              <h2>No rooms available</h2>
              <p>
                There are currently no rooms listed for this hotel.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default HotelDetails;