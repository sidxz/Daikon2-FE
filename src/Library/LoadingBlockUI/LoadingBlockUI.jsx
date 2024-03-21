import { BlockUI } from "primereact/blockui";
import React from "react";
import loadingGif from "../../assets/icon-1.1s-200px.gif";

const LoadingBlockUI = ({ blocked, children }) => {
  let innerTemplate = (
    <div className="flex flex-column gap-2 align-items-center justify-content-center bg-white-alpha-90 p-2 border-round-md">
      <div className="flex ">
        <div className="flex ">
          <img src={loadingGif} style={{ width: "100px" }} alt={"Loading.."} />
        </div>
      </div>
      <div className="flex">Loading...</div>
    </div>
  );

  return (
    <BlockUI blocked={blocked} template={innerTemplate}>
      {children}
    </BlockUI>
  );
};

export default LoadingBlockUI;
