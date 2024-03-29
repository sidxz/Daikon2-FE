import { observer } from "mobx-react-lite";
import { PrimeReactProvider } from "primereact/api";
//import "primereact/resources/themes/nano/theme.css";
import "primeicons/primeicons.css";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "remixicon/fonts/remixicon.css";
import Auth from "./Auth/Auth";
import AppUserManager from "./Auth/components/AppUserManager";
import Container from "./Container/Container";
import "./assets/theme.css";
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
