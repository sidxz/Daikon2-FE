import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React from "react";

const FlowDashWhatsNew = () => {
  let cardTitle = (text) => (
    <div className="flex justify-content-center m-0 p-0">
      <div className="m-0 p-0">{text}</div>
    </div>
  );

  return (
    <div className="flex flex-column surface-50 border-round m-0 p-0 gap-2">
      <div className="flex">
        <Card title={cardTitle("DAIKON 2.0")}>
          <p className="justify-content-center text-base">
            We're excited to unveil some new additions to DAIKON 2.0 :
          </p>
          <div className="m-0 p-0 text-base">
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
        </Card>
      </div>
      <div className="flex">
        <Card title={cardTitle("Publications")}>
          <div className="flex flex-column align-items-center gap-2 justify-content-center">
            <div className="flex">
              <Button
                label=" DAIKON Paper"
                className="p-button-info p-button-sm"
                onClick={() =>
                  window.open(
                    "https://pubs.acs.org/doi/10.1021/acsptsci.3c00034"
                  )
                }
              />
            </div>
            <div className="flex text-base justify-content-center">
              <p>
                We kindly request all users to <b>cite our work</b> when
                referencing our app. Thank you for your support!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FlowDashWhatsNew;
