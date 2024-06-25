import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import eye icons

function Login({ user, setUser }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setEmail(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitFunction = async (event) => {
    event.preventDefault();
    if (email.length < 5) {
      alert("Email must be at least 5 characters long.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    const userData = { email, password };
    try {
      const res = await axios.post(
        "http://localhost:3001/auth/login",
        userData
      );
      console.log(res);
      setUser(res.data);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }

    setPassword("");
    setEmail("");
  };

  return (
    <>
      <form
        onSubmit={submitFunction}
        className="flex justify-center items-center h-screen bg-slate-400"
      >
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-2xl">
          <div className="text-3xl font-bold text-center text-slate-600 mb-6">
            Login
          </div>
          <div className="space-y-4">
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Email"
                value={email}
                name="email"
                onChange={handleUsernameChange}
                className="input-login border-b-2 border-slate-100 py-2 px-3 focus:outline-none focus:border-slate-700 transition duration-300"
                required
              />
            </div>

            <div className="flex flex-col relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                className="input-login border-b-2 border-slate-100 py-2 px-3 focus:outline-none focus:border-slate-700 transition duration-300"
                required
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            <button
              type="submit"
              className="bg-slate-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Login
            </button>

            <div className="text-center text-slate-600 text-sm">
              Don't have an account?
              <Link
                to="/signup"
                className="text-slate-600 hover:underline font-semibold"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;
