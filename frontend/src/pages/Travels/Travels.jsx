import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTravels } from "../../redux/slices/travelSlice.js";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import styles from "./Travels.module.css";
import Swal from "sweetalert2";
import { createBooking } from "../../services/bookingService.js";

const Travels = () => {
  const dispatch = useDispatch();
  const {
    travels: travelsList,
    isLoading,
    error,
    totalPages,
  } = useSelector((state) => state.travel);
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    fromCity: "",
    toCountry: "",
    toCity: "",
    minPrice: "",
    maxPrice: "",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  useEffect(() => {
    const updateLimit = () => {
      const width = window.innerWidth;
      if (width > 1400) setLimit(12);
      else if (width > 1000) setLimit(8);
      else setLimit(6);
    };
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  const debouncedFetch = useCallback(
    debounce((filters, page) => {
      dispatch(fetchTravels({ page, limit, ...filters }));
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    debouncedFetch(filters, page);
    return debouncedFetch.cancel;
  }, [filters, page, debouncedFetch]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBooking = async (travelCode) => {
    try {
      const result = await Swal.fire({
        title: "Make a reservation",
        text: "How many people would you like to make a reservation for?",
        input: "number",
        inputAttributes: {
          min: 1,
          step: 1,
        },
        inputValue: 1,
        confirmButtonText: "Confirm",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const numberOfPeople = parseInt(result.value);
        if (isNaN(numberOfPeople) || numberOfPeople < 1) {
          Swal.fire("Error", "Please add at least 1 person.", "error");
          return;
        }

        await createBooking({ travelCode, numberOfPeople });

        Swal.fire("Good luck!", "Reservation created successfully.", "success");
        navigate("/bookings");
      }
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Reservation not received.",
        "error"
      );
    }
  };

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Travels</h1>

      <form className={styles.filterForm}>
        <input
          name="fromCity"
          placeholder="From City"
          value={filters.fromCity}
          onChange={handleChange}
        />
        <input
          name="toCity"
          placeholder="To City"
          value={filters.toCity}
          onChange={handleChange}
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
        />
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : travelsList?.length === 0 ? (
        <p className={styles.notFound}>No travels found.</p>
      ) : (
        <div className={styles.cardsWrapper}>
          {travelsList.map((travel) => (
            <div key={travel._id} className={styles.card}>
              <Link to={`/travel/${travel._id}`} className={styles.cardLink}>
                <h2 className={styles.cardTitle}>
                  {travel.from.city}, {travel.from.country} ➔ {travel.to.city},{" "}
                  {travel.to.country}
                </h2>
              </Link>
              <div className={styles.cardInfo}>
                <p className={styles.price}>{travel.price} USD</p>
                <p>Start: {new Date(travel.startDate).toLocaleDateString()}</p>
                <p>End: {new Date(travel.endDate).toLocaleDateString()}</p>
                <p>Seats Available: {travel.seatsAvailable}</p>
              </div>
              <button
                onClick={() => handleBooking(travel.travelCode)}
                className={styles.bookButton}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Travels;
