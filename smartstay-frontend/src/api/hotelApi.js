import api from "./api";

// get all hotels
export const getAllHotels = async () => {
  const res = await api.get("/api/hotels");
  return res.data;
};

// get hotels by city
export const getHotelsByCity = async (city) => {
  const res = await api.get(`/api/hotels/city/${city}`);
  return res.data;
};
