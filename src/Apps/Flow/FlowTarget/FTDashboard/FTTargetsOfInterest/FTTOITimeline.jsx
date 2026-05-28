import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { RootStoreContext } from "../../../../../RootStore";

const FTTOITimeline = () => {
  const rootStore = useContext(RootStoreContext);
  const { cohorts, selectedCohortIndex, setSelectedCohortIndex } =
    rootStore.targetNominationStore;

  if (!cohorts.length) return null;

  const handleSliderChange = (e) => {
    setSelectedCohortIndex(Number(e.target.value));
  };

  const handleTickClick = (index) => {
    setSelectedCohortIndex(index);
  };

  return (
    <div className="ftoi-timeline-bar">
      <div className="ftoi-slider-wrap">
        <input
          type="range"
          className="ftoi-slider"
          min={0}
          max={cohorts.length - 1}
          step={1}
          value={selectedCohortIndex}
          onChange={handleSliderChange}
        />
        <div className="ftoi-ticks">
          {cohorts.map((cohort, i) => (
            <span
              key={cohort}
              className={`ftoi-tick${i === selectedCohortIndex ? " active" : ""}`}
              onClick={() => handleTickClick(i)}
              title={cohort}
            >
              {cohort}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default observer(FTTOITimeline);
