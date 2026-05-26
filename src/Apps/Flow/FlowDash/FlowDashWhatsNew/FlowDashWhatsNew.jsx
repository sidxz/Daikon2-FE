import { Divider } from "primereact/divider";

const FlowDashWhatsNew = () => {
  return (
    <div className="flex flex-column gap-1 pl-3 pr-3 pb-3">
      <div className="flex">
        <p>We're excited to unveil some new additions to DAIKON 3.2</p>
      </div>
      <div className="flex flex-column">
        <div className="feature">
          <span className="icon-activity" aria-label="activity-icon">
            🔔
          </span>
          <strong> ADMET Property Predictions</strong>
          <br />
          Molecules in MolecuLogix now display predicted ADMET properties
          (Absorption, Distribution, Metabolism, Excretion, and Toxicity) via
          the ADMET-AI pipeline.
        </div>
        <Divider />
        <div className="feature">
          <span className="icon-activity" aria-label="activity-icon">
            🔔
          </span>
          <strong> Deep Learning Based Nuisance Compound Detection</strong>
          <br />
          Indicators to identify potential unwanted molecules using a Deep
          Learning pipeline.
        </div>
        <Divider />
        <div className="feature">
          <span className="icon-database" aria-label="database-icon">
            🔔
          </span>
          <strong> Document Summarization module</strong>
          <br></br>
          Documents from SharePoint are now organized by module (e.g., Target,
          Screen, HA, etc.) and can be accessed under each module’s dedicated
          Documents section.
          <br />
          Users can add comments, provide feedback, and suggest edits directly
          within the platform.
        </div>
        <Divider />
        <div className="feature">
          <span className="icon-activity" aria-label="activity-icon">
            🔔
          </span>
          <strong> New Feature: Disclosure Process</strong>
          <br />
          Undisclosed compounds can now be revealed in DAIKON. To do this,
          either right-click on the compound or use the MolecuLogix feature.
          Also, HA can now be directly created for these compounds.
        </div>
        <Divider />
      </div>
    </div>
  );
};

export default FlowDashWhatsNew;
