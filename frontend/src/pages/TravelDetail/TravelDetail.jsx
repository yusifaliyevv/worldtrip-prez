import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTravelById } from "../../services/travelService.js";
import { createBooking } from "../../services/bookingService.js";
import TravelMap from "../../components/map/TravelMap";
import Swal from "sweetalert2";
import styles from "./TravelDetail.module.css";

const TravelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [travel, setTravel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        const data = await getTravelById(id);
        setTravel(data);
      } catch (error) {
        console.log("Trip not found");
      } finally {
        setLoading(false);
      }
    };

    fetchTravel();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!travel) return <p>Trip not found</p>;

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
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>{travel.title}</h2>

        <div className={styles.infoGrid}>
          <p>
            <strong>Price:</strong> {travel.price.toFixed(2)} USD
          </p>
          <p>
            <strong>Seats Available:</strong> {travel.seatsAvailable}
          </p>
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(travel.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {new Date(travel.endDate).toLocaleDateString()}
          </p>
          <p>
            <strong>From City:</strong>{" "}
            {travel.from.city.charAt(0).toUpperCase() +
              travel.from.city.slice(1)}
            , {travel.from.country}
          </p>

          <p>
            <strong>To City:</strong> {travel.to.city}, {travel.to.country}
          </p>
        </div>

        <div className={styles.cityDescription}>
          <h3>About {travel.to.city}</h3>
          <p>
            {travel.description ||
              "No additional information is available about this city."}
          </p>
        </div>

        <div className={styles.mapWrapper}>
          <TravelMap from={travel.from} to={travel.to} />
        </div>

        <button
          className={styles.bookButton}
          onClick={() => handleBooking(travel.travelCode)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default TravelDetail;
