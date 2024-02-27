import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { InputSwitch } from "primereact/inputswitch";
import { Slider } from "primereact/slider";
import React, { useState } from "react";

const FTDTargetMap = () => {
  const [likeScoreCutoff, setLikeScoreCutoff] = useState(0.02);
  const [impactScoreCutoff, setImpactScoreCutoff] = useState(0.02);
  const [showLabel, setShowLabel] = useState(true);
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

    legend: {
      right: "7%",
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
        type: "scatter",
        label: {
          position: "top",

          fontSize: 12,
        },
        emphasis: {
          focus: "series",
          label: {
            position: "top",
          },
        },
        itemStyle: {
          shadowBlur: 10,

          shadowOffsetY: 5,
        },
      },
      {
        name: "Screen",
        type: "scatter",
        label: {
          position: "top",

          fontSize: 12,
        },

        emphasis: {
          focus: "series",
          label: {
            position: "top",
          },
        },
        itemStyle: {
          shadowBlur: 10,

          shadowOffsetY: 5,
        },
      },
      {
        name: "HA",
        type: "scatter",
        label: {
          position: "top",

          fontSize: 12,
        },
        emphasis: {
          focus: "series",
          label: {
            position: "top",
          },
        },
        itemStyle: {
          shadowBlur: 10,

          shadowOffsetY: 5,
        },
      },
      {
        name: "Portfolio",
        type: "scatter",
        label: {
          position: "top",

          fontSize: 12,
        },
        emphasis: {
          focus: "series",
          label: {
            position: "top",
          },
        },
        itemStyle: {
          shadowBlur: 10,

          shadowOffsetY: 5,
        },
      },
      {
        name: "PostPortfolio",
        type: "scatter",
        label: {
          position: "top",

          fontSize: 12,
        },
        emphasis: {
          focus: "series",
          label: {
            position: "top",
          },
        },
        itemStyle: {
          shadowBlur: 10,

          shadowOffsetY: 5,
        },
      },
    ],
  };
  return (
    <div className="flex flex-column w-full">
      <div
        className="flex"
        style={{ height: "650px", width: "650px", marginTop: "0px" }}
      >
        <ReactECharts
          option={option}
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
              value={0.02}
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
  );
};

export default FTDTargetMap;
