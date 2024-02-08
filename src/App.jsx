import { UserManager } from "oidc-client-ts";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SigninRedirect from "./Auth/components/SignInRedirect";
import SignOutRedirect from "./Auth/components/SignOutRedirect";
import Home from "./Container/Home";
import authConfig from "./config/authConfig";

const App = () => {
  var userManager = null;
  try {
    console.log("Creating user manager");
    console.log(authConfig);

    userManager = new UserManager(authConfig);
    console.log(userManager);
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle the error or display an error message to the user
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home userManager={userManager} />} />
        <Route
          path="/signin_redirect"
          element={<SigninRedirect userManager={userManager} />}
        />
        <Route
          path="/signout_redirect"
          element={<SignOutRedirect userManager={userManager} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
