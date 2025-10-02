import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import TransactionCard from "../../Components/cards/TransactionCard";
import { FaCalendarAlt } from "react-icons/fa";

const Dashboard = ({ user, thememode, toggle, setUser }) => {
  const [updateFlag, setUpdateFlag] = useState(false);
  const [show, setShow] = useState(false);
  const [transInput, setTransInput] = useState({
    userId: user._id,
    type: "expense",
    amount: "",
    category: "",
    desc: "",
    date: "",
    currency: "",
  });
  const [filterInput, setFilterInput] = useState({
    userId: user._id,
    category: "",
    startDate: "",
    endDate: "",
  });
  const [transactionData, setTransactionData] = useState([]);
  const [filteredData, setFilteredData] = useState(transactionData);
  const [filterState, setFilterState] = useState(false);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [errors, setErrors] = useState({});
  const { type, category, desc, date, currency } = transInput;
  let { amount } = transInput;

  // Functions to handle modal visibility
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Functions to handle input
  const handleTransInput = (name) => (e) => {
    setTransInput({ ...transInput, [name]: e.target.value });
    setErrors({ ...errors, [name]: "" }); // Clear error message when user types
  };

  // Handle Filter Input
  const handleFilterInput = (name) => (e) => {
    setFilterInput({ ...filterInput, [name]: e.target.value });
  };

  //? UseEffect for getting totalStats
  useEffect(() => {
    const getTotalStats = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/trans/getTotalStats/${user._id}`
        );
        setStats(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    getTotalStats();
  }, [updateFlag]);

  const isFilterEmpty =
    filterInput.category === "" &&
    filterInput.startDate === "" &&
    filterInput.endDate === "";

  //?useEffect for getting all transactions
  useEffect(() => {
    const temp = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/trans/getTransactions/${user._id}`
        );
        setTransactionData(res.data.transaction);
        if (isFilterEmpty) {
          setFilteredData(res.data.transaction);
        }
      } catch (err) {
        console.error(err.response.data);
      }
    };
    temp();
  }, [updateFlag]);

  //?function to retrieve user transactions with filter
  const handleFilter = (e) => {
    e.preventDefault();
    setFilterInput({
      category: "",
      startDate: "",
      endDate: "",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isFilterEmpty) {
          const res = await axios.post(
            "http://localhost:3001/trans/getTransactionsByFilter",
            { filterInput }
          );
          console.log("Fetch Data for filtered");
          setFilteredData(res.data.trans);
          setTransactionData(res.data.trans);
        }
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchData();
  }, [updateFlag, filterInput, isFilterEmpty, user._id]);

  //function to send mail
  const mailsend = async () => {
    try {
      const reqmail = user.email;
      console.log(reqmail);
      const res = await axios
        .post("http://localhost:3001/mail/sendmail", { reqmail })
        .then(() => alert("Message Sent Succesfully"))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const currenciData = "inr";

  // Retrieve all user transactions or apply filter

  // Update unique categories
  useEffect(() => {
    if (transactionData) {
      const categoriesSet = new Set(
        transactionData.map((transaction) => transaction.category)
      );
      setUniqueCategories([...categoriesSet]);
    }
  }, [updateFlag, transactionData]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!transInput.amount || amount < 0) {
      newErrors.amount = "Amount cannot be less than 0";
    }
    if (!transInput.category) {
      newErrors.category = "Category is required";
    }
    if (!transInput.date) {
      newErrors.date = "Date is required";
    }
    if (!transInput.currency) {
      newErrors.currency = "Currency is required";
    }

    if (Object.keys(newErrors).length > 1) {
      setErrors(newErrors);
      console.log(Object.keys(newErrors).length);
      return;
    }

    console.log(transInput);
    try {
      const res = await axios.post(
        "http://localhost:3001/trans/addTransaction",
        transInput
      );
      const val = res.data.transaction;
      setTransactionData((prev) => [...prev, val]);
      setUpdateFlag((prevFlag) => !prevFlag);
      handleClose();
    } catch (err) {
      console.log(err.response.data);
    }
    // mailsend();
    setTransInput({
      userId: user._id,
      type: "expense",
      amount: "",
      category: "",
      desc: "",
      date: "",
      currency: "",
    });
  };

  return (
    <div className="bg-gray-900 h-[90vh]">
      <Navbar />
      <div className="font-extrabold text-5xl mx-4 mt-4 underline underline-offset-3 decoration-slate-400 text-white">
        Welcome {user._id ? ", " + user.username + "!" : <div></div>}
      </div>
      <div className="mt-2 mb-2 mx-4 text-gray-600 dark:text-gray-400 text-2xl">
        Let's add some transactions!
      </div>
      <div className="flex flex-col justify-center items-center ">
        <div className="flex w-[90vw] justify-evenly items-center h-20 p-4 d-parent rounded-md my-3 bg-[#BFC0C0]">
          <div className="w-60 rounded-md flex flex-col justify-center bg-slate-600 h-10 text-white items-center chill">
            <div className="flex justify-between p-4 font-bold gap-6">
              <div>Income</div>
              <div>&#8377;{stats.totalIncome}</div>
            </div>
          </div>
          <div className="w-60 rounded-md flex flex-col justify-center bg-slate-600 h-10 text-white items-center chill">
            <div className="flex justify-between p-4 font-bold gap-6">
              <div>Balance</div>
              <div>&#8377;{stats.balance}</div>
            </div>
          </div>
          <div className="w-60 rounded-md flex flex-col justify-center bg-slate-600 h-10 text-white items-center chill">
            <div className="flex justify-between p-4 font-bold gap-6">
              <div className="text-md flex justify-evenly gap-2">
                <span> Expense </span>
              </div>
              <div>&#8377;{stats.totalExpense}</div>
            </div>
          </div>
        </div>
        <div className="flex px-4 py-4 justify-center items-center filter rounded-lg w-[90vw] bg-[#bfc0c0]">
          <div
            className="flex justify-center align-middle py-2 px-2 font-bold text-2xl"
            style={{ color: "#1b263b" }}
          >
            Filters:
          </div>
          {/* Category */}
          <select
            className="mx-2 border-2 h-12 rounded-md p-2 category-all bg-slate-600"
            name="category"
            id="category"
            selected="All"
            onChange={handleFilterInput("category")}
            value={filterInput.category}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {/* Date */}
          <input
            type="date"
            id="startDate"
            className="mx-2 my-2 border-2 h-12 rounded-md p-3 bg-slate-600"
            value={filterInput.startDate}
            onChange={handleFilterInput("startDate")}
            placeholder="Start date"
          ></input>
          <input
            type="date"
            id="endDate"
            className="mx-2 my-2 border-2 h-12 rounded-md p-3 bg-slate-600"
            value={filterInput.endDate}
            onChange={handleFilterInput("endDate")}
            placeholder="End date"
          ></input>
          <button
            onClick={handleFilter}
            className="mx-2 p-2 my-2 bg-[#374957] text-white rounded-md lg:w-80 hover:bg-[#192125]"
          >
            Clear Filter
          </button>
        </div>
        {/* Listing Transaction Cards below filter bar */}
        {!transactionData[0] ? (
          <div className="w-[90vw] mt-3 text-slate-400">
            No Transaction Data Available
          </div>
        ) : (
          <div className="w-[90vw] flex flex-col items-center">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {(filterState === false ? transactionData : filteredData)?.map(
                (trans) => (
                  <TransactionCard
                    user={user}
                    key={trans._id}
                    transactionData={trans}
                    thememode={thememode}
                    toggle={toggle}
                    setTransactionData={setTransactionData}
                    setUpdateFlag={setUpdateFlag}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
      {/* Add transaction modal */}
      <button
        onClick={handleShow}
        className="bg-[#bfc0c0] text-[#1b263b] rounded-full px-2 py-2 w-12 h-12 shadow-md fixed bottom-8 right-8 font-extrabold"
      >
        +
      </button>
      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header className="bg-[#e2e8f0]">
          <Modal.Title className="text-xl font-bold text-[#1b263b]">
            Add Transaction
          </Modal.Title>
          <button
            type="button"
            className="absolute top-0 right-0 mt-2 mr-2 text-black bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-full p-2"
            onClick={handleClose}
          >
            <span aria-hidden="true" className="text-bold rounded-full">
              x
            </span>
          </button>
        </Modal.Header>
        <Modal.Body className="bg-[#e2e8f0] text-[#1b263b] p-4 space-y-1">
          {/* Add transaction input section */}
          <div>
            <label htmlFor="type" className="block font-medium text-[#1b263b]">
              Transaction Type
            </label>
            <select
              name="type"
              id="type"
              value={type}
              onChange={handleTransInput("type")}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="currency"
              className="block font-medium text-[#1b263b]"
            >
              Currency
            </label>
            <select
              name="currency"
              id="currency"
              value={currency}
              onChange={handleTransInput("currency")}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="inr">INR</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block font-medium text-[#1b263b]"
            >
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={amount}
              onChange={handleTransInput("amount")}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              required
            />
            {errors.amount && (
              <div className="text-red-500">{errors.amount}</div>
            )}
          </div>
          <div>
            <label
              htmlFor="category"
              className="block font-medium text-[#1b263b]"
            >
              Category
            </label>
            <input
              name="category"
              type="text"
              value={category}
              onChange={handleTransInput("category")}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.category && (
              <div className="text-red-500">{errors.category}</div>
            )}
          </div>
          <div>
            <label htmlFor="desc" className="block font-medium text-[#1b263b]">
              Description
            </label>
            <input
              type="text"
              name="desc"
              value={desc}
              onChange={handleTransInput("desc")}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="date" className="block font-medium text-[#1b263b]">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={date}
                onChange={handleTransInput("date")}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <FaCalendarAlt
                onClick={() =>
                  document.querySelector('input[name="date"]').showPicker()
                }
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
              />
              {errors.date && <div className="text-red-500">{errors.date}</div>}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-[#e2e8f0] flex justify-end">
          <button
            className="bg-[#1b263b] px-4 py-2 rounded-md text-white font-semibold hover:bg-[#2e4266] focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSubmit}
            required
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
