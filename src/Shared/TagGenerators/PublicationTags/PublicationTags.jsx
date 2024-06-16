import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import React, { useState } from "react";
import { IoIosJournal } from "react-icons/io";
import PublicationTable from "./PublicationTable/PublicationTable";

const PublicationTags = ({ publications }) => {
  const [visible, setVisible] = useState(false);
  if (!publications || publications.length === 0) {
    return <></>;
  }
  //console.log("Publications", publications);
  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">Publications</span>
    </div>
  );

  return (
    <>
      <Tag
        style={{
          background:
            "linear-gradient(-225deg, #336699 0%, #5588bb 48%, #77aadd 100%)",
        }}
        className="cursor-pointer"
        onClick={() => setVisible(true)}
      >
        <div className="flex align-items-center">
          <IoIosJournal />

          <span className="text-xs">
            {publications.length} Publication
            {publications.length > 1 ? "s" : ""}
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
        <PublicationTable publications={publications} />
      </Dialog>
    </>
  );
};

export default PublicationTags;
