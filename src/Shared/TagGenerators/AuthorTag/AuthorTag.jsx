import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import React from "react";
import { AppUserResolver } from "../../VariableResolvers/AppUserResolver";

const AuthorTag = ({ userId, size = "normal" }) => {
  const { getIdFromUserFullName, getUserFullNameById } = AppUserResolver();
  let textClass = "text-bluegray-500 font-normal";

  if (size === "xlarge") {
    textClass = "text-bluegray-500 font-normal text-lg";
  }

  let author = getUserFullNameById(userId);
  if (!author) {
    author = "Unknown";
  }
  let authorInitials = author
    .split(" ")
    .map((n) => n[0])
    .join("");
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
          {/* <FaUser /> */}
          <Avatar label={authorInitials} size={size} />
        </div>
        <div className="flex">
          {" "}
          <span className={textClass}>{author}</span>
        </div>
      </div>
    </Tag>
  );
};

export default AuthorTag;
