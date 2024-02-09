import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Auth from "./Auth/Auth";
import AppUserManager from "./Auth/components/AppUserManager";
import Container from "./Container/Container";

const App = () => {
  var userManager = AppUserManager;

  return (
    <Router>
      <Routes>
        <Route path="/auth/*" element={<Auth userManager={userManager} />} />
        <Route path="/*" element={<Container userManager={userManager} />} />
      </Routes>
    </Router>
  );
};

export default App;
