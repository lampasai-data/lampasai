import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToHash from "./components/ScrollToHash";
import AuthModal from "./components/AuthModal";
import UpgradeModal from "./components/UpgradeModal";
import Home from "./pages/Home";
import Formations from "./pages/Formations";
import CertificationQuiz from "./pages/CertificationQuiz";
import ResetPassword from "./pages/ResetPassword";
import AdminGumroad from "./pages/AdminGumroad";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formations" element={<Formations />} />
        <Route path="/formations/:slug" element={<CertificationQuiz />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/gumroad" element={<AdminGumroad />} />
      </Routes>
      <Footer />
      <ScrollToTop />
      <ScrollToHash />
      <AuthModal />
      <UpgradeModal />
    </>
  );
}

export default App;
