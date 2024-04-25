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
        // background:
        //   "linear-gradient(-225deg, #b0bec5 0%, #90a4ae 48%, #78909c 100%)",
        background: "#ffffff",
      }}
    >
      <div className="flex align-items-center gap-2 pl-2 m-0">
        <div className="flex text-bluegray-500 font-normal">
          <FaUser />
        </div>
        <div className="flex">
          {" "}
          <span className="text-sm text-bluegray-500 font-normal">
            {author}
          </span>
        </div>
      </div>
    </Tag>
  );
};

export default AuthorTag;
