import React from "react";

const FlowDashCardsCircles = ({ svgIcon, total, active }) => {
  let activeComponent = (
    <div className="flex">
      <h3 style={{ margin: "0", padding: "0", color: "#44aa99" }}>Active</h3>
    </div>
  );
  let totalComponent = (
    <div className="flex">
      <h3 style={{ margin: "0", padding: "0", color: "#808080" }}>{total}</h3>
    </div>
  );
  return (
    <div className="card">
      <div className="card-container">
        <div className="flex flex-wrap justify-center">
          <div className="border-circle w-8rem h-8rem pt-1 bg-white flex items-center justify-content-center">
            <div className="flex flex-column align-items-center">
              <div className="flex align-items-center pt-3 pb-2">
                <i style={{ fontSize: "xx-large", color: "#3c83bd" }}></i>
                <div className="flex align-items-center justify-content-center text-3xl">
                  {svgIcon ? svgIcon : <i className={icon} />}
                </div>
              </div>
              {total && totalComponent}
              {active && activeComponent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowDashCardsCircles;
