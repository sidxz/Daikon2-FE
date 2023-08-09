import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appVersion } from "../../../appVersion";
import cssClass from "./Footer.module.css";

const Footer = () => {
  const navigate = useNavigate();
  let [showConfidentialAgreement, setShowConfidentialAgreement] =
    useState(false);
  let CustomConfidentialTag;
  try {
    CustomConfidentialTag =
      require("../../customizations/CustomFooterConfidentialTag/CustomFooterConfidentialTag").default;
  } catch (error) {
    CustomConfidentialTag = <></>;
  }

  let renderCustomConfidentialTag = () => {
    if (CustomConfidentialTag) {
      return (
        <>
          <Tag
            value="TBDA Confidential"
            severity="danger"
            style={{ cursor: "pointer" }}
            onClick={() => setShowConfidentialAgreement(true)}
          />

          <Dialog
            header="TBDA Informatics Systems Acknowledgment"
            visible={showConfidentialAgreement}
            onHide={() => setShowConfidentialAgreement(false)}
            style={{ width: "70vw" }}
          >
            <CustomConfidentialTag />
          </Dialog>
        </>
      );
    }
  };

  return (
    <div className={cssClass.Footer}>
      <hr className={cssClass.Hr} />
      <div className={["flex flex-column gap-2", cssClass.Text].join(" ")}>
        <div className="flex justify-content-end">
          <p style={{ margin: "0px" }}>
            &copy; | DAIKON {appVersion.stream}{" "}
            <b>{"  " + appVersion.release + " "}</b>
            {appVersion.channel}
          </p>
        </div>
        <div className="flex justify-content-end gap-2">
          <Tag
            value="Cite DAIKON"
            severity="success"
            onClick={() =>
              window.open("https://pubs.acs.org/doi/10.1021/acsptsci.3c00034")
            }
            style={{ cursor: "pointer" }}
          />
          {renderCustomConfidentialTag()}
        </div>
      </div>
    </div>
  );
};

export default Footer;
