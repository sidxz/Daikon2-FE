import React from "react";

const FlowDashWhatsNew = () => {
  return (
    <div className="flex flex-column gap-0 pl-3 pr-3 pb-3">
      <div className="flex">
        <p>We're excited to unveil some new additions to DAIKON 2.4 :</p>
      </div>
      <div className="flex flex-column">
        <div className="feature">
          <span className="icon-summary" aria-label="summary-icon">
            📝
          </span>
          <strong> DAIKON AI Phase 1- </strong> Generated short summaries with
          key details for presentations, including target structures and
          convenient download links.
        </div>
        <div className="feature">
          <span className="icon-activity" aria-label="activity-icon">
            🔔
          </span>
          <strong> Introducing Recent Activity Feed - </strong> To stay informed
          with real-time updates on all changes and actions happening within the
          app.
        </div>
        <div className="feature">
          <span className="icon-database" aria-label="database-icon">
            🔬
          </span>
          <strong> Introducing MolecuLogix - </strong> A comprehensive module
          designed to serve as a chemical database for compound organization,
          substructure searches, similarity analysis, and advanced property
          analysis.
        </div>
      </div>
    </div>
  );
};

export default FlowDashWhatsNew;
