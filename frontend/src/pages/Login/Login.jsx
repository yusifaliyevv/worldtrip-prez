import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import styles from "./Login.module.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("You have successfully logged in!", {
          position: "top-center",
          autoClose: 2000,
        });
        navigate("/");
      } else {
        toast.error(resultAction.payload || "An error occurred.");
      }
    } catch (err) {
      toast.error("An error occurred while logging in.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Log In</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Loading..." : "Log In"}
          </button>
          <div className={styles.forgotPassword}>
            <Link to="/forgotpassword">Forgot your password?</Link>
            <Link to="/register">Don't have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
