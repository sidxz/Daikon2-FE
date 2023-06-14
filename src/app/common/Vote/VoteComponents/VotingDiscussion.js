import React from "react";
import Discussion from "../../Discussion/Discussion";

const VotingDiscussion = ({ reference, tagsFilters = [] }) => {
  return (
    <div>
      <Discussion
        reference={reference}
        section={"Vote"}
        tagsFilters={tagsFilters}
      />
    </div>
  );
};

export default VotingDiscussion;
