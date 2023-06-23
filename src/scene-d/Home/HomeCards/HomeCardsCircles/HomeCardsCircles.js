import React from "react";

const HomeCardsCircles = ({ icon, total, active }) => {
  let activeComponent = (
    <div className="flex">
      <h3 style={{ margin: "0", padding: "0", color: "#44aa99" }}>{active}</h3>
    </div>
  );
  let totalComponent = (
    <div className="flex">
      <h3 style={{ margin: "0", padding: "0" }}>{total}</h3>
    </div>
  );
  return (
    <div className="card">
      <div className="card-container">
        <div className="flex flex-wrap justify-center">
          <div className="border-circle w-8rem h-8rem pt-1 bg-white flex items-center justify-content-center">
            <div className="flex flex-column align-items-center">
              <div className="flex align-items-center pt-3 pb-2">
                <i
                  className={icon}
                  style={{ fontSize: "xx-large", color: "#332288" }}
                ></i>
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

export default HomeCardsCircles;
