import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearSuccess } from "../../redux/slices/authSlice.js";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../components/shared/Spinner.jsx";
import styles from "./Register.module.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(clearSuccess());
        navigate("/login");
      }, 2000);
    }
  }, [success, dispatch, navigate]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name cannot be empty.";
    if (!formData.username.trim())
      newErrors.username = "Username cannot be empty.";
    if (!formData.email.trim()) newErrors.email = "Email cannot be empty.";
    if (!formData.password.trim())
      newErrors.password = "Password cannot be empty.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch(registerUser(formData));
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Register</h2>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className={`${styles.input} ${errors.name ? styles.errorInput : ""}`}
        />
        {errors.name && <p className={styles.error}>{errors.name}</p>}

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className={`${styles.input} ${
            errors.username ? styles.errorInput : ""
          }`}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className={`${styles.input} ${errors.email ? styles.errorInput : ""}`}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className={`${styles.input} ${
            errors.password ? styles.errorInput : ""
          }`}
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          placeholder="image"
          onChange={handleChange}
          className={styles.fileInput}
        />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? <Spinner /> : "Register"}
        </button>

        <div className={styles.forgotPassword}>
          <Link to="/login">Already have an account?</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
