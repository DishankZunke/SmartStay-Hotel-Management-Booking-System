import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";

export default function BookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/api/rooms").then(res => {
      const found = res.data.find(r => r.roomId == roomId);
      setRoom(found);
    });
  }, [roomId]);

  useEffect(() => {
    if (!checkIn || !checkOut || !room) return;
    const days =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    if (days > 0) {
      setTotal(days * room.pricePerNight * rooms);
    }
  }, [checkIn, checkOut, rooms, room]);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const bookingRes = await api.post("/api/bookings", {
        hotelId:Number(room.hotelId),
        roomId: Number(room.roomId),
        checkIn,
        checkOut,
        guests:Number(guests)
      });

      const booking = bookingRes.data;

      const orderRes = await api.post(`/api/payments/create-order/${booking.bookingId}`);
      const order = orderRes.data;

      console.log("Order from backend:", order);

      const options = {
        key: "rzp_test_S28Rx6QKpPbOmn",
        amount: order.amount,
        currency: order.currency,
        name: "SmartStay",
        description: "Hotel Booking",
        order_id: order.id,

        handler: async function (response) {
          console.log("Razorpay response:", response);

          try {
            await api.post("/api/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            alert("Payment successful! Booking confirmed.");
            navigate("/user/dashboard");
          } catch (e) {
            alert("Payment verification failed");
            console.error(e);
          }
        },

        theme: { color: "#2563eb" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      alert("Payment failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  


  if (!room) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{room.roomType}</h2>
      <p>₹ {room.pricePerNight} per night</p>
      <p>Available: {room.availableRooms}</p>

      <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="border p-2 w-full mt-2"/>
      <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="border p-2 w-full mt-2"/>
      <input type="number" value={guests} onChange={e => setGuests(e.target.value)} className="border p-2 w-full mt-2"/>
      <input type="number" value={rooms} onChange={e => setRooms(e.target.value)} className="border p-2 w-full mt-2"/>

      <h3 className="mt-4">Total ₹ {total}</h3>

      <button onClick={handlePayment} disabled={loading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 w-full rounded">
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
}


