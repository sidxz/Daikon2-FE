import { observer } from "mobx-react-lite";
import { Divider } from "primereact/divider";
import { TabPanel, TabView } from "primereact/tabview";
import { appColors } from "../../../constants/colors";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import TableCustomizationDefaults from "../../../Library/TableCustomization/TableCustomizationDefaults";
import {
  AllPhColumns,
  PhHitsTableType,
} from "../../Flow/FlowScreen/FSPhViewer/FSPhVHitCollection/FSPhVHits/FSPhVHitsHelper/FSPhVHitsConstants";
import {
  AllTbColumns,
  TbHitsTableType,
} from "../../Flow/FlowScreen/FSTbViewer/FSTbVHitCollection/FSTbVHits/FSTbVHitsHelper/FSTbVHitsConstants";

const AdminTableManagement = () => {
  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          icon="pi pi-table"
          heading="Table Management"
          color={appColors.admin.userManagement.users}
        />
      </div>
      <TabView>
        <TabPanel header="Target Based Hits Table">
          <div className="flex w-full font-bold text-xl">
            Customize defaults for Target Based Hits Table
          </div>
          <div className="flex w-full">
            <Divider />
          </div>
          <div className="flex w-full">
            <TableCustomizationDefaults
              tableType={TbHitsTableType}
              allColumns={AllTbColumns}
            />
          </div>
        </TabPanel>
        <TabPanel header="Phenotypic Hits Table">
          <div className="flex w-full font-bold text-xl">
            Customize defaults for Phenotypic Hits Table
          </div>
          <div className="flex w-full">
            <Divider />
          </div>
          <div className="flex w-full">
            <TableCustomizationDefaults
              tableType={PhHitsTableType}
              allColumns={AllPhColumns}
            />
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default observer(AdminTableManagement);
