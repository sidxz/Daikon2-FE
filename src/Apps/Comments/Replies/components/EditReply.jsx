import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import React, { useContext } from "react";
import { RootStoreContext } from "../../../../RootStore";

const EditReply = ({ reply, comment, setComment, closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);

  const { appVars } = rootStore.authStore;
  const { updateReply, isUpdatingReply, workingOnReplyId } =
    rootStore.commentStore;

  const formik = useFormik({
    initialValues: {
      body: reply?.body,
    },
    validate: (values) => {
      const errors = {};
      if (!values.body) errors.body = "Reply is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (data) => {
      let updatedReply = { ...reply, ...data };
      //console.log("updated", updatedReply);

      updateReply(updatedReply).then(() => {
        closeSideBar();
        formik.resetForm();

        let updatedComment = { ...comment };
        updatedComment.replies = updatedComment.replies.map((r) =>
          r.id === updatedReply.id ? updatedReply : r
        );
        setComment(updatedComment);
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

  return (
    <div className="card w-full">
      <form onSubmit={formik.handleSubmit} className="p-fluid">
        <div className="field">
          <label htmlFor="description">Description</label>
          <Editor
            id="body"
            headerTemplate={headerOfTextEditor}
            name="body"
            onTextChange={(e) => formik.setFieldValue("body", e.htmlValue)}
            onChange={formik.handleChange}
            //onBlur={formik.handleBlur}
            value={formik.values.body}
          />
          {getErrorMessage("body")}
        </div>
        <div className="field">
          <Button
            type="submit"
            className="p-button"
            label="Save"
            loading={isUpdatingReply}
          />
        </div>
      </form>
    </div>
  );
};

export default observer(EditReply);
