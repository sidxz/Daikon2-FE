import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";
import { TargetIcon } from "../../../icons/TargetIcon";

const FTApprovalDash = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchTQUnverified,
    isFetchingTQList,
    isTQUnVerifiedCacheValid,
    TQUnapproved,
  } = rootStore.targetPQStore;

  const navigate = useNavigate();

  useEffect(() => {
    if (!isTQUnVerifiedCacheValid) {
      fetchTQUnverified();
    }
  }, [fetchTQUnverified, isTQUnVerifiedCacheValid]);

  if (isFetchingTQList) {
    return <Loading message={"Fetching Targets..."} />;
  }

  console.log("FTApproval -> TQUnapproved", TQUnapproved);

  // construct the list of questionnaires
  const qListElements = TQUnapproved?.map((q) => {
    return (
      <div key={q.id} className="flex border-round-md w-9">
        <Card title={q.requestedTargetName} className="w-full">
          <div className="flex flex-column gap-2 justify-between">
            <div className="flex">
              <p className="m-2">The Target has been submitted for review </p>
            </div>
            <div className="flex">
              {" "}
              <Button
                label="Edit"
                onClick={() => navigate("./" + q.id)}
                className="w-10"
              />
            </div>
          </div>
        </Card>
      </div>
    );
  });

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<TargetIcon size={"25em"} />}
          heading="Targets Awaiting Approval"
          color={appColors.sectionHeadingBg.target}
          displayHorizon={false}
        />
      </div>
      <div className="flex w-full bg-gray-50 p-2 gap-2">
        <div className="flex border-round-md gap-2">{qListElements}</div>
      </div>
    </div>
  );
};

export default observer(FTApprovalDash);
