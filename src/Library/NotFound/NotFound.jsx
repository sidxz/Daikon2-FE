import { Card } from "primereact/card";
import React from "react";
import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="p-grid p-align-center p-justify-center w-full h-full">
      <div className="p-col-12 p-md-6 h-full">
        <Card title="Page Not Found" className="p-shadow-5 h-full">
          <div className="flex align-items-center gap-3 p-text-center">
            <i
              className="pi pi-exclamation-triangle"
              style={{ fontSize: "3em", color: "var(--primary-color)" }}
            ></i>
            <p className="flex m-0">
              Sorry, the page you are looking for does not exist. Please check
              the URL or return to the
            </p>
            <NavLink className="m-0" to="/">
              homepage.
            </NavLink>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
