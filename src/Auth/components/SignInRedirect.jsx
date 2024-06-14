import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../Library/Loading/Loading";

const SigninRedirect = ({ userManager }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    userManager
      .signinRedirectCallback()
      .then((user) => {
        if (user) {
          setUser(user);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  }, [userManager]);

  useEffect(() => {
    if (user) {
      console.log("SigninRedirect: user");
      const redirectUrl = localStorage.getItem("redirectUrl") || "/";
      console.log("SigninRedirect: redirectUrl", redirectUrl);
      localStorage.removeItem("redirectUrl");
      navigate(redirectUrl);
    }
  }, [user, navigate]);

  return <Loading message={"Processing Signin..."} />;
};

export default SigninRedirect;
