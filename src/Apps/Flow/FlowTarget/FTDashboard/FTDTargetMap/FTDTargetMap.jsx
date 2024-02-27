import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import React from "react";

const FTDTargetMap = () => {
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
    </div>
  );
};

export default FTDTargetMap;
