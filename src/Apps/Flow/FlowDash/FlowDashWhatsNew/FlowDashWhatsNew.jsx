import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React from "react";

const FlowDashWhatsNew = () => {
  let cardTitle = (text) => (
    <div
      className="flex justify-content-center m-0 p-0"
      style={{ fontSize: "large", margin: "0px" }}
    >
      <p className="m-0 p-0">{text}</p>
    </div>
  );

  return (
    <div className="surface-50 border-round m-0 p-0">
      <Card title={cardTitle("DAIKON 2.0")} style={{ fontSize: "small" }}>
        <p className="justify-content-center">
          We're excited to unveil some new additions to DAIKON 2.0 :
        </p>
        <p className="m-0 p-0">
          <ul>
            <li>
              📊 Introducing MolecuLogix - a comprehensive solution for
              structure organization, similarity searches, and property
              analysis.
            </li>
            <li>
              🔍 Transition to Microservices architecture for enhanced
              scalability, flexibility, and easier maintenance
            </li>

            <li>🌟 Upgraded Horizon View, and Timeline View</li>
            <li>📈 Landing pages for every stage of the pipeline</li>
          </ul>
        </p>
      </Card>
      <Card
        title={cardTitle("Publications")}
        style={{ fontSize: "small", marginTop: "6px" }}
      >
        <p
          className="align-items-center m-0 p-0"
          style={{ fontSize: "large", fontFamily: "Helvetica" }}
        >
          <center>
            <Button
              label=" DAIKON Paper"
              className="p-button-info p-button-sm"
              onClick={() =>
                window.open("https://pubs.acs.org/doi/10.1021/acsptsci.3c00034")
              }
            />
          </center>
        </p>
        <p>
          We kindly request all users to cite our work when referencing our app.
          Thank you for your support!{" "}
        </p>
      </Card>
    </div>
  );
};

export default FlowDashWhatsNew;
