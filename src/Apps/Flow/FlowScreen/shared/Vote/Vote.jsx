import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import React from "react";
import VotingButtonPanel from "./VoteComponents/VotingButtonPanel";
import VotingChartPanel from "./VoteComponents/VotingChartPanel";
/*
Usage: 
The voting module requires the parent module to import ConfirmDialog.
This is to prevent multiple binding of the ConfirmDialog if more than
one voting element is present in the screen.
*/

const Vote = ({
  hit,
  updateHit,
  isUpdatingHit,
  userId,
  isVotingAllowed = true,
  isVotesHidden = true,
  isOneClickVotingEnabled = false,
}) => {
  if (hit) {
    const PanelUserAlreadyVoted = () => {
      return (
        <div className="w-min">
          <p style={{ fontSize: "small" }}>
            You have voted <q>{hit.usersVote}</q>.
          </p>
        </div>
      );
    };

    let generateOptions = () => {
      if (hit.usersVote !== "NA") {
        return PanelUserAlreadyVoted();
      } else {
        if (isVotingAllowed)
          return (
            <VotingButtonPanel
              castVote={confirmCastVote}
              loading={isUpdatingHit}
            />
          );
      }
    };

    let updateHitWithVote = (selectedVote) => {
      let updatedHit = { ...hit };
      updatedHit.usersVote = selectedVote;
      updatedHit.voters = { ...hit.voters, [userId]: selectedVote };
      if (selectedVote === "Positive") {
        updatedHit.positive += 1;
      } else if (selectedVote === "Neutral") {
        updatedHit.neutral += 1;
      }
      if (selectedVote === "Negative") {
        updatedHit.negative += 1;
      }
      updateHit(updatedHit);
    };

    let confirmCastVote = (e, selectedVote) => {
      /* Skip confirmation if one click voting is enabled */
      if (isOneClickVotingEnabled) {
        // edit
        updateHitWithVote(selectedVote);
        return;
      }

      confirmDialog({
        message:
          "" + " Click to continue voting " + selectedVote.toLowerCase() + "?",
        header: "Voting confirmation",

        acceptLabel: "Vote " + selectedVote,
        rejectLabel: "Cancel",
        accept: () => updateHitWithVote(selectedVote),
        style: { width: "50vw" },
      });
    };

    let renderVotingChart = () => {
      if (!isVotesHidden)
        return (
          <div className="flex w-auto justify-content-center">
            <p style={{ fontSize: "small" }}>
              <i className="pi pi-eye-slash" /> Votes Hidden
            </p>
          </div>
        );

      if (hit.positive === 0 && hit.neutral === 0 && hit.negative === 0) {
        return <p style={{ fontSize: "small" }}> - No votes submitted -</p>;
      } else {
        return <VotingChartPanel hit={hit} />;
      }
    };

    /* Final Render */
    return (
      <React.Fragment>
        <div className="flex flex-column w-auto min-w-10">
          <div className="flex w-auto justify-content-center">
            {renderVotingChart()}
          </div>
          <div className="flex justify-content-center">{generateOptions()}</div>
          <div className="flex justify-content-center">
            <Button
              label="Comments"
              icon="pi pi-comments"
              //onClick={() => setShowVotingComment(true)}
              className="p-button-sm p-button-plain p-button-text"
            />
          </div>
        </div>
        {/* <Dialog
          //header=""
          //className="w-full"
          //footer={footer}
          //icons={myIcon}
          visible={showVotingComment}
          style={{ width: "90vw", height: "90vh" }}
          modal
          onHide={() => setShowVotingComment(false)}
        >
          <VotingDiscussion
            reference={discussionReference}
            tagsFilters={discussionTags}
          />
        </Dialog> */}
      </React.Fragment>
    );
  }

  return <p style={{ fontSize: "small" }}>Voting data is not available.</p>;
};

export default observer(Vote);
