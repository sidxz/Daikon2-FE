import { Card } from "primereact/card";
import React from "react";

const HomeWhatsNew = () => {
  let cardTitle = (
    <div
      className="flex justify-content-center"
      style={{ fontSize: "large", margin: "0px" }}
    >
      <p>📣 Attention TBDA Group!🔬</p>
    </div>
  );

  return (
    <div className="surface-50 border-round m-0 p-0">
      <Card
        title={cardTitle}
        style={{ fontSize: "small", marginBottom: "6px" }}
      >
        <p className="m-0">
          We are seeking your expertise to advance our collective mission to
          make DAIKON impactful. We invite you to contribute all available data
          on your screening efforts and validated hits achieved thus far.
        </p>
      </Card>
      <Card style={{ fontSize: "small" }}>
        <p className="m-0"></p>
      </Card>
    </div>
  );
};

export default HomeWhatsNew;
