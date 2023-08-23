import { Tooltip } from "primereact/tooltip";
import React from "react";

import PleaseWait from "../../../../../app/common/PleaseWait/PleaseWait";
import "./TargetGrid.css";

// Component to display the TargetGrid
const TargetGrid = ({ questions, target }) => {
  //console.log(questions);
  let answers = {};

  // Check if questions or target data is not available
  if (questions.size === 0 || target === null) {
    return <PleaseWait />;
  }
  // Iterate over targetScoreCardValues
  target.targetScorecard.targetScoreCardValues.forEach((ans) => {
    // Set appropriate answer color based on the answer value
    if (ans.answer === "ACTIVE" || ans.answer === "YES") {
      answers[ans.questionIdentification] = "greenCell";
    }
    if (ans.answer === "INACTIVE" || ans.answer === "NO") {
      answers[ans.questionIdentification] = "redCell";
    }
    if (ans.answer === "UNKNOWN" || ans.answer === "NA") {
      answers[ans.questionIdentification] = "grayCell";
    }

    if (ans.answer === "HIGH") {
      answers[ans.questionIdentification] = "darkGreenCell";
    }

    if (ans.answer === "MEDIUM") {
      answers[ans.questionIdentification] = "yellowCell";
    }

    if (ans.answer === "LOW") {
      answers[ans.questionIdentification] = "darkRedCell";
    }

    /* Exceptions */
    if (
      ans.questionIdentification === "5a1" ||
      ans.questionIdentification === "5a3"
    ) {
      if (ans.answer === "YES") {
        answers[ans.questionIdentification] = "redCell";
      }
      if (ans.answer === "NO") {
        answers[ans.questionIdentification] = "greenCell";
      }
    }
  });

  return (
    <div className="targetGrid">
      {/* Tooltip component */}
      <Tooltip target=".questionTooltip" mouseTrack mouseTrackLeft={10} />
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
              <b>2a</b>
            </td>
            <td></td>

            <td
              className={"questionTooltip " + answers["2a1"]}
              data-pr-tooltip={questions.get("2a1")?.questionBody}
              data-pr-position="left"
            >
              2a1
            </td>

            <td
              className={"questionTooltip " + answers["2a1b"]}
              data-pr-tooltip={questions.get("2a1b")?.questionBody}
              data-pr-position="left"
            >
              2a1b
            </td>
            <td
              className={"questionTooltip " + answers["2a2"]}
              data-pr-tooltip={questions.get("2a2")?.questionBody}
              data-pr-position="left"
            >
              2a2
            </td>

            <td
              className={"questionTooltip " + answers["2a3b"]}
              data-pr-tooltip={questions.get("2a3b")?.questionBody}
              data-pr-position="left"
            >
              2a3b
            </td>
            <td
              className={"questionTooltip " + answers["2a4a"]}
              data-pr-tooltip={questions.get("2a4a")?.questionBody}
              data-pr-position="left"
            >
              2a4a
            </td>
            <td
              className={"questionTooltip " + answers["2a4b"]}
              data-pr-tooltip={questions.get("2a4b")?.questionBody}
              data-pr-position="left"
            >
              2a4b
            </td>
            <td
              className={"questionTooltip " + answers["2a5"]}
              data-pr-tooltip={questions.get("2a5")?.questionBody}
              data-pr-position="left"
            >
              2a5
            </td>



          </tr>
          {/* Rest of the table rows */}
          <tr>
            <td>On replicating Mtb in vitro</td>
            <td>
              <b>2b</b>
            </td>
            <td></td>
            <td
              className={"questionTooltip " + answers["2b1"]}
              data-pr-tooltip={questions.get("2b1")?.questionBody}
              data-pr-position="left"
            >
              2b1
            </td>
            <td
              className={"questionTooltip " + answers["2b2"]}
              data-pr-tooltip={questions.get("2b2")?.questionBody}
              data-pr-position="left"
            >
              2b2
            </td>
            <td
              className={"questionTooltip " + answers["2b4"]}
              data-pr-tooltip={questions.get("2b4")?.questionBody}
              data-pr-position="left"
            >
              2b4
            </td>
            <td colSpan="5">&nbsp;</td>
          </tr>
          <tr>
            <td>On non replicating Mtb in vitro</td>
            <td>
              <b>2c</b>
            </td>
            <td></td>

            <td
              className={"questionTooltip " + answers["2c3"]}
              data-pr-tooltip={questions.get("2c3")?.questionBody}
              data-pr-position="left"
            >
              2c3
            </td>

            <td
              className={"questionTooltip " + answers["2c5"]}
              data-pr-tooltip={questions.get("2c5")?.questionBody}
              data-pr-position="left"
            >
              2c5
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
              className={"questionTooltip " + answers["3a1"]}
              data-pr-tooltip={questions.get("3a1")?.questionBody}
              data-pr-position="left"
            >
              3a1
            </td>
            <td
              className={"questionTooltip " + answers["3a2"]}
              data-pr-tooltip={questions.get("3a2")?.questionBody}
              data-pr-position="left"
            >
              3a2
            </td>
            <td
              className={"questionTooltip " + answers["3a3"]}
              data-pr-tooltip={questions.get("3a3")?.questionBody}
              data-pr-position="left"
            >
              3a3
            </td>
            <td
              className={"questionTooltip " + answers["3a4"]}
              data-pr-tooltip={questions.get("3a4")?.questionBody}
              data-pr-position="left"
            >
              3a4
            </td>
            <td
              className={"questionTooltip " + answers["3b1"]}
              data-pr-tooltip={questions.get("3b1")?.questionBody}
              data-pr-position="left"
            >
              3b1
            </td>
            <td
              className={"questionTooltip " + answers["3b2"]}
              data-pr-tooltip={questions.get("3b2")?.questionBody}
              data-pr-position="left"
            >
              3b2
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
              <b>4a</b>
            </td>
            <td></td>

            <td
              className={"questionTooltip " + answers["4a3a"]}
              data-pr-tooltip={questions.get("4a3a")?.questionBody}
              data-pr-position="left"
            >
              4a3a
            </td>
            <td
              className={"questionTooltip " + answers["4a3b"]}
              data-pr-tooltip={questions.get("4a3b")?.questionBody}
              data-pr-position="left"
            >
              4a3b
            </td>
            <td
              className={"questionTooltip " + answers["4a4"]}
              data-pr-tooltip={questions.get("4a4")?.questionBody}
              data-pr-position="left"
            >
              4a4
            </td>
            <td colSpan="5">&nbsp;</td>
          </tr>
          <tr></tr>
          <tr>
            <td>On non replicating Mtb in vitro</td>
            <td>
              <b>4c</b>
            </td>
            <td></td>

            <td
              className={"questionTooltip " + answers["4c3"]}
              data-pr-tooltip={questions.get("4c3")?.questionBody}
              data-pr-position="left"
            >
              4c3
            </td>

            <td
              className={"questionTooltip " + answers["4c5"]}
              data-pr-tooltip={questions.get("4c5")?.questionBody}
              data-pr-position="left"
            >
              4c5
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
              className={"questionTooltip " + answers["5a1"]}
              data-pr-tooltip={questions.get("5a1")?.questionBody}
              data-pr-position="left"
            >
              5a1
            </td>
            <td
              className={"questionTooltip " + answers["5a2"]}
              data-pr-tooltip={questions.get("5a2")?.questionBody}
              data-pr-position="left"
            >
              5a2
            </td>
            <td
              className={"questionTooltip " + answers["5a3"]}
              data-pr-tooltip={questions.get("5a3")?.questionBody}
              data-pr-position="left"
            >
              5a3
            </td>
            <td
              className={"questionTooltip " + answers["5b1"]}
              data-pr-tooltip={questions.get("5b1")?.questionBody}
              data-pr-position="left"
            >
              5b1
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
              <b>6a</b>
            </td>
            <td></td>
            <td
              className={"questionTooltip " + answers["6a1"]}
              data-pr-tooltip={questions.get("6a1")?.questionBody}
              data-pr-position="left"
            >
              6a1
            </td>
            <td
              className={"questionTooltip " + answers["6a2"]}
              data-pr-tooltip={questions.get("6a2")?.questionBody}
              data-pr-position="left"
            >
              6a2
            </td>
            <td
              className={"questionTooltip " + answers["6a3"]}
              data-pr-tooltip={questions.get("6a3")?.questionBody}
              data-pr-position="left"
            >
              6a3
            </td>
            <td
              className={"questionTooltip " + answers["6a4"]}
              data-pr-tooltip={questions.get("6a4")?.questionBody}
              data-pr-position="left"
            >
              6a4
            </td>
            <td
              className={"questionTooltip " + answers["6a4a"]}
              data-pr-tooltip={questions.get("6a4a")?.questionBody}
              data-pr-position="left"
            >
              6a4a
            </td>
            <td
              className={"questionTooltip " + answers["6a4b"]}
              data-pr-tooltip={questions.get("6a4b")?.questionBody}
              data-pr-position="left"
            >
              6a4b
            </td>
            <td
              className={"questionTooltip " + answers["6a4c"]}
              data-pr-tooltip={questions.get("6a4c")?.questionBody}
              data-pr-position="left"
            >
              6a4c
            </td>

            <td colSpan="1">&nbsp;</td>
          </tr>
          <tr>
            <td></td>

            <td
              className={"questionTooltip " + answers["6a5"]}
              data-pr-tooltip={questions.get("6a5")?.questionBody}
              data-pr-position="left"
            >
              6a5
            </td>
            <td
              className={"questionTooltip " + answers["6a6"]}
              data-pr-tooltip={questions.get("6a6")?.questionBody}
              data-pr-position="left"
            >
              6a6
            </td>
            <td
              className={"questionTooltip " + answers["6a6a"]}
              data-pr-tooltip={questions.get("6a6a")?.questionBody}
              data-pr-position="left"
            >
              6a6a
            </td>
            <td
              className={"questionTooltip " + answers["6a7"]}
              data-pr-tooltip={questions.get("6a7")?.questionBody}
              data-pr-position="left"
            >
              6a7
            </td>
            <td colSpan="4">&nbsp;</td>
          </tr>
          <tr>
            <td rowSpan="6">Structure based feasibility</td>
            <td rowSpan="6">
              <b>6b</b>
            </td>
            <td></td>
            <td
              className={"questionTooltip " + answers["6b1"]}
              data-pr-tooltip={questions.get("6b1")?.questionBody}
              data-pr-position="left"
            >
              6b1
            </td>
            <td
              className={"questionTooltip " + answers["6b1a"]}
              data-pr-tooltip={questions.get("6b1a")?.questionBody}
              data-pr-position="left"
            >
              6b1a
            </td>
            <td
              className={"questionTooltip " + answers["6b1b"]}
              data-pr-tooltip={questions.get("6b1b")?.questionBody}
              data-pr-position="left"
            >
              6b1b
            </td>
            <td
              className={"questionTooltip " + answers["6b1b1"]}
              data-pr-tooltip={questions.get("6b1b1")?.questionBody}
              data-pr-position="left"
            >
              6b1b1
            </td>
            <td
              className={"questionTooltip " + answers["6b1b2"]}
              data-pr-tooltip={questions.get("6b1b2")?.questionBody}
              data-pr-position="left"
            >
              6b1b2
            </td>
            <td
              className={"questionTooltip " + answers["6b1b2a"]}
              data-pr-tooltip={questions.get("6b1b2a")?.questionBody}
              data-pr-position="left"
            >
              6b1b2a
            </td>
            <td colSpan="2">&nbsp;</td>
          </tr>
          <tr>
            <td></td>

            <td
              className={"questionTooltip " + answers["6b1c"]}
              data-pr-tooltip={questions.get("6b1c")?.questionBody}
              data-pr-position="left"
            >
              6b1c
            </td>
            <td
              className={"questionTooltip " + answers["6b1d"]}
              data-pr-tooltip={questions.get("6b1d")?.questionBody}
              data-pr-position="left"
            >
              6b1d
            </td>
            <td
              className={"questionTooltip " + answers["6b1e"]}
              data-pr-tooltip={questions.get("6b1e")?.questionBody}
              data-pr-position="left"
            >
              6b1e
            </td>
            <td
              className={"questionTooltip " + answers["6b2"]}
              data-pr-tooltip={questions.get("6b2")?.questionBody}
              data-pr-position="left"
            >
              6b2
            </td>
            <td
              className={"questionTooltip " + answers["6b2a"]}
              data-pr-tooltip={questions.get("6b2a")?.questionBody}
              data-pr-position="left"
            >
              6b2a
            </td>
            <td
              className={"questionTooltip " + answers["6b2b"]}
              data-pr-tooltip={questions.get("6b2b")?.questionBody}
              data-pr-position="left"
            >
              6b2b
            </td>
            <td
              className={"questionTooltip " + answers["6b2c"]}
              data-pr-tooltip={questions.get("6b2c")?.questionBody}
              data-pr-position="left"
            >
              6b2c
            </td>

            <td colSpan="3">&nbsp;</td>
          </tr>

          <tr>
            <td></td>
            <td
              className={"questionTooltip " + answers["6b3"]}
              data-pr-tooltip={questions.get("6b3")?.questionBody}
              data-pr-position="left"
            >
              6b3
            </td>
            <td
              className={"questionTooltip " + answers["6b3a"]}
              data-pr-tooltip={questions.get("6b3a")?.questionBody}
              data-pr-position="left"
            >
              6b3a
            </td>
            <td
              className={"questionTooltip " + answers["6b3b"]}
              data-pr-tooltip={questions.get("6b3b")?.questionBody}
              data-pr-position="left"
            >
              6b3b
            </td>
            <td
              className={"questionTooltip " + answers["6b3b1"]}
              data-pr-tooltip={questions.get("6b3b1")?.questionBody}
              data-pr-position="left"
            >
              6b3b1
            </td>

            <td
              className={"questionTooltip " + answers["6b3b2"]}
              data-pr-tooltip={questions.get("6b3b2")?.questionBody}
              data-pr-position="left"
            >
              6b3b2
            </td>
            <td
              className={"questionTooltip " + answers["6b3b2a"]}
              data-pr-tooltip={questions.get("6b3b2a")?.questionBody}
              data-pr-position="left"
            >
              6b3b2a
            </td>
          </tr>
          <tr>
            <td></td>
            <td
              className={"questionTooltip " + answers["6b3c"]}
              data-pr-tooltip={questions.get("6b3c")?.questionBody}
              data-pr-position="left"
            >
              6b3c
            </td>
            <td
              className={"questionTooltip " + answers["6b3c1"]}
              data-pr-tooltip={questions.get("6b3c1")?.questionBody}
              data-pr-position="left"
            >
              6b3c1
            </td>
            <td
              className={"questionTooltip " + answers["6b3c1a"]}
              data-pr-tooltip={questions.get("6b3c1a")?.questionBody}
              data-pr-position="left"
            >
              6b3c1a
            </td>
            <td
              className={"questionTooltip " + answers["6b3c2"]}
              data-pr-tooltip={questions.get("6b3c2")?.questionBody}
              data-pr-position="left"
            >
              6b3c2
            </td>
            <td
              className={"questionTooltip " + answers["6b3d"]}
              data-pr-tooltip={questions.get("6b3d")?.questionBody}
              data-pr-position="left"
            >
              6b3d
            </td>
            <td colSpan="3">&nbsp;</td>
          </tr>
          <tr>
            <td></td>
            <td
              className={"questionTooltip " + answers["6b4"]}
              data-pr-tooltip={questions.get("6b4")?.questionBody}
              data-pr-position="left"
            >
              6b4
            </td>
            <td
              className={"questionTooltip " + answers["6b4a"]}
              data-pr-tooltip={questions.get("6b4a")?.questionBody}
              data-pr-position="left"
            >
              6b4a
            </td>
            <td
              className={"questionTooltip " + answers["6b4b"]}
              data-pr-tooltip={questions.get("6b4b")?.questionBody}
              data-pr-position="left"
            >
              6b4b
            </td>
            <td
              className={"questionTooltip " + answers["6b4c"]}
              data-pr-tooltip={questions.get("6b4c")?.questionBody}
              data-pr-position="left"
            >
              6b4c
            </td>
            <td colSpan="4">&nbsp;</td>
          </tr>
          <tr>
            <td></td>
            <td
              className={"questionTooltip " + answers["6b5"]}
              data-pr-tooltip={questions.get("6b5")?.questionBody}
              data-pr-position="left"
            >
              6b5
            </td>
            <td
              className={"questionTooltip " + answers["6b5a"]}
              data-pr-tooltip={questions.get("6b5a")?.questionBody}
              data-pr-position="left"
            >
              6b5a
            </td>
            <td
              className={"questionTooltip " + answers["6b5b"]}
              data-pr-tooltip={questions.get("6b5b")?.questionBody}
              data-pr-position="left"
            >
              6b5b
            </td>
            <td colSpan="5">&nbsp;</td>
          </tr>

          <tr>
            <td rowSpan="2">Progressibility considerations</td>
            <td rowSpan="2">
              <b>6c</b>
            </td>
            <td></td>
            <td
              className={"questionTooltip " + answers["6c1"]}
              data-pr-tooltip={questions.get("6c1")?.questionBody}
              data-pr-position="left"
            >
              6c1
            </td>
            <td
              className={"questionTooltip " + answers["6c2"]}
              data-pr-tooltip={questions.get("6c2")?.questionBody}
              data-pr-position="left"
            >
              6c2
            </td>
            <td
              className={"questionTooltip " + answers["6c3"]}
              data-pr-tooltip={questions.get("6c3")?.questionBody}
              data-pr-position="left"
            >
              6c3
            </td>
            <td
              className={"questionTooltip " + answers["6c4"]}
              data-pr-tooltip={questions.get("6c4")?.questionBody}
              data-pr-position="left"
            >
              6c4
            </td>
            <td colSpan="4">&nbsp;</td>
          </tr>
          <tr>
            <td></td>

            <td
              className={"questionTooltip " + answers["6c5"]}
              data-pr-tooltip={questions.get("6c5")?.questionBody}
              data-pr-position="left"
            >
              6c5
            </td>
            <td
              className={"questionTooltip " + answers["6c5a"]}
              data-pr-tooltip={questions.get("6c5a")?.questionBody}
              data-pr-position="left"
            >
              6c5a
            </td>
            <td
              className={"questionTooltip " + answers["6c5b"]}
              data-pr-tooltip={questions.get("6c5b")?.questionBody}
              data-pr-position="left"
            >
              6c5b
            </td>
            <td
              className={"questionTooltip " + answers["6c5b1"]}
              data-pr-tooltip={questions.get("6c5b1")?.questionBody}
              data-pr-position="left"
            >
              6c5b1
            </td>
            <td
              className={"questionTooltip " + answers["6c6"]}
              data-pr-tooltip={questions.get("6c6")?.questionBody}
              data-pr-position="left"
            >
              6c6
            </td>
            <td colSpan="3">&nbsp;</td>
          </tr>
          <tr>
            <td>Safety considerations</td>
            <td>
              <b>6d</b>
            </td>
            <td></td>
            <td
              className={"questionTooltip " + answers["6d1"]}
              data-pr-tooltip={questions.get("6d1")?.questionBody}
              data-pr-position="left"
            >
              6d1
            </td>
            <td
              className={"questionTooltip " + answers["6d2"]}
              data-pr-tooltip={questions.get("6d2")?.questionBody}
              data-pr-position="left"
            >
              6d2
            </td>
            <td
              className={"questionTooltip " + answers["6d3"]}
              data-pr-tooltip={questions.get("6d3")?.questionBody}
              data-pr-position="left"
            >
              6d3
            </td>
            <td
              className={"questionTooltip " + answers["6d4"]}
              data-pr-tooltip={questions.get("6d4")?.questionBody}
              data-pr-position="left"
            >
              6d4
            </td>
            <td
              className={"questionTooltip " + answers["6d5"]}
              data-pr-tooltip={questions.get("6d5")?.questionBody}
              data-pr-position="left"
            >
              6d5
            </td>
            <td colSpan="4">&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TargetGrid;
