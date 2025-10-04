import React, { createContext, useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import HomeContent from "./Routes/HomeContent";
import TermsPage from "./components/Terms";
import AuthPage from "./Routes/AuthPage";
import Home from "./Routes/Home";
import GamesPage from "./Routes/Games_List";
import NotFound from "./Routes/NotFound";
import Stock from "./Routes/Stock";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeContent />} />
        <Route path="/Terms" element={<TermsWrapper />} />
        <Route path="/AuthPage" element={<AuthPage />} />

        <Route path="/home" element={<Home />} />
        <Route path="/games-list" element={<GamesPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/Stock" element={<Stock />} />
      </Routes>
    </Router>
  );
};

const TermsWrapper: React.FC = () => {
  const navigate = useNavigate();
  return <TermsPage navigateBack={() => navigate(-1)} />;
};

export default App;
