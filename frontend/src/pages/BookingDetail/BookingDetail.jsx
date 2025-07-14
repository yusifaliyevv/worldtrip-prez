import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBookingById,
  deleteBooking,
  updateBooking,
} from "../../services/bookingService.js";
import TravelMap from "../../components/map/TravelMap.jsx";
import { createCheckoutSession } from "../../services/paymentService.js";
import styles from "./BookingDetail.module.css";
import {
  FaUserAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaPlaneDeparture,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState("1");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(id);
        setBooking(data);
        setNumberOfPeople(data.numberOfPeople.toString());
      } catch (error) {
        console.error("Reservation not found:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handlePayment = async () => {
    if (!booking) return;
    try {
      setPayLoading(true);
      const data = await createCheckoutSession(
        booking.bookingCode,
        booking.user._id
      );
      window.location.href = data.url;
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed. Please check again.");
    } finally {
      setPayLoading(false);
    }
  };

  const handleUpdatePeople = async () => {
    const peopleCount = parseInt(numberOfPeople);

    if (isNaN(peopleCount) || peopleCount < 1) {
      toast.info("There must be at least 1 person.");
      return;
    }

    try {
      setUpdateLoading(true);
      const updatedBooking = await updateBooking(booking._id, {
        numberOfPeople: peopleCount,
      });
      toast.success("Reservation updated.");
      setBooking(updatedBooking.booking);
      setShowModal(false);
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!booking) return;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this reservation?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteBooking(booking._id);
        Swal.fire("Deleted!", "Reservation successfully deleted.", "success");
        navigate("/bookings");
      } catch (err) {
        console.error("Deletion error:", err);
        Swal.fire(
          "Error!",
          "The deletion could not be completed. Please try again.",
          "error"
        );
      }
    } else {
      Swal.fire("Canceled", "Resercation not deleted", "info");
    }
  };

  if (loading) return <p className={styles.loading}>Yüklənir...</p>;
  if (!booking || !booking.user || !booking.travel) {
    return <p className={styles.error}>Reservation information not found.</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Booking Details</h2>

      <div className={styles.section}>
        <h3>
          <FaUserAlt /> User Information
        </h3>
        <p>
          <strong>Name:</strong> {booking.user.name || booking.user.username}
        </p>
        <p>
          <strong>Username:</strong>{" "}
          {booking.user.username || booking.user.username}
        </p>
        <p>
          <strong>Email:</strong> {booking.user.email}
        </p>
      </div>

      <div className={styles.section}>
        <h3>
          <FaCalendarAlt /> Booking Date
        </h3>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(booking.createdAt).toLocaleDateString("en-US")}
        </p>
        <p>
          <strong>People:</strong> {booking.numberOfPeople} person(s)
        </p>
        <div className={styles.actions}>
          <button
            onClick={() => {
              setNumberOfPeople(booking.numberOfPeople.toString());
              setShowModal(true);
            }}
            className={styles.editButton}
          >
            Edit
          </button>
          <button onClick={handleDelete} className={styles.deleteButton}>
            Delete
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>
          <FaMoneyBillWave /> Payment Information
        </h3>
        <p>
          <strong>Total Price:</strong> {booking.totalPrice.toFixed(2)} USD
        </p>
        <p>
          <strong>Price per Person:</strong> {booking.travel.price.toFixed(2)} USD
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {booking.isPaid ? (
            <span style={{ color: "green" }}>Paid</span>
          ) : (
            <span style={{ color: "red" }}>Not Paid</span>
          )}
        </p>

        {!booking.isPaid && (
          <button
            onClick={handlePayment}
            className={styles.payButton}
            disabled={payLoading}
          >
            {payLoading ? "Processing..." : "Pay Now"}
          </button>
        )}
      </div>

      <div className={styles.section}>
        <h3>
          <FaPlaneDeparture /> Travel Information
        </h3>
        <p>
          <strong>From:</strong> {booking.travel.from.city},{" "}
          {booking.travel.from.country}
        </p>
        <p>
          <strong>To:</strong> {booking.travel.to.city},{" "}
          {booking.travel.to.country}
        </p>
      </div>

      <div className={styles.section}>
        <TravelMap from={booking.travel.from} to={booking.travel.to} />
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Change Number of People</h3>
            <input
              type="number"
              min="1"
              value={numberOfPeople}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^\d+$/.test(val)) {
                  setNumberOfPeople(val);
                }
              }}
              className={styles.modalInput}
            />
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowModal(false)}
                className={styles.cancelButton}
              >
                Close
              </button>
              <button
                onClick={handleUpdatePeople}
                disabled={updateLoading}
                className={styles.saveButton}
              >
                {updateLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetail;
