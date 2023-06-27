import { observer } from "mobx-react-lite";
import { Dialog } from "primereact/dialog";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import HomeLatestDiscussionBlock from "./HomeLatestDiscussionBlock/HomeLatestDiscussionBlock";
import HomeLatestDiscussionView from "./HomeLatestDiscussionView/HomeLatestDiscussionView";

const HomeLatestDiscussions = () => {
  // Fetch the latest discussions from the API

  const rootStore = useContext(RootStoreContext);
  const {
    fetchLatestDiscussions,
    fetchingLatestDiscussions,
    latestDiscussions,
  } = rootStore.dataViewStore;

  const [showDiscussionThread, setShowDiscussionThread] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState({});

  useState(() => {
    fetchLatestDiscussions();
  }, [fetchLatestDiscussions]);

  // Create a list of the latest discussions
  // Loop around the latest discussions and create a list of them

  let renderLatestDiscussions = () => {
    if (!fetchingLatestDiscussions && latestDiscussions.length > 0) {
      return latestDiscussions.map((discussion) => {
        return (
          <div
            onClick={() => {
              setSelectedDiscussion(discussion);
              setShowDiscussionThread(true);
            }}
          >
            <HomeLatestDiscussionBlock
              id={discussion.id}
              discussion={discussion}
            />
          </div>
        );
      });
    }
  };

  console.log(rootStore.dataViewStore.latestDiscussions);

  return (
    <div className="flex flex-column card-container justify-content-center gap-0 w-full">
      {renderLatestDiscussions()}

      <Dialog
        visible={showDiscussionThread}
        style={{ width: "90vw", height: "90vh" }}
        modal
        onHide={() => setShowDiscussionThread(false)}
      >
        <HomeLatestDiscussionView discussion={selectedDiscussion} />
      </Dialog>
    </div>
  );
};

export default observer(HomeLatestDiscussions);
