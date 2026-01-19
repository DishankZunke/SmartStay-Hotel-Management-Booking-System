import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAvailableRooms } from "../../api/roomApi";

const RoomsPage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await getAvailableRooms(hotelId);
        setRooms(data);
      } catch (e) {
        alert("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, [hotelId]);

  if (loading) return <div className="p-10">Loading rooms...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Available Rooms</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.roomId} className="bg-white p-4 rounded shadow">
            <img
              src={room.imageUrl || "https://via.placeholder.com/400x250?text=Room"}
              alt="Room"
              className="w-full h-40 object-cover rounded mb-3"
            />

            <h2 className="text-lg font-bold">{room.roomType}</h2>
            <p>₹ {room.pricePerNight} / night</p>
            <p>Guests: {room.maxGuests}</p>
            <p>Available: {room.availableRooms}</p>

            <button
              disabled={room.availableRooms === 0}
              onClick={() => navigate(`/user/book/${room.roomId}`)}
              className={`mt-4 w-full py-2 rounded text-white ${
                room.availableRooms === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {room.availableRooms === 0 ? "Sold Out" : "Book Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
