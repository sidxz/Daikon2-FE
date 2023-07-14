import { observer } from "mobx-react-lite";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "remixicon/fonts/remixicon.css";
import "../../assets/_overrides.scss";
import Login from "../../scene-d/Login/Login";
import NoAccess from "../../scene-d/NoAccess/NoAccess";
import agent from "../api/agent";
import { RootStoreContext } from "../stores/rootStore";
import AppAdmin from "./AppAdmin";
import AppBeta from "./AppBeta";
import AppDefault from "./AppDefault";
import AppDeveloper from "./AppDeveloper";
import AppProjectManagement from "./AppProjectManagement";
import AppTools from "./AppTools";
import NetworkError from "./Errors/NetworkError/NetworkError";
import Footer from "./Footer/Footer";
import Loading from "./Loading/Loading";
import NotFound from "./NotFound/NotFound";
import TitleBar from "./TitleBar/TitleBar";
import "/node_modules/primeflex/primeflex.css";

/*
    Define the main application routes.

    Each <Route> specifies a unique path and the corresponding sub app to render
    when that path is navigated to. For instance, if the current URL path matches "/admin/*",
    the <AppAdmin> component will be rendered.

    <Navigate replace to="/d/" /> is used to automatically redirect from the index route ("/")
    to the "/d/" route which serves as the default route for the main sub app.

    The "*" wildcard in a path (e.g. "/d/*") means that this route will match any URL
    that starts with "/d/", no matter what follows after.

    The path "*" is a fallback route that will match any URL that hasn't already been matched
    by the other routes. If a user navigates to a URL that doesn't match any of the other routes,
    the <NotFound> component will be rendered.
*/
const App = () => {
  // Initialize instances and store variables
  const authServiceInstance = agent.AuthServiceInstance;
  const rootStore = useContext(RootStoreContext);
  const { user, getUser, fetching, userNotFound } = rootStore.userStore;
  const { adminMode } = rootStore.appSettingsStore;
  const { fetchingAppVars, appVars, fetchAppVars } = rootStore.generalStore;
  const [networkError, setNetworkError] = useState(false);

  // Load user and app vars on component mount
  useEffect(() => {
    // The if condition checks:
    // 1. If there's an authenticated user account
    // 2. If there's no network error
    // 3. If the user data is not fetched yet
    // 4. If the user does not exist (userNotFound is not true)

    if (
      authServiceInstance.account &&
      !networkError &&
      !user &&
      !userNotFound
    ) {
      // getUser is a function that fetches the user data.
      // If it fails (most likely due to network issues), it catches the error,
      // logs it to the console, and sets the networkError state to true to prevent further renders.

      getUser().catch((e) => {
        console.error("CAUGHT NETWORK ERROR");
        setNetworkError(true);
      });

      if (appVars === null) {
        fetchAppVars();
      }
    }
  }, [
    getUser,
    networkError,
    user,
    userNotFound,
    authServiceInstance.account,
    adminMode,
    appVars,
    fetchAppVars,
  ]);

  // Network Error handling
  if (networkError) {
    return <NetworkError />;
  }

  // Loading condition
  if (fetching || fetchingAppVars) {
    return <Loading />;
  }

  // User not found handling
  if (userNotFound) {
    return <NoAccess />;
  }

  // Render for signed-in users
  const signedInRender = (
    <Fragment>
      <ToastContainer pauseOnHover theme="light" />
      <div className="flex flex-column">
        <div className="block">
          <TitleBar />
        </div>
        <div className="block overflow-auto">
          <Routes>
            <Route index element={<Navigate replace to="/d/" />} />
            <Route path="/d/*" element={<AppDefault />} />
            <Route path="/admin/*" element={<AppAdmin />} />
            <Route path="/pm/*" element={<AppProjectManagement />} />
            <Route path="/beta" element={<AppBeta />} />
            <Route path="/developer/*" element={<AppDeveloper />} />
            <Route path="/tools/*" element={<AppTools />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <div className="flex">
          <Footer />
        </div>
      </div>
    </Fragment>
  );

  // Render for users not signed-in
  const notSignedInRender = (
    <Fragment>
      <Login loginButtonClicked={() => authServiceInstance.SignIn()} />
    </Fragment>
  );

  // Decide which render to use
  if (!user) {
    return notSignedInRender;
  }

  if (user) {
    return signedInRender;
  }
};

export default observer(App);
