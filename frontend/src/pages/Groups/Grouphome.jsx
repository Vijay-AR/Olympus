import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useParams } from "react-router-dom";

const Grouphome = ({ user, thememode, toggle }) => {
  const { id } = useParams();
  const [groupData, setgroupData] = useState([]);
  const [show, setShow] = useState(false);
  const [showPart, setShowPart] = useState(false);
  const [membersdata, setmembersdata] = useState([]);
  const [approved, setApproved] = useState(false);
  const [input, setInput] = useState({
    amount: "",
    groupData,
    user,
  });
  const [billSplitData, setBillSplitData] = useState([]);

  useEffect(() => {
    getgroup();
  }, []);

  useEffect(() => {
    const getMembers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/group/getmembers/${groupData._id}`
        );
        setmembersdata(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (groupData._id) {
      getMembers();
    }
  }, [groupData]);

  useEffect(() => {
    setInput((prevInput) => ({
      ...prevInput,
      groupData,
    }));
  }, [groupData]);

  const handleShowPart = () => setShowPart(true);
  const handleClosePart = () => setShowPart(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleInput = (name) => (e) => {
    setInput({ ...input, [name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`http://localhost:3001/group/splitbill`, {
        input,
      });
      setBillSplitData(res.data.billSplit);
    } catch (err) {
      console.log(err);
    }
  };

  const getgroup = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/group/getgroup/${id}`);
      setgroupData(res.data);
      setBillSplitData(res.data.billSplit);
    } catch (err) {
      console.log(err);
    }
  };

  const handleApproved = async (memid) => {
    try {
      const res = await axios.put(
        `http://localhost:3001/group/markapproved/${groupData._id}`,
        `http://localhost:3001/group/markapproved/${groupData._id}`,
        { userId: memid }
      );
      setApproved((prev) => !prev);
      setBillSplitData(res.data.billSplit);
      getgroup();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar thememode={thememode} toggle={toggle} />

      <div className="min-h-screen  w-full flex flex-col justify-center items-center bg-slate-800 px-4">
        <div className="font-extrabold text-5xl my-4 underline underline-offset-8 bg-white-100 dark:text-[#f0f0f0]">
          Split Bill
        </div>
        <div className="m-3 pt-3 text-4xl bg-[#f0f0f0] font-bold dark:bg-[#181818] dark:text-white p-4 w-full text-center rounded-lg">
          Group Title: {groupData.title}
        </div>

        <div className="w-full flex flex-col items-center dark:text-white m-3">
          <div className="flex space-x-4 w-full max-w-md">
            <button
              onClick={handleShowPart}
              className="bg-gray-900 text-white rounded-lg w-full p-2"
            >
              Participants
            </button>
            <button
              className="bg-gray-900 text-white rounded-lg w-full p-2"
              onClick={handleShow}
            >
              Split Bill
            </button>
          </div>

          {/* Bill Split Modal */}
          <Modal show={show} onHide={handleClose} animation={false} centered>
            <Modal.Header closeButton>
              <Modal.Title>Split Bill</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label htmlFor="title">Bill Amount: </label>
              <input
                type="number"
                name={"amount"}
                value={input.amount}
                onChange={handleInput("amount")}
                className="w-full p-2 mt-2 border rounded-lg"
                required
              />
            </Modal.Body>
            <Modal.Footer>
              <button
                onClick={handleSubmit}
                className="bg-gray-900 text-white rounded-lg w-full p-2"
              >
                Split Bill
              </button>
            </Modal.Footer>
          </Modal>

          {/* Group Participants Modal */}
          <Modal
            show={showPart}
            onHide={handleClosePart}
            animation={false}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Group Participants</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="flex flex-col">
                {membersdata?.map((data) => (
                  <div key={data._id} className="p-2">
                    {data.username}
                  </div>
                ))}
              </div>
            </Modal.Body>
          </Modal>

          {/* Bill Split Data */}
          <div className="mt-4 w-full max-w-md">
            {billSplitData[billSplitData.length - 1]?.map((mem) => (
              <div
                key={mem.userId}
                className="w-full flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2"
              >
                <div>
                  <b>Name: </b>
                  {mem.name}
                </div>
                <div>
                  <b>Amount: </b>
                  {mem.amount}
                </div>
                {groupData.userId === user._id && (
                  <button
                    onClick={() => handleApproved(mem.userId)}
                    className="bg-[#8656cd] text-white p-2 rounded-lg"
                  >
                    {mem.approved === false ? "Approve" : "Approved"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Grouphome;
