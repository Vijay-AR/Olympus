import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import "tailwindcss/base.css";
import "tailwindcss/components.css";
import "tailwindcss/utilities.css";
import "./Navbar.css";
import { FaRegEnvelope } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";


function Navbar({flag }) {
  const {logout} = useAuth();
  const [navuser, setNavuser] = useState({});
  const [showNav, setShowNav] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const check = async () => {
      try {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
          const foundUser = JSON.parse(loggedInUser);
          // console.log(foundUser)
          setNavuser(foundUser);
        }
      } catch (err) {
        console.log(err);
      }
    };
    check();
  }, [flag]);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center bg-gray-800 p-0">
      {/* Website Name */}
      <div
        className="text-3xl ml-10 text-white font-extrabold hover:cursor-pointer"
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        Olympus
      </div>

      {/* Navigation Links */}
      <div
        className={`${
          showNav ? "flex" : "hidden"
        } lg:flex lg:items-center lg:gap-8 p-4 text-white`}
      >
        {["dashboard", "dues", "groups", "savings", "inbox"].map((item) => (
          <button
            key={item}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-white font-bold transition duration-300"
            onClick={() => navigate(`/${item}`)}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
        {!(navuser && navuser._id) ? (
          <button
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-white font-bold transition duration-300"
            onClick={handleLogin}
          >
            LogIn
          </button>
        ) : (
          <button
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md text-white font-bold transition duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>

      {/* User Icons */}
      <div className="flex items-center gap-10 mr-6">
        <button
          className="bg-gray-600 hover:bg-gray-500 p-3 rounded-full"
          onClick={() => navigate("/inbox")}
        >
          <FaRegEnvelope className="text-white" />
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-500 py-3.5 px-3 rounded-full"
          onClick={() => navigate("/profile")}
        >
          <FontAwesomeIcon icon={faUser} className="text-white" />
        </button>
        <div className="lg:hidden">
          <button
            className="p-2 rounded-full"
            onClick={() => setShowNav(!showNav)}
          >
            <FontAwesomeIcon
              icon={showNav ? faTimes : faBars}
              className="text-white"
              size="lg"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
