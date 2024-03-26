import { Tooltip } from "primereact/tooltip";
import React from "react";

import PleaseWait from "../../../../../../Library/PleaseWait/PleaseWait";
import "./FTVScorecardGrid.css";

// Component to display the FTVScorecardGrid
const FTVScorecardGrid = ({ questions, selectedTQ }) => {
  let answers = {};

  // Check if questions or target data is not available
  if (questions.size === 0 || selectedTQ === null) {
    return <PleaseWait />;
  }
  // Iterate over targetScoreCardValues
  selectedTQ.response.forEach((ans) => {
    // Set appropriate answer color based on the answer value
    if (ans.item2 === "ACTIVE" || ans.item2 === "YES") {
      answers[ans.item1] = "greenCell";
    }
    if (ans.item2 === "INACTIVE" || ans.item2 === "NO") {
      answers[ans.item1] = "redCell";
    }
    if (ans.item2 === "UNKNOWN" || ans.item2 === "NA") {
      answers[ans.item1] = "grayCell";
    }

    if (ans.item2 === "HIGH") {
      answers[ans.item1] = "darkGreenCell";
    }

    if (ans.item2 === "MEDIUM") {
      answers[ans.item1] = "yellowCell";
    }

    if (ans.item2 === "LOW") {
      answers[ans.item1] = "darkRedCell";
    }

    /* Exceptions */
    if (ans.item1 === "5A1" || ans.item1 === "5A3") {
      if (ans.item2 === "YES") {
        answers[ans.item1] = "redCell";
      }
      if (ans.item2 === "NO") {
        answers[ans.item1] = "greenCell";
      }
    }
  });

  return (
    <div className="targetGrid">
      {/* Tooltip component */}
      <Tooltip target=".questionTooltip" />
      <table>
        <tbody>
          <tr>
            <td rowSpan="9" className="verticalText">
              <span>Biological Impact</span>
            </td>
          </tr>
          <tr>
            <td rowSpan="3" style={{ maxWidth: "200px" }}>
              <span>Impact of Chemical inhibition</span>
            </td>
            <td>During infections</td>
            <td>
              <b>2A</b>
            </td>
            <td></td>

            <td
              className={"questionTooltip " + answers["2A1"]}
              data-pr-tooltip={questions.get("2A1")?.questionBody}
              data-pr-position="left"
            >
              2A1
            </td>

            <td
              className={"questionTooltip " + answers["2A1B"]}
              data-pr-tooltip={questions.get("2A1B")?.questionBody}
              data-pr-position="left"
            >
              2A1B
            </td>
            <td
              className={"questionTooltip " + answers["2A2"]}
              data-pr-tooltip={questions.get("2A2")?.questionBody}
              data-pr-position="left"
            >
              2A2
            </td>

            <td
              className={"questionTooltip " + answers["2A3B"]}
              data-pr-tooltip={questions.get("2A3B")?.questionBody}
              data-pr-position="left"
            >
              2A3B
            </td>
            <td
              className={"questionTooltip " + answers["2A4A"]}
              data-pr-tooltip={questions.get("2A4A")?.questionBody}
              data-pr-position="left"
            >
              2A4A
            </td>
            <td
              className={"questionTooltip " + answers["2A4B"]}
              data-pr-tooltip={questions.get("2A4B")?.questionBody}
              data-pr-position="left"
            >
              2A4B
            </td>
            <td
              className={"questionTooltip " + answers["2A5"]}
              data-pr-tooltip={questions.get("2A5")?.questionBody}
              data-pr-position="left"
            >
              2A5
            </td>
          </tr>
          {/* Rest of the table rows */}
          <tr>
            <td>On replicating Mtb in vitro</td>
            <td>
              <b>2B</b>
            </td>
            <td></td>
            <td
              className={"questionTooltip " + answers["2B1"]}
              data-pr-tooltip={questions.get("2B1")?.questionBody}
              data-pr-position="left"
            >
              2B1
            </td>
            <td
              className={"questionTooltip " + answers["2B2"]}
              data-pr-tooltip={questions.get("2B2")?.questionBody}
              data-pr-position="left"
            >
              2B2
            </td>
            <td
              className={"questionTooltip " + answers["2B4"]}
              data-pr-tooltip={questions.get("2B4")?.questionBody}
              data-pr-position="left"
            >
              2B4
            </td>
            <td colSpan="5">&nbsp;</td>
          </tr>
          <tr>
            <td>On non replicating Mtb in vitro</td>
            <td>
              <b>2C</b>
            </td>
            <td></td>

            <td
              className={"questionTooltip " + answers["2C3"]}
              data-pr-tooltip={questions.get("2C3")?.questionBody}
              data-pr-position="left"
            >
              2C3
            </td>

            <td
              className={"questionTooltip " + answers["2C5"]}
              data-pr-tooltip={questions.get("2C5")?.questionBody}
              data-pr-position="left"
            >
              2C5
            </td>
            <td colSpan="6">&nbsp;</td>
          </tr>
          <tr>
            <td colSpan="2">
              Chemical inhibition-evidence for on target activity
            </td>

            <td>
              <b>3</b>
            </td>
            <td></td>
            <td
              className={"questionTooltip " + answers["3A1"]}
              data-pr-tooltip={questions.get("3A1")?.questionBody}
              data-pr-position="left"
            >
              3A1
            </td>
            <td
              className={"questionTooltip " + answers["3A2"]}
              data-pr-tooltip={questions.get("3A2")?.questionBody}
              data-pr-position="left"
            >
              3A2
            </td>
            <td
              className={"questionTooltip " + answers["3A3"]}
              data-pr-tooltip={questions.get("3A3")?.questionBody}
              data-pr-position="left"
            >
              3A3
            </td>
            <td
              className={"questionTooltip " + answers["3A4"]}
              data-pr-tooltip={questions.get("3A4")?.questionBody}
              data-pr-position="left"
            >
              3A4
            </td>
            <td
              className={"questionTooltip " + answers["3B1"]}
              data-pr-tooltip={questions.get("3B1")?.questionBody}
              data-pr-position="left"
            >
              3B1
            </td>
            <td
              className={"questionTooltip " + answers["3B2"]}
              data-pr-tooltip={questions.get("3B2")?.questionBody}
              data-pr-position="left"
            >
              3B2
            </td>
            <td colSpan="2">&nbsp;</td>
          </tr>
          <tr>
            <td rowSpan="3" style={{ maxWidth: "200px" }}>
              {" "}
              <span>Impact of Genetic inhibition</span>
            </td>
            <td>During infections</td>
            <td>
              <b>4A</b>
            </td>
            <td></td>

            <td
              className={"questionTooltip " + answers["4A3A"]}
              data-pr-tooltip={questions.get("4A3A")?.questionBody}
              data-pr-position="left"
            >
              4A3A
            </td>
            <td
              className={"questionTooltip " + answers["4A3B"]}
              data-pr-tooltip={questions.get("4A3B")?.questionBody}
              data-pr-position="left"
            >
              4A3B
            </td>
            <td
              className={"questionTooltip " + answers["4A4"]}
              data-pr-tooltip={questions.get("4A4")?.questionBody}
              data-pr-position="left"
            >
              4A4
            </td>
            <td colSpan="5">&nbsp;</td>
          </tr>
          <tr></tr>
          <tr>
            <td>On non replicating Mtb in vitro</td>
            <td>
              <b>4C</b>
            </td>
            <td></td>

            <td
              className={"questionTooltip " + answers["4C3"]}
              data-pr-tooltip={questions.get("4C3")?.questionBody}
              data-pr-position="left"
            >
              4C3
            </td>

            <td
              className={"questionTooltip " + answers["4C5"]}
              data-pr-tooltip={questions.get("4C5")?.questionBody}
              data-pr-position="left"
            >
              4C5
            </td>
            <td colSpan="6">&nbsp;</td>
          </tr>
          <tr>
            <td colSpan="2">Liabilities</td>
            <td>
              <b>5</b>
            </td>
            <td></td>
            <td
              className={"questionTooltip " + answers["5A1"]}
              data-pr-tooltip={questions.get("5A1")?.questionBody}
              data-pr-position="left"
            >
              5A1
            </td>
            <td
              className={"questionTooltip " + answers["5A2"]}
              data-pr-tooltip={questions.get("5A2")?.questionBody}
              data-pr-position="left"
            >
              5A2
            </td>
            <td
              className={"questionTooltip " + answers["5A3"]}
              data-pr-tooltip={questions.get("5A3")?.questionBody}
              data-pr-position="left"
            >
              5A3
            </td>
            <td
              className={"questionTooltip " + answers["5B1"]}
              data-pr-tooltip={questions.get("5B1")?.questionBody}
              data-pr-position="left"
            >
              5B1
            </td>
            <td colSpan="4">&nbsp;</td>
          </tr>
          <tr>
            <td rowSpan="12" className="verticalText">
              <span>Likelihood</span>
            </td>
          </tr>
          <tr>
            <td rowSpan="11" style={{ maxWidth: "200px" }}>
              {" "}
              <span>Tractability</span>
            </td>
            <td rowSpan="2">High throughput screening feasibility</td>
            <td rowSpan="2">
              <b>6A</b>
            </td>
            <td></td>
            <td
              className={"questionTooltip " + answers["6A1"]}
              data-pr-tooltip={questions.get("6A1")?.questionBody}
              data-pr-position="left"
            >
              6A1
            </td>
            <td
              className={"questionTooltip " + answers["6A2"]}
              data-pr-tooltip={questions.get("6A2")?.questionBody}
              data-pr-position="left"
            >
              6A2
            </td>
            <td
              className={"questionTooltip " + answers["6A3"]}
              data-pr-tooltip={questions.get("6A3")?.questionBody}
              data-pr-position="left"
            >
              6A3
            </td>
            <td
              className={"questionTooltip " + answers["6A4"]}
              data-pr-tooltip={questions.get("6A4")?.questionBody}
              data-pr-position="left"
            >
              6A4
            </td>
            <td
              className={"questionTooltip " + answers["6A4A"]}
              data-pr-tooltip={questions.get("6A4A")?.questionBody}
              data-pr-position="left"
            >
              6A4A
            </td>
            <td
              className={"questionTooltip " + answers["6A4B"]}
              data-pr-tooltip={questions.get("6A4B")?.questionBody}
              data-pr-position="left"
            >
              6A4B
            </td>
            <td
              className={"questionTooltip " + answers["6A4C"]}
              data-pr-tooltip={questions.get("6A4C")?.questionBody}
              data-pr-position="left"
            >
              6A4C
            </td>

            <td colSpan="1">&nbsp;</td>
          </tr>
          <tr>
            <td></td>

            <td
              className={"questionTooltip " + answers["6A5"]}
              data-pr-tooltip={questions.get("6A5")?.questionBody}
              data-pr-position="left"
            >
              6A5
            </td>
            <td
              className={"questionTooltip " + answers["6A6"]}
              data-pr-tooltip={questions.get("6A6")?.questionBody}
              data-pr-position="left"
            >
              6A6
            </td>
            <td
              className={"questionTooltip " + answers["6A6A"]}
              data-pr-tooltip={questions.get("6A6A")?.questionBody}
              data-pr-position="left"
            >
              6A6A
            </td>
            <td
              className={"questionTooltip " + answers["6A7"]}
              data-pr-tooltip={questions.get("6A7")?.questionBody}
              data-pr-position="left"
            >
              6A7
            </td>
            <td colSpan="4">&nbsp;</td>
          </tr>
          <tr>
            <td rowSpan="6">Structure based feasibility</td>
            <td rowSpan="6">
              <b>6B</b>
            </td>
            <td></td>
            <td
              className={"questionTooltip " + answers["6B1"]}
              data-pr-tooltip={questions.get("6B1")?.questionBody}
              data-pr-position="left"
            >
              6B1
            </td>
            <td
              className={"questionTooltip " + answers["6B1A"]}
              data-pr-tooltip={questions.get("6B1A")?.questionBody}
              data-pr-position="left"
            >
              6B1A
            </td>
            <td
              className={"questionTooltip " + answers["6B1B"]}
              data-pr-tooltip={questions.get("6B1B")?.questionBody}
              data-pr-position="left"
            >
              6B1B
            </td>
            <td
              className={"questionTooltip " + answers["6B1B1"]}
              data-pr-tooltip={questions.get("6B1B1")?.questionBody}
              data-pr-position="left"
            >
              6B1B1
            </td>
            <td
              className={"questionTooltip " + answers["6B1B2"]}
              data-pr-tooltip={questions.get("6B1B2")?.questionBody}
              data-pr-position="left"
            >
              6B1B2
            </td>
            <td
              className={"questionTooltip " + answers["6B1B2A"]}
              data-pr-tooltip={questions.get("6B1B2A")?.questionBody}
              data-pr-position="left"
            >
              6B1B2A
            </td>
            <td colSpan="2">&nbsp;</td>
          </tr>
          <tr>
            <td></td>

            <td
              className={"questionTooltip " + answers["6B1C"]}
              data-pr-tooltip={questions.get("6B1C")?.questionBody}
              data-pr-position="left"
            >
              6B1C
            </td>
            <td
              className={"questionTooltip " + answers["6B1D"]}
              data-pr-tooltip={questions.get("6B1D")?.questionBody}
              data-pr-position="left"
            >
              6B1D
            </td>
            <td
              className={"questionTooltip " + answers["6B1E"]}
              data-pr-tooltip={questions.get("6B1E")?.questionBody}
              data-pr-position="left"
            >
              6B1E
            </td>
            <td
              className={"questionTooltip " + answers["6B2"]}
              data-pr-tooltip={questions.get("6B2")?.questionBody}
              data-pr-position="left"
            >
              6B2
            </td>
            <td
              className={"questionTooltip " + answers["6B2A"]}
              data-pr-tooltip={questions.get("6B2A")?.questionBody}
              data-pr-position="left"
            >
              6B2A
            </td>
            <td
              className={"questionTooltip " + answers["6B2B"]}
              data-pr-tooltip={questions.get("6B2B")?.questionBody}
              data-pr-position="left"
            >
              6B2B
            </td>
            <td
              className={"questionTooltip " + answers["6B2C"]}
              data-pr-tooltip={questions.get("6B2C")?.questionBody}
              data-pr-position="left"
            >
              6B2C
            </td>

            <td colSpan="3">&nbsp;</td>
          </tr>

          <tr>
            <td></td>
            <td
              className={"questionTooltip " + answers["6B3"]}
              data-pr-tooltip={questions.get("6B3")?.questionBody}
              data-pr-position="left"
            >
              6B3
            </td>
            <td
              className={"questionTooltip " + answers["6B3A"]}
              data-pr-tooltip={questions.get("6B3A")?.questionBody}
              data-pr-position="left"
            >
              6B3A
            </td>
            <td
              className={"questionTooltip " + answers["6B3B"]}
              data-pr-tooltip={questions.get("6B3B")?.questionBody}
              data-pr-position="left"
            >
              6B3B
            </td>
            <td
              className={"questionTooltip " + answers["6B3B1"]}
              data-pr-tooltip={questions.get("6B3B1")?.questionBody}
              data-pr-position="left"
            >
              6B3B1
            </td>

            <td
              className={"questionTooltip " + answers["6B3B2"]}
              data-pr-tooltip={questions.get("6B3B2")?.questionBody}
              data-pr-position="left"
            >
              6B3B2
            </td>
            <td
              className={"questionTooltip " + answers["6B3B2A"]}
              data-pr-tooltip={questions.get("6B3B2A")?.questionBody}
              data-pr-position="left"
            >
              6B3B2A
            </td>
          </tr>
          <tr>
            <td></td>
            <td
              className={"questionTooltip " + answers["6B3c"]}
              data-pr-tooltip={questions.get("6B3c")?.questionBody}
              data-pr-position="left"
            >
              6B3c
            </td>
            <td
              className={"questionTooltip " + answers["6B3C1"]}
              data-pr-tooltip={questions.get("6B3C1")?.questionBody}
              data-pr-position="left"
            >
              6B3C1
            </td>
            <td
              className={"questionTooltip " + answers["6B3C1A"]}
              data-pr-tooltip={questions.get("6B3C1A")?.questionBody}
              data-pr-position="left"
            >
              6B3C1A
            </td>
            <td
              className={"questionTooltip " + answers["6B3C2"]}
              data-pr-tooltip={questions.get("6B3C2")?.questionBody}
              data-pr-position="left"
            >
              6B3C2
            </td>
            <td
              className={"questionTooltip " + answers["6B3D"]}
              data-pr-tooltip={questions.get("6B3D")?.questionBody}
              data-pr-position="left"
            >
              6B3D
            </td>
            <td colSpan="3">&nbsp;</td>
          </tr>
          <tr>
            <td></td>
            <td
              className={"questionTooltip " + answers["6B4"]}
              data-pr-tooltip={questions.get("6B4")?.questionBody}
              data-pr-position="left"
            >
              6B4
            </td>
            <td
              className={"questionTooltip " + answers["6B4A"]}
              data-pr-tooltip={questions.get("6B4A")?.questionBody}
              data-pr-position="left"
            >
              6B4A
            </td>
            <td
              className={"questionTooltip " + answers["6B4B"]}
              data-pr-tooltip={questions.get("6B4B")?.questionBody}
              data-pr-position="left"
            >
              6B4B
            </td>
            <td
              className={"questionTooltip " + answers["6B4C"]}
              data-pr-tooltip={questions.get("6B4C")?.questionBody}
              data-pr-position="left"
            >
              6B4C
            </td>
            <td colSpan="4">&nbsp;</td>
          </tr>
          <tr>
            <td></td>
            <td
              className={"questionTooltip " + answers["6B5"]}
              data-pr-tooltip={questions.get("6B5")?.questionBody}
              data-pr-position="left"
            >
              6B5
            </td>
            <td
              className={"questionTooltip " + answers["6B5A"]}
              data-pr-tooltip={questions.get("6B5A")?.questionBody}
              data-pr-position="left"
            >
              6B5A
            </td>
            <td
              className={"questionTooltip " + answers["6B5B"]}
              data-pr-tooltip={questions.get("6B5B")?.questionBody}
              data-pr-position="left"
            >
              6B5B
            </td>
            <td colSpan="5">&nbsp;</td>
          </tr>

          <tr>
            <td rowSpan="2">Progressibility considerations</td>
            <td rowSpan="2">
              <b>6C</b>
            </td>
            <td></td>
            <td
              className={"questionTooltip " + answers["6C1"]}
              data-pr-tooltip={questions.get("6C1")?.questionBody}
              data-pr-position="left"
            >
              6C1
            </td>
            <td
              className={"questionTooltip " + answers["6C2"]}
              data-pr-tooltip={questions.get("6C2")?.questionBody}
              data-pr-position="left"
            >
              6C2
            </td>
            <td
              className={"questionTooltip " + answers["6C3"]}
              data-pr-tooltip={questions.get("6C3")?.questionBody}
              data-pr-position="left"
            >
              6C3
            </td>
            <td
              className={"questionTooltip " + answers["6C4"]}
              data-pr-tooltip={questions.get("6C4")?.questionBody}
              data-pr-position="left"
            >
              6C4
            </td>
            <td colSpan="4">&nbsp;</td>
          </tr>
          <tr>
            <td></td>

            <td
              className={"questionTooltip " + answers["6C5"]}
              data-pr-tooltip={questions.get("6C5")?.questionBody}
              data-pr-position="left"
            >
              6C5
            </td>
            <td
              className={"questionTooltip " + answers["6C5A"]}
              data-pr-tooltip={questions.get("6C5A")?.questionBody}
              data-pr-position="left"
            >
              6C5A
            </td>
            <td
              className={"questionTooltip " + answers["6C5B"]}
              data-pr-tooltip={questions.get("6C5B")?.questionBody}
              data-pr-position="left"
            >
              6C5B
            </td>
            <td
              className={"questionTooltip " + answers["6C5B1"]}
              data-pr-tooltip={questions.get("6C5B1")?.questionBody}
              data-pr-position="left"
            >
              6C5B1
            </td>
            <td
              className={"questionTooltip " + answers["6C6"]}
              data-pr-tooltip={questions.get("6C6")?.questionBody}
              data-pr-position="left"
            >
              6C6
            </td>
            <td colSpan="3">&nbsp;</td>
          </tr>
          <tr>
            <td>Safety considerations</td>
            <td>
              <b>6D</b>
            </td>
            <td></td>
            <td
              className={"questionTooltip " + answers["6D1"]}
              data-pr-tooltip={questions.get("6D1")?.questionBody}
              data-pr-position="left"
            >
              6D1
            </td>
            <td
              className={"questionTooltip " + answers["6D2"]}
              data-pr-tooltip={questions.get("6D2")?.questionBody}
              data-pr-position="left"
            >
              6D2
            </td>
            <td
              className={"questionTooltip " + answers["6D3"]}
              data-pr-tooltip={questions.get("6D3")?.questionBody}
              data-pr-position="left"
            >
              6D3
            </td>
            <td
              className={"questionTooltip " + answers["6D4"]}
              data-pr-tooltip={questions.get("6D4")?.questionBody}
              data-pr-position="left"
            >
              6D4
            </td>
            <td
              className={"questionTooltip " + answers["6D5"]}
              data-pr-tooltip={questions.get("6D5")?.questionBody}
              data-pr-position="left"
            >
              6D5
            </td>
            <td colSpan="4">&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FTVScorecardGrid;
