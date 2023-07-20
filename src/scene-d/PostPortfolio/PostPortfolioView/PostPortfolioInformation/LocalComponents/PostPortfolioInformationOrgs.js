import React from "react";
import OrgChart from "../../../../../app/common/OrgChart/OrgChart";

const PostPortfolioInformationOrgs = ({ project }) => {
  return (
    <div className="flex flex-column">
      <OrgChart
        projectId={project.id} // Pass the project ID to the OrgChart component
        activeOrgs={project?.supportingOrgs} // Pass the supportingOrgs as activeOrgs
        primary={project?.primaryOrg?.alias} // Pass the primaryOrg's alias as primary
        allowEdit={true} // Enable editing in the OrgChart
      />
    </div>
  );
};

export default PostPortfolioInformationOrgs;
