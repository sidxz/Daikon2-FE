import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import Login from "../Auth/Login/Login";
import Dashboard from "../Dashboard/Dashboard";
const Container = ({ userManager }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Use effect :Container component mounted");
    userManager
      .getUser()
      .then((user) => {
        console.log(user);
        setUser(user);
      })
      .catch(function (err) {
        console.error(err);
      });
  }, [userManager]);

  const signOutRedirectHandler = async () => {
    try {
      await userManager.signoutRedirect();
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    console.log("User not logged in -> redirecting to login page");
    return <Login userManager={userManager} />;
  } else {
    console.log("User logged in");
    return (
      <div className="App">
        <h1>Container</h1>{" "}
        <button onClick={signOutRedirectHandler}>Logout</button>
        <hr />
        <Routes>
          <Route index element={<Navigate replace to="d/" />} />
          <Route path="d" element={<Dashboard user={user} />} />
        </Routes>
      </div>
    );
  }

  return <p>No routes found. Terminated</p>;
};

export default Container;
