import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Editor } from "primereact/editor";
import { useEventListener } from "primereact/hooks";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import { InputText } from "primereact/inputtext";
import { useContext, useEffect, useState } from "react";
import { RootStoreContext } from "../../../../RootStore";

const AddReply = ({ comment, setComment }) => {
  const rootStore = useContext(RootStoreContext);
  const { addReply, isAddingReply } = rootStore.commentStore;
  const [reply, setReply] = useState("");
  const [editorVisible, setEditorVisible] = useState(false);

  const [bindKeyDown, unbindKeyDown] = useEventListener({
    type: "keydown",
    listener: (e) => {
      if (e.key === "Escape") {
        setEditorVisible(false);
      }
    },
  });

  useEffect(() => {
    bindKeyDown();

    return () => {
      unbindKeyDown();
    };
  }, [bindKeyDown, unbindKeyDown]);

  let onSubmit = () => {
    let formattedReply = {
      commentId: comment.id,
      body: reply,
    };
    //console.log("submit", formattedReply);
    addReply(formattedReply).then(() => {
      setReply("");
      setEditorVisible(false);
      let updatedComment = { ...comment };
      formattedReply.createdById = rootStore.authStore.user.id;
      formattedReply.dateCreated = new Date();
      updatedComment.replies.push(formattedReply);
      setComment(updatedComment);
    });
  };
  const headerOfTextEditor = (
    <div className="flex w-full fadein animation-duration-500">
      <div className="flex w-full">
        <span className="ql-formats">
          <button className="ql-bold" aria-label="Bold"></button>
          <button className="ql-italic" aria-label="Italic"></button>
          <button className="ql-underline" aria-label="Underline"></button>
          <button className="ql-strike" aria-label="Strike"></button>
          <button className="ql-link" aria-label="Link"></button>
          <button
            className="ql-list"
            value="bullet"
            aria-label="Bullet"
          ></button>
        </span>
      </div>
      <div className="flex w-full justify-content-end align-items-center">
        <BlockUI blocked={isAddingReply}>
          <div className="border-0 border-color-1 border-round-md justify-content-center align-items-center text-center">
            <button
              label="Reply"
              className="text-center w-full gap-2"
              onClick={() => {
                //console.log("reply", reply);
                onSubmit();
              }}
            >
              <div className="flex align-items-center text-center gap-2">
                <div className="flex text-center text-primary">
                  <i className="pi pi-check-circle" />
                </div>
                <div className="flex align-items-center text-center text-primary">
                  Save
                </div>
              </div>
            </button>
          </div>
        </BlockUI>
      </div>
    </div>
  );
  return (
    <div className="flex flex-column w-full align-items-center">
      <Inplace
        className="w-full m-0 p-0"
        closable={false}
        active={editorVisible}
        onToggle={(e) => setEditorVisible(e.value)}
        pt={{
          display: { style: { padding: "0" } },
        }}
      >
        <InplaceDisplay className="m-0 p-0">
          <div className="flex align-items-center w-full mb-3 fadein animation-duration-500">
            <InputText className="w-full m-0" placeholder="Add a reply..." />
          </div>
        </InplaceDisplay>
        <InplaceContent className="p-0 m-2 fadein ">
          <Editor
            className="fadein animation-duration-500 mb-1"
            id="description"
            headerTemplate={headerOfTextEditor}
            name="description"
            onLoad={(editor) => {
              editor.focus();
            }}
            onTextChange={(e) => setReply(e.htmlValue)}
            readOnly={isAddingReply}
            //onChange={formik.handleChange}
            //onBlur={formik.handleBlur}
            //value={formik.values.description}
            //modules={mentionModule}
          />
        </InplaceContent>
      </Inplace>
    </div>
  );
};

export default observer(AddReply);
