import { observer } from "mobx-react-lite";
import { ConfirmDialog } from "primereact/confirmdialog";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Admin from "../Apps/Admin/Admin";
import Flow from "../Apps/Flow/Flow";
import MolecuLogix from "../Apps/MolecuLogix/MolecuLogix";
import Login from "../Auth/Login/Login";
import UnauthorizedUser from "../Auth/UnauthorizedUser/UnauthorizedUser";
import Loading from "../Library/Loading/Loading";
import { RootStoreContext } from "../RootStore";
import Footer from "./Footer/Footer";
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
  if (isFetchingUser) return <Loading message={"Authorizing user..."} />;
  if (!user) return <UnauthorizedUser onSignOut={signOut} ssoUser={ssoUser} />;

  return (
    <div className="App">
      <ConfirmDialog />
      <TitleBar signOut={signOut} ssoUser={ssoUser} />
      <ToastContainer />
      <Routes>
        <Route index element={<Navigate replace to="wf/" />} />
        <Route path="wf/*" element={<Flow />} />
        <Route path="admin/*" element={<Admin />} />
        <Route path="moleculogix/*" element={<MolecuLogix />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default observer(Container);
