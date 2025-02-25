import { Divider } from "primereact/divider";
import React from "react";

const FlowDashWhatsNew = () => {
  return (
    <div className="flex flex-column gap-1 pl-3 pr-3 pb-3">
      <div className="flex">
        <p>We're excited to unveil some new additions to DAIKON 2.5 :</p>
      </div>
      <div className="flex flex-column">
        <Divider />
        <div className="feature">
          <span className="icon-activity" aria-label="activity-icon">
            🔔
          </span>
          <strong> New Feature: HA Creation for Undisclosed Molecules</strong>
          <br></br>HA can now be created not just from screens or known compounds, but also for undisclosed molecules—offering more flexibility in your workflow
        </div>
        <Divider />
        <div className="feature">
          <span className="icon-activity" aria-label="activity-icon">
            🔔
          </span>
          <strong> New filters in Target Dashboard </strong>
          <br></br>New filter to highlight the top 25 high-interest targets.
        </div>
        <Divider />
        <div className="feature">
          <span className="icon-database" aria-label="database-icon">
          🔔
          </span>
          <strong> New filters in Screen Dashboard</strong>
          <br></br> Auto-hide red clock cards, new filters for target, organization and more!
        </div>
        <Divider />
        <div className="feature">
          <span className="icon-database" aria-label="database-icon">
          🔔
          </span>
          <strong> New HA Status: "Paused"</strong>
          <br></br> Paused HAs can now be filtered out from the HA list
        </div>
      </div>
    </div>
  );
};

export default FlowDashWhatsNew;
