import api from "./api";

export const getAvailableRooms = async (hotelId) => {
  const res = await api.get(`/api/rooms/available/${hotelId}`);
  return res.data;
};
