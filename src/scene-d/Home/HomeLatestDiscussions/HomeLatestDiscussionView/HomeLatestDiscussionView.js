import React from "react";
import Discussion from "../../../../app/common/Discussion/Discussion";

const HomeLatestDiscussionView = ({ discussion }) => {
  return (
    <div>
      <Discussion
        reference={discussion.reference}
        section={discussion.section}
        filterById={discussion.id}
        disableAddNewPost={true}
      />
    </div>
  );
};

export default HomeLatestDiscussionView;
