import { Suspense, lazy, useEffect, useState, type ReactNode } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToHash from "./components/ScrollToHash";
import { useAuth } from "./context/AuthContext";
import GumroadReturnHandler from "./components/GumroadReturnHandler";
import LanguageSync from "./components/LanguageSync";
import Home from "./pages/Home";

// Home stays eager - it's the landing page, and making a first-time visitor
// wait on a second round-trip for it would trade a real cost for nothing.
// Everything else is split out: the quiz engine, the leaderboard and the
// three admin pages were all shipped to every visitor who only ever read the
// marketing page.
// The two dialogs are closed on every page load and pull in the animation
// library; they are downloaded only the first time one is opened, then stay
// mounted so their closing animation still plays.
const AuthModal = lazy(() => import("./components/AuthModal"));
const UpgradeModal = lazy(() => import("./components/UpgradeModal"));

function MountOnFirstOpen({ open, children }: { open: boolean; children: ReactNode }) {
  const [wasOpen, setWasOpen] = useState(open);
  useEffect(() => {
    if (open) setWasOpen(true);
  }, [open]);
  return wasOpen ? <Suspense fallback={null}>{children}</Suspense> : null;
}

const Formations = lazy(() => import("./pages/Formations"));
const CertificationQuiz = lazy(() => import("./pages/CertificationQuiz"));
const CertificationLeaderboard = lazy(() => import("./pages/CertificationLeaderboard"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const EmailConfirmed = lazy(() => import("./pages/EmailConfirmed"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminGumroad = lazy(() => import("./pages/AdminGumroad"));
const AdminEmails = lazy(() => import("./pages/admin/AdminEmails"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminFeedback = lazy(() => import("./pages/admin/AdminFeedback"));
const AdminAudit = lazy(() => import("./pages/admin/AdminAudit"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const AdminVouchersHub = lazy(() => import("./pages/admin/AdminVouchersHub"));
const AdminStats = lazy(() => import("./pages/admin/AdminStats"));

// Deliberately plain: every split route already renders its own loading state
// once mounted, so this only covers the few hundred milliseconds of fetching
// the chunk itself. Anything more elaborate would flash in and out.
function RouteFallback() {
  return <section className="mx-auto max-w-3xl px-6 py-24 text-muted">Chargement…</section>;
}

function App() {
  // The admin area is a back office with its own sidebar: the marketing nav
  // and footer would only get in the way there.
  const inAdmin = useLocation().pathname.startsWith("/admin");
  const { authModalOpen, upgradeModalOpen } = useAuth();

  return (
    <>
      {!inAdmin && <Nav />}
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/formations/:slug" element={<CertificationQuiz />} />
          <Route path="/formations/:slug/classement" element={<CertificationLeaderboard />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/email-confirmed" element={<EmailConfirmed />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminStats />} />
            <Route path="utilisateurs" element={<AdminUsers />} />
            <Route path="gumroad" element={<AdminGumroad />} />
            <Route path="vouchers" element={<AdminVouchersHub />} />
            <Route path="emails" element={<AdminEmails />} />
            <Route path="audit" element={<AdminAudit />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="stats" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </Suspense>
      {!inAdmin && <Footer />}
      <ScrollToTop />
      <ScrollToHash />
      <MountOnFirstOpen open={authModalOpen}>
        <AuthModal />
      </MountOnFirstOpen>
      <MountOnFirstOpen open={upgradeModalOpen}>
        <UpgradeModal />
      </MountOnFirstOpen>
      <GumroadReturnHandler />
      <LanguageSync />
    </>
  );
}

export default App;
