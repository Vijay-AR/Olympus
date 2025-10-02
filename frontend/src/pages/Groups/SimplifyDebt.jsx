import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

export default function SimplifyDebt({ user, thememode, toggle }) {
  console.log(user);
  const { id } = useParams();
  const [inputFields, setInputFields] = useState([]);
  const [groupData, setgroupData] = useState([]);
  const [data, setData] = useState([]);
  const [commentflag, setcommentflag] = useState(false);
  const [showPart, setShowPart] = useState(false);
  const handleShowPart = () => setShowPart(true);
  const handleClosePart = () => setShowPart(false);

  console.log(inputFields);
  console.log(data);
  const [membersdata, setmembersdata] = useState([]);

  const getgroup = async () => {
    try {
      //function to fetch group data
      const res = await axios.get(`http://localhost:3001/group/getgroup/${id}`);
      console.log(res.data);
      setgroupData(res.data);
      console.log("use effect", groupData);
    } catch (err) {
      console.log(err);
    }
  };
  //function to handle input
  const handleInputChange = (index, fieldName, value) => {
    const updatedInputFields = [...inputFields];
    updatedInputFields[index][fieldName] = value;
    setInputFields(updatedInputFields);
  };

  const handleAddField = () => {
    setInputFields([...inputFields, { paidBy: "", paidFor: "", amount: "" }]);
  };

  const handleRemoveField = (index) => {
    const updatedInputFields = [...inputFields];
    updatedInputFields.splice(index, 1);
    setInputFields(updatedInputFields);
  };

  //function for adding field
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputFields);
    const resultMap = inputFields.reduce((result, item) => {
      const key = item.paidBy;

      if (result[key]) {
        if (result[key].paidFor[item.paidFor]) {
          result[key].paidFor[item.paidFor] += parseInt(item.amount, 10);
        } else {
          result[key].paidFor[item.paidFor] = parseInt(item.amount, 10);
        }
      } else {
        result[key] = {
          paidBy: item.paidBy,
          paidFor: { [item.paidFor]: parseInt(item.amount, 10) },
        };
      }

      return result;
    }, {});

    const outputArray = Object.values(resultMap);

    //function to simplify debts
    const simplify = async () => {
      try {
        const res = await axios.post(
          `http://localhost:3001/group/simplifyDebt/${id}`,
          { outputArray }
        );
        console.log(res.data);
        const val = res.data;
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    simplify();
  };
  useEffect(() => {
    //function to fetch all debts
    const getdebts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/group/getDebts/${id}`
        );
        console.log(res.data);
        if (res.data) setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getdebts();
  }, []);

  const [commentText, setCommentText] = useState("");

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  //function to add comment
  const handleAddComment = async () => {
    try {
      const res = await axios.post(`http://localhost:3001/group/addcomment`, {
        userId: user._id,
        text: commentText,
        groupId: id,
        username: user.username,
      });
      setCommentText("");
      setcommentflag((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };
  const [comments, setComments] = useState([]);

  //function to retrieve comments
  const getcomments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/group/getcomments/${id}`
      );
      setComments(response.data.commentss);
      console.log(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  useEffect(() => {
    getcomments();
  }, [commentflag, comments.length]);

  //function to retrieve members in a group
  useEffect(() => {
    const getMembers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/group/getmembers/${id}`
        );
        setmembersdata(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMembers();
  }, []);

  //members list
  const Dropdown = ({ options, value, onChange }) => (
    <select
      value={value}
      onChange={onChange}
      className="w-80 m-4 p-2 border border-gray-300 rounded-md"
      disabled={options.length <= 1}
    >
      <option value="" disabled>
        Select members
      </option>
      {options.map((option, index) => (
        <option key={index} value={option.username}>
          {option.username}
        </option>
      ))}
    </select>
  );

  useEffect(() => {
    getgroup();
  }, []);

  return (
    <div className="h-auto text-white bg-slate-900">
      <Navbar thememode={thememode} toggle={toggle} />
      <div className="font-extrabold text-5xl mx-4 mt-4 underline underline-offset-8 decoration-slate-400 text-[#f0f0f0]">
        Simplify Debts
      </div>
      <div className="mt-2 mb-2 mx-4 text-gray-600 dark:text-gray-400 text-2xl">
        Streamline your Splits!
      </div>
      <div className="flex justify-between">
        <div className="m-3 pt-3 text-3xl text-white p-2 underline underline-offset-4 decoration-slate-400">
          Group Title: {groupData.title}
        </div>
        <button
          onClick={handleShowPart}
          className="rounded-md transition ease-in-out delay-150 bg-slate-600 hover:bg-slate-700 hover:scale-105 duration-300 text-white font-bold w-1/6 p-1 h-10 my-4 mx-4"
        >
          View Friends
        </button>
      </div>

      <Modal
        show={showPart}
        onHide={handleClosePart}
        animation={false}
        centered
      >
        <Modal.Header className="bg-[#e2e8f0]">
          <Modal.Title className="text-xl font-bold text-[#1b263b]">
            Friends
          </Modal.Title>
          <button
            type="button"
            className="absolute top-0 right-0 mt-2 mr-2 text-black bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-full p-2"
            onClick={handleClosePart}
          >
            <span aria-hidden="true" className="text-bold rounded-full">
              x
            </span>
          </button>
        </Modal.Header>
        <Modal.Body className="bg-[#e2e8f0] text-[#1b263b] p-4">
          <div className="flex flex-col space-y-2">
            {membersdata?.map((data, index) => (
              <div key={index} className="text-md font-medium text-gray-700">
                {data.username}
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      <div className="flex justify-between">
        {/* comments section */}
        <div className="bg-slate-900 w-1/2 ml-2 overflow-x-auto">
          <h3 className="underline text-2xl underline-offset-8 ml-4 text-slate-200">
            Messages:
          </h3>
          <div className="m-4 max-h-80 overflow-y-auto bg-slate-800 p-4 rounded-lg shadow-md">
            {!comments[0] ? (
              <p className="text-slate-400">No Message</p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className={`flex p-4 my-2 rounded-md shadow-sm ${
                    comment.username === user.username
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`p-4 rounded-lg ${
                      comment.username === user.username
                        ? "bg-blue-500 text-white self-end"
                        : "bg-gray-700 text-white self-start"
                    }`}
                  >
                    <p className="text-sm text-gray-300 mb-1">
                      ~{" "}
                      {comment.username === user.username
                        ? "Me"
                        : comment.username}
                    </p>
                    <p className="break-words">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="ml-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddComment();
              }}
            >
              <div className="flex items-center">
                <input
                  type="text"
                  id="commentText"
                  value={commentText}
                  onChange={handleCommentChange}
                  placeholder="Type your message here"
                  className="w-full m-2 p-2 border text-slate-900 border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="rounded-md transition ease-in-out delay-150 bg-slate-600 hover:bg-slate-700 hover:scale-105 duration-300 text-white font-bold px-6 py-2 m-2"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
          {/* simplified output div */}
          <div className="bg-slate-900">
            {!data[0] ? (
              <></>
            ) : (
              <>
                {" "}
                <h3 className="underline text-2xl my-4 underline-offset-8 ml-4">
                  Simplified :
                </h3>
                {data?.map((debt) => (
                  <>
                    <div
                      className="flex items-center bg-gray-300 rounded-2xl justify-between p-2 mx-auto my-2"
                      key={debt[0]}
                    >
                      <div className="text-2xl text-slate-700 flex align-middle p-3">
                        {debt[0]} will give {debt[1]} &#x20B9;{debt[2]}
                      </div>
                      {user.username == debt[1] && (
                        <button
                          onClick={async () => {
                            try {
                              const res = await axios.post(
                                `http://localhost:3001/group/approveDebt/${id}`,
                                debt
                              );
                              setData(res.data.simplifyDebt);
                              console.log(res.data);
                            } catch (err) {
                              console.log(err);
                            }
                          }}
                          className="rounded-md transition ease-in-out delay-150 bg-slate-600 hover:bg-slate-700 hover:scale-105 duration-300 text-white font-bold p-2 m-2"
                        >
                          {debt[3] === true ? "Approved" : "Approve"}
                        </button>
                      )}
                      {user.username == debt[0] && debt[3] == true && (
                        <div>Approved by {debt[1]}✅</div>
                      )}
                    </div>
                  </>
                ))}{" "}
              </>
            )}
          </div>
        </div>

        {/* simplify div */}
        <div>
          <h3 className="underline text-2xl underline-offset-8 ml-4">Debts:</h3>
          {/* input fields paid to paid by amount div */}
          <div className="bg-gray-200 p-4 mt-4 rounded-md mr-3">
            <form className="flex flex-col gap-4">
              {!inputFields[0] ? (
                <div className="text-slate-600 text-xl">No dues</div>
              ) : (
                inputFields.map((field, index) => (
                  <div
                    className="p-4 rounded-lg bg-slate-400 shadow-md"
                    key={index}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="text-gray-40 flex mx-auto w-1/2 my-2">
                        <label
                          htmlFor={`paidBy-${index}`}
                          className="mr-2 text-slate-600"
                        >
                          By
                        </label>
                        <Dropdown
                          options={membersdata}
                          value={field.paidBy}
                          onChange={(e) =>
                            handleInputChange(index, "paidBy", e.target.value)
                          }
                          className="w-full p-2 rounded-md bg-slate-700 text-gray-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        />
                      </div>
                      <div className="text-gray-400 flex mx-auto w-1/2 my-2">
                        <label
                          htmlFor={`paidFor-${index}`}
                          className="mr-2 text-slate-600"
                        >
                          To
                        </label>
                        <Dropdown
                          options={membersdata}
                          value={field.paidFor}
                          onChange={(e) =>
                            handleInputChange(index, "paidFor", e.target.value)
                          }
                          className="w-full p-2 rounded-md bg-slate-700 text-gray-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        />
                      </div>
                      <div className="text-gray-400 flex mx-auto w-full justify-center align-middle my-2">
                        <input
                          type="number"
                          value={field.amount}
                          onChange={(e) =>
                            handleInputChange(index, "amount", e.target.value)
                          }
                          placeholder="Amount"
                          className="w-auto p-2 rounded-md bg-slate-700 text-gray-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        />
                        <button
                          type="button"
                          className="rounded-md h-[8vh] transition ease-in-out delay-150 bg-slate-600 hover:bg-slate-700 hover:scale-105 duration-300 text-white p-2 ml-2"
                          onClick={() => handleRemoveField(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </form>
          </div>

          {/* add remove buttons */}
          <div className="flex w-full justify-center bg-slate-900">
            <button
              type="button"
              onClick={handleAddField}
              className="rounded-md transition ease-in-out delay-150 bg-slate-600 hover:bg-slate-700 hover:scale-105 duration-300 text-white  p-2 w-60 m-4"
            >
              Add Due
            </button>
            <button
              type="submit"
              className="rounded-md transition ease-in-out delay-150 bg-slate-600 hover:bg-slate-700 hover:scale-105 duration-300 text-white w-60 p-2 m-4"
              onClick={handleSubmit}
            >
              Simplify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
