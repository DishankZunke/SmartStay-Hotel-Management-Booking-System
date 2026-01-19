import { useEffect, useState } from "react";
import { getAllHotels, getHotelsByCity } from "../../api/hotelApi";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const UserDashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ---------------- LOAD HOTELS ----------------
  const loadHotels = async () => {
    try {
      setLoading(true);
      const data = await getAllHotels();
      setHotels(data);
    } catch (e) {
      console.error("Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOAD MY BOOKINGS (JWT FIX) ----------------
  const loadBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/api/bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  };

  const searchByCity = async () => {
    if (!searchCity) {
      loadHotels();
      return;
    }
    try {
      const data = await getHotelsByCity(searchCity);
      setHotels(data);
    } catch {
      alert("No hotels found in this city");
    }
  };

  useEffect(() => {
    loadHotels();
    loadBookings();
  }, []);

  // ---------------- DOWNLOAD INVOICE ----------------
  const downloadInvoice = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/invoice/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        alert("Invoice download failed");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${bookingId}.pdf`;
      a.click();
    } catch (err) {
      console.error(err);
      alert("Invoice error");
    }
  };

  // filter by hotel name
  const filteredHotels = hotels.filter((h) =>
    h.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">SmartStay</h1>

      {/* 🔍 Search Bar */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search by city (Nagpur, Goa...)"
          className="p-3 border rounded w-1/3"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <input
          placeholder="Search by hotel name"
          className="p-3 border rounded w-1/3"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <button
          onClick={searchByCity}
          className="bg-blue-600 text-white px-6 rounded"
        >
          Search
        </button>
      </div>

      {/* 🏨 Hotel Cards */}
      {loading ? (
        <p>Loading hotels...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div key={hotel.hotelId} className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{hotel.name}</h2>
              <p className="text-gray-600">{hotel.city}</p>
              <p className="text-sm mt-2">{hotel.amenities}</p>

              <button
                onClick={() => navigate(`/user/rooms/${hotel.hotelId}`)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
              >
                View Rooms
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🧾 MY BOOKINGS */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-800">
        My Bookings
      </h2>

      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.bookingId}
            className="bg-white p-4 mb-4 rounded shadow"
          >
            <p><b>Hotel:</b> {b.hotel.name}</p>
            <p><b>Room:</b> {b.room.roomType}</p>
            <p><b>Check-in:</b> {b.checkIn}</p>
            <p><b>Check-out:</b> {b.checkOut}</p>
            <p><b>Total:</b> ₹{b.totalPrice}</p>
            <p><b>Status:</b> {b.status}</p>
            <p><b>Payment:</b> {b.paymentStatus}</p>

            {b.paymentStatus === "PAID" && (
              <button
                onClick={() => downloadInvoice(b.bookingId)}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
              >
                Download Invoice
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserDashboard;
