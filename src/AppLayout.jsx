import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthInterface from "./pages/Signin";
import Service from "./pages/Service";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

const AppLayout = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<AuthInterface />} />
        <Route path="/service" element={<Service />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default AppLayout;
