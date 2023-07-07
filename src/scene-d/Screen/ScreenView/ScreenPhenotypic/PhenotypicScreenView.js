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
import PhenotypicScreenSequence from "./PhenotypicScreenSequence/PhenotypicScreenSequence";
import PhenotypicValidatedHit from "./PhenotypicValidatedHit/PhenotypicValidatedHit";
import ScreenPhenotypicEdit from "./ScreenPhenotypicEdit/ScreenPhenotypicEdit";

const PhenotypicScreenView = () => {
  const params = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  /* MobX Store */
  const rootStore = useContext(RootStoreContext);

  const { user } = rootStore.userStore;

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

  if (user.roles.includes("screener")) {
    const adminActions = {
      label: "Admin Section",
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
          command: () => {},
        },
      ],
    };
    SideMenuItems.push(adminActions);
  }

  return (
    <React.Fragment>
      <Toast ref={toast} />
      <br />
      <div className="flex gap-2 w-full">
        <div className="flex">
          <Menu model={SideMenuItems} />
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
              element={<PhenotypicValidatedHit screenId={params.id} />}
            />
            <Route
              path="edit/"
              element={<ScreenPhenotypicEdit screenId={params.id} />}
            />
            {/* 
            <Route
              path="discussion/"
              element={
                <PhenotypicScreenDiscussion
                  baseScreenName={params.baseScreenName}
                />
              }
            /> */}
          </Routes>
        </div>
      </div>
    </React.Fragment>
  );
};

export default observer(PhenotypicScreenView);
