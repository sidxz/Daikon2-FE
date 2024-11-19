import { observer } from "mobx-react-lite";
import React from "react";
import { MdOutlineUpdate } from "react-icons/md";
import { VscNewFile } from "react-icons/vsc";
import { AppUserResolver } from "../../Shared/VariableResolvers/AppUserResolver";
import FDate from "../FDate/FDate";

const PageInfoPanel = ({
  dateCreated,
  createdById,
  dateUpdated,
  updatedById,
  heading = "Page Info",
}) => {
  const { getIdFromUserFullName, getUserFullNameById } = AppUserResolver();

  let createdByName = createdById ? getUserFullNameById(createdById) : "System";
  let updatedByName = updatedById ? getUserFullNameById(updatedById) : "";

  return (
    <div className="flex flex-column p-2 pl-3 border-1 border-50 border-round-md gap-1 w-full text-color-secondary text-sm">
      <div className="flex flex-column border-0 p-1 border-50 border-round-md text-base font-semibold text-color	">
        {heading}
      </div>
      <div className="flex flex-column border-1 p-1 border-50 border-round-md border-top-none border-left-none border-right-none">
        <div className="flex align-items-center gap-1 font-semibold mb-1">
          <div className="flex">
            <MdOutlineUpdate />
          </div>
          <div className="flex">Updated</div>
        </div>
        <div className="flex">
          <FDate timestamp={dateUpdated} color="#6c757d" />
        </div>
        <div className="flex">{updatedByName}</div>
      </div>
      <div className="flex flex-column border-0 p-1 border-50 border-round-md border-top-none border-left-none border-right-none">
        <div className="flex align-items-center gap-1 font-semibold mb-1">
          <div className="flex">
            <VscNewFile />
          </div>
          <div className="flex">Created</div>
        </div>
        <div className="flex">
          <FDate timestamp={dateCreated} color="#6c757d" />
        </div>
        <div className="flex">{createdByName}</div>
      </div>
    </div>
  );
};

export default observer(PageInfoPanel);
