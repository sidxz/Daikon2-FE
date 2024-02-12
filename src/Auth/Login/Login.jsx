import React from "react";
import DefaultLogin from "./DefaultLogin";

const Login = ({ userManager }) => {
  const [LoginComponent, setLoginComponent] = React.useState(null);

  React.useEffect(() => {
    // Dynamically import the CustomLoginLanding component
    import("../../Customizations/CustomLoginLanding/CustomLoginLanding")
      .then((module) => {
        setLoginComponent(() => (props) => <module.default {...props} />);
      })
      .catch((error) => {
        console.error(
          "CustomLoginLanding not found, using default login",
          error
        );
        setLoginComponent(() => DefaultLogin); // Fallback to DefaultLogin in case of error
      });
  }, []);

  const signinRedirectHandler = async () => {
    try {
      await userManager.signinRedirect();
    } catch (err) {
      console.error(err);
    }
  };

  // Check if LoginComponent is set before rendering
  if (!LoginComponent) {
    return <div>Loading...</div>; // Or any other loading state representation
  }

  return <LoginComponent loginButtonClicked={signinRedirectHandler} />;
};

export default Login;
