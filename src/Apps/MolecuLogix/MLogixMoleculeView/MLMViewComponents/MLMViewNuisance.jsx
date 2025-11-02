import _ from "lodash";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Dialog } from "primereact/dialog";
import { Fieldset } from "primereact/fieldset";
import { Tag } from "primereact/tag";
import React from "react";
import FDate from "../../../../Library/FDate/FDate";
import { ML_GENERATED_TOOLTIP } from "../../../../constants/strings";
import MLMViewNuisanceExplainer from "./MLMViewNuisanceExplainer";

const MLMViewNuisance = ({ selectedMolecule }) => {
  const [nuisanceExplainerModalVisible, setNuisanceExplainerModalVisible] =
    React.useState(false);

  let painsFlags = [
    {
      name: "RDKit Pains Flag",
      value: selectedMolecule?.pains?.rdKitPains,
    },
  ];

  let painsLabel = [
    {
      name: "RDKit Pains Label",
      value: selectedMolecule?.pains?.rdKitPainsLabels?.join(", "),
    },
  ];

  let boolValueTemplate = (rowData) => {
    if (rowData.value === true) {
      return <Tag severity="danger" value="True"></Tag>;
    }
    return <Tag severity="success" value="False"></Tag>;
  };

  const renderLabelBoxes = (modelPred) => {
    const labels = [
      "Aggregator",
      "LuciferaseInhibitor",
      "Reactive",
      "Promiscuous",
    ];

    return (
      <div className="flex flex-wrap gap-2 justify-content-center mt-3">
        {labels.map((label) => {
          const score = modelPred?.[`score${label}`] || 0;
          const isPositive = modelPred?.[`label${label}`] === 1;

          // White → Pale Amber → Deep Orange as score increases
          const getAmberShade = (val) => {
            const r = Math.round(255);
            const g = Math.round(255 - val * 120); // from 248 → 128
            const b = Math.round(255 - val * 180); // from 225 → 45
            return `rgb(${r}, ${g}, ${b})`;
          };

          return (
            <div
              key={label}
              className="p-3 border-round-md text-sm font-medium text-center shadow-1"
              style={{
                width: "10rem",
                backgroundColor: getAmberShade(score),
                color: score > 0.5 ? "#4a2c00" : "#3e2723",
                border: isPositive ? "3px solid #3e2723" : "0px solid #ddd",
              }}
            >
              {_.startCase(label)}
              <div className="mt-2 text-xs">Score: {score.toFixed(3)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRadarChart = (modelPred) => {
    const labels = [
      "Aggregator",
      "LuciferaseInhibitor",
      "Reactive",
      "Promiscuous",
    ];
    const scores = labels.map((label) => modelPred?.[`score${label}`] || 0);

    return (
      <Chart
        type="radar"
        data={{
          labels,
          datasets: [
            {
              label: "Prediction Scores",
              data: scores,
              fill: true,
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              pointBackgroundColor: "#3b82f6",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            r: {
              min: 0,
              max: 1,
              ticks: { stepSize: 0.2 },
            },
          },
        }}
        className="w-full md:w-30rem"
      />
    );
  };

  if (selectedMolecule?.predictions?.nuisanceRequestStatus === 0) {
    return (
      <div className="flex pt-2 w-full">
        <Fieldset
          className="m-0 flex-grow-1 w-full"
          legend="AI/ML NUISANCE PREDICTIONS"
        >
          <div className="flex flex-column w-full gap-2">
            The nuisance predictions are still being processed. Please check
            back later.
          </div>
        </Fieldset>
      </div>
    );
  }

  return (
    <div className="flex pt-2 w-full">
      <Fieldset
        className="m-0 flex-grow-1 w-full"
        legend="AI/ML NUISANCE PREDICTIONS"
      >
        <div className="flex flex-column w-full gap-2">
          <div className="flex align-items-center justify-content-center">
            {renderLabelBoxes(
              selectedMolecule?.predictions?.nuisanceModelPredictions[0]
            )}
          </div>
          <div className="flex align-items-center justify-content-center">
            {renderRadarChart(
              selectedMolecule?.predictions?.nuisanceModelPredictions[0]
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex flex-column w-9 gap-2">
              <div className="flex">
                Prediction Date :{" "}
                <FDate
                  timestamp={
                    selectedMolecule?.predictions?.nuisanceModelPredictions[0]
                      ?.predictionDate
                  }
                />
              </div>
              <div className="flex text-sm">
                Model Name :
                {
                  selectedMolecule?.predictions?.nuisanceModelPredictions[0]
                    ?.modelName
                }
              </div>
              <div className="flex text-sm">{ML_GENERATED_TOOLTIP}</div>
            </div>
            <div className="flex m-4">
              <Button
                label="Deep Dive"
                severity="secondary"
                size="small"
                outlined
                onClick={() => {
                  // Open modal with more explanation
                  setNuisanceExplainerModalVisible(true);
                }}
              />
            </div>
          </div>
        </div>
      </Fieldset>
      <Dialog
        header="Nuisance Prediction Explanation (Beta)"
        visible={nuisanceExplainerModalVisible}
        onHide={() => {
          if (!nuisanceExplainerModalVisible) return;
          setNuisanceExplainerModalVisible(false);
        }}
      >
        <MLMViewNuisanceExplainer selectedMolecule={selectedMolecule} />
      </Dialog>
    </div>
  );
};

export default MLMViewNuisance;
