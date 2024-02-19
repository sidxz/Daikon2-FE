import React from "react";

const FSDORecentlyCompleted = () => {
  return (
    <div className="flex flex-column  text-green-700 justify-content-center shadow-1 hover:shadow-3">
      <div className="flex align-items-end justify-content-end">
        <div
          className="flex p-1 justify-content-center bg-white text-700 text-xs border-right-1 border-green-100"
          style={{
            minWidth: "4rem",
          }}
        >
          Method
        </div>

        <div
          className="flex p-1 justify-content-center bg-white text-700 text-xs border-green-100"
          style={{
            minWidth: "4rem",
          }}
        >
          Organization
        </div>
      </div>

      <div
        className="flex justify-content-center bg-green-50 cursor-pointer"
        style={{
          fontSize: "medium",
        }}
      >
        <div
          className="flex p-2 justify-content-center text-green-700 "
          style={{
            minWidth: "7rem",
          }}
        >
          Screen Name
        </div>
      </div>
    </div>
  );
};

export default FSDORecentlyCompleted;
