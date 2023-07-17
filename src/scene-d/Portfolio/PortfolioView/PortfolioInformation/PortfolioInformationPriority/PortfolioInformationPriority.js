import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import React, { useState } from "react";
import PortfolioInformationProirityModify from "./PortfolioInformationProirityModify/PortfolioInformationProirityModify";

/**
 * Renders the component for displaying project priority information.
 * @param {Object} project - The project object containing priority information.
 * @returns {JSX.Element} The rendered component.
 */

const PortfolioInformationPriority = ({ project }) => {
  const [visible, setVisible] = useState(false);

  return (
    <React.Fragment>
      <div className="flex">
        <div
          className="flex flex-column m-3 p-3"
          style={{ textAlign: "center", lineHeight: "0.5" }}
        >
          {/* Display the priority */}
          Priority
          <h3>{project.teamPriority}</h3>
        </div>
        <div
          className="flex flex-column m-3 p-3"
          style={{ textAlign: "center", lineHeight: "0.5" }}
        >
          {/* Display the probability */}
          Probability
          <h3>{project.teamProbability}</h3>
        </div>
        <div
          className="flex flex-column m-3 p-3"
          style={{ textAlign: "center", lineHeight: "0.5" }}
        >
          {/* Button to open the sidebar */}
          <Button
            icon="pi pi-arrow-left"
            onClick={() => setVisible(true)}
            className="flex m-2 p-button-secondary"
          />
        </div>
      </div>

      {/* Sidebar for modifying the priority information */}
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
      >
        <PortfolioInformationProirityModify
          closeSidebar={() => setVisible(false)}
        />
        <hr />
      </Sidebar>
    </React.Fragment>
  );
};

export default PortfolioInformationPriority;
