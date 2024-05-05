import { observer } from "mobx-react-lite";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ConfirmPopup } from "primereact/confirmpopup";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Admin from "../Apps/Admin/Admin";
import Flow from "../Apps/Flow/Flow";
import MolecuLogix from "../Apps/MolecuLogix/MolecuLogix";
import Questionnaire from "../Apps/Questionnaire/Questionnaire";
import Login from "../Auth/Login/Login";
import UnauthorizedUser from "../Auth/UnauthorizedUser/UnauthorizedUser";
import Loading from "../Library/Loading/Loading";
import { RootStoreContext } from "../RootStore";
import Footer from "./Footer/Footer";
import TitleBar from "./TitleBar/TitleBar";

const Container = ({ userManager }) => {
  const [ssoUser, setSsoUser] = useState(null);
  const { authStore } = useContext(RootStoreContext);
  const {
    user,
    fetchUser,
    isFetchingUser,
    fetchAppVars,
    isFetchingAppVars,
    fetchGlobalValues,
    isFetchingGlobalValues,
    globalValues,
    appVars,
  } = authStore;

  useEffect(() => {
    const fetchSSOUser = async () => {
      try {
        const _ssoUser = await userManager.getUser();
        //console.log("SSO User", _ssoUser);
        const expiresAtTimestamp = _ssoUser?.expires_at;
        const expiresAtDate = new Date(expiresAtTimestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
        //console.log("SSO User Expires at", expiresAtDate);
        setSsoUser(_ssoUser);
        if (_ssoUser?.expired) {
          //console.log("SSO User expired, redirecting to login...");
          await userManager.signinRedirect();
        }
        fetchUser();
      } catch (err) {
        console.error("Error fetching SSO user:", err);
      }
    };

    fetchSSOUser();
    fetchAppVars();
    fetchGlobalValues();
  }, [userManager, fetchUser, fetchAppVars, fetchGlobalValues]);

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
  if (isFetchingAppVars || isFetchingGlobalValues)
    return <Loading message={"Fetching app data..."} />;
  if (!user) return <UnauthorizedUser onSignOut={signOut} ssoUser={ssoUser} />;

  console.log("Container user", user);
  console.log("Container appVars", appVars);
  console.log("Container globalValues", globalValues);

  return (
    <div className="App">
      <ConfirmDialog />
      <ConfirmPopup />
      <TitleBar signOut={signOut} ssoUser={ssoUser} />
      <ToastContainer />
      <Routes>
        <Route index element={<Navigate replace to="wf/" />} />
        <Route path="wf/*" element={<Flow />} />
        <Route path="admin/*" element={<Admin />} />
        <Route path="moleculogix/*" element={<MolecuLogix />} />
        <Route path="questionnaire/*" element={<Questionnaire />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default observer(Container);
