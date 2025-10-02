import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar.jsx"; // Ensure the path and case match the actual file
import Avatar from "@mui/material/Avatar";
import "./Profile.css"; // Import your CSS file
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import Modal from "@mui/material/Modal";
// import Rating from "@mui/material/Rating";
// import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Snackbar from "@mui/material/Snackbar";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
// import { v4 as uuidv4 } from "uuid";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

const Profile = ({ user, setUser, setIsLoggedIn }) => {
  const params = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    const getTrans = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/trans/getTotalStats/${user._id}`
        );
        console.log(res);
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getTrans();
  }, [user]);
  return (
    <div>
      <Navbar user={user} setIsLoggedIn={setIsLoggedIn} />
      <div className="profile-container h-[85vh]">
        <div className="profile-header">
          <div className="profile-info">
            <div className="name text-slate-800" style={{ fontSize: "24px" }}>
              Name: {user?.name}
            </div>
            <div className="name text-slate-900" style={{ fontSize: "24px" }}>
              Username: {user?.username}
            </div>
          </div>
          <label htmlFor="photo-upload" className="photo-icon">
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              // onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
            <Avatar src="/broken-image.jpg" className="avatar" />
          </label>
        </div>

        <div className="separator"></div>
        <div className="profile-details flex justify-between">
          <div className="w-1/2 float-left">
            <div className="about-section bg-gray-100 p-4 rounded font-semibold text-gold mt-2">
              <h2>About</h2>
              <div className="email mt-4">EMAIL: {user?.email}</div>
              <div className="age mt-4">Friends: {user?.friends.length}</div>
              <div className="location mt-4">Groups: {user?.groups.length}</div>
            </div>
          </div>
          <div className="w-1/2 float-left">
            <div className="about-section bg-gray-100 p-4 rounded font-semibold text-gold mt-2">
              <h2>Incomes and Expenses</h2>
              <div className="income mt-4">
                Total Income: ₹ {data?.totalIncome}
              </div>
              <div className="expenses mt-4">
                Total Expenses: ₹ {data?.totalExpense}
              </div>
              <div className="balance mt-4">Net Balance: ₹ {data?.balance}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
