import ReactECharts from "echarts-for-react";
import { observer } from "mobx-react-lite";
import { InputSwitch } from "primereact/inputswitch";
import { Slider } from "primereact/slider";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";
import { chartOption, formatChartSeries } from "./FTDTargetMapHelper";

const FTDTargetMap = () => {
  const [likeScoreCutoff, setLikeScoreCutoff] = useState(0.02);
  const [impactScoreCutoff, setImpactScoreCutoff] = useState(0.02);
  const [showLabel, setShowLabel] = useState(true);

  const rootStore = useContext(RootStoreContext);
  const { isFetchingTargets, targetList } = rootStore.targetStore;

  const navigate = useNavigate();

  if (isFetchingTargets) {
    return <Loading message={"Fetching Targets..."} />;
  }

  // Configure options for the chart
  let option = { ...chartOption };

  var targetData = [];
  var screenData = [];
  var haData = [];
  var portfolioData = [];
  var postPortfolioData = [];

  targetList.forEach((element) => {
    console.log("FTDTargetMap -> target", element);

    if (
      element.likeScore >= likeScoreCutoff &&
      element.impactScore >= impactScoreCutoff
    ) {
      targetData.push([
        element.likeScore,
        element.impactScore,
        element.id,
        element.name,
        element.type,
        element.bucket,
        element.currentStage,
      ]);
    }
  });

  option.series = formatChartSeries(
    targetData,
    screenData,
    haData,
    portfolioData,
    postPortfolioData,
    true
  );

  // Function to handle chart click events
  let onChartClick = (params) => {
    console.log("FTDTargetMap -> params", params.data[2]);
    navigate(`/wf/target/viewer/${params.data[2]}`);
  };
  // Attach click event listener to the chart
  let onEvents = {
    click: onChartClick,
  };

  return (
    <div className="flex flex-column w-full border-0">
      <div className="flex">
        <ReactECharts
          option={option}
          onEvents={onEvents}
          //className="w-full min-h-full"
          style={{ width: "600px", height: "600px" }}
        />
      </div>
      <div className="flex flex-column pl-5 pr-5 border-0">
        <div className="flex h-3rem">
          <h4>
            <i className="icon icon-common icon-filter" /> Filters
          </h4>
        </div>
        <div className="flex w-full align-content-center h-2rem column-gap-5">
          <div className="flex w-6 align-items-center ">
            <h5>Likelihood Score: {likeScoreCutoff}</h5>
          </div>
          <div className="flex w-full align-items-center">
            <Slider
              className="w-full"
              min={0}
              max={1}
              step={0.01}
              value={likeScoreCutoff}
              onChange={(e) => setLikeScoreCutoff(e.value)}
            />
          </div>
        </div>

        <div className="flex w-full align-content-center h-2rem column-gap-5">
          <div className="flex w-6 align-items-center">
            <h5>Biological Impact Score: {impactScoreCutoff}</h5>
          </div>
          <div className="flex w-full align-items-center">
            <Slider
              className="w-full"
              min={0}
              max={1}
              step={0.01}
              value={impactScoreCutoff}
              onChange={(e) => setImpactScoreCutoff(e.value)}
            />
          </div>
        </div>

        <div className="flex w-full align-content-center h-2rem column-gap-5 pb-2">
          <div className="flex w-6 align-items-center">
            <h5>Display Target Label: </h5>
          </div>
          <div className="flex w-full align-items-center">
            <InputSwitch
              className="p-button-sm"
              checked={showLabel}
              onChange={() => setShowLabel(showLabel ? false : true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(FTDTargetMap);
