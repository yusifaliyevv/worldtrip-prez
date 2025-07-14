import { useSearchParams, Link } from "react-router-dom";
import { useEffect } from "react";
import styles from "./SuccessPage.module.css";
import { confirmPayment } from "../../services/paymentService";
import { MdOutlineVerified } from "react-icons/md";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      confirmPayment(sessionId)
        .then((res) => {
          console.log("Payment confirmed:", res);
        })
        .catch((err) => {
          console.error("Error while confirming payment:", err);
        });
    }
  }, [sessionId]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}><MdOutlineVerified /> Payment completed successfully!</h1>
        <p className={styles.description}>
          Thank you for choosing us! Your reservation has been confirmed.
        </p>
        <Link to="/" className={styles.link}>
          Return to Home page
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
