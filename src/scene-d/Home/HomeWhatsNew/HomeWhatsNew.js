import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React from "react";

const HomeWhatsNew = () => {
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
      {/* <Card
        title={cardTitle("📣 Attention TBDA Group!🔬")}
        style={{ fontSize: "small", marginBottom: "6px" }}
      >
        <p className="m-0 p-0">
          We are seeking your expertise to advance our collective mission to
          make DAIKON impactful. We invite you to contribute all available data
          on your screening efforts and validated hits achieved thus far.
        </p>
      </Card> */}
      <Card
        title={cardTitle("Featured Additions")}
        style={{ fontSize: "small" }}
      >
        <p className="justify-content-center">
          We're excited to unveil the following additions with our latest update :
        </p>
        <p className="m-0 p-0">
          <ul>
            <li>
              👉 Integrated Target Promotion Questionnaire Tool.
            </li>
            <li>🚀 Import & Export Functionality for Screen Component for effortless bulk operations.</li>

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

export default HomeWhatsNew;
