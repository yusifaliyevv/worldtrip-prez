import { Outlet } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;
