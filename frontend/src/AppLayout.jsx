import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
// import AuthInterface from "./pages/Signin";
import Service from "./pages/Service";
import Location from "./pages/Location";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import AboutUs from "./pages/Aboutus";
import FAQPage from "./pages/FAQpage";
import Pricing from "./pages/Pricing";
import PaymentGateway from "./component/PaymentGateway";
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import Signin from "./pages/Signin";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";


const AppLayout = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/service" element={<Service />} />
        <Route path="/location" element={<Location />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/payment" element={<PaymentGateway />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default AppLayout;