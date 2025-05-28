import React, { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600">Note App</div>

          <div className="flex space-x-6 text-gray-700 font-medium">
            <button className="hover:text-blue-500">About</button>
            <button className="hover:text-blue-500">Note</button>
            {!token && (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="hover:text-blue-500"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="hover:text-blue-500"
                >
                  Register
                </button>
              </>
            )}
            {token && (
              <button
                onClick={handleLogout}
                className="hover:text-blue-500"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
};

export default Navbar;
