import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import Login from "../Auth/Login/Login";
import Dashboard from "../Dashboard/Dashboard";
import { RootStoreContext } from "../RootStore";

const Container = ({ userManager }) => {
  const [ssoUser, setSsoUser] = useState(null);

  const rootStore = useContext(RootStoreContext);
  const { user, fetchUser, isFetchingUser } = rootStore.authStore;

  useEffect(() => {
    console.log("Use effect :Container component mounted");
    userManager
      .getUser()
      .then((ssoUser) => {
        console.log(ssoUser);
        fetchUser();
        setSsoUser(ssoUser);
      })
      .catch(function (err) {
        console.error(err);
      });
  }, [userManager]);

  const signOutRedirectHandler = async () => {
    try {
      await userManager.signoutRedirect();
      setSsoUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (!ssoUser) {
    console.log("User not logged in -> redirecting to login page");
    return <Login userManager={userManager} />;
  }

  return (
    <div className="App">
      <h1>Container</h1>{" "}
      <button onClick={signOutRedirectHandler}>Logout</button>
      <hr />
      <Routes>
        <Route index element={<Navigate replace to="d/" />} />
        <Route path="d" element={<Dashboard ssoUser={ssoUser} />} />
      </Routes>
    </div>
  );
};

export default observer(Container);
