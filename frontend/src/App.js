import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup/Signup.jsx";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Dues from "./pages/Dues/Dues.jsx";
import axios from "axios";
import Savings2 from "./pages/Savings/Savings2.jsx";
import Main from "./pages/Groups/Main.jsx";
import SimplifyDebt from "./pages/Groups/SimplifyDebt.jsx";
import Grouphome from "./pages/Groups/Grouphome.jsx";
import Inbox from "./pages/inbox/inbox.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import { AuthProvider } from "./Context/AuthContext.js";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );
  useEffect(() => {
    const getUser = async ()=> {
      try {
        const res = await axios.get(`http://localhost:3001/profile/getInbox/${user._id}`)
        setUser(res.data);
      } catch (err) {
        console.log(err)
      }
    }
    getUser()
  }, [])

  
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    console.log(user)
  }, [user]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<Login user={user} setUser={setUser} />}
          />
          <Route
            path="/signup"
            element={<Signup user={user} setUser={setUser} />}
          />
          <Route
            path="/"
            element={<Dashboard user={user} setUser={setUser} />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard user={user} setUser={setUser} />}
          />
          <Route path="/dues" element={<Dues user={user} />} />
          <Route path="/savings" element={<Savings2 user={user} />} />
          <Route path="/groups" element={<Main user={user} />} />
          <Route path="/billsplit/:id" element={<Grouphome user={user} />} />
          <Route
            path="/simplifydebt/:id"
            element={<SimplifyDebt user={user} />}
          />
          <Route
            path="/profile"
            element={<Profile user={user} setUser={setUser} />}
          />
          <Route
            path="/inbox"
            element={<Inbox user={user} setUser={setUser} />}
          />
          <Route path="*" element={<p>Error 404 </p>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
