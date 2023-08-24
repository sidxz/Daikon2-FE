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

export function FormatScreenName(screen) {
  switch (screen.method.toUpperCase()) {
    case "BIOCHEMICAL SCREEN":
      return screen.screenName + " Biochemical";
      break;
    case "DNA ENCODED DEL SCREEN":
      return screen.screenName + " DEL";
      break;
    case "Fragment screen":
      return screen.screenName + " Fragment";
      break;
    case "HYPOMORPH":
      return screen.screenName + " Hypomorph";
      break;
    case "VIRTUAL SCREENING":
      return screen.screenName + " Virtual";
      break;
    case "LEGACY":
      return screen.screenName + " Legacy";
      break;
    default:
      return screen.screenName + " " + screen.method;
  }
}
