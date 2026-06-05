import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { RootStoreContext } from "../../../../../RootStore";

const FTTOIStatsBar = () => {
  const rootStore = useContext(RootStoreContext);
  const { stats } = rootStore.targetNominationStore;

  return (
    <div className="ftoi-stats-bar">
      <div className="ftoi-stat-box total">
        <span className="ftoi-stat-value">{stats.total}</span>
        <span className="ftoi-stat-label">Total</span>
      </div>
      <div className="ftoi-stat-box nominated">
        <span className="ftoi-stat-value">{stats.nominated}</span>
        <span className="ftoi-stat-label">Added</span>
      </div>
      <div className="ftoi-stat-box retained">
        <span className="ftoi-stat-value">{stats.retained}</span>
        <span className="ftoi-stat-label">Retained</span>
      </div>
      {/* <div className="ftoi-stat-box removed">
        <span className="ftoi-stat-value">{stats.removed}</span>
        <span className="ftoi-stat-label">Removed</span>
      </div> */}
    </div>
  );
};

export default observer(FTTOIStatsBar);
