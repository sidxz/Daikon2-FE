import { Skeleton } from "primereact/skeleton";
import React, { useEffect, useState } from "react";
import GraphAPI from "../../../Apps/Flow/shared/api/GraphAPI";

const TargetFromGraph = ({ elementId }) => {
  const [targetName, setTargetName] = useState(null);
  const [targetType, setTargetType] = useState(null);
  const [targetId, setTargetId] = useState(null);

  useEffect(() => {
    // Fetch target data from graph using elementId
    GraphAPI.findTarget(elementId).then((res) => {
      setTargetName(res.name);
      setTargetType(res.targetType);
      setTargetId(res.targetId);
    });
  }, [elementId]);

  if (targetId && !targetName) return <></>;
  if (!targetName)
    return (
      <>
        <Skeleton className="w-full h-full"></Skeleton>{" "}
      </>
    );

  return <>{targetName}</>;
};

export default TargetFromGraph;
