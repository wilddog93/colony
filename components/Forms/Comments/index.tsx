import { EditorContent, useEditor } from "@tiptap/react";
import {
  MdDelete,
  MdDocumentScanner,
  MdOutlineAddPhotoAlternate,
  MdOutlineAttachment,
  MdOutlineFileCopy,
  MdOutlineFileDownload,
  MdOutlineFileOpen,
  MdOutlineFileUpload,
  MdOutlineFormatBold,
  MdOutlineFormatItalic,
  MdOutlineFormatUnderlined,
  MdSend,
  MdTask,
} from "react-icons/md";
import React, {
  ChangeEvent,
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TextAlign from "@tiptap/extension-text-align";
import { toast } from "react-toastify";
import { FaCircleNotch } from "react-icons/fa";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Image } from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Button from "../../Button/Button";
import {
  isBase64,
  isPDFFiles,
  toBase64,
} from "../../../utils/useHooks/useFunction";

type Props = {
  content: any;
  setContent: Dispatch<SetStateAction<any | null>>;
  images: any;
  setImages: Dispatch<SetStateAction<any | null>>;
  placeholder?: string;
  loading: boolean;
  onSubmit: () => void;
  isEdit: boolean;
};

export default function Comments({
  content,
  setContent,
  placeholder,
  loading,
  onSubmit,
  isEdit,
  images,
  setImages,
  contentEdit,
  setContentEdit,
  imagesEdit,
  setImagesEdit,
}: any): JSX.Element | undefined {
  const url = process.env.API_ENDPOINT;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefEdit = useRef<HTMLInputElement>(null);
  const [isBaseStatus, setIsBaseStatus] = useState(false);
  const [isPdfStatus, setIsPdfStatus] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      loading,
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: "tiptap-image w-32",
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
          ? "focus:outline-none p-4 border-t-0 border-x-2 border-gray-5 shadow-card overflow-y-auto max-h-[100px]"
          : "focus:outline-none p-4 border-t-2 border-x-2 rounded-t-xl border-gray-5 shadow-card overflow-y-auto max-h-[100px]",
      },
    },
    content: `${isEdit ? contentEdit : ""}`,
    onUpdate: ({ editor }) => {
      isEdit
        ? setContentEdit(editor?.getText())
        : setContent(editor?.getText());
    },
  });

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log(file?.name, "images-format");
        setIsPdfStatus(isPDFFiles(file?.name));
        if (e.target) {
          const result = e.target.result as string;
          setImages(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadEdit = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setIsPdfStatus(isPDFFiles(file?.name));
        if (e.target) {
          const result = e.target.result as string;
          console.log(e.target.result, "images-format");
          setImagesEdit(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onDeleteImage = () => {
    console.log("hit delete");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImages(null);
  };

  const onDeleteImageEdit = () => {
    console.log("hit delete");
    if (fileInputRefEdit.current) {
      fileInputRefEdit.current.value = "";
    }
    setImagesEdit(null);
  };

  const onSelectMultiImage = (e: ChangeEvent<HTMLInputElement>) => {
    const filePathsPromises: any[] = [];
    const fileObj = e.target.files;
    const preview = async () => {
      if (fileObj) {
        const totalFiles = e?.target?.files?.length;
        if (totalFiles) {
          for (let i = 0; i < totalFiles; i++) {
            const img = fileObj[i];
            // console.log(img, 'image obj')
            filePathsPromises.push(toBase64(img));
            const filePaths = await Promise.all(filePathsPromises);
            const mappedFiles = filePaths.map((base64File) => ({
              attachmentName: base64File?.name,
              attachmentSize: base64File?.size,
              attachmentSource: base64File?.images,
            }));
            setImages(mappedFiles);
          }
        }
      }
    };
    if (!fileObj) {
      return null;
    } else {
      preview();
    }
  };

  // console.log(JSON.stringify(editor?.getText(), null, 2), "editor-content");
  //   console.log(editor?.getHTML(), "editor-html :");
  //   console.log(editor?.getAttributes("src"), "editor-image :");
  //   console.log(editor?.getText(), "editor-text");
  // console.log(content?.length, "content")
  // console.log(content, "content isi", content?.length)

  useEffect(() => {
    if (isEdit) {
      setIsBaseStatus(isBase64(imagesEdit) ? true : false);
    } else {
      setIsBaseStatus(isBase64(images) ? true : false);
    }
  }, [isEdit, imagesEdit, images]);

  useEffect(() => {
    if (isEdit) {
      setIsPdfStatus(isPDFFiles(imagesEdit));
    } else {
      setIsPdfStatus(isPDFFiles(images));
    }
  }, [isEdit]);

  console.log({ isPdfStatus, isBaseStatus }, "images-format", images);

  if (!editor) {
    return;
  }
  return (
    <Fragment>
      {loading ? editor?.commands?.clearContent(loading) : null}
      <EditorContent editor={editor} />
      <div className="flex w-full justify-between py-2 border-2 border-gray-5 rounded-b px-2">
        {/* bar menus */}
        <div className="w-full flex items-center gap-2">
          <div className="w-full flex gap-2 items-center">
            <button
              onClick={() => editor?.chain()?.focus()?.toggleBold()?.run()}
              disabled={!editor?.can()?.chain()?.focus()?.toggleBold()?.run()}
              className={editor?.isActive("bold") ? "is-active" : ""}>
              <MdOutlineFormatBold
                className={
                  editor?.isActive("bold")
                    ? "is-active font-bold text-primary h-6 w-6 bg-gray rounded border border-primary"
                    : "h-6 w-6 text-gray-6"
                }
              />
            </button>

            <button
              onClick={() => editor?.chain()?.focus()?.toggleItalic()?.run()}
              disabled={!editor?.can()?.chain()?.focus()?.toggleItalic()?.run()}
              className={editor?.isActive("italic") ? "is-active" : ""}>
              <MdOutlineFormatItalic
                className={
                  editor?.isActive("italic")
                    ? "is-active font-bold text-primary h-6 w-6 bg-gray rounded border border-primary"
                    : "h-6 w-6 text-gray-6"
                }
              />
            </button>

            <button
              onClick={() => editor?.chain()?.focus()?.toggleUnderline()?.run()}
              disabled={
                !editor?.can()?.chain()?.focus()?.toggleUnderline()?.run()
              }
              className={editor?.isActive("underline") ? "is-active" : ""}>
              <MdOutlineFormatUnderlined
                className={
                  editor?.isActive("underline")
                    ? "is-active font-bold text-primary h-6 w-6 bg-gray rounded border border-primary"
                    : "h-6 w-6 text-gray-6"
                }
              />
            </button>
            {!isEdit ? (
              <Fragment>
                <label htmlFor="image">
                  <MdOutlineAttachment className="h-5 w-5 text-gray-6 cursor-pointer hover:text-primary rotate-90" />
                </label>
                <input
                  id="image"
                  hidden
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </Fragment>
            ) : (
              <Fragment>
                <label htmlFor="imageEdit">
                  <MdOutlineAttachment className="h-5 w-5 text-gray-6 cursor-pointer hover:text-primary rotate-90" />
                </label>
                <input
                  id="imageEdit"
                  hidden
                  type="file"
                  // accept="image/*"
                  accept="application/pdf,image/*"
                  ref={fileInputRefEdit}
                  onChange={handleImageUploadEdit}
                />
              </Fragment>
            )}
          </div>
          <Button
            variant="primary"
            type="button"
            className={`text-xs rounded-lg ${isEdit ? "hidden" : ""}`}
            disabled={!content || loading ? true : false}
            onClick={() => {
              {
                onSubmit();
                editor?.commands?.clearContent(loading);
              }
            }}>
            {loading ? (
              <div className="flex items-center gap-1">
                <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                <span className="">Sending...</span>
                <MdSend className="h-4 w-4 ml-2" />
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span>Send</span>
                <MdSend className="h-4 w-4 ml-2" />
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* images */}
      <div className={`w-full ${!images ? "hidden" : "add"}`}>
        <div className="w-32 relative flex gap-2 group hover:cursor-pointer py-2">
          <label
            htmlFor="logo"
            className="w-full max-w-32 hover:cursor-pointer">
            {!isPdfStatus ? (
              <img
                src={images}
                alt="logo"
                className="w-32 h-auto object-cover object-center border border-gray shadow-card rounded-lg"
              />
            ) : (
              <MdTask className="w-16 mx-auto h-auto rounded-lg text-gray-6" />
            )}
          </label>

          {/* delete filte */}
          <div className={`absolute inset-0 flex`}>
            <button
              type="button"
              className={`rounded-lg text-sm shadow-card opacity-0 group-hover:opacity-50 m-auto bg-danger p-1 text-white`}
              onClick={onDeleteImage}>
              <MdDelete className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* images-edit */}
      <div className={`w-full ${imagesEdit && isEdit ? "edit" : "hidden"}`}>
        <div className="w-32 relative flex gap-2 group hover:cursor-pointer py-2">
          <label
            htmlFor="logo"
            className="w-full max-w-32 hover:cursor-pointer">
            {isBaseStatus && !isPdfStatus ? (
              <img
                src={imagesEdit}
                alt="logo"
                className="w-32 h-auto object-cover object-center border border-gray shadow-card rounded-lg"
              />
            ) : null}

            {isBaseStatus && isPdfStatus ? (
              <MdTask className="w-16 h-auto mx-auto" />
            ) : null}

            {!isBaseStatus && isPdfStatus ? (
              <MdTask className="w-16 h-auto mx-auto" />
            ) : null}

            {!isBaseStatus && !isPdfStatus ? (
              <img
                src={`${url}project/task/attachment/${imagesEdit}`}
                alt="logo"
                className="w-32 h-auto object-cover object-center border border-gray shadow-card rounded-lg"
              />
            ) : null}
          </label>

          {/* delete filte */}
          <div className={`absolute inset-0 flex`}>
            <button
              type="button"
              className={`rounded-lg text-sm shadow-card opacity-0 group-hover:opacity-50 m-auto bg-danger p-1 text-white`}
              onClick={onDeleteImageEdit}>
              <MdDelete className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
