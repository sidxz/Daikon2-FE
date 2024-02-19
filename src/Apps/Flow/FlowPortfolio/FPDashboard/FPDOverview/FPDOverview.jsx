import React from "react";
import { FcApproval, FcBiotech, FcRight } from "react-icons/fc";

import FPDOH2L from "./FPDOH2L/FPDOH2L";
import FPDOLO from "./FPDOLO/FPDOLO";
import FPDOSP from "./FPDOSP/FPDOSP";

const FPDOverview = () => {
  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full ">
        <div className="flex w-full flex-column text-sm ">
          <div
            className="flex p-1 align-items-center justify-content-center w-full text-lg gap-2"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex">
              <FcRight />
            </div>
            <div className="flex ">
              <b>H2L (10)</b>
            </div>
          </div>
          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1  bg-white">
              <FPDOH2L />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-column text-sm">
          <div
            className="flex p-1 align-items-center justify-content-center w-full text-lg gap-2"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex">
              <FcBiotech />
            </div>
            <div className="flex">
              <b>LO (5)</b>
            </div>
          </div>
          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1 bg-white">
              <FPDOLO />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-column text-sm">
          <div
            className="flex p-1 align-items-center justify-content-center w-full text-lg gap-2"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex text-orange-500">
              <FcApproval />
            </div>
            <div className="flex">
              <b>SP (3)</b>
            </div>
          </div>
          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1  bg-white">
              <FPDOSP />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FPDOverview;
