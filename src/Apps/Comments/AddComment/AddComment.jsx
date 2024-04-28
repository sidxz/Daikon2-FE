import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import { Editor } from "primereact/editor";
import { InputTextarea } from "primereact/inputtextarea";
import { Sidebar } from "primereact/sidebar";
import "quill-mention";
import "quill-mention/dist/quill.mention.min.css";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../RootStore";
import InputMentions from "../../../Shared/InputEditors/InputMentions";
import { AppUserResolver } from "../../../Shared/VariableResolvers/AppUserResolver";

const AddComment = ({ resourceId, tags }) => {
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.authStore;
  const { addComment, isAddingComment } = rootStore.commentStore;
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);

  const { getIdFromUserFullName, getUserFullNameById } = AppUserResolver();

  const formik = useFormik({
    initialValues: {
      resourceId: resourceId,
      topic: "",
      description: "",
      tags: [...tags],
      mentions: [],
      mentionsInNameFormat: [],
      subscribers: [],
      isCommentLocked: false,
    },
    validate: (values) => {
      const errors = {};
      if (!values.topic) errors.topic = "Topic is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (data) => {
      //convert mentionsInNameFormat to mentions
      data.mentions = data.mentionsInNameFormat.map((mention) =>
        getIdFromUserFullName(mention)
      );
      console.log("added", data);
      addComment(data).then(() => {
        setDisplayAddSideBar(false);
        formik.resetForm();
      });
    },
  });

  // Helper functions for form validation and error messages
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  const headerOfTextEditor = (
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button className="ql-strike" aria-label="Strike"></button>
      <button className="ql-link" aria-label="Link"></button>
      <button className="ql-list" value="bullet" aria-label="Bullet"></button>
    </span>
  );

  let atValues = Object.keys(appVars?.userNames).map((key) => ({
    id: key,
    value: appVars?.userNames[key],
  }));

  const mentionModule = {
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@"],
      source: function (searchTerm, renderList, mentionChar) {
        let values;

        if (mentionChar === "@") {
          values = atValues;
        } else {
          //values = hashValues;
        }

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (let i = 0; i < values.length; i++)
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            )
              matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      },
      onSelect: (item, insertItem) => {
        insertItem(item);
        const currentMentions = formik.values.mentionsInNameFormat || [];
        if (!currentMentions.includes(item.value)) {
          currentMentions.push(item.value);
          formik.setFieldValue("mentionsInNameFormat", currentMentions);
          formik.setFieldTouched("mentionsInNameFormat", true, false);
        }

        return false; // Return false to prevent the mention item from being inserted twice
      },
    },
  };

  return (
    <>
      <div className="flex flex-column w-full card-container">
        <div className="table-header flex flex-row w-full shadow-0 fadein">
          <div className="flex justify-content-end w-full">
            <div className="flex flex-grow min-w-max">
              <Button
                type="button"
                icon="pi pi-plus"
                label="New Discussion"
                className="p-button-text p-button-sm"
                onClick={() => setDisplayAddSideBar(true)}
              />
            </div>
          </div>
        </div>
      </div>
      <Sidebar
        visible={displayAddSideBar}
        position="right"
        onHide={() => setDisplayAddSideBar(false)}
        className="p-sidebar-md"
        header={
          <div className="text-lg font-bold">
            <i className="pi pi-plus pr-2" />
            Add
          </div>
        }
      >
        <div className="card w-full">
          <form onSubmit={formik.handleSubmit} className="p-fluid">
            <div className="field">
              <label htmlFor="topic">Topic</label>
              <InputTextarea
                id="topic"
                name="topic"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.topic}
              />
              {getErrorMessage("topic")}
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <Editor
                id="description"
                headerTemplate={headerOfTextEditor}
                name="description"
                onTextChange={(e) =>
                  formik.setFieldValue("description", e.htmlValue)
                }
                onChange={formik.handleChange}
                //onBlur={formik.handleBlur}
                value={formik.values.description}
                modules={mentionModule}
              />
              {getErrorMessage("description")}
            </div>
            <div className="field">
              <label htmlFor="tags">Tags</label>
              <Chips
                id="tags"
                name="tags"
                separator=","
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.tags}
              />
              {getErrorMessage("tags")}
            </div>
            <div className="field">
              <label htmlFor="mentionsInNameFormat">Mentions</label>
              <InputMentions
                id="mentionsInNameFormat"
                name="mentionsInNameFormat"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.mentionsInNameFormat}
              />
              {getErrorMessage("mentionsInNameFormat")}
            </div>

            <div className="field">
              <Button
                type="submit"
                className="p-button"
                label="Save"
                loading={isAddingComment}
              />
            </div>
          </form>
        </div>
      </Sidebar>
    </>
  );
};

export default observer(AddComment);
