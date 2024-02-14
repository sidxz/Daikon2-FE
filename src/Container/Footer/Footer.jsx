import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appVersion } from "../../constants/appVersion";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();
  const DefaultConfidentialTag = () => <div />; // Default component

  const [showConfidentialAgreement, setShowConfidentialAgreement] =
    useState(false);
  const [CustomConfidentialTag, setCustomConfidentialTag] = useState(
    () => DefaultConfidentialTag
  );

  useEffect(() => {
    // Dynamically import the CustomFooterConfidentialTag component
    import(
      "../../Customizations/CustomFooterConfidentialTag/CustomFooterConfidentialTag"
    )
      .then((module) => {
        setCustomConfidentialTag(() => module.default);
      })
      .catch((error) => {
        console.error(
          "CustomFooterConfidentialTag not found, using default",
          error
        );
        setCustomConfidentialTag(() => DefaultConfidentialTag); // Fallback to DefaultConfidentialTag in case of error
      });
  }, []);

  const renderCustomConfidentialTag = () => (
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

  return (
    <div className="Footer">
      <hr className="Hr" />
      <div className="flex flex-column gap-2 text">
        <div className="flex justify-content-end">
          <p style={{ margin: "0px" }}>
            &copy; | DAIKON {appVersion.stream}{" "}
            <b>{"  " + appVersion.release + " "}</b> {appVersion.channel}
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
