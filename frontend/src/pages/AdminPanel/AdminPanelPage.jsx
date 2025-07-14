import AdminPanel from "../../components/admin/AdminPanel";
import styles from "./admin.module.css";

const AdminPanelPage = () => {
  return (
    <div className={styles.pageWrapper}>
      <AdminPanel />
    </div>
  );
};

export default AdminPanelPage;
