import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import "./GroupCard.css";
import { useNavigate } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";

const GroupCard = ({
  key,
  setgroupData,
  groupData,
  allgroupsdata,
  setSelectedGroup,
  selectedGroup,
  thememode,
  toggle,
  user,
}) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showGroupHome, setShowGroupHome] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState([]);
  const [checkedState, setCheckedState] = useState(
    new Array(user.friends.length).fill(false)
  );

  //! Change the state of friends list when the checkbox is checked
  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
    const updatedFriends = user.friends.filter((friend, index) =>
      updatedCheckedState[index]
    );

    setFriends(updatedFriends);
  };

  //! Checked friends are send to join the group
  const handleAddFriendsToGroup = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3001/group/addfriend/${groupData._id}`,
        { friends }
      );
      alert(res.data.message);
      setShowAddFriend(false);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const [copied, setCopied] = useState(false);
  const handleAddFriendClose = () => setShowAddFriend(false);
  const handleAddFriendShow = () => setShowAddFriend(true);
  const handleCopyToClipboard = () => {
    setCopied(true);
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleOpenGroup = () => {
    setShowGroupHome(true);
    setSelectedGroup(groupData);
  };
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3001/group/remove/${groupData._id}`
      );
      console.log(res);
      alert(res.data.message)
      const delgroup = res.data.groupp;
      setgroupData(allgroupsdata.filter((data) => data._id != delgroup._id));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex justify-center items-center card-parent h-full p-1">
      <Card className="mx-4 my-4 p-4 bg-[#bfc0c0] shadow-md rounded-lg card-component flex flex-col justify-start items-start gap-3">
        <Card.Body className="w-full p-1">
          <div className="flex flex-col justify-start items-start gap-1">
            <Card.Header className="font-bold text-lg overflow-hidden text-[#1b263b] border-b-2 border-gray-200 dark:border-gray-700">
              Group Title: {groupData.title}
            </Card.Header>
            <div className="p-2 w-[100%]">
              <Card.Text className="text-md items-center">
                <b>Group Code</b>:
                <div className="flex align-middle justify-between  mt-1">
                  <div className="flex">
                    <input
                      type="text"
                      value={groupData.groupCode}
                      readOnly
                      className={`px-2 py-1 border w-[100%] border-gray-300 rounded-md ${thememode === "dark" ? "bg-[#3a3a3a] text-white" : "bg-white text-black"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <CopyToClipboard text={groupData.groupCode} onCopy={handleCopyToClipboard}>
                      <button className="ml-2 text-xl text-gray-500 hover:text-gray-700 transition duration-150">
                        <MdContentCopy />
                      </button>
                    </CopyToClipboard>
                  </div>
                  <button
                    className="ml-5 px-2 rounded-md transition ease-in-out delay-150 bg-slate-600 hover:bg-slate-700 hover:scale-105 duration-300 text-white font-bold w-full"
                    onClick={handleAddFriendShow}
                  >
                    or Add Friend
                  </button>
                </div>
              </Card.Text>
            </div>
            <div className="w-full p-2 my-2 flex flex-col justify-center items-start gap-3">
              <div className="flex justify-between item-center w-full gap-4">
                <button
                  className="rounded-md h-10 p-1 transition ease-in-out delay-150 bg-slate-600 hover:bg-slate-700 hover:scale-105 duration-300 text-white font-bold w-full"
                  onClick={() => navigate(`/simplifydebt/${groupData._id}`)}
                >
                  Simplify Debt
                </button>
                <button
                  className="rounded-md h-10 p-1 transition ease-in-out delay-150 bg-slate-600 hover:bg-slate-700 hover:scale-105 duration-300 text-white font-bold w-full"
                  onClick={() => navigate(`/billsplit/${groupData._id}`)}
                >
                  Split Bill
                </button>
                <button
                  className="rounded-md h-10 p-1 transition ease-in-out delay-150 bg-red-600 hover:bg-red-700 hover:scale-105 cursor-pointer duration-300 text-white font-bold w-full"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Modal show={showAddFriend} onHide={handleAddFriendClose} animation={false} centered>
        <Modal.Header className="bg-[#e2e8f0]">
          <Modal.Title className="text-xl font-bold text-[#1b263b]">Select friends to be added</Modal.Title>
          <button
            type="button"
            className="absolute top-0 right-0 mt-2 mr-2 text-black bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-full p-2"
            onClick={handleAddFriendClose}
          >
            <span aria-hidden="true" className="text-bold rounded-full">
              x
            </span>
          </button>
        </Modal.Header>
        <Modal.Body className="bg-[#e2e8f0] text-[#1b263b] p-4">
          <ul className="friends-list space-y-2">
            {user[0] ? (
              <div className="text-center text-gray-600">No Friend in your friend list</div>
            ) : (
              user.friends.map((name, index) => (
                <li key={index} className="flex items-center">
                  <div className="toppings-list-item h-8 flex items-center w-full px-4">
                    <input
                      type="checkbox"
                      id={`custom-checkbox-${index}`}
                      name={name}
                      value={name}
                      checked={checkedState[index]}
                      onChange={() => handleOnChange(index)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`custom-checkbox-${index}`} className="ml-2 text-gray-700">
                      {name}
                    </label>
                  </div>
                </li>
              ))
            )}
          </ul>
        </Modal.Body>
        <Modal.Footer className="bg-[#e2e8f0] flex justify-end">
          <button
            className="bg-[#1b263b] px-4 py-2 rounded-md text-white font-semibold hover:bg-[#2e4266] focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleAddFriendsToGroup}
            required
          >
            Add to group
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GroupCard;
