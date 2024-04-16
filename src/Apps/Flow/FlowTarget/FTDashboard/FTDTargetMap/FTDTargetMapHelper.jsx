import * as echarts from "echarts";
import { appColors } from "../../../../../constants/colors";

let nodeColors = {
  target: appColors.horizonText.target,
  screen: appColors.horizonText.screen,
  ha: appColors.horizonText.ha,
  portfolio: appColors.horizonText.portfolio,
  postPortfolio: appColors.horizonText.postPortfolio,
};

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

export const chartOption = {
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
};

export const formatChartSeries = (
  targetData,
  screenData,
  haData,
  portfolioData,
  postPortfolioData,
  showLabel
) => {
  return [
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
  ];
};
