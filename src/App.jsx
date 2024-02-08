import { UserManager } from "oidc-client-ts";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Auth from "./Auth/Auth";
import Container from "./Container/Container";
import authConfig from "./config/authConfig";

const App = () => {
  var userManager = new UserManager(authConfig);

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
