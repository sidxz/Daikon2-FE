/**
 * RootStore: Main MobX store that includes all the sub-stores.
 *
 * @class RootStore
 */

import { configure } from "mobx";
import { createContext } from "react";
import AdminStore from "./admin/adminStore";
import CompoundStore from "./compound/compoundStore";
import DataViewStore from "./dataView/dataViewStore";
import DiscussionStore from "./discussion/discussionStore";
import GenePromotionStore from "./gene/genePromotionStore";
import GeneStore from "./gene/geneStore";
import GeneStoreAdmin from "./gene/geneStoreAdmin";
import CompoundEvolutionStore from "./project/compoundEvolutionStore";
import HAStore from "./project/haStore";
import PortfolioStore from "./project/portfolioStore";
import PostPortfolioStore from "./project/postPortfolioStore";
import ProjectStore from "./project/projectStore";
import HitsStore from "./screen/hitsStore";
import ScreenPStore from "./screen/screenPStore";
import ScreenTStore from "./screen/screenTStore";
import AppSettingsStore from "./settings/appSettingsStore";
import GeneralStore from "./settings/generalStore";
import MsStore from "./settings/msStore";
import TargetStore from "./target/targetStore";
import TargetStoreAdmin from "./target/targetStoreAdmin";
import TargetPTDataManagement from "./targetPromotionTool/targetPTDataManagement";
import TargetPTQuestionnaireMetaStore from "./targetPromotionTool/targetPTQuestionnaireMetaStore";
import UserStore from "./user/userStore";
import VotingStore from "./voting/VotingStore";

// Enforcing that all state changes are done through actions
configure({ enforceActions: "always" });

export class RootStore {
  // Declaring the store variables
  adminStore;
  appSettingsStore;
  compoundStore;
  dataViewStore;
  discussionStore;
  generalStore;
  geneStore;
  geneStoreAdmin;
  haStore;
  hitsStore;
  msStore;
  portfolioStore;
  postPortfolioStore;
  projectStore;
  screenPStore;
  screenTStore;
  targetStore;
  targetStoreAdmin;
  userStore;
  votingStore;
  targetPTQuestionnaireMetaStore;
  genePromotionStore;
  targetPTDataManagement;
  compoundEvolutionStore;

  /**
   * constructor: Initializes the sub-stores.
   *
   * @param {none}
   */
  constructor() {
    this.adminStore = new AdminStore(this);
    this.appSettingsStore = new AppSettingsStore(this);
    this.compoundStore = new CompoundStore(this);
    this.dataViewStore = new DataViewStore(this);
    this.discussionStore = new DiscussionStore(this);
    this.generalStore = new GeneralStore(this);
    this.geneStore = new GeneStore(this);
    this.geneStoreAdmin = new GeneStoreAdmin(this);
    this.haStore = new HAStore(this);
    this.hitsStore = new HitsStore(this);
    this.msStore = new MsStore(this);
    this.portfolioStore = new PortfolioStore(this);
    this.postPortfolioStore = new PostPortfolioStore(this);
    this.projectStore = new ProjectStore(this);
    this.screenPStore = new ScreenPStore(this);
    this.screenTStore = new ScreenTStore(this);
    this.targetStore = new TargetStore(this);
    this.targetStoreAdmin = new TargetStoreAdmin(this);
    this.userStore = new UserStore(this);
    this.votingStore = new VotingStore(this);
    this.targetPTQuestionnaireMetaStore = new TargetPTQuestionnaireMetaStore(
      this
    );
    this.genePromotionStore = new GenePromotionStore(this);
    this.targetPTDataManagement = new TargetPTDataManagement(this);
    this.compoundEvolutionStore = new CompoundEvolutionStore(this);
  }
}

// Exporting an instance of RootStore as a context
export const RootStoreContext = createContext(new RootStore());
