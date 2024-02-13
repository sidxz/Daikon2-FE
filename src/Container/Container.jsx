import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Flow from "../Apps/Flow/Flow";
import Login from "../Auth/Login/Login";
import UnauthorizedUser from "../Auth/UnauthorizedUser/UnauthorizedUser";
import { RootStoreContext } from "../RootStore";
import TitleBar from "./TitleBar/TitleBar";

const Container = ({ userManager }) => {
  const [ssoUser, setSsoUser] = useState(null);
  const { authStore } = useContext(RootStoreContext);
  const { user, fetchUser, isFetchingUser } = authStore;

  useEffect(() => {
    const fetchSSOUser = async () => {
      try {
        const user = await userManager.getUser();
        setSsoUser(user);
        fetchUser();
      } catch (err) {
        console.error("Error fetching SSO user:", err);
      }
    };

    fetchSSOUser();
  }, [userManager, fetchUser]);

  const signOut = async () => {
    try {
      await userManager.signoutRedirect();
      setSsoUser(null);
    } catch (err) {
      console.error("Error during sign out:", err);
    }
  };

  if (!ssoUser) return <Login userManager={userManager} />;
  if (isFetchingUser) return <div>Loading...</div>;
  if (!user) return <UnauthorizedUser onSignOut={signOut} ssoUser={ssoUser} />;

  console.log("user", user);
  return (
    <div className="App">
      <TitleBar signOut={signOut} ssoUser={ssoUser} />
      <Routes>
        <Route index element={<Navigate replace to="wf/" />} />
        <Route path="wf/*" element={<Flow />} />
      </Routes>
    </div>
  );
};

export default observer(Container);
