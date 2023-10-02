import { observer } from "mobx-react-lite";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import EmbeddedHelp from "../../../../app/common/EmbeddedHelp/EmbeddedHelp";
import Loading from "../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../app/stores/rootStore";
import ScreenAdd from "./ScreenAdd/ScreenAdd";
import ScreenDelete from "./ScreenDelete/ScreenDelete";
import ScreenDiscussion from "./ScreenDiscussion/ScreenDiscussion";
import ScreenEdit from "./ScreenEdit/ScreenEdit";
import ScreenMerge from "./ScreenMerge/ScreenMerge";
import ScreenSequences from "./ScreenSequences/ScreenSequences";
import UpdateTargetAssociation from "./UpdateTargetAssociation/UpdateTargetAssociation";
import ValidatedHits from "./ValidatedHits/ValidatedHits";

const TargetBasedScreenView = () => {
  const params = useParams();
  const navigate = useNavigate();

  const toast = useRef(null);

  /* MobX Store */
  const rootStore = useContext(RootStoreContext);
  const {
    isLoadingTargetBasedScreens,
    targetBasedScreenRegistry,
    fetchTargetBasedScreens,
    selectedScreenTargetFilter,
    filterTargetBasedScreensByTarget,
    filteredScreens,
  } = rootStore.screenTStore;
  const { user } = rootStore.userStore;

  useEffect(() => {
    if (
      targetBasedScreenRegistry.size === 0 ||
      selectedScreenTargetFilter !== params.id
    ) {
      fetchTargetBasedScreens().then(() => {
        filterTargetBasedScreensByTarget(params.id);
      });
    }
  }, [
    fetchTargetBasedScreens,
    targetBasedScreenRegistry,
    filterTargetBasedScreensByTarget,
    params.id,
    selectedScreenTargetFilter,
  ]);

  const [displayPromotionDialog, setDisplayPromotionDialog] = useState(false);

  const [displayMergeScreenDialog, setDisplayMergeScreenDialog] =
    useState(false);
  const [displayEditScreenDialog, setDisplayEditScreenDialog] = useState(false);

  if (!isLoadingTargetBasedScreens && filteredScreens.length === 0) {
    return (
      <div className="flex justify-content-center w-full">
        <div className="flex flex-column">
          <div className="flex align-items-center">
            <h2>No Screens found</h2>
          </div>
          <div className="flex align-items-center">
            <EmbeddedHelp>
              To create a screen visit the targets page{" "}
            </EmbeddedHelp>
          </div>
        </div>
      </div>
    );
  }

  const SideMenuItems = [
    {
      label: "Sections",
      items: [
        {
          label: "Screens",
          icon: "icon icon-common icon-circle-notch",
          command: () => {
            navigate("screen-sequence/");
          },
        },
        {
          label: "Validated Hits",
          icon: "icon icon-conceptual icon-structures-3d",
          command: () => {
            navigate("validates-hit/");
          },
        },
        {
          label: "Discussion",
          icon: "ri-discuss-line",
          command: () => {
            navigate("discussion/");
          },
        },
      ],
    },
    {
      label: "Actions",
      items: [
        {
          label: "Add a Screen",
          icon: "icon icon-common icon-database-submit",
          command: () => {
            setDisplayPromotionDialog(true);
          },
        },
      ],
    },
  ];

  if (user.roles.includes("admin")) {
    const adminActions = {
      label: "Admin Section",
      items: [
        {
          label: "Edit",
          icon: "icon icon-common icon-edit",
          command: () => {
            setDisplayEditScreenDialog(true);
          },
        },
        {
          label: "Merge",
          icon: "icon icon-common icon-compress",
          command: () => {
            setDisplayMergeScreenDialog(true);
          },
        },
        {
          label: "Update Target Association",
          icon: "icon icon-common icon-target",
          command: () => {
            navigate("update-target-association/");
          },
        },
        {
          label: "Delete",
          icon: "icon icon-common icon-remove",
          command: () => {
            navigate("delete/");
          },
        },
      ],
    };
    SideMenuItems.push(adminActions);
  }

  if (!isLoadingTargetBasedScreens && targetBasedScreenRegistry.size >= 0) {
    return (
      <React.Fragment>
        <Toast ref={toast} />

        <div className="flex gap-1 w-full">
          <div className="flex">
            <Menu model={SideMenuItems} />
          </div>

          <div className="flex w-full w-10">
            <Routes>
              <Route
                index
                element={<Navigate replace to="screen-sequence/" />}
              />
              <Route
                path="screen-sequence/"
                element={<ScreenSequences TargetName={params.id} />}
              />
              <Route
                path="validates-hit/"
                element={<ValidatedHits TargetName={params.id} />}
              />
              <Route
                path="discussion/"
                element={<ScreenDiscussion TargetName={params.id} />}
              />
              <Route
                path="update-target-association/"
                element={<UpdateTargetAssociation TargetName={params.id} />}
              />
              <Route
                path="delete/"
                element={<ScreenDelete TargetName={params.id} />}
              />
            </Routes>
          </div>
        </div>
        <Sidebar
          visible={displayPromotionDialog}
          position="right"
          style={{ width: "30em", overflowX: "auto" }}
          onHide={() => setDisplayPromotionDialog(false)}
        >
          <div className="flex flex-column gap-3 pl-3  w-full">
            <div className="flex">
              <h2>
                <i className="icon icon-common icon-plus-circle"></i> Add a new
                Screen
              </h2>
            </div>
            <div className="flex">
              <EmbeddedHelp>
                This would create a new screening series. If you are intending
                to add screening information to an existing screening set please
                add it via the screening tab.
              </EmbeddedHelp>
            </div>
            <div className="flex w-full">
              <ScreenAdd
                TargetName={params.id}
                closeSidebar={() => setDisplayPromotionDialog(false)}
              />
            </div>
          </div>
        </Sidebar>

        <Dialog
          visible={displayEditScreenDialog}
          header="Admin : Edit Screen"
          style={{ width: "90%" }}
          onHide={() => setDisplayEditScreenDialog(false)}
          className="p-sidebar-lg"
        >
          <div className="card">
            <ScreenEdit
              selectedScreenTargetFilter={selectedScreenTargetFilter}
              close={() => setDisplayEditScreenDialog(false)}
            />
          </div>
        </Dialog>

        <Dialog
          visible={displayMergeScreenDialog}
          header="Admin : Merge Screens"
          style={{ width: "90%" }}
          onHide={() => setDisplayMergeScreenDialog(false)}
          className="p-sidebar-lg"
        >
          <div className="card">
            <ScreenMerge
              screens={filteredScreens}
              close={() => setDisplayMergeScreenDialog(false)}
            />
          </div>
        </Dialog>
      </React.Fragment>
    );
  }

  /** Loading Overlay */

  return <Loading />;
};

export default observer(TargetBasedScreenView);
