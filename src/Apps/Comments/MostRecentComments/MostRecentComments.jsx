import { observer } from "mobx-react-lite";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../../RootStore";
import Comment from "../Comment/Comment";

const MostRecentComments = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchMostRecentComments,
    isFetchingMostRecentComments,
    mostRecentComments,
  } = rootStore.commentStore;

  useEffect(() => {
    fetchMostRecentComments();
  }, []);

  if (isFetchingMostRecentComments)
    return (
      <div className="flex flex-column w-full card-container">
        <Skeleton height="20rem" className="mb-2"></Skeleton>
      </div>
    );

  if (mostRecentComments.length === 0)
    return (
      <div className="flex w-full text-color-secondary">
        <Card
          className="w-full text-color-secondary"
          title="No ongoing discussions found."

          // footer={footer}
          // header={header}
        >
          <p className="m-0 text-color-secondary">
            Engage with the community by starting a new discussion! Simply click
            the "New Discussion" button to begin. Keep in mind that discussions
            visible to everyone. You can filter discussions by tags, which are
            displayed above. When creating a new discussion, be sure to add
            relevant tags to help others find and join your conversation.
          </p>
        </Card>
      </div>
    );

  let commentsRender = mostRecentComments.map((comment) => {
    return <Comment key={comment.id} id={comment.id} />;
  });

  return (
    <>
      <div className="flex flex-column w-full card-container">
        <div className="flex flex-column w-full gap-2">{commentsRender}</div>
      </div>
    </>
  );
};

export default observer(MostRecentComments);
