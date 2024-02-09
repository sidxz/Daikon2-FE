import React from "react";

const Dashboard = ({ ssoUser }) => {
  return <div>Dashboard : {ssoUser.profile.email}</div>;
};

export default Dashboard;
