import React from "react";

const Dashboard = ({ user }) => {
  return <div>Dashboard : {user.profile.email}</div>;
};

export default Dashboard;
