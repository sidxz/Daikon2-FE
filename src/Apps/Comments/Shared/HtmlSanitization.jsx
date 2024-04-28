import DOMPurify from "dompurify";
import parse from "html-react-parser";

const sanitizeHtml = (text) =>
  DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ["strong", "p", "em", "u", "s", "a", "ul", "li"],
  });

export const cleanupAndParse = (text) => {
  let cleaned = sanitizeHtml(text);
  let parsed = <>{parse(cleaned)}</>;
  return parsed;
};
