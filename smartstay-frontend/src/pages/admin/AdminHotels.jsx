import { useEffect, useState } from "react";
import api from "../../api/api";

const AdminHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    amenities: "",
  });

  const [editingId, setEditingId] = useState(null);

  // ================= LOAD HOTELS =================
  const loadHotels = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/hotels");
      setHotels(res.data);
    } catch (err) {
      alert("Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= ADD / UPDATE HOTEL =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // UPDATE
        await api.put(`/api/admin/hotels/${editingId}`, form);
        alert("Hotel updated successfully");
      } else {
        // ADD
        await api.post("/api/admin/hotels", form);
        alert("Hotel added successfully");
      }

      setForm({
        name: "",
        city: "",
        address: "",
        description: "",
        amenities: "",
      });
      setEditingId(null);
      loadHotels();
    } catch (err) {
      alert("Operation failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (hotel) => {
    setEditingId(hotel.hotelId);
    setForm({
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
      description: hotel.description,
      amenities: hotel.amenities,
    });
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hotel?")) return;

    try {
      await api.delete(`/api/admin/hotels/${id}`);
      alert("Hotel deleted");
      loadHotels();
    } catch (err) {
      alert("Delete failed (delete rooms first if exist)");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Manage Hotels</h2>

      {/* ===== FORM ===== */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-8 space-y-4"
      >
        <h3 className="text-xl font-semibold">
          {editingId ? "Edit Hotel" : "Add Hotel"}
        </h3>

        <input
          name="name"
          placeholder="Hotel Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="amenities"
          placeholder="Amenities (Wifi, AC, Pool)"
          value={form.amenities}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Update Hotel" : "Add Hotel"}
        </button>
      </form>

      {/* ===== LIST ===== */}
      {loading ? (
        <p>Loading hotels...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotels.map((h) => (
            <div key={h.hotelId} className="bg-white p-4 rounded shadow">
              <h4 className="text-lg font-bold">{h.name}</h4>
              <p className="text-gray-600">{h.city}</p>
              <p className="text-sm mt-1">{h.amenities}</p>

              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => handleEdit(h)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(h.hotelId)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminHotels;

