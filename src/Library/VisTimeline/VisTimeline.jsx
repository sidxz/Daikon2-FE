import React, { useEffect, useRef } from "react";
import { Timeline } from "vis-timeline/standalone";

const VisTimeline = ({ items, options }) => {
  const timelineRef = useRef(null); // Create a ref for the DOM element

  useEffect(() => {
    // Initialize timeline when component mounts
    const timeline = new Timeline(timelineRef.current, items, options);

    // Cleanup function to be called when component unmounts
    return () => {
      timeline.destroy();
    };
  }, [items, options]); // This effect depends on items and options, it'll re-run when they change

  return <div ref={timelineRef} style={{ height: "auto", width: "100%" }} />;
};

export default VisTimeline;
