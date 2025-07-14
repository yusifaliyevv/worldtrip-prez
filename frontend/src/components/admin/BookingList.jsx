import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../../redux/slices/adminSlice.js";
import styles from "./BookingList.module.css";

const BookingList = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  if (isLoading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
<div className={styles.container}>
  <h2 className={styles.title}>All Bookings</h2>
  <div className={styles.tableContainer}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Travel</th>
          <th>Date</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {bookings
          .filter((booking) => booking.travel)
          .map((booking) => (
            <tr key={booking._id}>
              <td>{booking.user?.name || "N/A"}</td>
              <td>{booking.user?.username || "N/A"}</td>
              <td>{booking.travel?.travelCode || "N/A"}</td>
              <td>
                {new Date(booking.travel.startDate).toLocaleDateString()} -{" "}
                {new Date(booking.travel.endDate).toLocaleDateString()}
              </td>
              <td>{booking.totalPrice.toFixed(2)} USD</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default BookingList;
