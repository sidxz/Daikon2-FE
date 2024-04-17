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
import PortfolioCompoundEvolution from "../../../FlowPortfolio/shared/HaCompoundEvolution/PortfolioCompoundEvolution";
import { PostPortfolioIcon } from "../../../icons/PostPortfolioIcon";
import PostPortfolioStageDropdown from "../../shared/PostPortfolioStageDropdown";
import FPPVIProjectInfoDesc from "./FPPVIProjectInfo/FPPVIProjectInfoDesc";
import FPPVIProjectInfoPriority from "./FPPVIProjectInfo/FPPVIProjectInfoPriority";
import * as Helper from "./FPPVInformationHelper";

const FPPVInformation = () => {
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

  const timelineItems = new DataSet([]);

  isDateValid(selectedProject?.indStart) &&
    timelineItems.add({
      id: 1,
      content: "IND Actual Start",
      start: selectedProject?.indStart,
      //end: selectedProject.indPredictedStart,
      //start: addDays(6),
      //end: addDays(90),
      //className: "expected",
    });

  isDateValid(selectedProject?.p1PredictedStart) &&
    timelineItems.add({
      id: 2,
      content: "P1 Predicted Start",
      start: selectedProject?.p1PredictedStart,
      className: "expected",
    });

  isDateValid(selectedProject?.p1Start) &&
    timelineItems.add({
      id: 3,
      content: "P1 Actual Start",
      start: selectedProject?.p1Start,
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
          svgIcon={<PostPortfolioIcon size={"25em"} />}
          heading={"Post Portfolio - " + selectedProject.name}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.project}
          entryPoint={selectedProject?.id}
          customElements={[
            <PostPortfolioStageDropdown />,
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

      <div className="flex flex-row m-0 w-full">
        <div className="flex m-0 flex-grow-1">
          <Fieldset className="flex" legend="Team Info">
            <FPPVIProjectInfoPriority />
          </Fieldset>
        </div>
        <div className="flex w-full m-0">
          <Fieldset
            className="flex w-full"
            legend="Post Portfolio Description & Notes"
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
    </div>
  );
};

export default observer(FPPVInformation);
