import { Tag } from "primereact/tag";
import React from "react";
import { appVersion } from "../../../appVersion";
import cssClass from "./Footer.module.css";

const Footer = () => {
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
            onClick={() => console.log("/cite")}
          />
          <Tag value="TBDA Confidential" severity="danger" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
