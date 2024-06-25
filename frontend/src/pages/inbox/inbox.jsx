import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import axios from "axios";

export default function Inbox({ user, setUser, thememode, toggle }) {
  const [inboxuser, setInBoxUser] = useState({});
  useEffect(() => {
    const getInbox = async ()=> {
      try {
        const res = await axios.get(`http://localhost:3001/profile/getInbox/${user._id}`)
        // console.log(res.data);
        setInBoxUser(res.data);
      } catch (err) {
        console.log(err)
      }
    }
    getInbox()
  }, [])

  //function to accept friend request
  const handleAccept = async (key) => {
    try {
      // console.log(key);
      const res = await axios.put(
        `http://localhost:3001/friend/acceptRequest/${user._id}`,
        { friendName: key }
      );
      alert(res.data.message);
      setUser(res.data.myAcc);
      localStorage.setItem('user', JSON.stringify(res.data.myAcc))
      setInBoxUser(res.data.myAcc)
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  //fetching data from local storage
  useEffect(() => {
    setInBoxUser(user);
    // console.log(user)
  }, [user]);
  return (
    <div className="bg-gray-900 h-[100vh]">
      <Navbar thememode={thememode} toggle={toggle} />
      <div className="font-extrabold text-5xl mx-4 mt-4 underline underline-offset-8 decoration-[#f0f0f0] dark:text-[#f0f0f0]">
        Inbox
      </div>

      <div>
        {!user._id ? (<div className="m-4 w-[95vw] rounded-md flex flex-col justify-center bg-slate-600 h-10 text-white chill p-2">
          Your Inbox is empty
        </div>) : inboxuser.inbox?.toReversed().map((msg, index) => {
          const tokens = msg.split(" ");
          const key = tokens[0];

          return (
            <div key={key}>
              {msg.includes("sent") ? (
                <div className="m-4 w-[95vw] rounded-md flex justify-between bg-slate-600 h-10 text-white chill ">
                  <div className="m-2">{msg}</div>
                  <button
                    className="px-2 m-2 rounded-md text-white"
                    style={{
                      backgroundColor: inboxuser.friends.includes(key)
                        ? "green"
                        : "#8656cd",
                    }}
                    onClick={() => handleAccept(key)}
                  >
                    {inboxuser.friends.includes(key) ? "Accepted" : "Accept"}
                  </button>
                </div>
              ) : (
                <div className="m-4 w-[95vw] rounded-md flex flex-col justify-center bg-slate-600 h-10 text-white chill p-2">
                  {msg}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
