import { observer } from "mobx-react-lite";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import React, { useContext, useRef } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { RootStoreContext } from "../../../../app/stores/rootStore";
import PhenotypicDisclosedHit from "./PhenotypicDisclosedHit/PhenotypicDisclosedHit";
import PhenotypicScreenDiscussion from "./PhenotypicScreenDiscussion/PhenotypicScreenDiscussion";
import PhenotypicScreenSequence from "./PhenotypicScreenSequence/PhenotypicScreenSequence";
import ScreenPhenotypicEdit from "./ScreenPhenotypicEdit/ScreenPhenotypicEdit";
import ScreenPhenotypicMerge from "./ScreenPhenotypicMerge/ScreenPhenotypicMerge";

/**
 * PhenotypicScreenView component displays the view of a phenotypic screen.
 * It includes a side menu and routes to different sections of the screen.
 */
const PhenotypicScreenView = () => {
  const params = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  // Accessing the necessary properties from the rootStore
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.userStore;

  // Define the side menu items
  const sideMenuItems = [
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
          label: "Disclosed Hits",
          icon: "icon icon-conceptual icon-structures-3d",
          command: () => {
            navigate("disclosed-hit/");
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
  ];

  // If the user is a admin, add admin actions to the side menu
  if (user.roles.includes("admin")) {
    const adminActions = {
      label: "Actions",
      items: [
        {
          label: "Edit Screen",
          icon: "icon icon-common icon-edit",
          command: () => {
            navigate("edit/");
          },
        },
        {
          label: "Merge Screens",
          icon: "icon icon-common icon-compress",
          command: () => {
            navigate("merge/");
          },
        },
      ],
    };
    sideMenuItems.push(adminActions);
  }

  return (
    <React.Fragment>
      <Toast ref={toast} />
      <br />
      <div className="flex gap-2 w-full">
        <div className="flex">
          <Menu model={sideMenuItems} />
        </div>

        <div className="flex w-full">
          <Routes>
            <Route index element={<Navigate replace to="screen-sequence/" />} />
            <Route
              path="screen-sequence/"
              element={<PhenotypicScreenSequence screenId={params.id} />}
            />
            <Route
              path="disclosed-hit/"
              element={<PhenotypicDisclosedHit screenId={params.id} />}
            />
            <Route
              path="edit/"
              element={<ScreenPhenotypicEdit screenId={params.id} />}
            />
            <Route
              path="merge/"
              element={<ScreenPhenotypicMerge screenId={params.id} />}
            />

            <Route
              path="discussion/"
              element={<PhenotypicScreenDiscussion screenId={params.id} />}
            />
          </Routes>
        </div>
      </div>
    </React.Fragment>
  );
};

export default observer(PhenotypicScreenView);
