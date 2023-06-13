import { confirmDialog } from "primereact/confirmdialog";
import React, { useContext } from "react";
import { RootStoreContext } from "../../stores/rootStore";
import VotingButtonPanel from "./VoteComponents/VotingButtonPanel";
import VotingChartPanel from "./VoteComponents/VotingChartPanel";

/*
Usage: 
The voting module requires the parent module to import ConfirmDialog.
This is to prevent multiple binding of the ConfirmDialog if more than
one voting element is present in the screen.
*/

const Vote = ({ id, voteData, callBack, revealVote = false }) => {
  /* MobX Store */
  const rootStore = useContext(RootStoreContext);
  const { voting, vote } = rootStore.votingStore;

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
          <div className="flex">{generateOptions()}</div>
          <div className="flex justify-content-center ">
            <p style={{ fontSize: "small", color: "#999" }}>
              <i class="icon icon-common icon-comments"></i> Comments
            </p>
          </div>
        </div>
      </React.Fragment>
    );
  }

  return <p style={{ fontSize: "small" }}>Voting data is not available.</p>;
};

export default Vote;
