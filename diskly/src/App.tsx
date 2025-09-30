import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import HomeContent from "./Routes/HomeContent";
import TermsPage from "./components/Terms";
import AuthPage from "./Routes/AuthPage";
import NotFound from "./Routes/NotFound";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeWrapper />} />
        <Route path="/Terms" element={<TermsWrapper />} />
        <Route path="/AuthPage" element={<AuthWrapper />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

const HomeWrapper: React.FC = () => {
  const navigate = useNavigate();
  return <HomeContent navigateToTerms={() => navigate("/terms")} />;
};

const TermsWrapper: React.FC = () => {
  const navigate = useNavigate();
  return <TermsPage navigateBack={() => navigate(-1)} />;
};

const AuthWrapper: React.FC = () => {
  const navigate = useNavigate();
  return <AuthPage />;
};

export default App;
