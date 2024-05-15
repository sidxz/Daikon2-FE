import { ProgressBar } from "primereact/progressbar";
import React from "react";

const PleaseWait = () => {
  return (
    <>
      <ProgressBar mode="indeterminate" style={{ height: "6px" }} />
    </>
  );
};

export default PleaseWait;
