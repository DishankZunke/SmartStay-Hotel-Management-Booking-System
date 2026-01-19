const Home = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-6 text-green-600">
          Welcome to SmartStay!
        </h2>
        <p className="text-gray-700 mb-6">
          You have successfully logged in.
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;