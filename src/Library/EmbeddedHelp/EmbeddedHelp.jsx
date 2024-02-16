import React from "react";

const EmbeddedHelp = ({ children }) => {
  return (
    <div className="flex align-content-center gap-1 p-1">
      {/* <div className="flex align-items-center">
        <i className="icon icon-common icon-info font-light text-color-secondary" />
      </div> */}
      <div className="flex p-1 text-sm font-light text-color-secondary">
        {children}
      </div>
    </div>
  );
};

export default EmbeddedHelp;
