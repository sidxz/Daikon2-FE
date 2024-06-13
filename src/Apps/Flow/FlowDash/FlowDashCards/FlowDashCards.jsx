import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { RootStoreContext } from "../../../../RootStore";
import { GeneIcon } from "../../icons/GeneIcon";
import { HAIcon } from "../../icons/HAIcon";
import { PortfolioIcon } from "../../icons/PortfolioIcon";
import { PostPortfolioIcon } from "../../icons/PostPortfolioIcon";
import { ScreenIcon } from "../../icons/ScreenIcon";
import { TargetIcon } from "../../icons/TargetIcon";
import FlowDashCardsCircles from "./FlowDashCardsCircles/FlowDashCardsCircles";

const FlowDashCards = () => {
  const rootStore = useContext(RootStoreContext);

  const { isGeneListCacheValid, isGeneListLoading, geneList, fetchGenes } =
    rootStore.geneStore;

  const {
    targetList,
    isFetchingTargets,
    fetchTargets,
    isTargetListCacheValid,
  } = rootStore.targetStore;

  const {
    fetchScreens,
    isScreenListCacheValid,
    screenList,
    isFetchingScreens,
  } = rootStore.screenStore;

  const { fetchHAs, isHaListCacheValid, haList, isFetchingHAs } =
    rootStore.haStore;

  const {
    fetchProjects,
    isProjectListCacheValid,
    portfolioList,
    postPortfolioList,
    isFetchingProjects,
  } = rootStore.projectStore;

  useEffect(() => {
    if (!isProjectListCacheValid) {
      fetchProjects();
    }
  }, [isProjectListCacheValid, fetchProjects]);

  useEffect(() => {
    if (!isHaListCacheValid) {
      fetchHAs();
    }
  }, [isHaListCacheValid, fetchHAs]);

  useEffect(() => {
    if (!isScreenListCacheValid) {
      fetchScreens();
    }
  }, [isScreenListCacheValid, fetchScreens]);

  useEffect(() => {
    if (!isGeneListCacheValid) {
      fetchGenes();
    }
  }, [isGeneListCacheValid, fetchGenes]);

  useEffect(() => {
    if (!isTargetListCacheValid) {
      fetchTargets();
    }
  }, [fetchTargets, isTargetListCacheValid]);

  // commented out loading to do a background fetch and not block the main dashboard

  // if (
  //   isGeneListLoading ||
  //   isFetchingTargets ||
  //   isFetchingScreens ||
  //   isFetchingHAs ||
  //   isFetchingProjects
  // ) {
  //   return (
  //     <Loading
  //       message={
  //         isGeneListLoading
  //           ? "Fetching Genes..."
  //           : isFetchingTargets
  //           ? "Fetching Targets..."
  //           : isFetchingScreens
  //           ? "Fetching Screens..."
  //           : isFetchingHAs
  //           ? "Fetching HAs..."
  //           : isFetchingProjects
  //           ? "Fetching Projects..."
  //           : "Fetching..."
  //       }
  //     />
  //   );
  // }

  const geneListLength = geneList ? geneList.length : 0;
  const targetListLength = targetList ? targetList.length : 0;
  const screenListLength = screenList ? screenList.length : 0;
  const haListLength = haList ? haList.length : 0;
  const portfolioListLength = portfolioList ? portfolioList.length : 0;
  const postPortfolioListLength = postPortfolioList
    ? postPortfolioList.length
    : 0;

  return (
    <div className="flex justify-content-center gap-5 mt-2 ">
      {" "}
      <div className="flex">
        <NavLink to="gene/" style={{ textDecoration: "None" }}>
          <FlowDashCardsCircles
            svgIcon={<GeneIcon size={"25em"} />}
            total={geneListLength}
            isLoading={isGeneListLoading}
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="target/" style={{ textDecoration: "None" }}>
          <FlowDashCardsCircles
            // icon="icon icon-common icon-target"
            svgIcon={<TargetIcon size={"25em"} />}
            total={targetListLength}
            isLoading={isFetchingTargets}
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="screen/" style={{ textDecoration: "None" }}>
          <FlowDashCardsCircles
            // icon="icon icon-common icon-search"
            svgIcon={<ScreenIcon size={"25em"} />}
            total={screenListLength}
            isLoading={isFetchingScreens}
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="ha/" style={{ textDecoration: "None" }}>
          <FlowDashCardsCircles
            //  icon="icon icon-common icon-search"
            svgIcon={<HAIcon size={"25em"} />}
            total={haListLength}
            isLoading={isFetchingHAs}
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="portfolio/" style={{ textDecoration: "None" }}>
          <FlowDashCardsCircles
            // icon="icon icon-common icon-search"
            svgIcon={<PortfolioIcon size={"25em"} />}
            total={portfolioListLength}
            isLoading={isFetchingProjects}
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="post-portfolio/" style={{ textDecoration: "None" }}>
          <FlowDashCardsCircles
            // icon="icon icon-common icon-search"
            svgIcon={<PostPortfolioIcon size={"25em"} />}
            total={postPortfolioListLength}
            isLoading={isFetchingProjects}
          />
        </NavLink>
      </div>
    </div>
  );
};

export default observer(FlowDashCards);
