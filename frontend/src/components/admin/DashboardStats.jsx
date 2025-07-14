import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getDashboardStats } from "../../services/adminService.js";
import styles from "./DashboardStats.module.css";

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (!stats) return <p className={styles.error}>No statistical information found.</p>;

  const pieData = [
    { name: "All users", value: stats.users },
    { name: "Premium users", value: stats.premiumUsers },
    { name: "Admins", value: stats.admins },
  ];

  const COLORS = ["#0ea5e9", "#10b981", "#f97316"];

  const barData = [
    { name: "Trips", count: stats.travels },
    { name: "Bookings", count: stats.bookings },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <h3>{stats.users}</h3>
          <p>All Users</p>
        </div>
        <div className={styles.card}>
          <h3>{stats.travels}</h3>
          <p>All Travels</p>
        </div>
        <div className={styles.card}>
          <h3>{stats.bookings}</h3>
          <p>All Bookings</p>
        </div>
        <div className={styles.card}>
          <h3>{stats.revenue.toFixed(2)} USD</h3>
          <p>Total income</p>
        </div>
      </div>

      <div className={styles.charts}>
        <div className={styles.chartBox}>
          <h4>Users</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartBox}>
          <h4>Travel and Booking statistics</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
