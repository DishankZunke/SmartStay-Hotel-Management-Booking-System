import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/hotels"
          className="bg-white shadow p-6 rounded hover:bg-blue-50"
        >
          <h3 className="text-xl font-semibold">Manage Hotels</h3>
          <p className="text-gray-600 mt-2">
            Add, update and delete hotels
          </p>
        </Link>

        <Link
          to="/admin/rooms"
          className="bg-white shadow p-6 rounded hover:bg-blue-50"
        >
          <h3 className="text-xl font-semibold">Manage Rooms</h3>
          <p className="text-gray-600 mt-2">
            Add rooms, prices, availability
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
