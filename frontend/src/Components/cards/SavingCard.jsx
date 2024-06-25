import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { Button } from "react-bootstrap";

const SavingCard = ({
  user,
  props,
  savingData,
  setSavingData,
  items,
  thememode,
  toggle,
  updateFlag,
  setUpdateFlag,
}) => {
  const [show, setShow] = useState(false);
  const [flag, setFlag] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    console.log(props);
  }, [props]);

  let percentage =
    Math.round(((props.currAmt * 100) / props.targetAmt) * 100) / 100;

  if (percentage > 100) {
    percentage = 100;
  }

  const [SavingInput, setSavingInput] = useState({
    userId: user._id,
    title: "",
    currAmt: "",
    targetAmt: "",
  });

  const { title, currAmt, targetAmt } = SavingInput;

  const handleSavingInput = (name) => (e) => {
    setSavingInput({ ...SavingInput, [name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const editSavings = async () => {
      try {
        let requestBody = {
          currAmt,
          title,
        };

        if (targetAmt !== "") {
          requestBody.targetAmt = targetAmt;
        }
        const res = await axios.put(
          `http://localhost:3001/savings/editSaving/${props._id}`,
          { requestBody }
        );
        console.log(res.data);
        setSavingInput({
          userId: user._id,
          title: "",
          currAmt: "",
          targetAmt: "",
        });
        setFlag((prev) => !prev);
        setUpdateFlag((prev) => !prev);
      } catch (err) {
        console.log(err.response.data.message);
      }
    };
    editSavings();
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3001/savings/deleteSaving/${props._id}`
      );
      console.log(res.data.saving);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="card mt-8 shadow-lg">
        <div className="card-header bg-gray-300">
          <h5 className="font-semibold text-center text-lg">
            Title - {props.title}
          </h5>
        </div>
        <div className="card-body bg-gray-900 text-white">
          <div className="flex justify-between items-center">
            <div className="w-1/2">
              <p className="text-lg">
                Current Amount: <span className="text-xl">{props.currAmt}</span>
              </p>
              <p className="text-lg">
                Goal Amount: <span className="text-xl">{props.targetAmt}</span>
              </p>
            </div>
            <div className="w-1/2">
              <div className="mb-2">Completion:</div>
              <div className="progress">
                <div
                  className="progress-bar bg-gray-300"
                  role="progressbar"
                  style={{ width: `${percentage > 100 ? 100 : percentage}%` }}
                  aria-valuenow={percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {percentage > 100 ? 100 : percentage}%
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <AiFillEdit
                  onClick={handleShow}
                  className="cursor-pointer text-blue-500 text-lg"
                />
                <AiFillDelete
                  onClick={handleDelete}
                  className="cursor-pointer text-red-500 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal ${show ? "block" : "hidden"}`}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Edit Transaction</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <label htmlFor="title" className="text-black">
                Title:
              </label>
              <input
                type="text"
                name="title"
                defaultValue={props.title}
                onChange={handleSavingInput("title")}
                required
                className="form-control"
              />
              <label htmlFor="currAmt" className="text-black">
                Current Amount:
              </label>
              <input
                type="text"
                name="currAmt"
                value={currAmt}
                onChange={handleSavingInput("currAmt")}
                required
                className="form-control"
              />
              <label htmlFor="targetAmt" className="text-black">
                Goal Amount:
              </label>
              <input
                type="text"
                name="targetAmt"
                value={targetAmt}
                onChange={handleSavingInput("targetAmt")}
                required
                className="form-control"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingCard;
