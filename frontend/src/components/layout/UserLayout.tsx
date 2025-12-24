import { Outlet } from "react-router-dom";
import UserHeader from "../UserHeader";
import Footer from "../Footer";

/**
 * UserLayout - Layout cho Seller và Bidder
 * Giống MainLayout nhưng không có category bar
 */
const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
