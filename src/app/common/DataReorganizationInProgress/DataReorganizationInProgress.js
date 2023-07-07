import React from "react";

export const DataReorganizationInProgress = () => {
  return (
    <div
      className="flex flex-column w-full fadein animation-duration-500 p-8"
      style={{
        textAlign: "center",
        fontSize: "medium",
        display: "table",
        margin: "auto",
      }}
    >
      <i className="pi pi-exclamation-circle"></i>{" "}
      <p style={{ padding: "1em", color: "#000" }}>
        Data restructuring in progress.
      </p>
      <p
        style={{ padding: "0em", color: "#AAAAAA" }}
        className="ml-8 mr-8 pl-8 pr-8"
      >
        We apologize for the inconvenience. The requested section is currently
        undergoing a restructuring process to enhance the data organization. We
        understand your need for access and kindly request your patience during
        this time. We appreciate your understanding and assure you that we are
        working diligently to make the section available as soon as possible.
        Thank you for your patience and cooperation.
      </p>
    </div>
  );
};
