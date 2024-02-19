import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { FcAlarmClock, FcDisapprove, FcOk, FcWorkflow } from "react-icons/fc";
import FHADOActiveHA from "./FHADOActiveHA/FHADOActiveHA";
import FHADOInActiveHA from "./FHADOInActiveHA/FHADOInActiveHA";
import FHADOPortfolioReadyHA from "./FHADOPortfolioReadyHA/FHADOPortfolioReadyHA";
import FHADOReadyForHA from "./FHADOReadyForHA/FHADOReadyForHA";

const FHADOverview = () => {
  const Card = ({ project, onDrop }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "CARD",
      item: { project },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [{ isOver }, drop] = useDrop({
      accept: "CARD",
      drop: (item) => onDrop(item.project, project.bucket),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <div
        ref={(node) => drag(drop(node))}
        className={`card ${isDragging ? "dragging" : ""}`}
      >
        {/* Render card content here */}
        <p>{project.name}</p>
        {/* ... */}
      </div>
    );
  };

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
              <FcAlarmClock />
            </div>
            <div className="flex ">
              <b>READY FOR HA</b>
            </div>
          </div>
          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1  bg-white">
              <FHADOReadyForHA />
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
              <FcWorkflow />
            </div>
            <div className="flex">
              <b>ACTIVE HA</b>
            </div>
          </div>
          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1 bg-white">
              <FHADOActiveHA />
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
              <FcDisapprove />
            </div>
            <div className="flex">
              <b>INACTIVE HA</b>
            </div>
          </div>
          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1  bg-white">
              <FHADOInActiveHA />
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
            <div className="flex text-green-500">
              <FcOk />
            </div>
            <div className="flex">
              <b>PORTFOLIO READY</b>
            </div>
          </div>
          <div className="flex w-full pr-3">
            <div className="flex w-full  pt-1 bg-white">
              <FHADOPortfolioReadyHA />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FHADOverview;
