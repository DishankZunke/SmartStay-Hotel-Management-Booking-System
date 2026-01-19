import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone number must be 10 digits");
      return;
    }

    try {
      await authService.register({
        ...form,
        email: form.email.toLowerCase(),
      });
      setSuccess("Registration successful. Please login.");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(typeof err === "string" ? err : "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          SmartStay Signup
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-3 border rounded-lg" />
          <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border rounded-lg" />
          <input name="phone" placeholder="Phone" onChange={handleChange} className="w-full p-3 border rounded-lg" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-3 border rounded-lg" />

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
