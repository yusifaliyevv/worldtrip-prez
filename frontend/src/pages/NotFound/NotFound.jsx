import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.robotIcon}>🤖💥</div>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>
         We couldn't find the page. :/
      </p>
      <Link to="/" className={styles.homeLink}>
        Return to home page
      </Link>
    </div>
  );
};

export default NotFound;
