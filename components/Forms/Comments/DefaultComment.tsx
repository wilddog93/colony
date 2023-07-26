import { EditorContent, useEditor } from "@tiptap/react";
import {
  MdFormatBold,
  MdFormatItalic,
  MdOutlineFormatUnderlined,
  MdRefresh,
  MdSend,
  MdOutlineAddPhotoAlternate,
} from "react-icons/md";

// import Bold from "@tiptap/extension-bold";
// import Italic from "@tiptap/extension-italic";
// import Mention from "@tiptap/extension-mention";
// import suggestion from "./Suggestion";
import React, { Fragment } from "react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Image } from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Button from "../../Button/Button";

function DefaultComment(props: any): JSX.Element | undefined {
  const {
    setCommentEdit,
    setComment,
    onClick,
    commentData,
    loading,
    isDisabled,
    isEdit,
    isDelete,
    editStatus,
  } = props;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      loading,
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: "tiptap-image",
        },
        allowBase64: true,
        // resize: true,
        // handlePaste: true,
      }),
      Placeholder.configure({ placeholder: "Comment here..." }),
    ],
    editorProps: {
      attributes: {
        class: isEdit
          ? "focus:outline-none px-4 py-2 border-t-2 border-x-2 rounded-t-xl border-gray-5 shadow-card overflow-y-auto max-h-[100px]"
          : "focus:outline-none p-4 border-t-2 border-x-2 rounded-t-xl border-gray-5 shadow-card overflow-y-auto max-h-[100px]",
      },
    },
    content: `${isEdit ? commentData : ""}`,
    onUpdate: ({ editor }) => {
      isEdit == true
        ? setCommentEdit(editor?.getHTML())
        : setComment(editor?.getHTML());
    },
  });

  if (!editor) {
    return;
  }

  return (
    <Fragment>
      {loading ? editor?.commands?.clearContent(loading) : null}
      <EditorContent editor={editor} />
      <div
        className={
          isEdit
            ? "px-2 flex justify-between border-b-2 border-x-2 rounded-b-xl py-2 border-gray-5 shadow-card focus:border-primary"
            : "px-2 flex justify-between border-b-2 border-x-2 rounded-b-xl py-2 border-t-2 border-gray-5 shadow-card focus:border-primary"
        }>
        <div className={isEdit ? "flex w-1/2" : "flex w-1/2 border-r"}>
          <button
            type="button"
            onClick={() => editor?.chain()?.focus()?.toggleBold()?.run()}>
            <MdFormatBold
              className={
                editor?.isActive("bold")
                  ? "is-active font-bold text-primary h-5 w-5"
                  : "h-5 w-5 text-gray-500"
              }
            />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain()?.focus()?.toggleItalic()?.run()}
            className="mx-3">
            <MdFormatItalic
              className={
                editor?.isActive("italic")
                  ? "is-active font-bold text-primary h-5 w-5"
                  : "h-5 w-5 text-gray-500"
              }
            />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain()?.focus()?.toggleUnderline()?.run()}>
            <MdOutlineFormatUnderlined
              className={
                editor?.isActive("underline")
                  ? "is-active font-bold text-primary h-5 w-5"
                  : "h-5 w-5 text-gray-500"
              }
            />
          </button>
        </div>

        <div className="flex justify-end mr-2 items-center">
          {isEdit && !isDelete ? null : (
            <Button
              disabled={editor.isEmpty || isDisabled || loading}
              variant="primary"
              type="button"
              onClick={async () => {
                await onClick();
                await editor?.commands?.clearContent(loading);
              }}>
              {loading && !isEdit && !isDelete && !editStatus ? (
                <div className="flex items-center">
                  <MdRefresh className="w-5 animate-spin-slow mr-1" />
                  <span>proccessing...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <p>Send</p>
                  <MdSend className="h-4 w-4 ml-2" />
                </div>
              )}
            </Button>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default DefaultComment;
