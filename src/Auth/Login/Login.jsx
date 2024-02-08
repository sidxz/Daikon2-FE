import React from "react";

const Login = ({ userManager }) => {
  const signinRedirectHandler = async () => {
    try {
      await userManager.signinRedirect();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <button onClick={signinRedirectHandler}>Redirect Login</button>
    </div>
  );
};

export default Login;
