import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { observer } from "mobx-react-lite";
import React from "react";

const RichTextDisplay = ({ data }) => {
  if (data === null || data === "") {
    data = "<p>Data Unavailable. Right-click for Options.</p>";
  }
  let sanitizeHtml = (text) =>
    DOMPurify.sanitize(text, {
      ALLOWED_TAGS: ["strong", "p", "em", "u", "s", "a", "ul", "li", "b"],
    });

  let cleanupAndParse = (text) => {
    let cleaned = sanitizeHtml(text);
    let parsed = <React.Fragment>{parse(cleaned)}</React.Fragment>;
    return parsed;
  };

  return <div>{cleanupAndParse(data)}</div>;
};

export default observer(RichTextDisplay);
