import { Skeleton } from "primereact/skeleton";
import React, { useEffect, useState } from "react";
import GraphAPI from "../../../Apps/Flow/shared/api/GraphAPI";

const TargetFromGraph = ({ elementId }) => {
  const [targetName, setTargetName] = useState(null);
  const [targetType, setTargetType] = useState(null);
  const [targetId, setTargetId] = useState(null);

  //console.log("elementId", elementId);
  useEffect(() => {
    // Fetch target data from graph using elementId
    GraphAPI.findTarget(elementId).then((res) => {
      setTargetName(res.name);
      setTargetType(res.targetType);
      setTargetId(res.targetId);
    });
  }, [elementId]);

  //console.log("targetName", targetName);

  if (targetId && !targetName)
    return (
      <div
        className="surface-overlay white-space-nowrap overflow-hidden text-overflow-ellipsis"
        style={{ width: "5em" }}
      >
        Unknown
      </div>
    );

  if (!targetName)
    return (
      <>
        <Skeleton className="w-full h-full"></Skeleton>{" "}
      </>
    );

  return (
    <div
      className="surface-overlay white-space-nowrap overflow-hidden text-overflow-ellipsis"
      style={{ width: "5em" }}
    >
      {targetName}
    </div>
  );
};

export default TargetFromGraph;
