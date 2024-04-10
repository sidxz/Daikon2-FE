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
import { DateValidators } from "../../../../../Shared/Validators/DateValidators";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import { appColors } from "../../../../../constants/colors";
import { PortfolioIcon } from "../../../icons/PortfolioIcon";
import PortfolioCompoundEvolution from "../../shared/HaCompoundEvolution/PortfolioCompoundEvolution";
import PortfolioStageDropdown from "../../shared/PortfolioStageDropdown";
import * as Helper from "./FPVInformationHelper";

const FPVInformation = () => {
  const rootStore = useContext(RootStoreContext);
  const { selectedProject, isFetchingProject } = rootStore.projectStore;

  if (isFetchingProject) {
    return <Loading message={"Fetching Portfolios..."} />;
  }

  const navigate = useNavigate();

  const { isDateValid } = DateValidators();

  const { getOrgNameById } = AppOrgResolver();

  // calculate the waiting to start date in days from the current date = current date - date created
  let waitingToStartDate = new Date() - new Date(selectedProject.dateCreated);
  waitingToStartDate = Math.ceil(waitingToStartDate / (1000 * 3600 * 24));

  var groups = new DataSet([
    { id: "group1", content: "group1" },
    { id: "group2", content: "group2" },
  ]);

  const timelineItems = new DataSet([
    {
      id: 1,
      content: "Created",
      start: selectedProject.dateCreated,
      //start: today,
      group: "group1",
    },

    {
      id: 2,
      content: "Predicted Start",
      start: selectedProject.h2LPredictedStartDate,
      //start: addDays(5),
      group: "group1",
    },
  ]);

  isDateValid(selectedProject.h2LStartDate) &&
    timelineItems.add({
      id: 3,
      content: "Actual Start",
      start: selectedProject.h2LStartDate,
      //end: selectedProject.h2LPredictedStartDate,
      //start: addDays(6),
      //end: addDays(90),
      //className: "expected",
      group: "group2",
      subgroup: "sg_1",
    });

  isDateValid(selectedProject?.h2LPredictedStartDate) &&
    timelineItems.add({
      id: 4,
      content: "H2L Predicted Start",
      start: selectedProject?.h2LPredictedStartDate,
      group: "group1",
    });

  isDateValid(selectedProject?.terminationDate) &&
    timelineItems.add({
      id: 5,
      content: "Termination Date",
      start: selectedProject?.terminationDate,
      group: "group1",
    });

  isDateValid(selectedProject?.completionDate) &&
    timelineItems.add({
      id: 6,
      content: "Completed",
      start: selectedProject?.completionDate,
      group: "group1",
    });

  const options = {
    stack: true,
    stackSubgroups: false,
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
            <PortfolioStageDropdown />,
            <Chip
              label={getOrgNameById(selectedProject?.primaryOrgId)}
              icon="ri-organization-chart"
              className="mr-3"
            />,
          ]}
        />
      </div>
      <div className="flex w-full">
        <VisTimeline items={timelineItems} options={options} groups={groups} />
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
