export function generateVoteScore(screen) {
  // check if validated hits object exists
  if (!screen.hasOwnProperty("validatedHits")) return screen;

  screen.validatedHits.forEach((validatedHit) => {
    validatedHit["voteScore"] = 0;

    // check if vote object exists
    if (!validatedHit.hasOwnProperty("vote")) return;

    // assigning inverted scoring as React Table sorts descending by default
    validatedHit["voteScore"] =
      -1 *
      (2 * validatedHit.vote.positive +
        1 * validatedHit.vote.neutral -
        2 * validatedHit.vote.negative);
  });
  return screen;
}
