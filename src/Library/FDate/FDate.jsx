import React from "react";

const FDate = ({ timestamp, hideTime = true, color = "#17202A" }) => {
  // Check if timestamp is null, undefined, or the default date
  if (
    !timestamp ||
    timestamp === "0001-01-01T00:00:00" ||
    timestamp === "0001-01-01T00:00:00Z"
  ) {
    return <span></span>;
  }

  // Format the date based on hideTime flag
  if (hideTime) {
    return (
      <span style={{ color: color }}>
        {new Date(timestamp).toLocaleDateString()}
      </span>
    );
  }

  return (
    <span style={{ color: color }}>{new Date(timestamp).toLocaleString()}</span>
  );
};

export default FDate;
