import React from "react";

const FSDOActiveScreens = () => {
  return (
    <div className="flex flex-column justify-content-center hover:shadow-2">
      <div className="flex align-items-end justify-content-end">
        <div
          className="flex p-1 justify-content-center bg-white text-700 text-xs border-right-1 border-cyan-100"
          style={{
            minWidth: "4rem",
          }}
        >
          Method
        </div>

        <div
          className="flex p-1 justify-content-center bg-white text-700 text-xs"
          style={{
            minWidth: "4rem",
          }}
        >
          Organization
        </div>
      </div>

      <div
        className="flex justify-content-center bg-cyan-50 cursor-pointer"
        style={{
          fontSize: "medium",
        }}
      >
        <div
          className="flex p-2 justify-content-center"
          style={{
            minWidth: "7rem",
            color: "#0e7994",
          }}
        >
          Screen name
        </div>
      </div>
    </div>
  );
};

export default FSDOActiveScreens;
