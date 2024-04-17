import { Tag } from "primereact/tag";
import React from "react";
import { FaUser } from "react-icons/fa6";

const AuthorTag = ({ userId }) => {
  // if (!userId) {
  //   return <></>;
  // }

  let author = "Siddhant Rath";
  return (
    <Tag
      style={{
        background:
          "linear-gradient(-225deg, #b0bec5 0%, #90a4ae 48%, #78909c 100%)",
      }}
    >
      <div className="flex align-items-center gap-2">
        <div className="flex">
          <FaUser />
        </div>
        <div className="flex">
          {" "}
          <span className="text-sm">{author}</span>
        </div>
      </div>
    </Tag>
  );
};

export default AuthorTag;
