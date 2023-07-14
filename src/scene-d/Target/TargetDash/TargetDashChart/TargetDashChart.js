import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { observer } from "mobx-react-lite";
import { InputSwitch } from "primereact/inputswitch";
import { Slider } from "primereact/slider";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../app/stores/rootStore";
import { appColors } from "../../../../colors";

const TargetDashChart = () => {
  const navigate = useNavigate();

  // Get the root store using the RootStoreContext
  const rootStore = useContext(RootStoreContext);
  const { loadingTargetDash, targetDash, loadTargetDash } =
    rootStore.dataViewStore;

  // Load target dash data when the component mounts
  useEffect(() => {
    if (targetDash === null) loadTargetDash();
  }, [targetDash, loadTargetDash]); // eslint-disable-line react-hooks/exhaustive-deps

  // State for filter values and label visibility
  const [likeScoreCutoff, setLikeScoreCutoff] = useState(0.02);
  const [impactScoreCutoff, setImpactScoreCutoff] = useState(0.02);
  const [showLabel, setShowLabel] = useState(true);

  // Render loading indicator if data is being loaded
  if (loadingTargetDash) {
    return <Loading />;
  }

  // Prepare data and options for the chart
  let nodeColors = {
    target: appColors.horizonText.target,
    screen: appColors.horizonText.screen,
    ha: appColors.horizonText.ha,
    portfolio: appColors.horizonText.portfolio,
    postPortfolio: appColors.horizonText.postPortfolio,
  };

  // Function to generate a color gradient
  let ColorLuminance = (hex, lum) => {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    // convert to decimal and change luminosity
    var rgb = "#",
      c,
      i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
    }
    return rgb;
  };

  // Function to generate a gradient for the chart
  let generateGradient = (color) => {
    return new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
      {
        offset: 0,
        color: ColorLuminance(color, 0.5),
      },
      {
        offset: 1,
        color: color,
      },
    ]);
  };

  // Prepare data arrays for different stages
  var targetData = [];
  var screenData = [];
  var haData = [];
  var portfolioData = [];
  var postPortfolioData = [];

  // Filter and populate data arrays based on cutoff values
  if (!loadingTargetDash && targetDash !== null) {
    targetDash.forEach((element) => {
      if (
        element.likeScore >= likeScoreCutoff &&
        element.impactScore >= impactScoreCutoff
      ) {
        if (element.currentStage === "Target") {
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
        if (element.currentStage === "Screen") {
          screenData.push([
            element.likeScore,
            element.impactScore,
            element.id,
            element.name,
            element.type,
            element.bucket,
            element.currentStage,
          ]);
        }
        if (element.currentStage === "HA") {
          haData.push([
            element.likeScore,
            element.impactScore,
            element.id,
            element.name,
            element.type,
            element.bucket,
            element.currentStage,
          ]);
        }
        if (element.currentStage === "Portfolio") {
          portfolioData.push([
            element.likeScore,
            element.impactScore,
            element.id,
            element.name,
            element.type,
            element.bucket,
            element.currentStage,
          ]);
        }
        if (element.currentStage === "PostPortfolio") {
          postPortfolioData.push([
            element.likeScore,
            element.impactScore,
            element.id,
            element.name,
            element.type,
            element.bucket,
            element.currentStage,
          ]);
        }
      }
    });

    // Configure options for the chart
    let option = {
      backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [
        {
          offset: 0,
          color: "#fff",
        },
        {
          offset: 1,
          color: "#eee",
        },
      ]),
      title: {
        text: "Target Map",
        left: "5%",
        top: "3%",
      },
      legend: {
        right: "10%",
        top: "3%",
        data: ["Target", "Screen", "HA", "Portfolio", "PostPortfolio"],
      },
      grid: {
        left: "9%",
        top: "10%",
      },
      xAxis: {
        min: 0,
        max: 1,
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
          },
        },
        splitNumber: 10,
        name: "Likelihood",
        nameLocation: "center",
        nameGap: 30,
      },
      yAxis: {
        min: 0,
        max: 1,
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
          },
        },
        splitNumber: 10,
        name: "Biological Impact",
        nameLocation: "center",
        nameGap: 30,
      },
      series: [
        {
          name: "Target",
          data: targetData,
          type: "scatter",
          label: {
            formatter: function (param) {
              return param.data[3];
            },
            position: "top",
            show: showLabel,
            fontSize: 12,
          },
          emphasis: {
            focus: "series",
            label: {
              show: true,
              formatter: function (param) {
                return param.data[3];
              },
              position: "top",
            },
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: nodeColors.target,
            shadowOffsetY: 5,
            color: generateGradient(nodeColors.target),
          },
        },
        {
          name: "Screen",
          data: screenData,
          type: "scatter",
          label: {
            formatter: function (param) {
              return param.data[3];
            },
            position: "top",
            show: showLabel,
            fontSize: 12,
          },

          emphasis: {
            focus: "series",
            label: {
              show: true,
              formatter: function (param) {
                return param.data[3];
              },
              position: "top",
            },
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: nodeColors.screen,
            shadowOffsetY: 5,
            color: generateGradient(nodeColors.screen),
          },
        },
        {
          name: "HA",
          data: haData,
          type: "scatter",
          label: {
            formatter: function (param) {
              return param.data[3];
            },
            position: "top",
            show: showLabel,
            fontSize: 12,
          },
          emphasis: {
            focus: "series",
            label: {
              show: true,
              formatter: function (param) {
                return param.data[3];
              },
              position: "top",
            },
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: nodeColors.ha,
            shadowOffsetY: 5,
            color: generateGradient(nodeColors.ha),
          },
        },
        {
          name: "Portfolio",
          data: portfolioData,
          type: "scatter",
          label: {
            formatter: function (param) {
              return param.data[3];
            },
            position: "top",
            show: showLabel,
            fontSize: 12,
          },
          emphasis: {
            focus: "series",
            label: {
              show: true,
              formatter: function (param) {
                return param.data[3];
              },
              position: "top",
            },
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: nodeColors.portfolio,
            shadowOffsetY: 5,
            color: generateGradient(nodeColors.portfolio),
          },
        },
        {
          name: "PostPortfolio",
          data: postPortfolioData,
          type: "scatter",
          label: {
            formatter: function (param) {
              return param.data[3];
            },
            position: "top",
            show: showLabel,
            fontSize: 12,
          },
          emphasis: {
            focus: "series",
            label: {
              show: true,
              formatter: function (param) {
                return param.data[3];
              },
              position: "top",
            },
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: nodeColors.postPortfolio,
            shadowOffsetY: 5,
            color: generateGradient(nodeColors.postPortfolio),
          },
        },
      ],
    };

    // Function to handle chart click events
    let onChartClick = (params) => {
      navigate(params.data[2]);
    };

    // Attach click event listener to the chart
    let onEvents = {
      click: onChartClick,
    };

    // Render the TargetDashChart component
    return (
      <React.Fragment>
        <div className="flex flex-column w-full">
          <div
            className="flex"
            style={{ height: "650px", width: "650px", marginTop: "0px" }}
          >
            <ReactECharts
              option={option}
              onEvents={onEvents}
              style={{ height: "650px", width: "650px" }}
            />
          </div>
          <div className="flex flex-column pl-5 pr-5">
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

            <div className="flex w-full align-content-center h-2rem column-gap-5">
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
      </React.Fragment>
    );
  }

  // Render "Wait.." message while data is being loaded
  return <h2>Wait..</h2>;
};

// Wrap the TargetDashChart component with the MobX observer to automatically re-render on store updates
export default observer(TargetDashChart);
