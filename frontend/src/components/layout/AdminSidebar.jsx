import { FaTachometerAlt, FaUser, FaBus, FaPlusCircle, FaBook } from "react-icons/fa";
import styles from "./AdminSidebar.module.css";

const AdminSidebar = ({ onSelectTab, activeTab }) => {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Admin Panel</h2>
      <ul className={styles.menu}>
        <li
          className={activeTab === "dashboard" ? styles.active : ""}
          onClick={() => onSelectTab("dashboard")}
        >
          <FaTachometerAlt className={styles.icon} />
          Dashboard
        </li>
        <li
          className={activeTab === "users" ? styles.active : ""}
          onClick={() => onSelectTab("users")}
        >
          <FaUser className={styles.icon} />
          Users
        </li>
        <li
          className={activeTab === "travels" ? styles.active : ""}
          onClick={() => onSelectTab("travels")}
        >
          <FaBus className={styles.icon} />
          Travels
        </li>
        <li
          className={activeTab === "create" ? styles.active : ""}
          onClick={() => onSelectTab("create")}
        >
          <FaPlusCircle className={styles.icon} />
          New travel
        </li>
        <li
          className={activeTab === "bookings" ? styles.active : ""}
          onClick={() => onSelectTab("bookings")}
        >
          <FaBook className={styles.icon} />
          Bookings
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
