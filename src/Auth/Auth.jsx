import React from "react";
import { Route, Routes } from "react-router-dom";
import SigninRedirect from "./components/SignInRedirect";
import SignOutRedirect from "./components/SignOutRedirect";

const Auth = ({ userManager, returnUrl }) => {
  return (
    <Routes>
      <Route
        path="signin_redirect"
        element={
          <SigninRedirect userManager={userManager} returnUrl={returnUrl} />
        }
      />
      <Route
        path="signout_redirect"
        element={<SignOutRedirect userManager={userManager} />}
      />
    </Routes>
  );
};

export default Auth;
