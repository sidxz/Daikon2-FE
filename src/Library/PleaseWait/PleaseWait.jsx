import { ProgressBar } from "primereact/progressbar";
import React from "react";

const PleaseWait = ({ height = "6px" }) => {
  return (
    <>
      <ProgressBar mode="indeterminate" style={{ height: height }} />
    </>
  );
};

export default PleaseWait;
