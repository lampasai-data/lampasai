import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToHash from "./components/ScrollToHash";
import AuthModal from "./components/AuthModal";
import UpgradeModal from "./components/UpgradeModal";
import GumroadReturnHandler from "./components/GumroadReturnHandler";
import Home from "./pages/Home";

// Home stays eager - it's the landing page, and making a first-time visitor
// wait on a second round-trip for it would trade a real cost for nothing.
// Everything else is split out: the quiz engine, the leaderboard and the
// three admin pages were all shipped to every visitor who only ever read the
// marketing page.
const Formations = lazy(() => import("./pages/Formations"));
const CertificationQuiz = lazy(() => import("./pages/CertificationQuiz"));
const CertificationLeaderboard = lazy(() => import("./pages/CertificationLeaderboard"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const EmailConfirmed = lazy(() => import("./pages/EmailConfirmed"));
const AdminGumroad = lazy(() => import("./pages/AdminGumroad"));
const AdminVouchers = lazy(() => import("./pages/AdminVouchers"));
const AdminStats = lazy(() => import("./pages/AdminStats"));

// Deliberately plain: every split route already renders its own loading state
// once mounted, so this only covers the few hundred milliseconds of fetching
// the chunk itself. Anything more elaborate would flash in and out.
function RouteFallback() {
  return <section className="mx-auto max-w-3xl px-6 py-24 text-muted">Chargement…</section>;
}

function App() {
  return (
    <>
      <Nav />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/formations/:slug" element={<CertificationQuiz />} />
          <Route path="/formations/:slug/classement" element={<CertificationLeaderboard />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/email-confirmed" element={<EmailConfirmed />} />
          <Route path="/admin/gumroad" element={<AdminGumroad />} />
          <Route path="/admin/vouchers" element={<AdminVouchers />} />
          <Route path="/admin/stats" element={<AdminStats />} />
        </Routes>
      </Suspense>
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
