import React from "react";

const TitleBar = ({ signOut }) => {
  return (
    <div>
      <h1>Container</h1>
      <button onClick={signOut}>Logout</button>
      <hr />
    </div>
  );
};

export default TitleBar;
