import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../redux/slices/authSlice";
import styles from "./Settings.module.css";

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    image: null,
  });

  const [preview, setPreview] = useState(
    user?.image ? `/uploads/${user.image}` : null
  );

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
      }));
      setPreview(user.image ? `/uploads/${user.image}` : null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }
    try {
      await dispatch(updateProfile(data)).unwrap();
      alert("Profile updated successfully!");
    } catch (err) {
      alert("An error occurred: " + err);
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <h2>Settings</h2>
      <form onSubmit={handleSubmit} className={styles.settingsForm}>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password (optional)</label>
          <input type="password" name="password" onChange={handleChange} />
        </div>
        <div>
          <label>Profile Image</label>
          <input type="file" name="image" onChange={handleChange} />
          {preview && (
            <img
              src={`http://localhost:5000/${user.image}`}
              alt="Preview"
              className={styles.imagePreview}
            />
          )}
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Settings;
