import { useEffect, useState } from "react";
import {
  getAllTravelsAdmin,
  updateTravel,
  deleteTravel,
} from "../../services/adminService.js";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import styles from "./TravelList.module.css";

const TravelList = () => {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    fromCity: "",
    toCity: "",
    minPrice: "",
    maxPrice: "",
    startDate: "",
    endDate: "",
  });

  const fetchAllTravels = async (query = {}) => {
    try {
      setLoading(true);
      const data = await getAllTravelsAdmin(query);
      setTravels(data.travels);
      setError(null);
    } catch {
      setError("An error occurred while purchasing trips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTravels();
  }, []);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAllTravels(filters);
  };

  const handleEdit = async (travel) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit trip",
      html: `
      <input id="fromCity" class="swal2-input" placeholder="Departure city" value="${
        travel.from.city
      }" />
      <input id="toCity" class="swal2-input" placeholder="Destination city" value="${
        travel.to.city
      }" />
      <input id="startDate" type="date" class="swal2-input" value="${new Date(
        travel.startDate
      )
        .toISOString()
        .slice(0, 10)}" />
      <input id="endDate" type="date" class="swal2-input" value="${new Date(
        travel.endDate
      )
        .toISOString()
        .slice(0, 10)}" />
      <input id="price" type="number" class="swal2-input" placeholder="Price" value="${
        travel.price
      }" />
      <input id="seatsAvailable" type="number" class="swal2-input" placeholder="Available seats" value="${
        travel.seatsAvailable
      }" />    `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          fromCity: document.getElementById("fromCity").value,
          toCity: document.getElementById("toCity").value,
          startDate: document.getElementById("startDate").value,
          endDate: document.getElementById("endDate").value,
          price: document.getElementById("price").value,
          seatsAvailable: document.getElementById("seatsAvailable").value,
        };
      },
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      customClass: {
        popup: styles.swal2Popup,
        title: styles.swal2Title,
        input: styles.swal2Input,
        confirmButton: styles.swal2Confirm,
        cancelButton: styles.swal2Cancel,
        closeButton: styles.swal2Close,
      },
    });

    if (formValues) {
      try {
        const response = await updateTravel(travel._id, formValues);
        const updatedTravel = response.travel;

        toast.success("Trip successfully edited!");

        setTravels((prev) =>
          prev.map((t) => (t._id === updatedTravel._id ? updatedTravel : t))
        );
      } catch (error) {
        toast.error("An error occurred while editing!");
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete?",
      text: "This operation cannot be reversed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#415A77",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: styles.swal2Popup,
        title: styles.swal2Title,
        confirmButton: styles.swal2Confirm,
        cancelButton: styles.swal2Cancel,
        closeButton: styles.swal2Close,
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteTravel(id);
        toast.success("Trip deleted");
        setTravels((prev) => prev.filter((t) => t._id !== id));
      } catch {
        toast.error("An error occurred while deleting.");
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Travel List</h2>

      {/* filter form */}
      <form onSubmit={handleSubmit} className={styles.filterForm}>
        <input
          type="text"
          name="fromCity"
          placeholder="Departure City"
          value={filters.fromCity}
          onChange={handleChange}
        />
        <input
          type="text"
          name="toCity"
          placeholder="Destination City"
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
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
        />
        <button type="submit">Filter</button>
      </form>

      {/* results */}
      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Date</th>
                <th>Seats</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {travels.map((travel) => (
                <tr key={travel._id}>
                  <td>{travel.travelCode}</td>
                  <td>{travel.price} AZN</td>
                  <td>{new Date(travel.startDate).toLocaleDateString()}</td>
                  <td>{travel.seatsAvailable}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(travel)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(travel._id)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TravelList;
