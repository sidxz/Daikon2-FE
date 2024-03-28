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
import { HAIcon } from "../../../icons/HAIcon";
import HaCompoundEvolution from "../../shared/HaCompoundEvolution/HaCompoundEvolution";
import HaStatusDropdown from "../../shared/HaStatusDropdown";
import * as Helper from "./FHaVInformationHelper";

const FHaVInformation = () => {
  const rootStore = useContext(RootStoreContext);
  const { selectedHa, isFetchingHa } = rootStore.haStore;

  if (isFetchingHa) {
    return <Loading message={"Fetching HA..."} />;
  }

  const navigate = useNavigate();

  const { getOrgNameById } = AppOrgResolver();

  // calculate the waiting to start date in days from the current date = current date - date created
  let waitingToStartDate = new Date() - new Date(selectedHa.dateCreated);
  waitingToStartDate = Math.ceil(waitingToStartDate / (1000 * 3600 * 24));

  let haInformation = [
    { name: "Created Date", value: selectedHa.dateCreated },
    { name: "Waiting to start", value: waitingToStartDate },
    { name: "Start Date", value: selectedHa.haStartDate },
    {
      name: "Predicted Start Date",
      value: selectedHa.haPredictedStartDate,
    },
    { name: "Completed Date", value: selectedHa.completionDate },
    { name: "Termination Date", value: selectedHa.terminationDate },
  ];

  const items = new DataSet([
    {
      id: 1,
      content: "Created Date",
      start: selectedHa.dateCreated,
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
        <BreadCrumb model={Helper.breadCrumbItems(navigate, selectedHa)} />
      </div>
      <div className="flex w-full">
        <SecHeading
          svgIcon={<HAIcon size={"25em"} />}
          heading={"Hit Assessment - " + selectedHa.name}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.ha}
          customElements={[
            <HaStatusDropdown />,
            <Chip
              label={getOrgNameById(selectedHa?.primaryOrgId)}
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
          <HaCompoundEvolution events={selectedHa?.haCompoundEvolution} />
        </Fieldset>
      </div>
    </div>
  );
};

export default observer(FHaVInformation);
