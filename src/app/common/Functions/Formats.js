export function ExtractBaseScreenNameFromScreen(screenName) {
  // For a screen name say xyz-1-2, the function will return xyz-1, dropping the last part after the last hyphen
  // return null if the screen name is null or undefined
  if (!screenName) {
    return null;
  }
  const lastHyphenIndex = screenName.lastIndexOf("-");
  if (lastHyphenIndex !== -1) {
    return screenName.slice(0, lastHyphenIndex);
  } else {
    return screenName;
  }
}
