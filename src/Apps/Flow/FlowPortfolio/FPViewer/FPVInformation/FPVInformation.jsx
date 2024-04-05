import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Chip } from "primereact/chip";
import { Fieldset } from "primereact/fieldset";
import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { DataSet } from "vis-data";
import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import VisTimeline from "../../../../../Library/VisTimeline/VisTimeline";
import { RootStoreContext } from "../../../../../RootStore";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import { appColors } from "../../../../../constants/colors";
import { PortfolioIcon } from "../../../icons/PortfolioIcon";
import PortfolioCompoundEvolution from "../../shared/HaCompoundEvolution/PortfolioCompoundEvolution";
import * as Helper from "./FPVInformationHelper";

const FPVInformation = () => {
  const rootStore = useContext(RootStoreContext);
  const { selectedProject, isFetchingProject } = rootStore.projectStore;

  if (isFetchingProject) {
    return <Loading message={"Fetching Portfolios..."} />;
  }

  const navigate = useNavigate();

  const { getOrgNameById } = AppOrgResolver();

  // calculate the waiting to start date in days from the current date = current date - date created
  let waitingToStartDate = new Date() - new Date(selectedProject.dateCreated);
  waitingToStartDate = Math.ceil(waitingToStartDate / (1000 * 3600 * 24));

  let projectInformation = [
    { name: "Created Date", value: selectedProject.dateCreated },
    { name: "Waiting to start", value: waitingToStartDate },
    { name: "Start Date", value: selectedProject.projectStartDate },
    {
      name: "Predicted Start Date",
      value: selectedProject.projectPredictedStartDate,
    },
    { name: "Completed Date", value: selectedProject.completionDate },
    { name: "Termination Date", value: selectedProject.terminationDate },
  ];

  const items = new DataSet([
    {
      id: 1,
      content: "Created Date",
      start: selectedProject.dateCreated,
    },

    { id: 3, content: "Predicted Start Date", start: "2024-04-14" },
    { id: 4, content: "Actual Start Date", start: "2024-04-17" },
    { id: 5, content: "Completed Date", start: "2024-12-17" },
  ]);

  const options = {
    // Your options here
  };

  return (
    <div className="flex flex-column w-full gap-1">
      <div className="flex w-full">
        <BreadCrumb model={Helper.breadCrumbItems(navigate, selectedProject)} />
      </div>
      <div className="flex w-full">
        <SecHeading
          svgIcon={<PortfolioIcon size={"25em"} />}
          heading={"Portfolio - " + selectedProject.name}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.project}
          entryPoint={selectedProject?.id}
          customElements={[
            <Chip
              label={getOrgNameById(selectedProject?.primaryOrgId)}
              icon="ri-organization-chart"
              className="mr-3"
            />,
          ]}
        />
      </div>
      <div className="flex w-full">
        <VisTimeline items={items} options={options} />{" "}
      </div>
      <div className="flex w-full">
        <Fieldset className="m-0 flex-grow-1" legend="Compound Evolution">
          <PortfolioCompoundEvolution
            events={selectedProject?.portfolioCompoundEvolution}
          />
        </Fieldset>
      </div>
    </div>
  );
};

export default observer(FPVInformation);
