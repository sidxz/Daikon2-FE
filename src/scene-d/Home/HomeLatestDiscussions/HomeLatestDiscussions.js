import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import HomeLatestDiscussionBlock from "./HomeLatestDiscussionBlock/HomeLatestDiscussionBlock";

const HomeLatestDiscussions = () => {
  // Fetch the latest discussions from the API

  const rootStore = useContext(RootStoreContext);
  const {
    fetchLatestDiscussions,
    fetchingLatestDiscussions,
    latestDiscussions,
  } = rootStore.dataViewStore;

  useState(() => {
    fetchLatestDiscussions();
  }, [fetchLatestDiscussions]);

  // Create a list of the latest discussions
  // Loop around the latest discussions and create a list of them

  let renderLatestDiscussions = () => {
    if (!fetchingLatestDiscussions && latestDiscussions.length > 0) {
      return latestDiscussions.map((discussion) => {
        return (
          <HomeLatestDiscussionBlock
            id={discussion.id}
            discussion={discussion}
          />
        );
      });
    }
  };

  console.log(rootStore.dataViewStore.latestDiscussions);

  return (
    <div className="flex flex-column card-container justify-content-center gap-0 w-full">
      {renderLatestDiscussions()}
    </div>
  );
};

export default observer(HomeLatestDiscussions);
