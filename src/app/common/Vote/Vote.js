import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../stores/rootStore";
import VotingButtonPanel from "./VoteComponents/VotingButtonPanel";
import VotingChartPanel from "./VoteComponents/VotingChartPanel";
import VotingDiscussion from "./VoteComponents/VotingDiscussion";
/*
Usage: 
The voting module requires the parent module to import ConfirmDialog.
This is to prevent multiple binding of the ConfirmDialog if more than
one voting element is present in the screen.
*/

const Vote = ({
  id,
  voteData,
  callBack,
  revealVote = false,
  discussionReference,
  discussionTags,
  enableOneCLickVoting = false,
}) => {
  /* MobX Store */
  const rootStore = useContext(RootStoreContext);
  const { voting, vote } = rootStore.votingStore;
  const [showVotingComment, setShowVotingComment] = useState(false);

  if (id && voteData) {
    let votes = {
      Positive: voteData.positive,
      Neutral: voteData.neutral,
      Negative: voteData.negative,
    };

    const generateUserVotedPanel = () => {
      return (
        <div className="w-min">
          <p style={{ fontSize: "small" }}>
            You have voted <q>{voteData.usersVote}</q>.
          </p>
        </div>
      );
    };

    let generateOptions = () => {
      if (voteData.hasUserVoted) {
        return generateUserVotedPanel();
      } else {
        if (voteData.isVotingAllowed)
          return (
            <VotingButtonPanel castVote={confirmCastVote} loading={voting} />
          );
      }
    };

    let confirmCastVote = (e, selectedVote) => {
      let vData = {
        voteId: voteData.id,
        voteButton: selectedVote,
      };

      /* Skip confirmation if one click voting is enabled */
      if (enableOneCLickVoting) {
        vote(vData).then(() => {
          /* CALL BACK will call a function that has been passed as a prop */
          if (callBack !== undefined) callBack();
        });
        return;
      }

      confirmDialog({
        message:
          "" + " Click to continue voting " + selectedVote.toLowerCase() + "?",
        header: "Voting confirmation",

        acceptLabel: "Vote " + selectedVote,
        rejectLabel: "Cancel",
        accept: () =>
          vote(vData).then(() => {
            /* CALL BACK will call a function that has been passed as a prop */
            if (callBack !== undefined) callBack();
          }),
        style: { width: "50vw" },
      });
    };

    let renderVotingChart = () => {
      if (!revealVote)
        return (
          <div className="flex w-auto justify-content-center">
            <p style={{ fontSize: "small" }}>
              <i className="pi pi-eye-slash" /> Votes Hidden
            </p>
          </div>
        );

      if (votes.Positive === 0 && votes.Neutral === 0 && votes.Negative === 0) {
        return <p style={{ fontSize: "small" }}> - No votes submitted -</p>;
      } else {
        return <VotingChartPanel votes={votes} />;
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
              onClick={() => setShowVotingComment(true)}
              className="p-button-sm p-button-plain p-button-text"
            />
          </div>
        </div>
        <Dialog
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
        </Dialog>
      </React.Fragment>
    );
  }

  return <p style={{ fontSize: "small" }}>Voting data is not available.</p>;
};

export default Vote;
