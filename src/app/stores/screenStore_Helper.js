export function generateVoteScore(screen) {
  // check if validated hits object exists
  if (!screen.hasOwnProperty("validatedHits")) return screen;

  screen.validatedHits.forEach((validatedHit) => {
    validatedHit["voteScore"] = 0;

    // check if vote object exists
    if (!validatedHit.hasOwnProperty("vote")) return;

    validatedHit["voteScore"] =
      2 * validatedHit.vote.positive +
      1 * validatedHit.vote.neutral -
      2 * validatedHit.vote.negative;
    console.log(validatedHit);
  });
  return screen;
}
