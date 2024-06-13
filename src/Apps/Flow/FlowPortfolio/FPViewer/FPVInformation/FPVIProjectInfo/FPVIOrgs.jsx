import { observer } from "mobx-react-lite";
import React from "react";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";

const FPVIOrgs = ({ project }) => {
  {
    /* Reused: At PostPortfolio */
  }
  const { getOrgNameById } = AppOrgResolver();

  let pOrgRender = (
    <div className="flex p-1 border-1 border-50">
      {getOrgNameById(project.primaryOrgId)}
    </div>
  );

  let pOrgsRender = project.participatingOrgs.map((orgId) => {
    const orgName = getOrgNameById(orgId);

    return (
      <div className="flex p-1 border-1 border-50" key={orgId}>
        {orgName}
      </div>
    );
  });

  return (
    <div className="flex m-1 gap-1">
      {pOrgRender}
      {pOrgsRender}
    </div>
  );
};

export default observer(FPVIOrgs);
