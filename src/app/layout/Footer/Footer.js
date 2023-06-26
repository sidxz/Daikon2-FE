import { Tag } from "primereact/tag";
import React from "react";
import { useNavigate } from "react-router-dom";
import { appVersion } from "../../../appVersion";
import cssClass from "./Footer.module.css";

const Footer = () => {
  const navigate = useNavigate();

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
          <Tag
            value="TBDA Confidential"
            severity="danger"
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
