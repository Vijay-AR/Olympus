import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

function Signup({ setUser }) {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isPassValid, setIsPassValid] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setIsPassValid(checkPassword(newPassword));
  };

  const checkPassword = (password) => {
    // Password validation rules
    const passwordRegex = /^(?=.[A-Z])(?=.\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
  };

  const handleUsernameChange = (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    setIsUsernameValid(newUsername.length >= 5);
  };

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
  };

  const handleConfirmPasswordChange = (event) => {
    const newConfirmPass = event.target.value;
    setConfirmPass(newConfirmPass);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitClicked(true);

    if (
      !isPassValid ||
      !isUsernameValid ||
      password !== confirmPass ||
      !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    ) {
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/auth/register", {
        name,
        username,
        email,
        password,
      });
      console.log(res.data.newUser);
      setUser(res.data.newUser);
      navigate("/dashboard");
      alert("Logged in successfully");
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }

    // Clear form fields after successful submission
    setEmail("");
    setPassword("");
    setUsername("");
    setName("");
    setConfirmPass("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center h-screen bg-slate-400"
    >
      <div className="w-full max-w-sm py-2 px-4 bg-white m-4 rounded-lg shadow-lg">
        <div className="text-3xl font-bold text-center text-slate-600 m-4">
          Sign Up
        </div>
        <div className="space-y-4">
          <div className="flex flex-col">
            <input
              type="text"
              value={username}
              placeholder="Username"
              name="username"
              onChange={handleUsernameChange}
              className={`input-signup border-b-2 border-slate-100 py-2 px-3 focus:outline-none focus:border-slate-700 transition duration-300 ${
                submitClicked && !isUsernameValid ? "border-red-500" : ""
              }`}
              required
            />
            {submitClicked && !isUsernameValid && (
              <span className="text-sm text-red-500">
                Username must be at least 5 characters long
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              value={name}
              placeholder="Name"
              name="name"
              onChange={handleNameChange}
              className="input-signup border-b-2 border-slate-100 py-2 px-3 focus:outline-none focus:border-slate-700 transition duration-300"
              required
            />
          </div>

          <div className="flex flex-col">
            <input
              type="email"
              placeholder="Email"
              name="email"
              className={`input-signup border-b-2 border-slate-100 py-2 px-3 focus:outline-none focus:border-slate-700 transition duration-300 ${
                submitClicked &&
                !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
                  ? "border-red-500"
                  : ""
              }`}
              value={email}
              onChange={handleEmailChange}
              required
            />
            {submitClicked &&
              !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) && (
                <span className="text-sm text-red-500">
                  Enter a valid email address
                </span>
              )}
          </div>

          <div className="flex flex-col relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Password"
              className={`input-signup border-b-2 border-slate-100 py-2 px-3 focus:outline-none focus:border-slate-700 transition duration-300 ${
                submitClicked && (!isPassValid || !checkPassword(password))
                  ? "border-red-500"
                  : ""
              }`}
              onChange={handlePasswordChange}
              name="password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-slate-600 hover:text-slate-700"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
            {submitClicked && (!isPassValid || !checkPassword(password)) && (
              <span className="text-sm text-red-500">
                Password must be at least 8 characters long and contain at least
                one capital letter and one digit
              </span>
            )}
          </div>

          <div className="flex flex-col relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPass}
              name="confirmPassword"
              onChange={handleConfirmPasswordChange}
              className={`input-signup border-b-2 border-slate-100 py-2 px-3 focus:outline-none focus:border-slate-700 transition duration-300 ${
                submitClicked && password !== confirmPass
                  ? "border-red-500"
                  : ""
              }`}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-slate-600 hover:text-slate-700"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
            {submitClicked && password !== confirmPass && (
              <span className="text-sm text-red-500">
                Passwords do not match
              </span>
            )}
          </div>

          <button
            type="submit"
            className="bg-slate-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            Submit
          </button>

          <div className="text-center text-slate-600 text-sm">
            Already have an account?
            <Link
              to="/login"
              className="text-slate-600 hover:underline font-semibold"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Signup;
