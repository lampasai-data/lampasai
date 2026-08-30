import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToHash from "./components/ScrollToHash";
import AuthModal from "./components/AuthModal";
import UpgradeModal from "./components/UpgradeModal";
import GumroadReturnHandler from "./components/GumroadReturnHandler";
import Home from "./pages/Home";
import Formations from "./pages/Formations";
import CertificationQuiz from "./pages/CertificationQuiz";
import CertificationLeaderboard from "./pages/CertificationLeaderboard";
import ResetPassword from "./pages/ResetPassword";
import EmailConfirmed from "./pages/EmailConfirmed";
import AdminGumroad from "./pages/AdminGumroad";
import AdminVouchers from "./pages/AdminVouchers";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formations" element={<Formations />} />
        <Route path="/formations/:slug" element={<CertificationQuiz />} />
        <Route path="/formations/:slug/classement" element={<CertificationLeaderboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-confirmed" element={<EmailConfirmed />} />
        <Route path="/admin/gumroad" element={<AdminGumroad />} />
        <Route path="/admin/vouchers" element={<AdminVouchers />} />
      </Routes>
      <Footer />
      <ScrollToTop />
      <ScrollToHash />
      <AuthModal />
      <UpgradeModal />
      <GumroadReturnHandler />
    </>
  );
}

export default App;
