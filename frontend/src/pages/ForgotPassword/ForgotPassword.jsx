import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendResetEmail } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import styles from "./ForgotPassword.module.css";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(sendResetEmail({ email }));
      if (sendResetEmail.fulfilled.match(result)) {
        toast.success("Password reset link sent");
      } else {
        toast.error(result.payload || "An error occurred.");
      }
    } catch {
      toast.error("An error occurred.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.topRow}>
          <h2 className={styles.heading}>Forgot Password?</h2>
          <input
            type="email"
            placeholder="Email address"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <div className={styles.forgotPassword}>
          <Link to="/login">Remembered?</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
