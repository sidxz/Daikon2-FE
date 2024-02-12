import { observer } from "mobx-react-lite";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/nano/theme.css";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Auth from "./Auth/Auth";
import AppUserManager from "./Auth/components/AppUserManager";
import Container from "./Container/Container";
import "/node_modules/primeflex/primeflex.css";

const App = () => {
  var userManager = AppUserManager;

  return (
    <PrimeReactProvider>
      <Router>
        <Routes>
          <Route path="/auth/*" element={<Auth userManager={userManager} />} />
          <Route path="/*" element={<Container userManager={userManager} />} />
        </Routes>
      </Router>
    </PrimeReactProvider>
  );
};

export default observer(App);
