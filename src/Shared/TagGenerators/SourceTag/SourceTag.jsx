import { Tag } from "primereact/tag";
import React from "react";
import { FaSourcetree } from "react-icons/fa";

const SourceTag = ({ source }) => {
  if (!source) {
    return <></>;
  }
  return (
    <Tag
      style={{
        background:
          "linear-gradient(-225deg, #b0bec5 0%, #90a4ae 48%, #78909c 100%)",
      }}
    >
      <div className="flex align-items-center">
        <FaSourcetree />
        <span className="text-xs">{source}</span>
      </div>
    </Tag>
  );
};

export default SourceTag;
