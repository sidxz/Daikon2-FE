import { observer } from "mobx-react-lite";
import { Route, Routes } from "react-router-dom";
import FTDashboard from "./FTDashboard/FTDashboard";
import FTViewer from "./FTViewer/FTViewer";
import FTApprovalDash from "./Sourcing/FTApprovalDash/FTApprovalDash";
import FTApprovalView from "./Sourcing/FTApprovalView/FTApprovalView";
import FTImportData from "./Sourcing/FTImportData/FTImportData";
import TargetPromotionQuestionnaire from "./Sourcing/TargetPromotionQuestionnaire/TargetPromotionQuestionnaire";

const FlowTarget = () => {
  return (
    <>
      <Routes>
        <Route index element={<FTDashboard />} />
        <Route
          path="sourcing/tpq/*"
          element={<TargetPromotionQuestionnaire />}
        />
        <Route path="sourcing/approval/:id/*" element={<FTApprovalView />} />
        <Route path="sourcing/approval/" element={<FTApprovalDash />} />
        <Route path="viewer/:id/*" element={<FTViewer />} />
        <Route path="sourcing/import/*" element={<FTImportData />} />
      </Routes>
    </>
  );
};

export default observer(FlowTarget);
