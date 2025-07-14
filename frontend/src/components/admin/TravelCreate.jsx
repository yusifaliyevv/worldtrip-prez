import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createTravel } from "../../services/travelService.js";
import styles from "./TravelCreate.module.css";

const TravelCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fromCity: "",
    toCity: "",
    startDate: "",
    endDate: "",
    price: "",
    seatsAvailable: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error("The end date cannot be before the start date!");
      return;
    }

    const formattedData = {
      ...formData,
      price: Number(formData.price),
      seatsAvailable: Number(formData.seatsAvailable),
    };

    try {
      await createTravel(formattedData);
      toast.success("Trip created successfully!");
    } catch (err) {
      toast.error("An error occurred while creating the trip!");
    }
  };

  return (
<div className={styles.container}>
  <h2 className={styles.title}>Create New Travel</h2>
  <form onSubmit={handleSubmit} className={styles.form}>
    <input
      type="text"
      name="fromCity"
      placeholder="Departure City"
      value={formData.fromCity}
      onChange={handleChange}
      required
    />
    <input
      type="text"
      name="toCity"
      placeholder="Destination City"
      value={formData.toCity}
      onChange={handleChange}
      required
    />
    <input
      type="date"
      name="startDate"
      value={formData.startDate}
      onChange={handleChange}
      required
    />
    <input
      type="date"
      name="endDate"
      value={formData.endDate}
      onChange={handleChange}
      required
    />
    <input
      type="number"
      name="price"
      placeholder="Price"
      value={formData.price}
      onChange={handleChange}
      required
    />
    <input
      type="number"
      name="seatsAvailable"
      placeholder="Available Seats"
      value={formData.seatsAvailable}
      onChange={handleChange}
      required
    />
    <input
      type="text"
      name="description"
      placeholder="Travel Description"
      value={formData.description}
      onChange={handleChange}
    />

    <button type="submit">Create</button>
  </form>
</div>

  );
};

export default TravelCreate;
