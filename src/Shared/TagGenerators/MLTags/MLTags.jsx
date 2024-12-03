import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";
import React from "react";
import { AIDocumentIcon } from "../../../Apps/Flow/icons/AIDocumentIcon";

const MLTags = ({ entity }) => {
  if (!entity) {
    return <></>;
  }
  const MLGeneratedTag = (
    <>
      <Tooltip target=".mlgen">
        Please verify before use, as AI outputs may not always be accurate.
      </Tooltip>
      <Tag
        style={{
          background:
            "linear-gradient(-225deg, #e3f2fd 0%, #bbdefb 48%, #90caf9 100%)",
        }}
        className="mlgen"
        tooltipOptions={{ showDelay: 1000, hideDelay: 300 }}
      >
        <div className="flex align-items-center">
          <AIDocumentIcon className="mr-2" />
          <span className="text-xs text-color">ML Generated</span>
        </div>
      </Tag>
    </>
  );

  const UnverifiedTag = (
    <Tag
      style={{
        background:
          "linear-gradient(-225deg, #b0bec5 0%, #90a4ae 48%, #78909c 100%)",
      }}
    >
      <div className="flex align-items-center">
        <i className="icon icon-common icon-unreviewed-data pr-2"></i>
        <span className="text-xs">Unreviewed</span>
      </div>
    </Tag>
  );

  const VerifiedTag = (
    <Tag
      style={{
        background:
          "linear-gradient(-225deg, #388e3c 0%, #2e7d32 48%, #1b5e20 100%)",
      }}
    >
      <div className="flex align-items-center">
        <i className="ri-check-double-line pr-1"></i>
        <span className="text-xs">Reviewed</span>
      </div>
    </Tag>
  );

  return (
    <div className="flex gap-1">
      <div className="flex">{MLGeneratedTag}</div>
      {/* <div className="flex">{UnverifiedTag}</div> */}
      {/* <div className="flex">{VerifiedTag}</div> */}
    </div>
  );
};

export default MLTags;
