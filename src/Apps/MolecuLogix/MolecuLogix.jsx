import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";
import MDisclose from "./MDisclose/MDisclose";
import MPreDisclose from "./MDisclose/middleware/MPreDisclose";
import MLogixComments from "./MLogixComments/MLogixComments";
import MLogixDisclosureReport from "./MLogixDisclosureReport/MLogixDisclosureReport";
import MLogixDocs from "./MLogixDocs/MLogixDocs";
import MLogixDraw from "./MLogixDraw/MLogixDraw";
import MLogixMenuBar from "./MLogixMenuBar/MLogixMenuBar";
import MLogixMoleculeEdit from "./MLogixMoleculeEdit/MLogixMoleculeEdit";
import MLogixMoleculeView from "./MLogixMoleculeView/MLogixMoleculeView";
import MLogixSearch from "./MLogixSearch/MLogixSearch";

const MolecuLogix = () => {
  return (
    <div className="flex flex-column">
      <div className="block mb-2">
        <MLogixMenuBar />
      </div>
      <div className="flex w-full pl-3 pr-3 fadein animation-duration-1000">
        <Routes>
          <Route index element={<Navigate to="search/" />} />
          <Route path="molecule/:id/edit" element={<MLogixMoleculeEdit />} />
          <Route path="molecule/:id/docs" element={<MLogixDocs />} />
          <Route path="molecule/:id/discussion" element={<MLogixComments />} />
          <Route path="molecule/:id" element={<MLogixMoleculeView />} />
          <Route path="search/" element={<MLogixSearch />} />
          <Route path="draw/*" element={<MLogixDraw />} />
          <Route path="disclose/pre/*" element={<MPreDisclose />} />
          <Route path="disclose/*" element={<MDisclose />} />
          <Route
            path="disclosure-report/*"
            element={<MLogixDisclosureReport />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default MolecuLogix;
