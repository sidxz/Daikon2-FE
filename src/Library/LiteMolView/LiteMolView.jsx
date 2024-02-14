import LiteMol from "litemol";
import React, { useEffect, useRef } from "react";
import "./LiteMol.css";

const LiteMolView = ({ id, url, format }) => {
  const targetRef = useRef(null);

  useEffect(() => {
    if (!targetRef.current) {
      return;
    }

    const plugin = LiteMol.Plugin.create({
      target: targetRef.current,
      viewportBackground: "#fff",
      layoutState: {
        hideControls: true,
        isExpanded: false,
      },
    });

    plugin.loadMolecule({
      id: id,
      url: url,
      format: format,
    });

    return () => {
      plugin.destroy();
    };
  }, [format, id, url]);

  return (
    <div
      id="litemol"
      style={{
        width: "600px",
        height: "600px",
        marginTop: "0px",
        position: "relative",
        overflowY: "hidden",
        overflowX: "hidden",
      }}
      ref={targetRef} // Attach the `useRef` created ref here
    ></div>
  );
};

export default LiteMolView;
