import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import SavingCard from "../../Components/cards/SavingCard.jsx";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar";
import "./Savings.css";

function Savings2({ user, setUser, thememode, toggle }) {
  const [inputTitle, setInputTitle] = useState("");
  const [currentAmount, setCurrentAmount] = useState();
  const [amount, setAmount] = useState();
  const [items, setItems] = useState([]);
  const [Currency, setCurrency] = useState();
  const [editAmount, setEditAmount] = useState("");
  const [editCurrent, setEditCurrent] = useState("");
  const [editItemId, setEditItemId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [savingData, setSavingData] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(false);

  //function to handle savings input
  const handleInputTitle = (event) => {
    setInputTitle(event.target.value);
  };

  const handleCurrentAmount = (event) => {
    setCurrentAmount(event.target.value);
  };

  const handleAmount = (event) => {
    setAmount(event.target.value);
  };

  const handleCurrency = (event) => {
    setCurrency(event.target.value);
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      title: inputTitle,
      currentAmount: currentAmount,
      goalAmount: amount,
    };
    setItems([...items, newItem]);
    setInputTitle("");
    setCurrentAmount();
    setAmount();
  };

  //function to edit details
  const handleEditAmount = (event) => {
    setEditAmount(event.target.value);
  };

  const handleEditCurrent = (event) => {
    setEditCurrent(event.target.value);
  };

  //function to delete data
  const deleteData = () => {
    setEditAmount("");
    setEditCurrent("");
    setEditItemId(null);
  };

  //function to handle submit
  const handleSubmitEdit = () => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === editItemId
          ? {
              ...item,
              currentAmount: parseFloat(editCurrent),
              goalAmount: parseFloat(editAmount),
            }
          : item
      )
    );
    deleteData();
    setIsVisible(false);
  };

  const [currenci, setCurrenci] = useState("inr");
  const currenciData = currenci;
  //function to add saving
  const handleAddSaving = async (e) => {
    const saving = {
      userId: user._id,
      title: inputTitle,
      currAmt: currentAmount,
      targetAmt: amount,
      currency: Currency,
    };
    try {
      e.preventDefault();
      const res = await axios.post("http://localhost:3001/savings/addSaving", {
        saving,
      });
      console.log(res.data.message);
      setInputTitle("");
      setCurrentAmount("");
      setAmount("");
      setItems("");
      setCurrency("");
    } catch (err) {
      alert("Enter valid inputs");
      console.log(err.response.data.message);
    }
  };
  useEffect(() => {
    const getSavings = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/savings/getSaving/${user._id}`
        );
        console.log(res.data.message);
        // console.log(res.data.savingDetail);
        setSavingData(res.data.savingDetail); // Update temp with the response data, not the entire response object
      } catch (err) {
        console.log(err.response.data.message);
      }
    };
    getSavings();
  }, [user._id, updateFlag]);

  useEffect(() => {
    if (savingData) {
      console.log("savingData : ", savingData); // Log the updated value of temp
    }
  }, [savingData]);
  return (
    <div className="min-h-screen w-full bg-gray-900">
      <Navbar />
      <div className="savings-container bg-gray-900">
        <div className="font-extrabold text-5xl mx-4 mt-4">
          <span className="text-blue-500">Savings</span>{" "}
          <span className="text-green-500">Tracker</span>
        </div>

        <div className="m-4 text-gray-600 dark:text-gray-400">
          Have any financial goals? Track them here!
        </div>

        <div className="main-body" style={{ color: "black" }}>
          <div
            className={`main-content p-1  text-black bg-gray-300 rounded-md`}
          >
            <div className="main-left">
              <div className="savings-holder">
                <label htmlFor="">Title</label>
                <br />
                <input
                  type="text"
                  placeholder="Input the title"
                  className="saving-input border-none"
                  value={inputTitle}
                  onChange={handleInputTitle}
                  style={{
                    color: "black",
                    backgroundColor: "white",
                  }}
                />
              </div>

              <div className="savings-holder">
                <label htmlFor="">Current Amount</label> <br />
                <input
                  type="number"
                  placeholder="Input the Current Amount"
                  className="saving-input border-none"
                  value={currentAmount}
                  onChange={handleCurrentAmount}
                  style={{
                    color: "black",
                    backgroundColor: "white",
                  }}
                />
              </div>

              <div className="savings-holder">
                <label htmlFor="">Goal Amount</label> <br />
                <input
                  type="number"
                  placeholder="Input the Goal Amount"
                  className="saving-input border-none"
                  value={amount}
                  onChange={handleAmount}
                  style={{
                    color: "black",
                    backgroundColor: "white",
                  }}
                />
              </div>

              <div className="savings-holder">
                <label htmlFor="">Currency</label> <br />
                <select
                  name="currency"
                  id="currency"
                  value={Currency}
                  onChange={handleCurrency}
                  className="p-2 border-1 rounded-md"
                  style={{
                    color: "black",
                    backgroundColor: "white",
                  }}
                  required
                >
                  <option>Select:</option>
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="AUD">AUD</option>
                  <option value="CAD">CAD</option>
                  <option value="CNY">CNY</option>
                  <option value="HKD">HKD</option>
                  <option value="SGD">SGD</option>
                  <option value="CHF">CHF</option>
                  <option value="SEK">SEK</option>
                  <option value="MXN">MXN</option>
                </select>
              </div>

              <div className="savings-holder" onClick={addItem}>
                <button
                  className="rounded-md py-2 px-4 text-white w-40 bg-blue-500 hover:bg-blue-600 focus:outline-none"
                  onClick={handleAddSaving}
                >
                  Add Saving
                </button>
              </div>
            </div>

            {/* Saving Cards list */}
            <div className="main-right flex flex-col justify-center items-start gap-5 h-[500px]">
              <div className="overflow-y-scroll w-full mt-2 rounded-md">
                {savingData &&
                  savingData?.map((sav) => (
                    <SavingCard
                      user={user}
                      props={sav}
                      setSavingData={setSavingData}
                      savingData={savingData}
                      thememode={thememode}
                      toggle={toggle}
                      updateFlag={updateFlag}
                      setUpdateFlag={setUpdateFlag}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* {isVisible && (
            <div className="model visible">
              <div className="cross">
                <FontAwesomeIcon icon={faMinus} className="minus" />
              </div>
              <div className="input-amount">
                <label htmlFor="">Goal</label>
                <input
                  type="number"
                  placeholder="Input the new Goal"
                  className="input-A"
                  value={editAmount}
                  onChange={handleEditAmount}
                />
              </div>
              <div className="input-amount">
                <label htmlFor="">Current Amount</label>
                <input
                  type="number"
                  placeholder="Input the current Amount"
                  className="input-A"
                  value={editCurrent}
                  onChange={handleEditCurrent}
                />
              </div>
              <div className="model-button">
                <div className="model-br">
                  <button onClick={handleSubmitEdit}>Submit</button>
                </div>
                <div className="model-br">
                  <button onClick={deleteData}>Clear</button>
                </div>
              </div>
            </div>
          )} */}
      </div>
    </div>
  );
}
export default Savings2;
