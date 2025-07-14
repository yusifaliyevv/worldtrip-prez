import { useEffect, useState } from "react";
import { getAllUsers, setAdmin, setPremium, deleteUser, removeAdmin } from "../../services/adminService.js";
import styles from "./UsersTable.module.css";
import Swal from "sweetalert2";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        setError("An error occurred while retrieving users.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleSetAdmin = async (userId) => {
    try {
      await setAdmin(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isAdmin: true } : u))
      );
    } catch {
      console.error("An error occurred while assigning admin.");
    }
  };


  const handleRemoveAdmin = async (userId) => {
    try {
      await removeAdmin(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isAdmin: false } : u))
      );
    } catch {
      console.error("An error occurred while retrieving admin status.");
    }
  };

const handleDeleteUser = async (userId) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!"
  });

  if (result.isConfirmed) {
    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u._id !== userId));
      Swal.fire("Deleted!", "User has been deleted.", "success");
    } catch {
      console.error("An error occurred while deleting the user.");
      Swal.fire("Error!", "Something went wrong while deleting.", "error");
    }
  }
};

  if (loading) return <p className={styles.loading}>Yüklənir...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
<div className={styles.tableWrapper}>
  <h2 className={styles.title}>User List</h2>
  <table className={styles.table}>
    <thead>
      <tr>
        <th>Name</th>
        <th>Username</th>
        <th>Email</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user._id}>
          <td>{user.name}</td>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>{user.isAdmin ? "Admin" : "User"}</td>
          <td>
            {!user.isAdmin && (
              <button
                onClick={() => handleSetAdmin(user._id)}
                className={`${styles.btn} ${styles.admin}`}
              >
                Make Admin
              </button>
            )}
            {user.isAdmin && (
              <button
                onClick={() => handleRemoveAdmin(user._id)}
                className={`${styles.btn} ${styles.premium}`}
              >
                Make User
              </button>
            )}
            <button
              onClick={() => handleDeleteUser(user._id)}
              className={`${styles.btn} ${styles.delete}`}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


  );
};

export default UsersTable;
