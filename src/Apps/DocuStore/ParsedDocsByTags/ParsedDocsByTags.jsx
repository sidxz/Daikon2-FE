import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../../RootStore";
import ParsedDocTable from "../ParsedDocTable/ParsedDocTable";
const ParsedDocsByTags = ({ tags }) => {
  const rootStore = useContext(RootStoreContext);
  const { fetchDocsByTags, isFetchingDocs, docListByTags } =
    rootStore.parsedDocStore;

  useEffect(() => {
    fetchDocsByTags(tags);
  }, [fetchDocsByTags, tags]);

  if (isFetchingDocs) {
    return (
      <div className="flex flex-column w-full card-container">Loading</div>
    );
  }

  let docs = docListByTags(tags);

  console.log(docs);

  return (
    <div className="flex w-full">
      <ParsedDocTable docs={docs} />
    </div>
  );
};

export default observer(ParsedDocsByTags);
