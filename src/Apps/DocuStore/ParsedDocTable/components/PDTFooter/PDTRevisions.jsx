import FieldDiffTimeline from "../../../../../Library/RevisionTable/FieldDiffTimeline";

const PDTRevisions = ({ revisions }) => {
  return (
    <div>
      <FieldDiffTimeline history={revisions} field="ShortSummary" />
    </div>
  );
};

export default PDTRevisions;
