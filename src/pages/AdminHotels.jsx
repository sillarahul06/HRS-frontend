import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import API_URL from "../api";
function AdminHotels() {
  const { token } = useAuth();

  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showHotelForm, setShowHotelForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);

  const [hotelForm, setHotelForm] = useState({
    name: "",
    location: "",
    description: "",
    rating: "",
  });

  const [openHotel, setOpenHotel] = useState(null);

  const [showRoomForm, setShowRoomForm] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

  const [roomForm, setRoomForm] = useState({
    roomType: "",
    price: "",
    capacity: "",
    available: true,
  });

  // FETCH HOTELS AND ROOMS
  const fetchData = async () => {
    try {
      setLoading(true);

      const [hotelResponse, roomResponse] = await Promise.all([
        fetch("${API_URL}/hotels"),
        fetch("${API_URL}/rooms"),
      ]);

      const hotelData = await hotelResponse.json();
      const roomData = await roomResponse.json();

      setHotels(hotelData);
      setRooms(roomData);
    } catch (error) {
      setMessage("Unable to load hotels and rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // HOTEL FORM CHANGE
  const handleHotelChange = (e) => {
    setHotelForm({
      ...hotelForm,
      [e.target.name]: e.target.value,
    });
  };

  // ADD / UPDATE HOTEL
  const handleHotelSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingHotel
        ? `${API_URL}/hotels/${editingHotel._id}`
        : `${API_URL}/hotels`;

      const method = editingHotel ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...hotelForm,
          rating: Number(hotelForm.rating),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Hotel operation failed");
      }

      setMessage(
        editingHotel
          ? "Hotel updated successfully."
          : "Hotel added successfully."
      );

      resetHotelForm();
      fetchData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // DELETE HOTEL
  const handleDeleteHotel = async (hotelId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hotel?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/hotels/${hotelId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete hotel");
      }

      setMessage("Hotel deleted successfully.");
      fetchData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // EDIT HOTEL
  const startEditHotel = (hotel) => {
    setEditingHotel(hotel);

    setHotelForm({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      rating: hotel.rating,
    });

    setShowHotelForm(true);
  };

  // RESET HOTEL FORM
  const resetHotelForm = () => {
    setEditingHotel(null);

    setHotelForm({
      name: "",
      location: "",
      description: "",
      rating: "",
    });

    setShowHotelForm(false);
  };

  // ROOM FORM CHANGE
  const handleRoomChange = (e) => {
    const { name, value, type, checked } = e.target;

    setRoomForm({
      ...roomForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ADD / UPDATE ROOM
  const handleRoomSubmit = async (e, hotelId) => {
    e.preventDefault();

    try {
      const url = editingRoom
        ? `${API_URL}/rooms/${editingRoom._id}`
        : `${API_URL}/rooms`;

      const method = editingRoom ? "PUT" : "POST";

      const body = {
        hotel: hotelId,
        roomType: roomForm.roomType,
        price: Number(roomForm.price),
        capacity: Number(roomForm.capacity),
        available: roomForm.available,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Room operation failed");
      }

      setMessage(
        editingRoom
          ? "Room updated successfully."
          : "Room added successfully."
      );

      resetRoomForm();
      fetchData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // DELETE ROOM
  const handleDeleteRoom = async (roomId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/rooms/${roomId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete room");
      }

      setMessage("Room deleted successfully.");
      fetchData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // EDIT ROOM
  const startEditRoom = (room) => {
    setEditingRoom(room);

    setRoomForm({
      roomType: room.roomType,
      price: room.price,
      capacity: room.capacity,
      available: room.available,
    });

    setShowRoomForm(room.hotel?._id || room.hotel);
  };

  // RESET ROOM FORM
  const resetRoomForm = () => {
    setEditingRoom(null);

    setRoomForm({
      roomType: "",
      price: "",
      capacity: "",
      available: true,
    });

    setShowRoomForm(null);
  };

  // GET ROOMS FOR HOTEL
  const getHotelRooms = (hotelId) => {
    return rooms.filter((room) => {
      const roomHotelId =
        room.hotel?._id || room.hotel;

      return roomHotelId === hotelId;
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="admin-page">
          <p>Loading hotels...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="admin-page">

        {/* HEADER */}
        <div className="admin-page-header">
          <div>
            <Link
              to="/admin/dashboard"
              className="admin-back-link"
            >
              ← Admin Dashboard
            </Link>

            <p className="admin-label">HOTELS</p>

            <h1>Manage Hotels</h1>

            <p>
              Manage hotels and the rooms belonging to each hotel.
            </p>
          </div>

          <button
            className="admin-primary-btn"
            onClick={() => {
              resetHotelForm();
              setShowHotelForm(true);
            }}
          >
            + Add Hotel
          </button>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="admin-message">
            {message}
          </div>
        )}

        {/* HOTEL FORM */}
        {showHotelForm && (
          <div className="admin-form-card">

            <h2>
              {editingHotel ? "Edit Hotel" : "Add New Hotel"}
            </h2>

            <form onSubmit={handleHotelSubmit}>

              <div className="admin-form-grid">

                <input
                  type="text"
                  name="name"
                  placeholder="Hotel Name"
                  value={hotelForm.name}
                  onChange={handleHotelChange}
                  required
                />

                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={hotelForm.location}
                  onChange={handleHotelChange}
                  required
                />

                <input
                  type="number"
                  name="rating"
                  placeholder="Rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={hotelForm.rating}
                  onChange={handleHotelChange}
                  required
                />

                <textarea
                  name="description"
                  placeholder="Hotel Description"
                  value={hotelForm.description}
                  onChange={handleHotelChange}
                  required
                />

              </div>

              <div className="admin-form-actions">

                <button
                  type="submit"
                  className="admin-primary-btn"
                >
                  {editingHotel
                    ? "Update Hotel"
                    : "Add Hotel"}
                </button>

                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={resetHotelForm}
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

        {/* HOTEL LIST */}
        <div className="admin-hotel-list">

          {hotels.length === 0 ? (
            <div className="admin-empty">
              No hotels found.
            </div>
          ) : (
            hotels.map((hotel) => {

              const hotelRooms = getHotelRooms(hotel._id);

              const isOpen =
                openHotel === hotel._id;

              return (
                <div
                  className="admin-hotel-card"
                  key={hotel._id}
                >

                  {/* HOTEL HEADER */}
                  <div className="admin-hotel-header">

                    <div>
                      <h2>{hotel.name}</h2>

                      <p>
                        📍 {hotel.location}
                      </p>

                      <p>
                        ⭐ {hotel.rating}
                      </p>
                    </div>

                    <div className="admin-hotel-actions">

                      <button
                        className="admin-edit-btn"
                        onClick={() =>
                          startEditHotel(hotel)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="admin-delete-btn"
                        onClick={() =>
                          handleDeleteHotel(hotel._id)
                        }
                      >
                        Delete
                      </button>

                      <button
                        className="admin-room-btn"
                        onClick={() =>
                          setOpenHotel(
                            isOpen ? null : hotel._id
                          )
                        }
                      >
                        {isOpen
                          ? "Hide Rooms"
                          : `Manage Rooms (${hotelRooms.length})`}
                      </button>

                    </div>

                  </div>

                  <p className="admin-hotel-description">
                    {hotel.description}
                  </p>

                  {/* ROOMS INSIDE HOTEL */}
                  {isOpen && (
                    <div className="admin-rooms-section">

                      <div className="admin-rooms-header">

                        <div>
                          <h3>
                            Rooms in {hotel.name}
                          </h3>

                          <p>
                            Add and manage rooms for this hotel.
                          </p>
                        </div>

                        <button
                          className="admin-primary-btn"
                          onClick={() => {
                            setEditingRoom(null);

                            setRoomForm({
                              roomType: "",
                              price: "",
                              capacity: "",
                              available: true,
                            });

                            setShowRoomForm(hotel._id);
                          }}
                        >
                          + Add Room
                        </button>

                      </div>

                      {/* ROOM FORM */}
                      {showRoomForm === hotel._id && (
                        <form
                          className="admin-room-form"
                          onSubmit={(e) =>
                            handleRoomSubmit(
                              e,
                              hotel._id
                            )
                          }
                        >

                          <h4>
                            {editingRoom
                              ? "Edit Room"
                              : "Add Room"}
                          </h4>

                          <input
                            type="text"
                            name="roomType"
                            placeholder="Room Type"
                            value={roomForm.roomType}
                            onChange={handleRoomChange}
                            required
                          />

                          <input
                            type="number"
                            name="price"
                            placeholder="Price per night"
                            min="0"
                            value={roomForm.price}
                            onChange={handleRoomChange}
                            required
                          />

                          <input
                            type="number"
                            name="capacity"
                            placeholder="Capacity"
                            min="1"
                            value={roomForm.capacity}
                            onChange={handleRoomChange}
                            required
                          />

                          <label className="admin-checkbox">
                            <input
                              type="checkbox"
                              name="available"
                              checked={roomForm.available}
                              onChange={handleRoomChange}
                            />
                            Room Available
                          </label>

                          <div className="admin-form-actions">

                            <button
                              type="submit"
                              className="admin-primary-btn"
                            >
                              {editingRoom
                                ? "Update Room"
                                : "Add Room"}
                            </button>

                            <button
                              type="button"
                              className="admin-secondary-btn"
                              onClick={resetRoomForm}
                            >
                              Cancel
                            </button>

                          </div>

                        </form>
                      )}

                      {/* ROOMS */}
                      {hotelRooms.length === 0 ? (
                        <div className="admin-empty-room">
                          No rooms added for this hotel.
                        </div>
                      ) : (
                        <div className="admin-room-list">

                          {hotelRooms.map((room) => (
                            <div
                              className="admin-room-card"
                              key={room._id}
                            >

                              <div>
                                <h4>
                                  {room.roomType}
                                </h4>

                                <p>
                                  ₹{room.price} / night
                                </p>

                                <p>
                                  Capacity: {room.capacity} guests
                                </p>

                                <span
                                  className={
                                    room.available
                                      ? "room-available"
                                      : "room-unavailable"
                                  }
                                >
                                  {room.available
                                    ? "Available"
                                    : "Unavailable"}
                                </span>
                              </div>

                              <div className="admin-room-actions">

                                <button
                                  className="admin-edit-btn"
                                  onClick={() =>
                                    startEditRoom(room)
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  className="admin-delete-btn"
                                  onClick={() =>
                                    handleDeleteRoom(
                                      room._id
                                    )
                                  }
                                >
                                  Delete
                                </button>

                              </div>

                            </div>
                          ))}

                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })
          )}

        </div>

      </div>
    </>
  );
}

export default AdminHotels;
