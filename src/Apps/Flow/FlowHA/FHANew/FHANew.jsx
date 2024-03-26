import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Loading from "../../../../Library/Loading/Loading";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../RootStore";
import { appColors } from "../../../../constants/colors";
import { HAIcon } from "../../icons/HAIcon";
import FHANewBaseHitData from "./components/FHANewBaseHitData/FHANewBaseHitData";
import FHaNewHitPicker from "./components/FHaNewHitPicker/FHaNewHitPicker";

const FHANew = () => {
  const [searchParams] = useSearchParams();
  const encodedData = searchParams.get("data");
  let decodedData = null;
  if (encodedData) {
    const decodedDataString = atob(encodedData);
    decodedData = JSON.parse(decodedDataString);
  }
  const [baseHitData, setBaseHitData] = useState(decodedData);

  console.log("FHANew -> baseHitData", baseHitData);

  // make sure screen and hits are prefetched

  const rootStore = useContext(RootStoreContext);
  const {
    fetchScreens,
    isScreenListCacheValid,
    screenList,
    isFetchingScreens,
  } = rootStore.screenStore;

  useEffect(() => {
    if (!isScreenListCacheValid) {
      fetchScreens();
    }
  }, [isScreenListCacheValid, fetchScreens]);

  if (isFetchingScreens) {
    return <Loading message="Fetching screens and hits..." />;
  }

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500 gap-1">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<HAIcon size={"25em"} />}
          heading="New Hit Assessment"
          color={appColors.sectionHeadingBg.ha}
          displayHorizon={false}
        />
      </div>
      <div className="flex w-full m-2">
        {baseHitData == null ? (
          <FHaNewHitPicker
            baseHitData={baseHitData}
            setBaseHitData={setBaseHitData}
          />
        ) : (
          <FHANewBaseHitData baseHitData={baseHitData} />
        )}
      </div>
    </div>
  );
};

export default observer(FHANew);
