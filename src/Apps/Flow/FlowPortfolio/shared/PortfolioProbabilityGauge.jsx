import ReactECharts from "echarts-for-react";
import React from "react";

const PortfolioProbabilityGauge = ({ probability }) => {
  let value = 0;

  if (probability === "Low") {
    value = 0.17;
  } else if (probability === "Medium") {
    value = 0.5;
  } else if (probability === "High") {
    value = 0.83;
  }

  let option = {
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        center: ["50%", "50%"],
        radius: "90%",
        min: 0,
        max: 1,
        splitNumber: 6,
        axisLine: {
          lineStyle: {
            width: 3,
            color: [
              [0.34, "#5a72a5"],
              [0.67, "#DCB14E"],
              [1, "#D86D6F"],
            ],
          },
        },
        pointer: {
          icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
          length: "12%",
          width: 20,
          offsetCenter: [0, "-60%"],
          itemStyle: {
            color: "auto",
          },
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: "auto",
            width: 1,
          },
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: "auto",
            width: 3,
          },
        },
        axisLabel: {
          color: "#464646",
          fontSize: 20,
          distance: -50,
          rotate: "tangential",
          formatter: function (value) {
            let value2 = value.toFixed(2);

            // Uncomment to show axis labels
            // if (value2 == 0.17) {
            //   return "Low";
            // } else if (value2 == 0.5) {
            //   return "Medium";
            // } else if (value2 == 0.83) {
            //   return "High";
            // }
            return "";
          },
        },
        title: {
          offsetCenter: [0, "-10%"],
          fontSize: 15,
        },
        detail: {
          fontSize: 20,
          offsetCenter: [0, "-35%"],
          valueAnimation: true,
          formatter: function (value) {
            if (value == 0.17) {
              return "Low";
            } else if (value == 0.5) {
              return "Medium";
            } else if (value == 0.83) {
              return "High";
            }
          },
          color: "inherit",
        },
        data: [
          {
            value: value,
            name: "Probability",
          },
        ],
      },
    ],
  };
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: "10rem", width: "18rem" }}
    >
      <ReactECharts
        option={option}
        style={{ height: "18rem", width: "18rem" }}
      />
    </div>
  );
};

export default PortfolioProbabilityGauge;
