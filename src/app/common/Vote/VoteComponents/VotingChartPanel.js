import ReactECharts from "echarts-for-react";
import React from "react";

const VotingChartPanel = ({ votes }) => {
  let option = {
    grid: {
      left: "3%",
      right: "3%",
      bottom: "0%",
      containLabel: false,
    },
    xAxis: {
      type: "value",
      show: false,
    },
    yAxis: {
      type: "category",
      data: ["Votes"],
      show: false,
    },

    series: [
      {
        name: "Positive",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        itemStyle: {
          color: "#76D7C4",
        },
        data: [votes.Positive],
      },
      {
        name: "Neutral",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        itemStyle: {
          color: "#F7DC6F",
        },
        data: [votes.Neutral],
      },
      {
        name: "Negative",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        itemStyle: {
          color: "#F1948A",
        },
        data: [votes.Negative],
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      // onEvents={onEvents}
      style={{ height: "6rem", width: "10rem" }}
    />
  );
};

export default VotingChartPanel;
