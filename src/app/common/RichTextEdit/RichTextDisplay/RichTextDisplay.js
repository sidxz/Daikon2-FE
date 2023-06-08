import DOMPurify from "dompurify";
import parse from "html-react-parser";
import React from "react";

const RichTextDisplay = ({ data }) => {
  let sanitizeHtml = (text) =>
    DOMPurify.sanitize(text, {
      ALLOWED_TAGS: ["strong", "p", "em", "u", "s", "a", "ul", "li"],
    });

  let cleanupAndParse = (text) => {
    let cleaned = sanitizeHtml(text);
    let parsed = <React.Fragment>{parse(cleaned)}</React.Fragment>;
    return parsed;
  };

  return <div>{cleanupAndParse(data)}</div>;
};

export default RichTextDisplay;
