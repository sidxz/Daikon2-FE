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
import { AppRoleResolver } from "../../../../../Shared/VariableResolvers/AppRoleResolver";
import { appColors } from "../../../../../constants/colors";
import HaCompoundEvolution from "../../../FlowHA/shared/HaCompoundEvolution/HaCompoundEvolution";
import { PortfolioIcon } from "../../../icons/PortfolioIcon";
import { PortfolioAdminRoleName } from "../../constants/roles";
import PortfolioCompoundEvolution from "../../shared/HaCompoundEvolution/PortfolioCompoundEvolution";
import PortfolioStageDropdown from "../../shared/PortfolioStageDropdown";
import FPVIOrgs from "./FPVIProjectInfo/FPVIOrgs";
import FPVIProjectInfoDesc from "./FPVIProjectInfo/FPVIProjectInfoDesc";
import FPVIProjectInfoPriority from "./FPVIProjectInfo/FPVIProjectInfoPriority";
import * as Helper from "./FPVInformationHelper";

const FPVInformation = () => {
  const rootStore = useContext(RootStoreContext);
  const { selectedProject, isFetchingProject } = rootStore.projectStore;

  const { isUserInAnyOfRoles } = AppRoleResolver();

  if (isFetchingProject) {
    return <Loading message={"Fetching Portfolios..."} />;
  }

  const navigate = useNavigate();

  const { isDateValid } = DateValidators();

  const { getOrgAliasById } = AppOrgResolver();

  // calculate the waiting to start date in days from the current date = current date - date created
  let waitingToStartDate = new Date() - new Date(selectedProject.dateCreated);
  waitingToStartDate = Math.ceil(waitingToStartDate / (1000 * 3600 * 24));

  var groups = new DataSet([
    { id: "group1", content: "group1" },
    { id: "group2", content: "group2" },
  ]);

  const timelineItems = new DataSet([]);

  isDateValid(selectedProject?.h2LStart) &&
    timelineItems.add({
      id: 1,
      content: "H2L Actual Start",
      start: selectedProject?.h2LStart,
      //end: selectedProject.h2LPredictedStartDate,
      //start: addDays(6),
      //end: addDays(90),
      //className: "expected",
    });

  isDateValid(selectedProject?.loPredictedStart) &&
    timelineItems.add({
      id: 2,
      content: "LO Predicted Start",
      start: selectedProject?.loPredictedStart,
      //end: selectedProject.h2LPredictedStartDate,
      //start: addDays(6),
      //end: addDays(90),
      className: "expected",
    });

  isDateValid(selectedProject?.loStart) &&
    timelineItems.add({
      id: 3,
      content: "LO Actual Start",
      start: selectedProject?.loStart,
      //end: selectedProject.h2LPredictedStartDate,
      //start: addDays(6),
      //end: addDays(90),
      //className: "expected",
    });

  isDateValid(selectedProject?.spPredictedStart) &&
    timelineItems.add({
      id: 4,
      content: "SP Predicted Start",
      start: selectedProject?.spPredictedStart,
      //end: selectedProject.h2LPredictedStartDate,
      //start: addDays(6),
      //end: addDays(90),
      className: "expected",
    });

  isDateValid(selectedProject?.spStart) &&
    timelineItems.add({
      id: 5,
      content: "SP Actual Start",
      start: selectedProject?.spStart,
      //end: selectedProject.h2LPredictedStartDate,
      //start: addDays(6),
      //end: addDays(90),
      //className: "expected",
    });

  isDateValid(selectedProject?.indPredictedStart) &&
    timelineItems.add({
      id: 6,
      content: "IND Predicted Start",
      start: selectedProject?.indPredictedStart,
      //end: selectedProject.h2LPredictedStartDate,
      //start: addDays(6),
      //end: addDays(90),
      className: "expected",
    });

  const options = {
    stack: true,
    stackSubgroups: false,
  };

  var titleBarButtons = [];

  if (isUserInAnyOfRoles([PortfolioAdminRoleName])) {
    titleBarButtons.push(<PortfolioStageDropdown />);
  } else {
    titleBarButtons.push(
      <PortfolioStageDropdown
        readOnly={true}
        readOnlyStage={selectedProject.stage}
      />
    );
  }

  titleBarButtons.push(
    <Chip
      label={getOrgAliasById(selectedProject?.primaryOrgId)}
      icon="ri-organization-chart"
      className="mr-3"
    />
  );

  return (
    <div
      className="flex flex-column w-full gap-1"
      style={{
        filter: selectedProject?.isProjectRemoved ? "grayscale(100%)" : "none",
      }}
    >
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
          customElements={titleBarButtons}
        />
      </div>
      <div className="flex w-full">
        <VisTimeline items={timelineItems} options={options} groups={groups} />
      </div>

      <div className="flex w-full">
        <Fieldset
          className="m-0 flex-grow-1"
          legend="Organization & Collaboration"
        >
          <FPVIOrgs project={selectedProject} />
        </Fieldset>
      </div>

      <div className="flex flex-row m-0 w-full">
        <div className="flex m-0 flex-grow-1">
          <Fieldset className="flex" legend="Team Info">
            <FPVIProjectInfoPriority />
          </Fieldset>
        </div>
        <div className="flex w-full m-0">
          <Fieldset
            className="flex w-full"
            legend="Portfolio Achievements, Summary & Notes"
          >
            <FPVIProjectInfoDesc />
          </Fieldset>
        </div>
      </div>

      <div className="flex w-full">
        <Fieldset
          className="m-0 flex-grow-1"
          legend="Project Compound Evolution"
        >
          <PortfolioCompoundEvolution
            events={selectedProject?.portfolioCompoundEvolution}
          />
        </Fieldset>
      </div>
      <div className="flex w-full">
        <Fieldset
          className="m-0 flex-grow-1"
          legend="Hit Assessment Compound Evolution"
        >
          <HaCompoundEvolution
            haId={selectedProject.haId}
            showMenuBar={false}
          />
        </Fieldset>
      </div>
    </div>
  );
};

export default observer(FPVInformation);
