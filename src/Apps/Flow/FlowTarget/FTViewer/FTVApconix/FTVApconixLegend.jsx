import React from "react";
import { FaGaugeSimpleHigh } from "react-icons/fa6";

const FTVApconixLegend = () => {
  return (
    <div className="flex w-10 flex-column gap-2 ">
        <h4>Mammalian off-target selectivity rating</h4>
      <div className="flex gap-1 w-full">
        <div
          className={
            "flex gap-1 w-1 align-items-center justify-content-center border-round-md bg-green-300"
          }
        ></div>
        <div className="flex w-full p-2 align-items-left justify-content-left text-base ">
          No mammalian off-target identified or confident that the Mtb target
          drug binding domain does not occur in the mammalian off-target
        </div>
      </div>
      <div className="flex gap-1 w-full">
        <div
          className={
            "flex gap-1 w-1 align-items-center justify-content-center border-round-md bg-yellow-300"
          }
        ><span><FaGaugeSimpleHigh /></span></div>
        <div className="flex w-full p-2 align-items-left justify-content-left text-base ">
        Drug binding domain occurs in the mammalian off-target, but more than 1000 X in vitro selectivity toward Mtb target demonstrated
        </div>
      </div>
      <div className="flex gap-1 w-full">
        <div
          className={
            "flex gap-1 w-1 align-items-center justify-content-center border-round-md bg-red-300"
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
