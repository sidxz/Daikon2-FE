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
          We've taken your feedback to heart and implemented some powerful
          upgrades.{" "}
        </p>
        <p className="m-0 p-0">
          <ul>
            <li>
              👉 Introducing "One-Click Voting" for convenient voting by passing
              the confirmation dialog box!
            </li>
            <li>🚀 Revamped Landing Page to explore the latest discussions.</li>
            <li>
              🗳️ Hidden, Sorted, and Commented Votes: Now, you have the ability
              to hide votes, sort them according to your preferences, and engage
              in meaningful discussions by leaving comments.
            </li>
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
