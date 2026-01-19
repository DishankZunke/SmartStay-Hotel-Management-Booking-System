import { useEffect, useState } from "react";
import api from "../../api/api";

const AdminRooms = () => {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    roomType: "",
    pricePerNight: "",
    maxGuests: "",
    totalRooms: "",
    availableRooms: "",
    imageUrl: "",
  });

  // ================= LOAD HOTELS =================
  const loadHotels = async () => {
    const res = await api.get("/api/admin/hotels");
    setHotels(res.data);
  };

  // ================= LOAD ROOMS =================
  const loadRooms = async (hotelId) => {
    if (!hotelId) return;
    const res = await api.get(`/api/rooms/hotel/${hotelId}`);
    setRooms(res.data);
  };

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    loadRooms(selectedHotelId);
  }, [selectedHotelId]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= ADD / UPDATE ROOM =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedHotelId) {
      alert("Select hotel first");
      return;
    }

    try {
      if (editingId) {
        // UPDATE
        await api.put(
          `/api/admin/rooms/${editingId}?hotelId=${selectedHotelId}`,
          form
        );
        alert("Room updated");
      } else {
        // ADD
        await api.post(
          `/api/admin/rooms?hotelId=${selectedHotelId}`,
          form
        );
        alert("Room added");
      }

      resetForm();
      loadRooms(selectedHotelId);
    } catch (err) {
      alert("Operation failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (room) => {
    setEditingId(room.roomId);
    setForm({
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      maxGuests: room.maxGuests,
      totalRooms: room.totalRooms,
      availableRooms: room.availableRooms,
      imageUrl: room.imageUrl || "",
    });
  };

  // ================= DELETE =================
  const handleDelete = async (roomId) => {
    if (!window.confirm("Delete this room?")) return;

    try {
      await api.delete(`/api/admin/rooms/${roomId}`);
      alert("Room deleted");
      loadRooms(selectedHotelId);
    } catch (err) {
      alert("Delete failed");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      roomType: "",
      pricePerNight: "",
      maxGuests: "",
      totalRooms: "",
      availableRooms: "",
      imageUrl: "",
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Manage Rooms</h2>

      {/* ===== SELECT HOTEL ===== */}
      <select
        className="border p-2 rounded mb-6 w-full"
        value={selectedHotelId}
        onChange={(e) => setSelectedHotelId(e.target.value)}
      >
        <option value="">Select Hotel</option>
        {hotels.map((h) => (
          <option key={h.hotelId} value={h.hotelId}>
            {h.name} — {h.city}
          </option>
        ))}
      </select>

      {/* ===== FORM ===== */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-8 space-y-4"
      >
        <h3 className="text-xl font-semibold">
          {editingId ? "Edit Room" : "Add Room"}
        </h3>

        <input
          name="roomType"
          placeholder="Room Type (Deluxe)"
          value={form.roomType}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="pricePerNight"
          placeholder="Price per night"
          value={form.pricePerNight}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="maxGuests"
          placeholder="Max guests"
          value={form.maxGuests}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="totalRooms"
          placeholder="Total rooms"
          value={form.totalRooms}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="availableRooms"
          placeholder="Available rooms"
          value={form.availableRooms}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="imageUrl"
          placeholder="Room image URL"
          value={form.imageUrl}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Update Room" : "Add Room"}
        </button>
      </form>

      {/* ===== ROOMS LIST ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((r) => (
          <div key={r.roomId} className="bg-white p-4 rounded shadow">
            {r.imageUrl && (
              <img
                src={r.imageUrl}
                alt="room"
                className="h-40 w-full object-cover rounded mb-2"
              />
            )}

            <h4 className="text-lg font-bold">{r.roomType}</h4>
            <p>₹ {r.pricePerNight} / night</p>
            <p>Guests: {r.maxGuests}</p>
            <p>Available: {r.availableRooms}</p>

            <div className="mt-3 flex gap-3">
              <button
                onClick={() => handleEdit(r)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(r.roomId)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRooms;

;
