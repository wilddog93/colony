import React, {
  ChangeEvent,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DefaultLayout from "../../../../../../components/Layouts/DefaultLayouts";
import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/Hook";
import {
  getAuthMe,
  selectAuth,
} from "../../../../../../redux/features/auth/authReducers";
import Button from "../../../../../../components/Button/Button";
import {
  MdAdd,
  MdArrowRightAlt,
  MdCheckCircle,
  MdChevronLeft,
  MdClose,
  MdDelete,
  MdDocumentScanner,
  MdDownload,
  MdFileDownload,
  MdFileUpload,
  MdRemoveCircle,
  MdUnarchive,
  MdWarning,
} from "react-icons/md";
import SidebarComponent from "../../../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuAssets } from "../../../../../../utils/routes";
import Modal from "../../../../../../components/Modal";
import { ModalHeader } from "../../../../../../components/Modal/ModalComponent";
import moment from "moment";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import {
  OptionProps,
  ProductProps,
  RequestProductProps,
} from "../../../../../../utils/useHooks/PropTypes";
import {
  getProducts,
  selectProductManagement,
} from "../../../../../../redux/features/assets/products/productManagementReducers";
import { FaCircleNotch } from "react-icons/fa";
import {
  createRequestDocumentById,
  deleteRequestDocumentById,
  getRequestById,
  selectRequestManagement,
  updateRequestChangeStatus,
} from "../../../../../../redux/features/assets/stocks/requestReducers";
import FormProduct from "../../../../../../components/Forms/assets/FormProduct";
import Cards from "../../../../../../components/Cards/Cards";
import {
  convertBytes,
  toBase64,
} from "../../../../../../utils/useHooks/useFunction";
import { toast } from "react-toastify";

type FormValues = {
  id?: number | string;
  requestNumber?: number | string;
  requestDescription?: string;
  products?: ProductProps[];
};

type Props = {
  pageProps: any;
};

const RequestDetails = ({ pageProps }: Props) => {
  moment.locale("id");
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;
  const { type } = query;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { request, pending } = useAppSelector(selectRequestManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // data-table
  const [formData, setFormData] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [isOpenFiles, setIsOpenFiles] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // modal
  const [isOpenDiscard, setIsOpenDiscard] = useState<boolean>(false);
  const [isOpenDeleteDoc, setIsOpenDeleteDoc] = useState<boolean>(false);

  // date
  const dateTimeFormat = (value: any) => {
    if (!value) return "-";
    const date = moment(new Date(value)).format("MMMM Do YYYY, h:mm");
    return date;
  };

  // discard modal
  const onOpenDeleteDoc = (value: any) => {
    setFormData(value);
    setIsOpenDeleteDoc(true);
  };

  const onCloseDeleteDoc = () => {
    setFormData(null);
    setIsOpenDeleteDoc(false);
  };

  // discard modal
  const onOpenDiscard = () => {
    setIsOpenDiscard(true);
  };

  const onCloseDiscard = () => {
    setIsOpenDiscard(false);
  };

  // document modal
  const onOpenFiles = () => {
    setIsOpenFiles(true);
  };

  const onCloseFiles = () => {
    setIsOpenFiles(false);
  };

  // get request-by-id
  useEffect(() => {
    if (token) dispatch(getRequestById({ token, id: query?.id }));
  }, [token, query?.id]);

  useEffect(() => {
    if (token) {
      dispatch(
        getAuthMe({
          token,
          callback: () => router.push("/authentication?page=sign-in"),
        })
      );
    }
  }, [token]);

  const onDiscardRequest = () => {
    setLoading(true);
    router.back();
  };

  // handle-upload-docs
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
              documentNumber: "",
              documentName: base64File?.name,
              documentSize: base64File?.size,
              documentSource: base64File?.images,
            }));
            setFiles(mappedFiles);
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

  // upload-docs
  const onUploadDocument = (value: any) => {
    if (!value) {
      return;
    }
    let newObj = value?.document?.length > 0 ? value?.document[0] : "";
    console.log(newObj, "document");
    dispatch(
      createRequestDocumentById({
        token,
        id: value?.id,
        data: newObj,
        isSuccess: () => {
          toast.dark("Document has been uploaded");
          dispatch(getRequestById({ token, id: query?.id }));
          onCloseFiles();
        },
        isError: () => {
          console.log("Something went wrong!");
        },
      })
    );
  };

  // delete-file-docs
  const onDeleteFiles = (id: any) => {
    if (fileRef.current) {
      fileRef.current.value = "";
      setFiles(files.splice(id, 0));
    }
  };

  // delete-doc
  const onDeleteDoc = (value: any) => {
    if (!value) return;
    dispatch(
      deleteRequestDocumentById({
        token,
        id: query?.id,
        documentId: value,
        isSuccess: () => {
          toast.dark("Document has been deleted");
          dispatch(getRequestById({ token, id: query?.id }));
          onCloseDeleteDoc();
        },
        isError: () => {
          console.log("Something went wrong!");
        },
      })
    );
  };

  // chnage doc No.
  const onChangeDocNo = ({ value, idx }: any) => {
    let items = [...files];
    items[idx] = { ...items[idx], documentNumber: value };
    setFiles(items);
  };

  // download-doc
  const onDownloadDocument = async ({ url, name }: any) => {
    async function toDataURL(url: any) {
      const blob = await fetch(url).then((res) => res.blob());
      return URL.createObjectURL(blob);
    }
    if (url) {
      const a = document.createElement("a");
      a.href = await toDataURL(url);
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const requestProducts = useMemo(() => {
    let productsList: RequestProductProps[] = [];
    const { requestProducts } = request;
    if (!requestProducts) {
      return productsList;
    } else {
      requestProducts?.map((item: any) => {
        productsList.push(item);
      });
    }
    return productsList;
  }, [request]);

  const documentRequest = useMemo(() => {
    let document: any[] = [];
    const { documents } = request;
    if (!documents) {
      return document;
    } else {
      documents?.map((item: any) => {
        document.push(item);
      });
    }
    return document;
  }, [request]);

  const onChangeApproval = (status: any) => {
    if (!status) return;
    else if (status == "Waiting") {
      let obj = { status: "Approve" };
      dispatch(
        updateRequestChangeStatus({
          token,
          id: query?.id,
          data: obj,
          isSuccess: () => {
            toast.dark("Request has been approved");
            dispatch(getRequestById({ token, id: query?.id }));
          },
          isError: () => {
            console.log("Something went wrong!");
          },
        })
      );
    } else if (status == "On-Progress") {
      let obj = { status: "Mark As Complete" };
      dispatch(
        updateRequestChangeStatus({
          token,
          id: query?.id,
          data: obj,
          isSuccess: () => {
            toast.dark("Request has been approved");
            dispatch(getRequestById({ token, id: query?.id }));
          },
          isError: () => {
            console.log("Something went wrong!");
          },
        })
      );
    } else {
      toast.dark("Request status is not valid");
    }
  };

  const onChangeReject = (status: any) => {
    let obj: any = undefined;
    if (!status) return;
    else if (status == "Waiting") {
      obj = { status: "Rejected" };
      dispatch(
        updateRequestChangeStatus({
          token,
          id: query?.id,
          data: obj,
          isSuccess: () => {
            toast.dark("Request has been approved");
            dispatch(getRequestById({ token, id: query?.id }));
          },
          isError: () => {
            console.log("Something went wrong!");
          },
        })
      );
    } else if (status == "Approve") {
      obj = { status: "Cancel" };
      dispatch(
        updateRequestChangeStatus({
          token,
          id: query?.id,
          data: obj,
          isSuccess: () => {
            toast.dark("Request has been approved");
            dispatch(getRequestById({ token, id: query?.id }));
          },
          isError: () => {
            console.log("Something went wrong!");
          },
        })
      );
    }
  };

  return (
    <DefaultLayout
      title="Colony"
      header="Assets & Inventories"
      head="Details Request Order"
      logo="../../../../image/logo/logo-icon.svg"
      images="../../../../image/logo/building-logo.svg"
      userDefault="../../../../image/user/user-01.png"
      description=""
      token={token}
      icons={{
        icon: MdUnarchive,
        className: "w-8 h-8 text-meta-6",
      }}>
      <div className="absolute inset-0 mt-20 z-9 bg-boxdark flex text-white">
        <SidebarComponent
          menus={menuAssets}
          sidebar={sidebarOpen}
          setSidebar={setSidebarOpen}
        />

        <div className="relative w-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 overflow-y-auto">
          <div className="w-full flex items-center justify-between py-3 lg:hidden">
            <button
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
              className="rounded-sm border p-1.5 shadow-sm border-strokedark bg-boxdark lg:hidden">
              <MdArrowRightAlt
                className={`w-5 h-5 delay-700 ease-in-out ${
                  sidebarOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div className="sticky bg-white top-0 z-50 py-6 mb-3 w-full flex flex-col gap-2 border border-gray mt-5 rounded-xl shadow-card px-4">
            {/* headers */}
            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
              <div className="w-full flex flex-col lg:flex-row gap-2 items-center mx-auto lg:mx-0">
                <button
                  type="button"
                  className="rounded-lg text-sm font-semibold border-0 gap-2.5 focus:outline-none flex items-center text-gray-6"
                  onClick={() => onOpenDiscard()}
                  key={"1"}>
                  <div className="flex gap-1 items-center">
                    <MdChevronLeft className="w-6 h-6" />
                    <h3 className="w-full text-center text-xl font-semibold text-graydark capitalize">
                      <span className="inline-block">Request {type}</span>
                    </h3>
                  </div>
                </button>
                <div className="w-full max-w-max text-primary">
                  <p className="font-semibold uppercase">
                    {request?.requestNumber
                      ? `#${request?.requestNumber}`
                      : "-"}
                  </p>
                </div>
                <div className="w-full max-w-max flex flex-col lg:flex-row items-center gap-2 text-gray-6 text-sm">
                  <span
                    className={`w-full max-w-max flex items-center p-1 rounded ${
                      request?.requestStatus == "Waiting"
                        ? "border border-yellow-400 bg-yellow-50 text-yellow-400"
                        : "border border-primary bg-blue-100 text-primary"
                    }`}>
                    {request?.requestStatus}
                  </span>
                  <div>{dateTimeFormat(request?.updatedAt)}</div>
                </div>
              </div>

              <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
                {request?.requestStatus == "Waiting" ||
                request?.requestStatus == "Approve" ? (
                  <button
                    type="button"
                    className={`rounded-lg text-sm font-semibold px-4 py-3 border-2 border-gray inline-flex text-gray-6 active:scale-90 shadow-1`}
                    onClick={() => onChangeReject(request?.requestStatus)}
                    disabled={pending}>
                    {pending ? (
                      <Fragment>
                        <span className="hidden lg:inline-block">
                          Loading...
                        </span>
                        <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                      </Fragment>
                    ) : (
                      <Fragment>
                        <span className="hidden lg:inline-block">
                          {request?.requestStatus == "Waiting"
                            ? "Reject"
                            : "Cancel"}
                        </span>
                        <MdRemoveCircle className="w-4 h-4 inline-block lg:hidden" />
                      </Fragment>
                    )}
                  </button>
                ) : null}

                {request?.requestStatus !== "Waiting" ||
                request?.requestStatus !== "On-Progress" ? (
                  <button
                    type="button"
                    className={`inline-flex gap-2 items-center rounded-lg text-sm font-semibold px-4 py-3 active:scale-90 shadow-2 focus:outline-none border border-primary bg-primary disabled:opacity-30 disabled:active:scale-100`}
                    onClick={() => onChangeApproval(request?.requestStatus)}
                    disabled={
                      pending ||
                      documentRequest?.length == 0 ||
                      request?.requestStatus == "Approve"
                    }>
                    {pending ? (
                      <Fragment>
                        <span className="hidden lg:inline-block">
                          Loading...
                        </span>
                        <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                      </Fragment>
                    ) : (
                      <Fragment>
                        <span className="hidden lg:inline-block">
                          {request?.requestStatus == "Waiting"
                            ? "Approve"
                            : "Mark As Complete"}
                        </span>
                        <MdCheckCircle className="w-4 h-4" />
                      </Fragment>
                    )}
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="w-full grid col-span-1 lg:grid-cols-3 gap-2 py-4">
            <div className="w-full p-4 border border-gray rounded-xl shadow-card text-gray-6 lg:col-span-2">
              <div className="w-full grid grid-cols-2 items-center">
                <h3 className="text-lg font-bold tracking-widest">
                  Requested Items
                </h3>
                <div className="w-full flex justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    className="rounded-lg border border-primary active:scale-90"
                    onClick={() => console.log("download-data")}>
                    <span className="text-xs">Download</span>
                    <MdDownload className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 text-gray-6">
                <div className="col-span-1 overflow-x-auto">
                  <table className="w-full table-auto overflow-hidden rounded-xl shadow-md">
                    <thead className="text-left text-xs font-semibold tracking-wide text-gray-500 uppercase border-b-2 border-gray">
                      <tr>
                        <th
                          scope="col"
                          className="font-semibold px-2 py-4 text-sm text-wide capitalize text-left">
                          Product Name
                        </th>
                        <th
                          scope="col"
                          className="font-semibold px-2 py-4 text-sm text-wide capitalize text-left">
                          Product Type
                        </th>
                        <th
                          scope="col"
                          className="font-semibold px-2 py-4 text-sm text-wide capitalize text-center">
                          Requested Qty
                        </th>
                        <th
                          scope="col"
                          className="font-semibold px-2 py-4 text-sm text-wide capitalize text-center">
                          Completed Qty
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y-0 divide-gray-5 text-gray-6 text-xs">
                      {requestProducts?.length > 0 ? (
                        requestProducts?.map((e: any, idx: any) => {
                          return (
                            <tr
                              key={idx}
                              className="w-full bg-white p-4 rounded-lg mb-2 text-xs">
                              <td className="w-[350px]">
                                <div className="w-full flex items-center border border-gray rounded-lg bg-gray p-2">
                                  <img
                                    src={
                                      e?.product?.productImages
                                        ? `${url}product/productImage/${e?.product?.productImages}`
                                        : "../../../../image/no-image.jpeg"
                                    }
                                    alt="img-product"
                                    className="object cover object-center w-6 h-6 rounded mr-1"
                                  />
                                  <div>{e?.product?.productName}</div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div>{e?.product?.productType}</div>
                              </td>
                              <td className="p-4 text-center">
                                <div>{e?.requestQty || 0}</div>
                              </td>
                              <td className="p-4 text-center">
                                <div>{e?.requestQtyCompleted || 0}</div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={12} className="p-4">
                            <div className="text-sm italic text-gray-500 font-semibold">
                              There is no request product data.
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-b-2 border-gray w-full h-2 my-3"></div>

              <div className="w-full mb-3">
                <label
                  className="col-span-1 font-semibold"
                  htmlFor="requestDescription">
                  Notes :
                </label>
                <div className="w-full col-span-4 h-full min-h-[100px] overflow-y-auto">
                  <p className="w-full tracking-wide text-sm text-left">
                    {request?.requestDescription}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              {/* card */}
              <Cards className="w-full border border-gray rounded-xl shadow-card text-gray-6 text-sm">
                <div className="w-full p-4 grid grid-cols-2 gap-1 items-center">
                  <h3 className="font-semibold">
                    File Uploaded <span className="text-primary">*</span>
                  </h3>
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() => onOpenFiles()}
                      type="button"
                      className="w-full max-w-max inline-flex border-2 border-gray rounded-lg justify-center items-center focus:outline-none focus:border-primary active:scale-95 px-2 py-1">
                      <MdFileUpload className="w-4 h-4" />
                      <span className="font-semibold">Upload File</span>
                    </button>
                  </div>
                </div>

                <div className="w-full border-b-2 border-gray"></div>

                <div className="w-full p-4 h-full max-h-[250px] overflow-y-auto">
                  {documentRequest && documentRequest?.length > 0 ? (
                    documentRequest?.map((file, id) => {
                      let pathname = `${url}document/documentSource/${file?.documentSource}`;
                      return (
                        <div
                          key={id}
                          className="w-full grid grid-cols-5 gap-2 text-xs">
                          <button
                            onClick={() =>
                              onDownloadDocument({
                                url: pathname,
                                name: file?.documentName,
                              })
                            }
                            type="button"
                            className="w-full flex border-2 border-gray rounded-lg justify-center items-center focus:outline-none focus:border-primary active:scale-95">
                            <MdFileDownload className="w-6 h-6" />
                          </button>

                          <div className="w-full col-span-3">
                            <div className="font-semibold">
                              {file?.documentName?.length > 15
                                ? `${file?.documentName?.substring(15, 0)}...`
                                : file?.documentName || "-"}
                            </div>
                            <div>
                              {file?.documentSize
                                ? convertBytes({ bytes: file?.documentSize })
                                : "-"}
                            </div>
                          </div>

                          <button
                            onClick={() => onOpenDeleteDoc(file)}
                            type="button"
                            className="w-full flex border-2 border-gray rounded-lg justify-center items-center focus:outline-none focus:border-primary active:scale-95">
                            <MdDelete className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div>File not found.</div>
                  )}
                </div>
              </Cards>
            </div>
          </div>
        </div>
      </div>

      {/* discard modal */}
      <Modal size="small" onClose={onCloseDiscard} isOpen={isOpenDiscard}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseDiscard}>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold">Back to Request</h3>
              <p className="text-gray-5 text-sm">{`Are you sure to go back to request product ?`}</p>
            </div>
          </ModalHeader>
          <div className="w-full flex items-center px-4 justify-end gap-2 mb-3">
            <button
              type="button"
              className="rounded-lg border-2 px-2 py-1 border-gray-5 shadow-2 active:scale-90 focus:outline-none"
              onClick={onCloseDiscard}>
              <span className="text-xs font-semibold">No</span>
            </button>

            <Button
              type="button"
              variant="primary"
              className="rounded-lg border-2 border-primary active:scale-90"
              onClick={() => onDiscardRequest()}
              disabled={loading}>
              {!loading ? (
                <span className="text-xs">Yes, go back</span>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-xs">loading...</span>
                  <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                </div>
              )}
            </Button>
          </div>
        </Fragment>
      </Modal>

      {/* upload modal */}
      <Modal size="medium" onClose={onCloseFiles} isOpen={isOpenFiles}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray"
            isClose={true}
            onClick={onCloseFiles}>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">Upload Files</h3>
              <p className="text-gray-5 text-sm">
                Fill your document information.
              </p>
            </div>
          </ModalHeader>

          <div className="w-full p-4 border-b-2 border-gray overflow-hidden">
            {files && files?.length > 0
              ? files?.map((file, id) => {
                  return (
                    <div className="w-full flex gap-2">
                      <div className="w-1/2 flex flex-col gap-2">
                        <div className="font-semibold">Document Name</div>
                        <div className="w-full grid grid-cols-6 gap-2">
                          <div className="w-full flex max-w-[50px] h-[50px] min-h-[50px] border border-gray shadow-card rounded-lg justify-center items-center">
                            <MdDocumentScanner className="w-6 h-6" />
                          </div>
                          <div className="w-full col-span-5 text-sm">
                            <p>{file?.documentName}</p>
                            <p>
                              {file?.documentSize
                                ? convertBytes({ bytes: file?.documentSize })
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-1/2 flex flex-col gap-2">
                        <label htmlFor="documentNumber">
                          Document No. <span className="text-primary">*</span>
                        </label>
                        <div className="w-full flex gap-1">
                          <input
                            type="text"
                            value={file?.documentNumber || ""}
                            onChange={({ target }) =>
                              onChangeDocNo({ value: target.value, idx: id })
                            }
                            placeholder="Document No."
                            className="w-full text-sm rounded-lg border border-stroke bg-transparent py-1.5 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent"
                          />
                          <div className="w-full max-w-max flex justify-center items-center">
                            <Button
                              type="button"
                              variant="danger"
                              className={`rounded-lg text-sm py-1 px-2 shadow-card hover:opacity-90 active:scale-95 ml-auto`}
                              onClick={() => onDeleteFiles(id)}>
                              <MdDelete className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
            <input
              type="file"
              id="document"
              placeholder="Upload Document"
              autoFocus
              className={`w-full focus:outline-none max-w-max text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-primary file:text-sm file:font-semibold file:bg-violet-50 file:text-primary-700 hover:file:bg-violet-100 ${
                files?.length > 0 ? "hidden" : ""
              }`}
              onChange={onSelectMultiImage}
              ref={fileRef}
              accept="application/pdf,application/vnd.ms-excel"
            />
          </div>

          <div className="w-full flex items-center p-4 justify-end gap-2">
            <Button
              type="button"
              variant="primary"
              className="w-full rounded-lg border-2 border-primary active:scale-90 uppercase font-semibold"
              onClick={() =>
                onUploadDocument({ document: files, id: query?.id })
              }
              disabled={pending}>
              {!pending ? (
                <span className="text-xs">Save</span>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-xs">loading...</span>
                  <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                </div>
              )}
            </Button>
          </div>
        </Fragment>
      </Modal>

      {/* delete document modal */}
      <Modal size="small" onClose={onCloseDeleteDoc} isOpen={isOpenDeleteDoc}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseDeleteDoc}>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold">Delete</h3>
              <p className="text-gray-5 text-sm">{`Are you sure to delete document?`}</p>
            </div>
          </ModalHeader>
          <div className="w-full flex items-center px-4 justify-end gap-2 mb-3">
            <button
              type="button"
              className="rounded-lg border-2 px-2 py-1 border-gray-5 shadow-2 active:scale-90 focus:outline-none"
              onClick={onCloseDeleteDoc}>
              <span className="text-xs font-semibold">No</span>
            </button>

            <Button
              type="button"
              variant="primary"
              className="rounded-lg border-2 border-primary active:scale-90"
              onClick={() => onDeleteDoc(formData?.id)}
              disabled={pending}>
              {!pending ? (
                <span className="text-xs">Yes, Delete</span>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-xs">loading...</span>
                  <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                </div>
              )}
            </Button>
          </div>
        </Fragment>
      </Modal>
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Parse cookies from the request headers
  const cookies = getCookies(context);

  // Access cookies using the cookie name
  const token = cookies["accessToken"] || null;
  const access = cookies["access"] || null;
  const firebaseToken = cookies["firebaseToken"] || null;

  if (!token) {
    return {
      redirect: {
        destination: "/authentication?page=sign-in", // Redirect to the home page
        permanent: false,
      },
    };
  }

  return {
    props: { token, access, firebaseToken },
  };
};

export default RequestDetails;
