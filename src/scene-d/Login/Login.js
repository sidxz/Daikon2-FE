import React from "react";
import DefaultLogin from "./DefaultLogin/DefaultLogin";

let CustomLoginLanding;
try {
  CustomLoginLanding =
    require("../../app/customizations/CustomLoginLanding/CustomLoginLanding").default;
} catch (error) {
  console.error("Failed to import CustomLoginLanding:", error);
  CustomLoginLanding = DefaultLogin;
}

const Login = (props) => {
  const { loginButtonClicked } = props;

  const LoginComponent = CustomLoginLanding;

  return <LoginComponent {...props} />;
};

export default Login;
