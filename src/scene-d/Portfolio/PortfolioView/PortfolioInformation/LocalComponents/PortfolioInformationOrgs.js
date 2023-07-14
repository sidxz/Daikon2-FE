import React from "react";
import OrgChart from "../../../../../app/common/OrgChart/OrgChart";

/**
 * Renders the component for displaying project organization chart in portfolio information.
 * @param {object} project - The project object containing information.
 * @returns {JSX.Element} - The JSX element representing the component.
 */

const PortfolioInformationOrgs = ({ project }) => {
  return (
    <div className="flex flex-column">
      <OrgChart
        projectId={project.id}
        activeOrgs={project?.supportingOrgs}
        primary={project?.primaryOrg?.alias}
        allowEdit={true}
      />
    </div>
  );
};

export default PortfolioInformationOrgs;
