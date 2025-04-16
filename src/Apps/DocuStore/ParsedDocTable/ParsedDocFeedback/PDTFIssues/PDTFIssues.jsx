import { observer } from "mobx-react-lite";
import { Divider } from "primereact/divider";
import React from "react";
import PDTFIssue from "./PDTFIssue";
import PDTFIssueAdd from "./PDTFIssueAdd";

const PDTFIssues = () => {
  let issues = [
    {
      id: 1,
      createdById: 2,
      body: "<p>Gratitude contented direction of the attention. Offending inquietude me is at no existence behaving. Wicket to address it valley lively. Tiled me and way the head, just moment had no himself.</p>",
      dateCreated: new Date(),
    },
    {
      id: 2,
      createdById: 3,
      body: "<p>Imprudence attachment him his for sympathize. Large above be to means. Dashwood on considered speaking me opinion. Mention Mr manners opinion if garrets enabled.</p>",
      dateCreated: new Date(),
    },
    {
      id: 3,
      createdById: 4,
      body: "<p>Inquietude comparison contrasted remarkably increasing. Waiting surprise nothing it he subject. Had judgment out opinions property the supplied. Supposing so be resolving breakfast am or perfectly.</p>",
      dateCreated: new Date(),
    },
    {
      id: 4,
      createdById: 5,
      body: "<p>Repulsive questions contented him few extensive supported. Of remarkably thoroughly he appearance in. Supposing tolerably applauded or of be. Place voice no arises along to. Parlors waiting so against me no. Wishing calling is warrant settled was lucky.</p>",
      dateCreated: new Date(),
    },
  ];

  let issuesView = issues.map((issue) => {
    return <PDTFIssue key={issue.id} issue={issue} />;
  });

  return (
    <div className="flex flex-column w-full border-1 border-50 border-orange-100 p-1 border-round-md">
      <div className="flex justify-content-start align-items-center">
        <div className="flex font-bold capitalize text-lg pt-2 pl-2 text-orange-600">
          <i className="pi pi-exclamation-triangle mr-2"></i>
        </div>
        <div className="flex font-bold capitalize text-lg pt-2 pl-2 text-orange-600">
          Issues
        </div>
      </div>
      <div className="flex flex-column">
        <Divider />
      </div>
      <div className="flex flex-column">
        <PDTFIssueAdd />
      </div>
      <div className="flex flex-column gap-2">{issuesView}</div>
    </div>
  );
};
export default observer(PDTFIssues);
