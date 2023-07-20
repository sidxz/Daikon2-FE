/**
 * generateVoteScore: Function to generate a vote score for a given screen.
 * The score is calculated based on validated hits available in the screen data.
 *
 * @param {object} screen - The screen object containing validated hits.
 * @returns {object} The modified screen object with calculated vote scores for each validated hit.
 */

export function generateVoteScore(screen) {
  // Check if "validatedHits" property exists in the screen object.
  if (!screen.hasOwnProperty("validatedHits")) return screen;

  // For each validated hit in the screen,
  // compute a "voteScore" based on the "vote" properties (if available).
  screen.validatedHits.forEach((validatedHit) => {
    validatedHit["voteScore"] = 0;

    // Check if "vote" property exists in the validated hit.
    if (!validatedHit.hasOwnProperty("vote")) return;

    // Calculate the "voteScore" as per the given formula.
    // Note: The score calculation is inverted because React Table sorts in descending order by default.
    validatedHit["voteScore"] =
      -1 *
      (2 * validatedHit.vote.positive +
        1 * validatedHit.vote.neutral -
        2 * validatedHit.vote.negative);
  });

  // Return the modified screen object with calculated vote scores.
  return screen;
}
