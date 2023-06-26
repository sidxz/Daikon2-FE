import React from "react";
import "./Home.css";
import HomeCards from "./HomeCards/HomeCards";

const Home = () => {
  return (
    <div className="Home flex flex-column align-items-center w-full pb-4 pl-5 pr-5 ml-5 mr-5">
      <div className="flex">
        <h1>
          Data Acquisition, Integration and Knowledge capture application
          (DAIKON)
        </h1>
      </div>
      <div className="flex">
        <HomeCards />
      </div>
      <div className="flex w-full justify-content-center gap-5 mt-2 border-3">
        <div className="flex m-1 p-2 border-3">Home</div>
        <div className="flex m-1 p-2 border-3">Home</div>
      </div>
    </div>
  );
};

export default Home;
