import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [burgerOpen, setBurgerOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out");
    navigate("/login");
    setOpenDropdown(false);
    setBurgerOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        World<span className={styles.highlight}>Trip</span>
      </Link>

      <div className={styles.burger} onClick={() => setBurgerOpen(!burgerOpen)}>
        {burgerOpen ? <FiX /> : <FiMenu />}
      </div>

      <div
        className={`${styles.navLinks} ${burgerOpen ? styles.activeMenu : ""}`}
      >
        <Link to="/" onClick={() => setBurgerOpen(false)}>
          Home
        </Link>
        <Link to="/travels" onClick={() => setBurgerOpen(false)}>
          Travels
        </Link>
        <Link to="/ai" onClick={() => setBurgerOpen(false)}>
          AI assistant
        </Link>
        {user && (
          <Link to="/bookings" onClick={() => setBurgerOpen(false)}>
            Bookings
          </Link>
        )}
        {user?.isAdmin && (
          <Link to="/admin" onClick={() => setBurgerOpen(false)}>
            Admin
          </Link>
        )}

        {!user ? (
          <>
            <Link to="/login" onClick={() => setBurgerOpen(false)}>
              Login
            </Link>
            <Link
              to="/register"
              className={styles.registerBtn}
              onClick={() => setBurgerOpen(false)}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {/* profil sekli */}
            <div className={styles.profileWrapper}>
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className={`${styles.profileBtn} ${styles.desktopOnly}`}
              >
                {user.image ? (
                  <img
                    src={`http://localhost:5000/${user.image}`}
                    alt="Profile"
                    className={styles.profileImg}
                  />
                ) : (
                  <FiUser className={styles.profileIcon} />
                )}
              </button>
              {openDropdown && (
                <div className={styles.dropdown}>
                  <Link
                    to="/updateprofile"
                    onClick={() => setOpenDropdown(false)}
                  >
                    Settings
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>

            <div className={styles.mobileOnly}>
              <button>
                {" "}
                <Link to="/updateprofile" onClick={() => setBurgerOpen(false)}>
                  Settings
                </Link>
              </button>
              <button onClick={handleLogout}>
                <Link>Logout</Link>
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
