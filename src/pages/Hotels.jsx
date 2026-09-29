import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API_URL from "../api";
function Hotels() {
  const [searchParams] = useSearchParams();

  const selectedLocation =
    searchParams.get("location") || "All Locations";

  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(selectedLocation);
  const [priceRange, setPriceRange] = useState("All Prices");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/hotels`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch hotels");
        }

        return response.json();
      })
      .then((data) => {
        setHotels(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(
          "Unable to load hotels. Please make sure the backend is running."
        );
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLocation(selectedLocation);
  }, [selectedLocation]);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const matchesSearch =
        hotel.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        hotel.location
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesLocation =
        location === "All Locations" ||
        hotel.location === location;

      /*
        Your current Hotel MongoDB model does not contain
        an image or price field.

        Therefore price filtering will only be applied
        when price data exists.
      */
      let matchesPrice = true;

      if (
        priceRange !== "All Prices" &&
        hotel.price !== undefined
      ) {
        if (priceRange === "Under ₹2,500") {
          matchesPrice = hotel.price < 2500;
        }

        if (priceRange === "₹2,500 - ₹3,000") {
          matchesPrice =
            hotel.price >= 2500 &&
            hotel.price <= 3000;
        }

        if (priceRange === "Above ₹3,000") {
          matchesPrice = hotel.price > 3000;
        }
      }

      return (
        matchesSearch &&
        matchesLocation &&
        matchesPrice
      );
    });
  }, [hotels, search, location, priceRange]);

  const resetFilters = () => {
    setSearch("");
    setLocation("All Locations");
    setPriceRange("All Prices");
  };

  return (
    <>
      <Navbar />

      <main className="hotels-page">

        {/* PAGE HEADING */}
        <div className="page-heading">
          <span className="heading-small">
            FIND YOUR STAY
          </span>

          <h1>
            {location === "All Locations"
              ? "Explore Hotels"
              : `Hotels in ${location}`}
          </h1>

          <p>
            Discover comfortable hotels and choose the
            perfect room for your stay.
          </p>
        </div>

        {/* FILTERS */}
        <div className="hotel-filter">

          <input
            type="text"
            placeholder="Search by hotel or location"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          >
            <option>All Locations</option>
            <option>Goa</option>
            <option>Visakhapatnam</option>
            <option>Hyderabad</option>
          </select>

          <select
            value={priceRange}
            onChange={(e) =>
              setPriceRange(e.target.value)
            }
          >
            <option>All Prices</option>
            <option>Under ₹2,500</option>
            <option>₹2,500 - ₹3,000</option>
            <option>Above ₹3,000</option>
          </select>

          <button onClick={resetFilters}>
            Reset
          </button>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="no-hotels">
            <div className="no-hotels-icon">
              ⏳
            </div>

            <h2>Loading hotels...</h2>

            <p>
              Getting available hotels from Stayora.
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="no-hotels">

            <div className="no-hotels-icon">
              ⚠️
            </div>

            <h2>Unable to load hotels</h2>

            <p>{error}</p>

            <button
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>

          </div>
        )}

        {/* RESULTS */}
        {!loading && !error && (
          <>
            <div className="hotel-results">
              Showing{" "}
              <strong>
                {filteredHotels.length}
              </strong>{" "}
              {filteredHotels.length === 1
                ? "available hotel"
                : "available hotels"}
            </div>

            {filteredHotels.length > 0 ? (
              <div className="hotel-cards">

                {filteredHotels.map((hotel) => (

                  <article
                    className="hotel-card"
                    key={hotel._id}
                  >

                    {/* IMAGE */}
                    <div className="hotel-image-container">
                      <img
                        src={
                          hotel.image ||
                          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=85"
                        }
                        alt={hotel.name}
                      />

                      <span className="hotel-rating">
                        ★ {hotel.rating}
                      </span>
                    </div>

                    {/* INFO */}
                    <div className="hotel-info">

                      <div className="hotel-title">

                        <h3>
                          {hotel.name}
                        </h3>

                      </div>

                      <p>
                        📍 {hotel.location}
                      </p>

                      <p className="hotel-description">
                        {hotel.description}
                      </p>

                      <div className="hotel-bottom">

                        <div>
                          {hotel.price ? (
                            <>
                              <strong>
                                ₹
                                {hotel.price.toLocaleString()}
                              </strong>

                              <small>
                                {" "}
                                / night
                              </small>
                            </>
                          ) : (
                            <strong>
                              View rooms
                            </strong>
                          )}
                        </div>

                        <Link
                          to={`/hotel-details?hotel=${hotel._id}`}
                          className="hotel-view-btn"
                        >
                          View Details
                        </Link>

                      </div>

                    </div>

                  </article>

                ))}

              </div>
            ) : (
              <div className="no-hotels">

                <div className="no-hotels-icon">
                  🏨
                </div>

                <h2>
                  No hotels found
                </h2>

                <p>
                  Try another location or change
                  your search filters.
                </p>

                <button onClick={resetFilters}>
                  Show All Hotels
                </button>

              </div>
            )}
          </>
        )}

      </main>
    </>
  );
}

export default Hotels;