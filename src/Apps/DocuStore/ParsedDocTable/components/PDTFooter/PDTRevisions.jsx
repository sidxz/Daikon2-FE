import FieldDiffTimeline from "../../../../../Library/RevisionTable/FieldDiffTimeline";

const PDTRevisions = ({ revisions }) => {
  return (
    <div className="flex flex-column w-full bg-gray-50">
      <FieldDiffTimeline history={revisions} field="ShortSummary" />
    </div>
  );
};

export default PDTRevisions;
