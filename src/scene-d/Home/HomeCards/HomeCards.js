import React, { useContext } from "react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import HomeCardsCircles from "./HomeCardsCircles/HomeCardsCircles";

const HomeCards = () => {
  //const header = <img alt="Card" src="/images/usercard.png" />;
  const header = null;

  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.generalStore;

  return (
    <div className="flex justify-content-center gap-5 mt-2 ">
      <div className="flex">
        <HomeCardsCircles
          icon="icon icon-conceptual icon-dna"
          total={appVars.appCount.geneCount}
        />
      </div>
      <div className="flex">
        <HomeCardsCircles
          icon="icon icon-common icon-target"
          total={appVars.appCount.targetCount}
          // active="105"
        />
      </div>
      <div className="flex">
        <HomeCardsCircles
          icon="icon icon-common icon-search"
          total={appVars.appCount.screenCount}
        />
      </div>
      <div className="flex">
        <HomeCardsCircles
          icon="icon icon-conceptual icon-chemical"
          total={appVars.appCount.haCount}
        />
      </div>
      <div className="flex">
        <HomeCardsCircles
          icon="icon icon-common icon-analyse"
          total={appVars.appCount.portfolioCount}
        />
      </div>
      <div className="flex">
        <HomeCardsCircles
          icon="icon icon-common icon-drug"
          total={appVars.appCount.postPortfolioCount}
        />
      </div>
    </div>
  );
};

export default HomeCards;
