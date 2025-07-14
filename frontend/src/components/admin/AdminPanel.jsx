import { useState } from "react";
import AdminSidebar from "../layout/AdminSidebar";
import UsersTable from "./UsersTable";
import TravelList from "./TravelList";
import TravelCreate from "./TravelCreate";
import BookingList from "./BookingList";
import DashboardStats from "./DashboardStats";
import styles from "./AdminPanel.module.css";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className={styles.adminPanel}>
      <AdminSidebar onSelectTab={setActiveTab} />
      <div className={styles.content}>
        <h1 className={styles.title}>Admin Panel</h1>
        <div className={styles.tabContent}>
          {activeTab === "dashboard" && <DashboardStats />}
          {activeTab === "users" && <UsersTable />}
          {activeTab === "travels" && <TravelList />}
          {activeTab === "create" && <TravelCreate />}
          {activeTab === "bookings" && <BookingList />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
