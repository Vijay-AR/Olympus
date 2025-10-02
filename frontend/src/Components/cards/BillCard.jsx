import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { AiFillEdit, AiFillDelete, AiTwotoneCalendar } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { Button } from "react-bootstrap";

const BillCard = ({ billflag, setbillflag, user, BillData, thememode }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [BillInput, setBillInput] = useState({
    userId: user._id,
    title: "",
    dueDate: "",
    amount: "",
    toWhom: "",
    recurring: "",
  });

  const { title, amount, toWhom, dueDate } = BillInput;
  const [formErrors, setFormErrors] = useState({
    title: "",
    amount: "",
    toWhom: "",
    dueDate: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to handle the bill's input
  const handleBillInput = (name) => (e) => {
    const value = e.target.value;
    setBillInput({ ...BillInput, [name]: value });

    // Clear previous error message when user starts typing again
    setFormErrors({ ...formErrors, [name]: "" });
  };

  // Handling the closing and opening of edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setBillInput({
      userId: user._id,
      title: "",
      dueDate: "",
      amount: "",
      toWhom: "",
      recurring: "",
    });
    setFormErrors({
      title: "",
      amount: "",
      toWhom: "",
      dueDate: "",
    });
  };

  const handleShowEditModal = () => {
    setBillInput({
      userId: user._id,
      title: BillData.title,
      dueDate: BillData.dueDate,
      amount: BillData.amount,
      toWhom: BillData.toWhom,
      recurring: BillData.recurring,
    });
    setShowEditModal(true);
  };

  // Function to handle submitting the edit data
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const editBill = async () => {
      try {
        const res = await axios.put(
          `http://localhost:3001/bill/editBill/${BillData._id}`,
          { BillInput }
        );
        console.log(res.data.message);
        setbillflag((prev) => !prev);
        handleCloseEditModal();
      } catch (err) {
        console.log(err);
      }
    };

    // Validate form fields
    let valid = true;
    const errors = {
      title: "",
      amount: "",
      toWhom: "",
      dueDate: "",
    };

    if (!BillInput.title) {
      errors.title = "Title is required";
      valid = false;
    }

    if (!BillInput.amount || BillInput.amount <= 0) {
      errors.amount = "Amount must be greater than 0";
      valid = false;
    }

    if (!BillInput.toWhom) {
      errors.toWhom = "To whom is required";
      valid = false;
    }

    if (!BillInput.dueDate) {
      errors.dueDate = "Due date is required";
      valid = false;
    }

    if (!valid) {
      setFormErrors(errors);
      return;
    }

    editBill();
  };

  // Handling the delete function with confirmation modal
  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3001/bill/deleteBill/${id}`
      );
      console.log(res.data.message);
      setbillflag((prev) => !prev);
      handleCloseDeleteModal();
    } catch (err) {
      console.log(err);
    }
  };

  // Function to track past due payments
  const paymentTime = () => {
    let duedate = new Date(BillData.dueDate);
    let currDate = new Date();
    return currDate > duedate;
  };

  return (
    <div>
      <Card
        variant="light"
        className="mx-4 my-4 p-3"
        style={{
          backgroundColor: "#F4F4F4",
          color: "#333333",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <Card.Body>
          <Card.Title style={{ color: paymentTime() ? "#FF4500" : "#32CD32" }}>
            {BillData.title}
          </Card.Title>
          <Card.Text>To: {BillData.toWhom}</Card.Text>
          <Card.Text>Amount: &#8377; {BillData.amount}</Card.Text>
          <Card.Text>
            Date: {BillData.dueDate?.substring(0, 10)}{" "}
            <AiTwotoneCalendar size={20} />
          </Card.Text>
          <div className="d-flex justify-content-end">
            <AiFillEdit
              onClick={handleShowEditModal}
              style={{
                cursor: "pointer",
                color: "#007BFF",
                marginRight: "1rem",
              }}
            />
            <AiFillDelete
              onClick={handleShowDeleteModal}
              style={{ cursor: "pointer", color: "#DC3545" }}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        animation={false}
        centered
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#007BFF", color: "#FFFFFF" }}
        >
          <Modal.Title>Edit Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-3">
              <label htmlFor="amount" style={{ color: "#333333" }}>
                Amount:
              </label>
              <input
                type="number"
                value={amount}
                name="amount"
                onChange={handleBillInput("amount")}
                required
                className={`form-control ${formErrors.amount && "is-invalid"}`}
              />
              {formErrors.amount && (
                <div className="invalid-feedback">{formErrors.amount}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="person" style={{ color: "#333333" }}>
                To Whom:
              </label>
              <input
                type="text"
                name="person"
                value={toWhom}
                onChange={handleBillInput("toWhom")}
                required
                className={`form-control ${formErrors.toWhom && "is-invalid"}`}
              />
              {formErrors.toWhom && (
                <div className="invalid-feedback">{formErrors.toWhom}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="title" style={{ color: "#333333" }}>
                Title:
              </label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={handleBillInput("title")}
                required
                className={`form-control ${formErrors.title && "is-invalid"}`}
              />
              {formErrors.title && (
                <div className="invalid-feedback">{formErrors.title}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="date" style={{ color: "#333333" }}>
                Date:
              </label>
              <input
                type="date"
                name="dueDate"
                value={dueDate}
                onChange={handleBillInput("dueDate")}
                required
                className={`form-control ${formErrors.dueDate && "is-invalid"}`}
              />
              {formErrors.dueDate && (
                <div className="invalid-feedback">{formErrors.dueDate}</div>
              )}
            </div>

            <div className="modal-footer">
              <Button variant="secondary" onClick={handleCloseEditModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this bill?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(BillData._id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BillCard;
