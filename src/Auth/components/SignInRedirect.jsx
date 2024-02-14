import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../Library/Loading/Loading";

const SigninRedirect = ({ userManager }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    userManager
      .signinCallback()
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
      navigate("/");
    }
  }, [user, navigate]);

  return <Loading message={"Processing Signin..."} />;
};

export default SigninRedirect;
