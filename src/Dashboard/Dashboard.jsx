import React, { useContext } from "react";

import { RootStoreContext } from "../RootStore";

const Dashboard = () => {
  const { authStore } = useContext(RootStoreContext);
  const { user, fetchUser, isFetchingUser } = authStore;
  return <div>Dashboard : {user.email}</div>;
};

export default Dashboard;
