import React from "react";

const FTVApconixLegend = () => {
  return (
    <div className="flex flex-column gap-2 w-full border-1 border-50">
      <div className="flex gap-2 w-full border-1 border-50">
        <div
          className={
            "flex gap-2 w-1 align-items-center justify-content-center border-round-md bg-green-300"
          }
        ></div>
        <div className="flex w-full p-2 align-items-left justify-content-left text-base ">
          No mammalian off-target identified or confident that the Mtb target
          drug binding domain does not occur in the mammalian off-target
        </div>
      </div>
      <div className="flex gap-2 w-full border-1 border-50">
        <div
          className={
            "flex gap-2 w-1 align-items-center justify-content-center border-round-md bg-yellow-300"
          }
        ></div>
        <div className="flex w-full p-2 align-items-left justify-content-left text-base ">
        Drug binding domain occurs in the mammalian off-target, but more than 1000 X in vitro selectivity toward Mtb target demonstrated
        </div>
      </div>
      <div className="flex gap-2 w-full border-1 border-50">
        <div
          className={
            "flex gap-2 w-1 align-items-center justify-content-center border-round-md bg-red-300"
          }
        ></div>
        <div className="flex w-full p-2 align-items-left justify-content-left text-base ">
        Drug binding domain not known, less than 1000 X in vitro selectivity toward Mtb target demonstrated, or mammalian screen not feasible
        </div>
      </div>
    </div>
  );
};

export default FTVApconixLegend;
