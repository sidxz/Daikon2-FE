import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
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
        <NavLink to="/d/gene/" style={{ textDecoration: "None" }}>
          <HomeCardsCircles
            icon="icon icon-conceptual icon-dna"
            total={appVars.appCount.geneCount}
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="/d/target/" style={{ textDecoration: "None" }}>
          <HomeCardsCircles
            icon="icon icon-common icon-target"
            total={appVars.appCount.targetCount}
            // active="105"
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="/d/screen/" style={{ textDecoration: "None" }}>
          <HomeCardsCircles
            icon="icon icon-common icon-search"
            total={appVars.appCount.screenCount}
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="/d/ha/" style={{ textDecoration: "None" }}>
          <HomeCardsCircles
            icon="icon icon-conceptual icon-chemical"
            total={appVars.appCount.haCount}
          />
        </NavLink>
      </div>

      <div className="flex">
        <NavLink to="/d/portfolio/" style={{ textDecoration: "None" }}>
          <HomeCardsCircles
            icon="icon icon-common icon-analyse"
            total={appVars.appCount.portfolioCount}
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="/d/post-portfolio/" style={{ textDecoration: "None" }}>
          <HomeCardsCircles
            icon="icon icon-common icon-drug"
            total={appVars.appCount.postPortfolioCount}
          />
        </NavLink>
      </div>
    </div>
  );
};

export default HomeCards;
