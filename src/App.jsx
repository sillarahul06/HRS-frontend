import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminBookings from "./pages/AdminBookings";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHotels from "./pages/AdminHotels";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* CUSTOMER ONLY */}
          <Route element={<ProtectedRoute />}>
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotel-details" element={<HotelDetails />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* ADMIN LOGIN */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ADMIN ONLY */}
          <Route element={<AdminRoute />}>

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/hotels"
              element={<AdminHotels />}
            />
<Route
  path="/admin/bookings"
  element={<AdminBookings />}
/>
          </Route>

        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;