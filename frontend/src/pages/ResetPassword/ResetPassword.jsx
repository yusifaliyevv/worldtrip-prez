import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../redux/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(resetPassword({ token, password }));
    if (resetPassword.fulfilled.match(result)) {
      toast.success("Password successfully updated");
      navigate("/login");
    } else {
      toast.error(result.payload || "An error occurred.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.heading}>Set New Password</h2>
        <input
          type="password"
          placeholder="New password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Loading..." : "Reset password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
