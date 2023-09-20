import { observer } from "mobx-react-lite";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";
import SectionHeading from "../../../app/common/SectionHeading/SectionHeading";

// import "./PortfolioDashDataTable.css";
import { appColors } from "../../../colors";
import HAList from "./HAList/HAList";
import HAOverview from "./HAOverview/HAOverview";

const HADash = () => {
  return (
    <div className="flex flex-column w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SectionHeading
          icon="icon icon-conceptual icon-chemical"
          heading="Hit Assessment"
          color={appColors.sectionHeadingBg.ha}
        />
      </div>
      <div className="flex w-full">
        <TabView className="w-full">
          <TabPanel header="Overview">
            <HAOverview />
          </TabPanel>
          <TabPanel header="All HA Projects">
            <HAList />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default observer(HADash);
