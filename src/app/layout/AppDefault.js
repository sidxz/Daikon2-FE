// Importing necessary libraries and components
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";

// Importing scenes
import GeneSearch from "../../scene-d/Gene/GeneSearch/GeneSearch";
import GeneGroups from "../../scene-d/Gene/GeneView/GeneGroups/GeneGroups";
import GenePromotionRequests from "../../scene-d/Gene/GeneView/GenePromotionRequests/GenePromotionRequests";
import GeneView from "../../scene-d/Gene/GeneView/GeneView";
import HADash from "../../scene-d/HA/HADash/HADash";
import HAView from "../../scene-d/HA/HAView/HAView";
import Home from "../../scene-d/Home/Home";
import PortfolioDash from "../../scene-d/Portfolio/PortfolioDash/PortfolioDash";
import PortfolioView from "../../scene-d/Portfolio/PortfolioView/PortfolioView";
import PostPortfolioDash from "../../scene-d/PostPortfolio/PostPortfolioDash/PostPortfolioDash";
import PostPortfolioView from "../../scene-d/PostPortfolio/PostPortfolioView/PostPortfolioView";
import ScreenDashboard from "../../scene-d/Screen/ScreenDashboard/ScreenDashboard";
import PhenotypicScreenView from "../../scene-d/Screen/ScreenView/PhenotypicScreenView/PhenotypicScreenView";
import TargetDash from "../../scene-d/Target/TargetDash/TargetDash";
import TargetView from "../../scene-d/Target/TargetView/TargetView";
import { DataReorganizationInProgress } from "../common/DataReorganizationInProgress/DataReorganizationInProgress";
import { RootStoreContext } from "../stores/rootStore";

// Importing other components
import GenePromote from "../../scene-d/Gene/GenePromote/GenePromote";
import TargetBasedScreenView from "../../scene-d/Screen/ScreenView/TargetBasedScreenView/TargetBasedScreenView";
import MenuBar from "./MenuBar/MenuBar";
import NotFound from "./NotFound/NotFound";

/**
 * The main application component that sets up all the routes for the application.
 * It uses the RootStoreContext to access user roles to control access to certain routes.
 */
const AppDefault = () => {
  // Getting the rootStore from context
  const rootStore = useContext(RootStoreContext);
  // Extracting the user from the userStore
  const { user } = rootStore.userStore;

  return (
    <div className="flex flex-column">
      <div className="block mb-2">
        <MenuBar />
      </div>
      <div className="flex w-full pl-3 pr-3 fadein animation-duration-1000">
        <Routes>
          {/* Default route (home page) */}
          <Route index element={<Home />} />
          {/* Gene related routes */}
          <Route path="gene/*" element={<GeneSearch />} />
          <Route path="gene/gene-group" element={<GeneGroups />} />
          <Route
            path="gene/gene-promotion-requests"
            element={<GenePromotionRequests />}
          />
          {/* Currently disabled for all except for admin */}
          <Route
            path="gene/promote/:proposedTargetName"
            element={
              user.roles.includes("admin") ? <GenePromote /> : <NotFound />
            }
          />

          {/* Fallback for an invalid path */}
          <Route path="gene/:id/*" element={<GeneView />} />
          {/* Target related routes */}
          <Route path="target/*" element={<TargetDash />} />
          <Route path="target/:id/*" element={<TargetView />} />
          {/* Screen related routes */}
          <Route path="screen/*" element={<ScreenDashboard />} />
          <Route
            path="screen/target-based/:id/*"
            element={<TargetBasedScreenView />}
          />
          {/* Phenotypic Screen Routes */}
          {/* Currently disabled for all except for screening group */}
          <Route
            path="screen/phenotypic/:id/*"
            element={
              user.roles.includes("screener") ? (
                <PhenotypicScreenView />
              ) : (
                <DataReorganizationInProgress />
              )
            }
          />
          {/* Hit Assessment related routes */}
          <Route path="ha/*" element={<HADash />} />
          <Route path="ha/:id/*" element={<HAView />} />
          {/* Portfolio related routes */}
          <Route path="portfolio/*" element={<PortfolioDash />} />
          <Route path="portfolio/:id/*" element={<PortfolioView />} />
          {/* Post Portfolio related routes */}
          <Route path="post-portfolio/*" element={<PostPortfolioDash />} />
          <Route path="post-portfolio/:id/*" element={<PostPortfolioView />} />
          {/* Catch-all route for non-defined paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default observer(AppDefault);
