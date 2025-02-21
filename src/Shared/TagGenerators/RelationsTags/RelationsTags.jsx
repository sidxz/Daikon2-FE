import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import React, { useState } from "react";
import { BsJournals } from "react-icons/bs";
import { IoIosJournal } from "react-icons/io";
import RelationsTable from "./RelationsTable/RelationsTable";

const RelationsTags = ({ relations }) => {
  const [visible, setVisible] = useState(false);
  if (!relations || relations.length === 0) {
    return <></>;
  }
  //console.log("relations", relations);
  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <BsJournals />
      <span className="font-bold white-space-nowrap">Relations</span>
    </div>
  );

  return (
    <>
      <Tag
        style={{
          background:
            "linear-gradient(-225deg, #9b7bbd 0%, #6f5fa8 48%, #4a4991 100%)",
        }}
        className="cursor-pointer"
        onClick={() => setVisible(true)}
      >
        <div className="flex align-items-center">
          <IoIosJournal />

          <span className="text-xs pl-1">
            {relations.length} Relation
            {relations.length > 1 ? "s" : ""}
          </span>
        </div>
      </Tag>
      <Dialog
        visible={visible}
        modal
        header={headerElement}
        style={{ width: "90rem" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <RelationsTable relations={relations} />
      </Dialog>
    </>
  );
};

export default RelationsTags;
