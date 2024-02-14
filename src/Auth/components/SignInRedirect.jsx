import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../Library/Loading/Loading";

const SigninRedirect = ({ userManager }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Use effect :SigninRedirect component mounted");
    userManager
      .signinCallback()
      .then((user) => {
        console.log("signin popup callback response success");
        console.log(user);
        if (user) {
          setUser(user);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  }, [userManager]);

  useEffect(() => {
    console.log("Use effect :SigninRedirect user effect");
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return <Loading message={"Processing Signin..."} />;
};

export default SigninRedirect;
