import { Skeleton } from "primereact/skeleton";
import React, { useEffect, useState } from "react";
import GraphAPI from "../../../Apps/Flow/shared/api/GraphAPI";

const TargetFromGraph = ({ elementId }) => {
  const [targetName, setTargetName] = useState(null);
  const [targetType, setTargetType] = useState(null);
  const [targetId, setTargetId] = useState(null);

  useEffect(() => {
    const cachedData = sessionStorage.getItem(`targetData-${elementId}`);

    if (cachedData) {
      // Use cached data
      const { name, targetType, targetId } = JSON.parse(cachedData);
      setTargetName(name);
      setTargetType(targetType);
      setTargetId(targetId);
    } else {
      // Fetch target data from the API if not cached
      GraphAPI.findTarget(elementId).then((res) => {
        setTargetName(res.name);
        setTargetType(res.targetType);
        setTargetId(res.targetId);

        // Cache the fetched data
        sessionStorage.setItem(
          `targetData-${elementId}`,
          JSON.stringify({
            name: res.name,
            targetType: res.targetType,
            targetId: res.targetId,
          })
        );
      });
    }
  }, [elementId]);

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
