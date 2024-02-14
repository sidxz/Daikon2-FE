import React, { useState } from "react";

const JSONTree = ({ data, indent = 2 }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  if (typeof data !== "object" || data === null) {
    // Data is not an object or array, so just return the value
    return <div style={{ marginLeft: `${indent * 20}px` }}>{String(data)}</div>;
  }

  return (
    <div>
      {Array.isArray(data) ? (
        <div style={{ marginLeft: `${indent * 20}px` }}>
          <span onClick={toggleCollapse} style={{ cursor: "pointer" }}>
            {isCollapsed ? "[...]" : "[-]"}
          </span>
        </div>
      ) : (
        <div style={{ marginLeft: `${indent * 20}px` }}>
          <span onClick={toggleCollapse} style={{ cursor: "pointer" }}>
            {isCollapsed ? "{...}" : "[-]"}
          </span>
        </div>
      )}
      {!isCollapsed &&
        Object.keys(data).map((key) => (
          <div key={key} style={{ marginLeft: `${indent * 20}px` }}>
            <strong>{key}:</strong>
            <JSONTree data={data[key]} indent={indent + 1} />
          </div>
        ))}
    </div>
  );
};

export default JSONTree;
