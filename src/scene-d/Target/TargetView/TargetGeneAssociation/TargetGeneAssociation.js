import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Toast } from "primereact/toast";
import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FailedLoading from "../../../../app/common/FailedLoading/FailedLoading";
import SectionHeading from "../../../../app/common/SectionHeading/SectionHeading";
import Unauthorized from "../../../../app/common/Unauthorized/Unauthorized";
import Loading from "../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../app/stores/rootStore";
import { appColors } from "../../../../colors";

const TargetGeneAssociation = ({ id }) => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const rootStore = useContext(RootStoreContext);
  const {
    fetchTargetAdmin,
    selectedTarget,
    editTargetAdmin,
    displayLoading,
    editingTarget,
  } = rootStore.targetStoreAdmin;

  const { user } = rootStore.userStore;

  useEffect(() => {
    // Fetch target when the component mounts or when the selected target changes
    if (selectedTarget === null || selectedTarget.id !== id) {
      fetchTargetAdmin(id);
    }
  }, [id, selectedTarget, fetchTargetAdmin]);

  if (displayLoading) {
    return <Loading content="Loading Target..." />;
  }

  /* Only Admins can access this page */
  if (!user.roles.includes("admin")) {
    return <Unauthorized />;
  }
  /* Generate Breadcrumb */
  if (selectedTarget !== null) {
    const breadCrumbItems = [
      {
        label: "Targets",
        command: () => {
          navigate("/d/target/");
        },
      },
      {
        label: selectedTarget.name,
        command: () => {
          navigate(`/d/target/${selectedTarget.id}`);
        },
      },
      { label: "Update Gene Association" },
    ];

    return (
      <React.Fragment>
        <Toast ref={toast} />

        <div className="flex flex-column w-full">
          <div className="flex w-full pb-2">
            <BreadCrumb model={breadCrumbItems} />
          </div>

          <div className="flex w-full">
            <SectionHeading
              icon="icon icon-common icon-target"
              heading={selectedTarget.name}
              entryPoint={selectedTarget.name}
              displayHorizon={true}
              color={appColors.sectionHeadingBg.target}
            />
          </div>
          <div className="flex w-full">
            <SectionHeading
              icon="icon icon-conceptual icon-proteins"
              heading={"Update Gene Association"}
              color={"#f4f4f4"}
              textColor={"#000000"}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  return <FailedLoading />;
};

export default observer(TargetGeneAssociation);
