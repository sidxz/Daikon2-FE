import React from "react";

const FlowDashWhatsNew = () => {
  let cardTitle = (text) => (
    <div
      className="flex justify-content-center m-0 p-0"
      style={{ margin: "0px", marginBottom: "-10px" }}
    >
      <div className="m-0 p-0 text-cyan-700 text-2xl">{text}</div>
    </div>
  );

  return (
    <div className="flex flex-column gap-2">
      <div className="flex justify-content-left mt-0">
        <div>
          <p className="justify-content-left text-base m-3">
            We're excited to unveil some new additions to DAIKON 2.0 :
          </p>
          <div className="text-base m-2">
            <ul>
              <li>
                📊 Introducing MolecuLogix - a comprehensive solution for
                structure organization, similarity searches, and property
                analysis.
              </li>
              <li>
                🔍 Transition to Microservices architecture for enhanced
                scalability, flexibility, and easier maintenance
              </li>

              <li>🌟 Upgraded Horizon View, and Timeline View</li>
              <li>📈 Landing pages for every stage of the pipeline</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowDashWhatsNew;
