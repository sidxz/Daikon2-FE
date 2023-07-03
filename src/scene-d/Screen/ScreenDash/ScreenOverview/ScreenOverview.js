import React from "react";

const ScreenOverview = () => {
  return (
    <div class="card">
      <div class="flex card-container">
        <div class="flex-1 h-4rem surface-ground text-black font-bold text-center p-4 border-round">
          Target-Based
        </div>
        <div class="flex-1 h-4rem surface-ground text-black font-bold text-center p-4 border-round mx-4">
          Phenotypic
        </div>
      </div>
      <div class="flex flex-column card-container mt-4 pr-4">
        <div class="flex align-items-center justify-content-center h-4rem surface-ground font-bold text-black border-round">
          All Screens
        </div>
      </div>
    </div>
  );
};

export default ScreenOverview;
