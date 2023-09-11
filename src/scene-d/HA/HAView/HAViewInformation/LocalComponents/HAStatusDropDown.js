import { observer } from "mobx-react-lite";
import { Dropdown } from "primereact/dropdown";

import React from "react";
import { FcDataSheet, FcNeutralTrading, FcOk, FcPlanner } from "react-icons/fc";

/**
 * HAStatusDropDown component allows users to update the status of a HA Project.
 * The status of the project can be updated to a predefined set of options,
 * with each option associated with an icon.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.id - The id of the screen.
 * @param {string} props.status - The current status of the screen.
 * @param {boolean} props.readOnly - Whether the status can be updated or not.
 */
const HAStatusDropDown = (id, status) => {

    if (!id || !status) return <></>;

    // The set of available options for the status of a screen
    const haStatusOptions = [
        { name: "Active", icon: <FcPlanner /> },
        { name: "Incorrect m/z", icon: <FcDataSheet /> },
        { name: "Completed", icon: <FcNeutralTrading /> },
        { name: "Terminated", icon: <FcOk /> },
    ];

    // Template for rendering a selected status option
    const haOptionTemplate = (option) => {
        if (option) {
            return (
                <div className="flex align-items-center align-self-center gap-2">
                    <div className="flex flex-column">{option.icon}</div>
                    <div className="flex flex-column">{option.name}</div>
                </div>
            );
        }
    };


    return (
        <div className="flex">
            <Dropdown
                value=""
                options={haStatusOptions}
                optionLabel="name"
                optionValue="name"
                placeholder="Set Status"
                itemTemplate={haOptionTemplate}
                valueTemplate={haOptionTemplate}
                className="align-items-center"
            />

        </div>
    );
};

export default observer(HAStatusDropDown);
