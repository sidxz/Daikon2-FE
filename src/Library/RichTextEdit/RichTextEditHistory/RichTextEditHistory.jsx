import JsonQuery from "json-query";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import { Timeline } from "primereact/timeline";
import React, { useEffect } from "react";
import Loading from "../../Loading/Loading";
import RichTextDisplay from "../RichTextDisplay/RichTextDisplay";

const RichTextEditHistory = ({
  historyDisplayLoading,
  history,
  dataSelector,
  fetchHistory,
}) => {
  useEffect(() => {
    if (!historyDisplayLoading && history === null) {
      fetchHistory();
      //console.log("RichTextEditHistory: history is null");
    }
  }, [historyDisplayLoading, history]);

  if (historyDisplayLoading) {
    return (
      <React.Fragment>
        <Loading />
      </React.Fragment>
    );
  } else {
    if (history !== null) {
      let historyId = _.upperFirst(_.camelCase(dataSelector));
      let historyQuery = "[*propertyName=" + historyId + "]";
      let historyResult = JsonQuery(historyQuery, { data: history }).value;

      if (_.isEmpty(historyResult)) {
        return (
          <React.Fragment>
            <p>No records found</p>
          </React.Fragment>
        );
      }

      return (
        <div style={{ overflow: "auto", height: "90%" }}>
          <Timeline
            value={historyResult}
            opposite={(historyResult) => (
              <React.Fragment>
                <RichTextDisplay data={historyResult.newValue} />
                <hr style={{ borderTop: "1px LightGray" }} />
              </React.Fragment>
            )}
            content={(historyResult) => (
              <React.Fragment>
                <small className="p-text-secondary">
                  {new Date(historyResult.dateChanged).toDateString()}
                </small>
                <br />
                <small className="p-text-secondary">
                  {historyResult.modifiedBy}
                </small>
              </React.Fragment>
            )}
          />
        </div>
      );
    }
  }
};

export default observer(RichTextEditHistory);
