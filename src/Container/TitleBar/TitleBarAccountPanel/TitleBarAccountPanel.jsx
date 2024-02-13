import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import React, { useContext } from "react";
import { RootStoreContext } from "../../../RootStore";

const TitleBarAccountPanel = ({ signOut }) => {
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.authStore;

  // take first letter of first name and last name
  let initials = user?.firstName?.[0] + user?.lastName?.[0];

  return (
    <div className="flex flex-column border-0 p-2 gap-2">
      <div className="flex border align-items-center">
        <div className="flex w-3">
          <Avatar
            label={initials}
            className="p-mr-2"
            size="large"
            shape="circle"
          />
        </div>
        <div className="flex pl-3 text-xl text-overflow-ellipsis border-0">
          {user?.firstName} {user?.lastName}
        </div>
      </div>
      <div className="flex border align-items-center justify-content-center">
        <div className="flex text-sm text-color-secondary">
          {user?.appOrg?.name}
        </div>
      </div>

      <div className="flex border align-items-center border-1 border-50 mt-1">
        <div className="flex">
          <Button
            label="Settings"
            icon="ri-user-settings-line"
            className="p-button-text p-button-plain"
          />
        </div>
        <div className="flex">
          <Button
            label="Logout"
            icon="ri-logout-circle-r-line"
            className="p-button-text p-button-plain"
            onClick={() => {
              signOut();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TitleBarAccountPanel;
