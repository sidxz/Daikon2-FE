import { Divider } from "primereact/divider";

const FlowDashWhatsNew = () => {
  return (
    <div className="flex flex-column gap-1 pl-3 pr-3 pb-3">
      <div className="flex">
        <p>We're excited to unveil some new additions to DAIKON 2.7</p>
      </div>
      <div className="flex flex-column">
        <Divider />
        <div className="feature">
          <span className="icon-activity" aria-label="activity-icon">
            🔔
          </span>
          <strong> New Feature: Disclosure Vault</strong>
          <br></br>Undisclosed compounds can now be revealed in DAIKON. To do
          this, either right-click on the compound or use the MolecuLogix
          feature. Also, HA can now be directly created for these compounds.
        </div>
        <Divider />
        <div className="feature">
          <span className="icon-activity" aria-label="activity-icon">
            🔔
          </span>
          <strong> PAINS & Frequent Hitters Detection</strong>
          <br></br>Indicators to identify unwanted molecules using RDKit
          filters.
        </div>
        <Divider />
        <div className="feature">
          <span className="icon-database" aria-label="database-icon">
            🔔
          </span>
          <strong> Hits View Upgrade:</strong>
          <br></br> Customize hits table view, new Clustering tool, filter on
          unvoted hits, and many more!
        </div>
        <Divider />
      </div>
    </div>
  );
};

export default FlowDashWhatsNew;
