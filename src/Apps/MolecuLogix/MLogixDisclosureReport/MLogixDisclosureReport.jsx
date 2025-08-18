import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { FcHeatMap } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router-dom";
import { appColors } from "../../../constants/colors";
import Loading from "../../../Library/Loading/Loading";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../RootStore";
import MDRTable from "./components/MDRTable";
import MLDRSideBar from "./components/MLDRSideBar";

const MLogixDisclosureReport = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    getRecentDisclosures,
    isFetchingRecentDisclosures,
    recentDisclosures,
  } = rootStore.moleculeStore;

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const urlStartDate = queryParams.get("startDate");
  const urlEndDate = queryParams.get("endDate");

  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState(
    urlStartDate ? new Date(urlStartDate) : defaultStart
  );
  const [endDate, setEndDate] = useState(
    urlEndDate ? new Date(urlEndDate) : today
  );

  const [orgSelectionKeys, setOrgSelectionKeys] = useState({});

  // Sync URL when dates change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("startDate", startDate?.toISOString());
    params.set("endDate", endDate?.toISOString());
    navigate({ search: params.toString() }, { replace: true });

    // Fetch fresh data from the server (no cache assumption)
    //getRecentDisclosures({ startDate, endDate });
  }, [startDate, endDate, navigate, getRecentDisclosures]);

  const allDisclosures = Array.from(recentDisclosures?.values?.() || []);

  const selectedOrgIds = Object.entries(orgSelectionKeys)
    .filter(([_, val]) => val.checked)
    .map(([key]) => key);

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
          svgIcon={<FcHeatMap />}
          heading={"Disclosure Report"}
          displayHorizon={false}
          color={appColors.molecuLogix.disclose}
        />
      </div>
      <div className="flex w-full border-0 gap-2">
        <div className="flex w-2 border-0 m-2">
          <MLDRSideBar
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            data={allDisclosures}
            orgSelectionKeys={orgSelectionKeys}
            setOrgSelectionKeys={setOrgSelectionKeys}
            getRecentDisclosures={() =>
              getRecentDisclosures({ startDate, endDate })
            }
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
