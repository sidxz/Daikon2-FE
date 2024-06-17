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
import FPVIOrgs from "../../../FlowPortfolio/FPViewer/FPVInformation/FPVIProjectInfo/FPVIOrgs";
import PortfolioCompoundEvolution from "../../../FlowPortfolio/shared/HaCompoundEvolution/PortfolioCompoundEvolution";
import { PostPortfolioIcon } from "../../../icons/PostPortfolioIcon";
import { PostPortfolioAdminRoleName } from "../../constants/roles";
import PostPortfolioStageDropdown from "../../shared/PostPortfolioStageDropdown";
import FPPVIProjectInfoDesc from "./FPPVIProjectInfo/FPPVIProjectInfoDesc";
import FPPVIProjectInfoPriority from "./FPPVIProjectInfo/FPPVIProjectInfoPriority";
import * as Helper from "./FPPVInformationHelper";

const FPPVInformation = () => {
  const rootStore = useContext(RootStoreContext);
  const { selectedProject, isFetchingProject } = rootStore.projectStore;

  const { isUserInAnyOfRoles } = AppRoleResolver();

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

  isDateValid(selectedProject?.indStart) &&
    timelineItems.add({
      id: 7,
      content: "IND Actual Start",
      start: selectedProject?.indStart,
      //end: selectedProject.indPredictedStart,
      //start: addDays(6),
      //end: addDays(90),
      //className: "expected",
    });

  isDateValid(selectedProject?.p1PredictedStart) &&
    timelineItems.add({
      id: 8,
      content: "P1 Predicted Start",
      start: selectedProject?.p1PredictedStart,
      className: "expected",
    });

  isDateValid(selectedProject?.p1Start) &&
    timelineItems.add({
      id: 9,
      content: "P1 Actual Start",
      start: selectedProject?.p1Start,
    });

  const options = {
    stack: true,
    stackSubgroups: false,
  };

  var titleBarButtons = [];

  if (isUserInAnyOfRoles([PostPortfolioAdminRoleName])) {
    titleBarButtons.push(<PostPortfolioStageDropdown />);
  } else {
    titleBarButtons.push(
      <PostPortfolioStageDropdown
        readOnly={true}
        readOnlyStage={selectedProject.stage}
      />
    );
  }

  titleBarButtons.push(
    <Chip
      label={getOrgNameById(selectedProject?.primaryOrgId)}
      icon="ri-organization-chart"
      className="mr-3"
    />
  );

  return (
    <div className="flex flex-column w-full gap-1">
      <div className="flex w-full">
        <BreadCrumb model={Helper.breadCrumbItems(navigate, selectedProject)} />
      </div>
      <div className="flex w-full">
        <SecHeading
          svgIcon={<PostPortfolioIcon size={"25em"} />}
          heading={"Post Portfolio - " + selectedProject.name}
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
          {/* Reusing: Component from Portfolio */}
          <FPVIOrgs project={selectedProject} />
        </Fieldset>
      </div>

      <div className="flex flex-row m-0 w-full">
        <div className="flex m-0 flex-grow-1">
          <Fieldset className="flex" legend="Team Info">
            <FPPVIProjectInfoPriority />
          </Fieldset>
        </div>
        <div className="flex w-full m-0">
          <Fieldset
            className="flex w-full"
            legend="Post Portfolio Achievements, Summary & Notes"
          >
            <FPPVIProjectInfoDesc />
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

export default observer(FPPVInformation);
