import SmilesView from "../../../../Library/SmilesView/SmilesView";
import { formatBioActivity } from "../../Library/Relationships/BioActivity";
import Relationships from "../../Library/Relationships/Relationships";
let structureTemplate = (rowData) => (
  <div className="flex w-full h-full">
    <SmilesView
      smiles={rowData?.smiles}
      compoundId={rowData?.id}
      //requestedCompoundName={rowData?.requestedMoleculeName}
      width={250}
      height={270}
    />
  </div>
);

let relationshipsTemplate = (rowData) => (
  <div className="flex w-full h-full">
    <Relationships associations={rowData?.horizonRelations} />
  </div>
);

let bioActivityTemplate = (rowData) => {
  let bioActivities = [];

  let bioActivitiesHits = rowData.hits.flatMap((hit) => formatBioActivity(hit));
  let bioActivitiesHAs = rowData.haCompoundEvolutions.flatMap((ha) =>
    formatBioActivity(ha)
  );
  let bioActivitiesProjects = rowData.projectCompoundEvolution.flatMap(
    (project) => formatBioActivity(project)
  );

  bioActivities.push(...bioActivitiesHits);
  bioActivities.push(...bioActivitiesHAs);
  bioActivities.push(...bioActivitiesProjects);

  let bioActViews = bioActivities.map((activity, index) => (
    <div key={index} className="flex w-full flex-col gap-1">
      <p className="font-semibold">{activity.label}</p>
      <p className="text">{activity.value}</p>
    </div>
  ));

  return <div className="flex w-full flex-column gap-1">{bioActViews}</div>;
};

export const templates = {
  structureTemplate,
  relationshipsTemplate,
  bioActivityTemplate,
};
