import { configure } from "mobx";
import { createContext } from "react";
import AdminRoleManagementStore from "./Apps/Admin/AdminRoleManagement/Stores/AdminRoleManagementStore";
import AdminUserManagementStore from "./Apps/Admin/AdminUserManagement/Stores/AdminUserManagementStore";
import CommentStore from "./Apps/Comments/Stores/CommentStore";
import GeneCrispriStrainStore from "./Apps/Flow/FlowGene/Stores/GeneCrispriStrainStore";
import GeneEssentialityStore from "./Apps/Flow/FlowGene/Stores/GeneEssentialityStore";
import GeneHypomorphStore from "./Apps/Flow/FlowGene/Stores/GeneHypomorphStore";
import GenePDBCrossRefStore from "./Apps/Flow/FlowGene/Stores/GenePDBCrossRefStore";
import GeneProteinActivityAssayStore from "./Apps/Flow/FlowGene/Stores/GeneProteinActivityAssayStore";
import GeneProteinProductionStore from "./Apps/Flow/FlowGene/Stores/GeneProteinProductionStore";
import GeneResistanceMutationStore from "./Apps/Flow/FlowGene/Stores/GeneResistanceMutationStore";
import GeneStore from "./Apps/Flow/FlowGene/Stores/GeneStore";
import GeneUnpublishedStructuralInformationStore from "./Apps/Flow/FlowGene/Stores/GeneUnpublishedStructuralInformationStore";
import GeneVulnerabilityStore from "./Apps/Flow/FlowGene/Stores/GeneVulnerabilityStore";
import HAStore from "./Apps/Flow/FlowHA/Stores/HAStore";
import HaCompoundEvoStore from "./Apps/Flow/FlowHA/Stores/HaCompoundEvoStore";
import ProjectCompoundEvoStore from "./Apps/Flow/FlowPortfolio/Stores/ProjectCompoundEvoStore";
import ProjectStore from "./Apps/Flow/FlowPortfolio/Stores/ProjectStore";
import HitCollectionStore from "./Apps/Flow/FlowScreen/Stores/HitCollectionStore";
import HitStore from "./Apps/Flow/FlowScreen/Stores/HitStore";
import ScreenRunStore from "./Apps/Flow/FlowScreen/Stores/ScreenRunStore";
import ScreenStore from "./Apps/Flow/FlowScreen/Stores/ScreenStore";
import TargetPQStore from "./Apps/Flow/FlowTarget/Stores/TargetPQStore";
import TargetSafetyAssessmentStore from "./Apps/Flow/FlowTarget/Stores/TargetSafetyAssessmentStore";
import TargetSourcingStore from "./Apps/Flow/FlowTarget/Stores/TargetSourcingStore";
import TargetStore from "./Apps/Flow/FlowTarget/Stores/TargetStore";
import MoleculeAssociationStore from "./Apps/MolecuLogix/Stores/MoleculeAssociationStore";
import MoleculeStore from "./Apps/MolecuLogix/Stores/MoleculeStore";
import QnaireStore from "./Apps/Questionnaire/Stores/QnaireStore";
import AuthStore from "./Auth/AuthStore";
import HorizonStore from "./Library/Horizon/HorizonStore";

configure({ enforceActions: "always" });

export class RootStore {
  // Stores

  authStore;

  geneStore;
  genePDBCrossRefStore;
  geneEssentialityStore;
  geneProteinProductionStore;
  geneProteinActivityAssayStore;
  geneHypomorphStore;
  geneCrispriStrainStore;
  geneResistanceMutationStore;
  geneVulnerabilityStore;
  geneUnpublishedStructuralInformationStore;

  targetStore;
  targetSourcingStore;
  targetPQStore;
  targetSafetyAssessmentStore;

  screenStore;
  screenRunStore;
  hitCollectionStore;
  hitStore;

  haStore;
  haCompoundEvoStore;

  projectStore;
  projectCompoundEvoStore;

  moleculeStore;

  adminUserManagementStore;
  adminRoleManagementStore;

  qnaireStore;

  horizonStore;
  moleculeAssociationStore;

  commentStore;
  constructor() {
    /* Auth */
    this.authStore = new AuthStore(this);

    /* Gene */
    this.geneStore = new GeneStore(this);
    this.genePDBCrossRefStore = new GenePDBCrossRefStore(this);
    this.geneEssentialityStore = new GeneEssentialityStore(this);
    this.geneProteinProductionStore = new GeneProteinProductionStore(this);
    this.geneProteinActivityAssayStore = new GeneProteinActivityAssayStore(
      this
    );
    this.geneHypomorphStore = new GeneHypomorphStore(this);
    this.geneCrispriStrainStore = new GeneCrispriStrainStore(this);
    this.geneResistanceMutationStore = new GeneResistanceMutationStore(this);
    this.geneVulnerabilityStore = new GeneVulnerabilityStore(this);
    this.geneUnpublishedStructuralInformationStore =
      new GeneUnpublishedStructuralInformationStore(this);

    /* Target */
    this.targetStore = new TargetStore(this);
    this.targetSourcingStore = new TargetSourcingStore(this);
    this.targetPQStore = new TargetPQStore(this);
    this.targetSafetyAssessmentStore = new TargetSafetyAssessmentStore(this);

    /* Screen */
    this.screenStore = new ScreenStore(this);
    this.screenRunStore = new ScreenRunStore(this);
    this.hitCollectionStore = new HitCollectionStore(this);
    this.hitStore = new HitStore(this);

    /* HA */
    this.haStore = new HAStore(this);
    this.haCompoundEvoStore = new HaCompoundEvoStore(this);

    /* Project */
    this.projectStore = new ProjectStore(this);
    this.projectCompoundEvoStore = new ProjectCompoundEvoStore(this);

    /* MLogix */
    this.moleculeStore = new MoleculeStore(this);

    /* Admin */
    this.adminUserManagementStore = new AdminUserManagementStore(this);
    this.adminRoleManagementStore = new AdminRoleManagementStore(this);

    /* Questionnaire */
    this.qnaireStore = new QnaireStore(this);

    /* Horizon */
    this.horizonStore = new HorizonStore(this);
    this.moleculeAssociationStore = new MoleculeAssociationStore(this);

    /* Comments */
    this.commentStore = new CommentStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
