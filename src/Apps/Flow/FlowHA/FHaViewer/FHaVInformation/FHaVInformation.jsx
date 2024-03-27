import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Fieldset } from "primereact/fieldset";
import React, { useContext } from "react";
import { useNavigate } from "react-router";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";

import { Chip } from "primereact/chip";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import { appColors } from "../../../../../constants/colors";
import { HAIcon } from "../../../icons/HAIcon";
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

  //waitingToStartDate = Math.ceil(waitingToStartDate / (1000 * 3600 * 24));

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

  return (
    <div className="flex flex-column w-full">
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
      <div className="flex gap-2">
        <div className="flex flex-column gap-2">
          <div className="flex pt-2">
            <Fieldset className="m-0 flex-grow-1" legend="HA Information">
              <DataTable value={haInformation} className="HideDataTableHeader">
                <Column field="name"></Column>
                <Column field="value"></Column>
              </DataTable>
            </Fieldset>
          </div>
        </div>

        <div className="flex flex-column gap-2"></div>
      </div>
      <div className="flex w-full">
        <Fieldset
          className="m-0 flex-grow-1"
          legend="Compound Evolution"
        ></Fieldset>
      </div>
    </div>
  );
};

export default observer(FHaVInformation);
