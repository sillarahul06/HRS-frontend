import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const hotels = [
    {
      name: "Grand Palace Hotel",
      location: "Visakhapatnam",
      rating: "4.8",
      price: "₹2,500",
      image:
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Ocean View Resort",
      location: "Goa",
      rating: "4.7",
      price: "₹3,200",
      image:
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "City Comfort Hotel",
      location: "Hyderabad",
      rating: "4.5",
      price: "₹2,000",
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=85",
    },
  ];

  const handleSearch = () => {
    if (!destination.trim()) {
      navigate("/hotels");
      return;
    }

    navigate(
      `/hotels?location=${encodeURIComponent(destination.trim())}`
    );
  };

  const BedIcon = () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 24V11C5 9.9 5.9 9 7 9H25C26.1 9 27 9.9 27 11V24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 17H27"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 13H12C13.1 13 14 13.9 14 15V17H5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 24H29"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 24V27"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M25 24V27"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  const CalendarIcon = () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="7"
        width="22"
        height="20"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10 5V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22 5V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 13H27"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10 17H10.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M16 17H16.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M22 17H22.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M10 22H10.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M16 22H16.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M22 22H22.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="home-hero">
        <div className="hero-overlay"></div>

        <div className="home-hero-content">
          <span className="hero-tag">WELCOME TO STAYORA</span>

          <h1>
            Find a stay that
            <br />
            feels like <span>home.</span>
          </h1>

          <p>
            Discover comfortable hotels, beautiful destinations and
            memorable stays for every journey.
          </p>

          {/* SEARCH */}
          <div className="home-search">

            {/* DESTINATION */}
            <div className="search-item">
              <span className="search-icon">
                <BedIcon />
              </span>

              <div>
                <label>Destination</label>

                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={destination}
                  onChange={(e) =>
                    setDestination(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>

            <div className="search-divider"></div>

            {/* CHECK IN */}
            <div className="search-item">
              <span className="search-icon">
                <CalendarIcon />
              </span>

              <div>
                <label>Check-in</label>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) =>
                    setCheckIn(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="search-divider"></div>

            {/* CHECK OUT */}
            <div className="search-item">
              <span className="search-icon">
                <CalendarIcon />
              </span>

              <div>
                <label>Check-out</label>

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) =>
                    setCheckOut(e.target.value)
                  }
                />
              </div>
            </div>

            {/* SEARCH BUTTON */}
            <button
              className="search-action"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* QUICK INFO */}
      <section className="quick-info">
        <div>
          <strong>500+</strong>
          <span>Hotels & stays</span>
        </div>

        <div>
          <strong>50+</strong>
          <span>Destinations</span>
        </div>

        <div>
          <strong>4.7/5</strong>
          <span>Guest rating</span>
        </div>

        <div>
          <strong>24/7</strong>
          <span>Booking support</span>
        </div>
      </section>

      {/* POPULAR HOTELS */}
      <section className="home-section">
        <div className="section-heading-row">
          <div>
            <span className="section-label">EXPLORE</span>

            <h2>Popular stays</h2>

            <p>
              Handpicked places for your next memorable journey.
            </p>
          </div>

          <Link to="/hotels" className="view-all">
            View all hotels →
          </Link>
        </div>

        <div className="premium-hotel-grid">
          {hotels.map((hotel) => (
            <article
              className="premium-hotel-card"
              key={hotel.name}
            >
              <div className="card-image-wrapper">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                />

                <span className="rating-badge">
                  ★ {hotel.rating}
                </span>
              </div>

              <div className="premium-card-content">
                <span className="location">
                  📍 {hotel.location}
                </span>

                <h3>{hotel.name}</h3>

                <div className="card-bottom">
                  <div>
                    <strong>{hotel.price}</strong>
                    <span> / night</span>
                  </div>

                  <Link
                    to={`/hotels?location=${encodeURIComponent(
                      hotel.location
                    )}`}
                    className="card-arrow"
                  >
                    →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="destination-section">
        <div className="section-heading centered">
          <span className="section-label">DISCOVER</span>

          <h2>Popular destinations</h2>

          <p>Explore places worth staying in.</p>
        </div>

        <div className="destination-grid">

          <Link
            to="/hotels?location=Goa"
            className="destination-card destination-goa"
          >
            <div>
              <span>Beach escapes</span>
              <h3>Goa</h3>
            </div>
          </Link>

          <Link
            to="/hotels?location=Visakhapatnam"
            className="destination-card destination-vizag"
          >
            <div>
              <span>Coastal city</span>
              <h3>Visakhapatnam</h3>
            </div>
          </Link>

          <Link
            to="/hotels?location=Hyderabad"
            className="destination-card destination-hyd"
          >
            <div>
              <span>City experiences</span>
              <h3>Hyderabad</h3>
            </div>
          </Link>

        </div>
      </section>

      {/* WHY STAYORA */}
      <section className="why-stayora">

        <div className="why-left">
          <span className="section-label">
            WHY STAYORA
          </span>

          <h2>
            Everything you need
            <br />
            for a better stay.
          </h2>

          <p>
            From finding the right hotel to managing your
            reservation, Stayora keeps your booking experience
            simple and convenient.
          </p>

          <Link
            to="/hotels"
            className="primary-btn"
          >
            Explore hotels
          </Link>
        </div>

        <div className="why-features">

          <div className="why-feature">
            <div className="feature-number">
              01
            </div>

            <div>
              <h3>Trusted stays</h3>

              <p>
                Find comfortable hotels with reliable
                facilities and quality rooms.
              </p>
            </div>
          </div>

          <div className="why-feature">
            <div className="feature-number">
              02
            </div>

            <div>
              <h3>Simple booking</h3>

              <p>
                Search, select your room and manage your
                reservation without unnecessary steps.
              </p>
            </div>
          </div>

          <div className="why-feature">
            <div className="feature-number">
              03
            </div>

            <div>
              <h3>Great value</h3>

              <p>
                Discover stays at prices suitable for
                different travel needs and budgets.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="stayora-footer">

        <div className="footer-main">

          <div className="footer-brand">
            <h2>Stayora</h2>

            <p>
              Your simple way to discover comfortable
              stays and make memorable journeys.
            </p>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>

            <Link to="/">Home</Link>
            <Link to="/hotels">Hotels</Link>
          </div>

          <div className="footer-column">
            <h4>Account</h4>

            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/profile">Profile</Link>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2026 Stayora</span>
          <span>Your stay, simplified.</span>
        </div>

      </footer>
    </>
  );
}

export default Home;