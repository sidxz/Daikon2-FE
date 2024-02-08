import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignOutRedirect = ({ userManager }) => {
  const navigate = useNavigate();
  const [signoutDone, setSignoutDone] = React.useState(false);

  useEffect(() => {
    userManager
      .signoutCallback()
      .then(() => {
        console.log("Signout successful");
        setSignoutDone(true);
      })
      .catch(function (err) {
        console.error(err);
      });
  }, [userManager]);

  useEffect(() => {
    if (signoutDone) {
      setTimeout(() => navigate("/"), 100);
    }
  }, [signoutDone, navigate]);

  return <p>Processing SignOut...</p>;
};

export default SignOutRedirect;
