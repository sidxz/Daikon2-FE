import { Card } from "primereact/card";
import React from "react";
import "./Home.css";
import HomeCards from "./HomeCards/HomeCards";
import HomeLatestDiscussions from "./HomeLatestDiscussions/HomeLatestDiscussions";
import HomeWhatsNew from "./HomeWhatsNew/HomeWhatsNew";

const Home = () => {
  let generateCardTitle = (icon, title) => {
    return (
      <div
        className="flex justify-content-center p-0 gap-2"
        style={{ margin: "0px", marginBottom: "-10px" }}
      >
        <div
          className="flex p-0 m-0"
          style={{
            color: "#3c83bd",
          }}
        >
          <i className={icon} />
        </div>
        <div className="flex p-0 m-0">
          <h5
            style={{
              color: "#3c83bd",
              margin: "0px",
              padding: "0px",
            }}
          >
            {title}
          </h5>
        </div>
      </div>
    );
  };

  return (
    <div className="Home surface-50 flex flex-column align-items-center w-full pb-4 pl-5 pr-5 ml-5 mr-5">
      <div className="flex">
        <h1>Data Acquisition, Integration and Knowledge Capture Application</h1>
      </div>
      <div className="flex">
        <HomeCards />
      </div>
      <div className="flex w-full gap-2 mt-4">
        <div className="flex flex-column p-2 w-8">
          <Card
            title={generateCardTitle("ri-discuss-line", "Recent Discussions")}
            className="w-full min-h-full"
          >
            <HomeLatestDiscussions />
          </Card>
        </div>

        <div className="flex flex-column p-2 w-4">
          <Card
            title={generateCardTitle(
              "icon icon-common icon-newspaper",
              "What's New?"
            )}
            className="w-full min-h-full"
          >
            <HomeWhatsNew />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
