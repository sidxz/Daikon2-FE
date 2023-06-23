import React from "react";
import "./Home.css";
import HomeCards from "./HomeCards/HomeCards";

const Home = () => {
  return (
    <div className="Home flex flex-column align-items-center w-full pb-4">
      <div className="flex">
        <h1>
          Data Acquisition, Integration and Knowledge capture application
          (DAIKON)
        </h1>
      </div>
      <div className="flex">
        <HomeCards />
      </div>
      <div className="flex"></div>
    </div>
  );
};

export default Home;
