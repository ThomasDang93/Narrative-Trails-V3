import Footer from "./Footer";
import Navbar from "./Navbar";

import BottomNav from "./BottomNav";

const Layout = ({ children }) => {
  return (
    <div className="content">
      <Navbar />
      {children}
      <BottomNav />
      <Footer />
    </div>
  );
};

export default Layout;
