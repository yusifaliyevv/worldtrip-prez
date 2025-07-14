import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserBookings } from "../../redux/slices/bookingSlice";
import SmallMap from "../../components/map/SmallMap";
import { Link } from "react-router-dom";
import styles from "./Bookings.module.css";
import { FaPlane } from "react-icons/fa";

const Bookings = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading, error } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getUserBookings());
  }, [dispatch]);

  if (isLoading) {
    return <div className={styles.empty}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.empty} style={{ color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>My Bookings</h1>
      {bookings.length === 0 ? (
        <p className={styles.empty}>You don't have any bookings yet.</p>
      ) : (
        <div className={styles.list}>
          {bookings
            .filter((b) => b.travel)
            .map((b, idx) => (
              <div key={idx} className={styles.card}>
                <div className={styles.left}>
                  <h2 className={styles.title}>
                    {b.travel.from.city.charAt(0).toUpperCase() +
                      b.travel.from.city.slice(1)}{" "}
                    ➔{" "}
                    {b.travel.to.city.charAt(0).toUpperCase() +
                      b.travel.to.city.slice(1)}
                  </h2>

                  <div className={styles.infoGroup}>
                    <p className={styles.line}>
                      <strong>Date:</strong>{" "}
                      {new Date(b.createdAt).toLocaleDateString("en-US")}
                    </p>
                    <p className={styles.line}>
                      <strong>People:</strong> {b.numberOfPeople} person(s)
                    </p>
                    <p className={styles.line}>
                      <strong>Total Price:</strong> {b.totalPrice.toFixed(2)}{" "}
                      USD
                    </p>
                    <p className={styles.line}>
                      <strong>Travel Code:</strong> {b.travel.travelCode}
                    </p>
                  </div>

                  <div className={styles.bookingCode}>
                    <FaPlane className={styles.icon} />
                    <span>{b.bookingCode}</span>
                  </div>
                </div>

                <div className={styles.right}>
                  <SmallMap from={b.travel.from} to={b.travel.to} />
                  <Link to={`/booking/${b._id}`} className={styles.linkButton}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
