import React from "react";
import ValidatedHitsList from "../../../ScreenTargetBased/ValidatedHits/ValidatedHitsList/ValidatedHitsList";

const PhenotypicValidatedHitTable = ({ screenId }) => {
  return (
    <>
      <ValidatedHitsList screenId={screenId} />
    </>
  );
};

export default PhenotypicValidatedHitTable;
