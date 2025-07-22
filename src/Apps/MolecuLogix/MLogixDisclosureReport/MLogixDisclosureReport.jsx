import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { appColors } from "../../../constants/colors";
import Loading from "../../../Library/Loading/Loading";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../RootStore";
import { DiscloseIcon } from "../Icons/DiscloseIcon";
import MDRTable from "./components/MDRTable";
import MLDRSideBar from "./components/MLDRSideBar";

const MLogixDisclosureReport = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    getRecentDisclosures,
    isFetchingRecentDisclosures,
    recentDisclosures,
  } = rootStore.moleculeStore;

  const today = new Date();
  const dateFromDefault = new Date(today);
  dateFromDefault.setDate(today.getDate() - 30);

  const [dateFrom, setDateFrom] = useState(dateFromDefault);
  const [dateTo, setDateTo] = useState(today);
  const [orgSelectionKeys, setOrgSelectionKeys] = useState({});

  // Fetch data when date changes
  useEffect(() => {
    getRecentDisclosures({ dateFrom, dateTo });
  }, [getRecentDisclosures, dateFrom, dateTo]);

  const allDisclosures = Array.from(recentDisclosures?.values?.() || []);

  // Extract selected org IDs
  const selectedOrgIds = Object.entries(orgSelectionKeys)
    .filter(([_, val]) => val.checked)
    .map(([key]) => key);

  // Filter disclosures
  const filteredDisclosures =
    selectedOrgIds.length > 0
      ? allDisclosures.filter((item) =>
          selectedOrgIds.includes(item.disclosureOrgId)
        )
      : allDisclosures;

  if (isFetchingRecentDisclosures) {
    return <Loading message={"Fetching Recent Disclosures..."} />;
  }

  return (
    <div className="flex flex-column w-full gap-2">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<DiscloseIcon size={"25em"} />}
          heading={"Disclosure Report"}
          displayHorizon={false}
          color={appColors.molecuLogix.disclose}
        />
      </div>
      <div className="flex w-full border-0 gap-2">
        <div className="flex w-2 border-0 m-2">
          <MLDRSideBar
            dateFrom={dateFrom}
            dateTo={dateTo}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
            data={allDisclosures}
            orgSelectionKeys={orgSelectionKeys}
            setOrgSelectionKeys={setOrgSelectionKeys}
            getRecentDisclosures={getRecentDisclosures}
          />
        </div>
        <div className="flex w-10 border-0 m-2">
          <MDRTable
            data={filteredDisclosures}
            isFetchingRecentDisclosures={isFetchingRecentDisclosures}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(MLogixDisclosureReport);
