import React, { Fragment, useEffect, useMemo, useState } from "react";
import { MdDeleteOutline, MdDone, MdEdit, MdPeople } from "react-icons/md";
import { useRouter } from "next/router";
import { isBase64, sortByArr } from "../../../../../utils/useHooks/useFunction";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook";
import {
  createTaskComment,
  deleteTaskComment,
  getTaskComment,
  selectTaskComment,
  updateTaskComment,
} from "../../../../../redux/features/task-management/project/taskComment/taskCommentReducers";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import Comments from "../../../Comments";
import { toast } from "react-toastify";
import { FaCircleNotch } from "react-icons/fa";
import moment from "moment";
import { ModalHeader } from "../../../../Modal/ModalComponent";
import Modal from "../../../../Modal";
import Button from "../../../../Button/Button";

type Props = {
  id?: number | any;
  item?: any;
  member?: any | any[];
  user?: any | any[];
  token?: any;
  filters?: any;
};

type FormValues = {
  value?: any;
  index?: any;
  isEdit?: boolean;
  isDelete?: boolean;
};

export default function TaskComment({ id, item, member, user, token }: Props) {
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { query } = router;

  const [commentData, setCommentData] = useState<any | any[]>([]);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [attachment, setAttachment] = useState<string | any>(null);
  const [editComment, setEditComment] = useState<FormValues | any>();
  const [deleteComment, setDeleteComment] = useState<FormValues | any>();
  const [isOpenDeleteComment, setIsOpenDeleteComment] = useState(false);
  const [commentEdit, setCommentEdit] = useState<any>(null);
  const [attachmentEdit, setAttachmentEdit] = useState(null);

  // edit base status
  const [isBaseStatus, setIsBaseStatus] = useState(false);

  // redux
  const dispatch = useAppDispatch();
  const { taskComments } = useAppSelector(selectTaskComment);

  const filterComment = useMemo(() => {
    let qb = RequestQueryBuilder.create();

    qb.sortBy({ field: "createdAt", order: "DESC" });
    qb.query();
    return qb;
  }, []);

  // get task comment
  useEffect(() => {
    if (token && item) {
      dispatch(
        getTaskComment({
          token,
          id,
          taskId: item?.id,
          params: filterComment.queryObject,
        })
      );
    }
  }, [token, filterComment, item, id]);

  useEffect(() => {
    const arr: any[] = [];
    const { data } = taskComments;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        arr.push(item);
      });
      setCommentData(arr);
    }
  }, [taskComments]);

  // create-comment
  const onCreateComment = async (value: any) => {
    const { comment, attachment } = value;
    const newData = {
      taskCommentContent: comment,
      taskCommentAttachment: attachment,
    };
    // await getDetailTask({ id: item?.id, token });
    setLoading(true);
    dispatch(
      createTaskComment({
        token,
        id,
        taskId: item?.id,
        data: newData,
        isSuccess() {
          toast.dark("Your comment has been sent");
          setLoading(false);
          setComment("");
          setAttachment(null);
          dispatch(
            getTaskComment({
              token,
              id,
              taskId: item?.id,
              params: filterComment.queryObject,
            })
          );
        },
        isError() {
          console.log("error-comment");
          setLoading(false);
          setComment("");
          setAttachment([]);
        },
      })
    );
    console.log({ comment, attachment }, "onComment");
  };

  // edit-comment-start
  const onEditComment = ({ value, index, isEdit }: FormValues) => {
    const newObj = {
      isEdit: isEdit,
      idx: index,
      id: value?.id,
      taskCommentContent: value?.taskCommentContent,
      taskCommentAttachment: value?.taskCommentAttachment,
    };
    setCommentEdit(value?.taskCommentContent);
    setAttachmentEdit(value?.taskCommentAttachment);
    setEditComment(newObj);
    console.log(newObj, "edit-comment");
  };

  useEffect(() => {
    setIsBaseStatus(isBase64(attachmentEdit));
  }, [attachmentEdit]);

  const onUpdateComment = async (value: any) => {
    const { commentEdit, attachmentEdit, taskId, commentId } = value;
    let newObj: any = {
      taskCommentContent: commentEdit,
    };
    if (isBaseStatus) {
      newObj = {
        ...newObj,
        taskCommentAttachment: attachmentEdit,
      };
    }
    setLoading(true);
    dispatch(
      updateTaskComment({
        token,
        id,
        taskId: taskId,
        commentId: parseInt(commentId),
        data: newObj,
        isSuccess() {
          toast.dark("Your comment has been updated");
          setLoading(false);
          setCommentEdit(null);
          setAttachmentEdit(null);
          setEditComment(null);
          dispatch(
            getTaskComment({
              token,
              id,
              taskId: taskId,
              params: filterComment.queryObject,
            })
          );
        },
        isError() {
          console.log("error-comment");
          setLoading(false);
        },
      })
    );
    console.log(value);
  };
  // edit-comment-end

  // delete-comment-start
  const onOpenDeleteComment = ({ value, index, isEdit, isDelete }: any) => {
    const newObj = {
      isEdit: isEdit,
      idx: index,
      id: value?.id,
      isDelete: isDelete || false,
    };
    setDeleteComment(newObj);
    setIsOpenDeleteComment(true);
  };

  const onCloseDeleteComment = () => {
    setDeleteComment(null);
    setIsOpenDeleteComment(false);
  };

  const onDeleteComment = async (value: any) => {
    if (!value?.id) return;
    setLoading(true);
    dispatch(
      deleteTaskComment({
        token,
        id,
        taskId: item?.id,
        commentId: parseInt(value?.id),
        isSuccess() {
          toast.dark("Your comment has been removed");
          setLoading(false);
          onCloseDeleteComment();
          dispatch(
            getTaskComment({
              token,
              id,
              taskId: item?.id,
              params: filterComment.queryObject,
            })
          );
        },
        isError() {
          console.log("error-comment");
          onCloseDeleteComment();
          setLoading(false);
        },
      })
    );
  };
  // delete-comment-end

  const disPlayComment = useMemo(() => {
    const getDate = (o: any) => {
      return o?.createdAt;
    };
    let sortByDate = sortByArr(getDate, false);
    let sort = commentData?.length > 0 && commentData.sort(sortByDate);
    return sort;
  }, [commentData]);

  return (
    <div>
      <div className="w-full flex flex-col font-normal px-4">
        <Comments
          onSubmit={() => onCreateComment({ comment, attachment })}
          content={comment}
          setContent={setComment}
          loading={loading}
          images={attachment}
          setImages={setAttachment}
        />
      </div>

      <div className="overflow-y-scroll my-5 max-h-60">
        {disPlayComment?.length > 0
          ? disPlayComment?.map((element: any, idx: any) => {
              return (
                <React.Fragment key={idx}>
                  <div className="w-full p-4 pb-0">
                    <div className="w-full flex flex-row justify-between font-normal items-center border-2 p-2 border-gray-5 rounded-t-lg">
                      <div className="flex items-center gap-2">
                        {element?.user?.profileImage ? (
                          <img
                            src={`${url}user/profileImage/${element?.user?.profileImage}`}
                            className="rounded-full h-10 w-10 mr-2 object-cover object-center"
                          />
                        ) : (
                          <MdPeople className="w-10 h-10 rounded-full border-2 border-gray-5 mx-auto p-2" />
                        )}
                        <div className="flex flex-col">
                          <span className="font-bold"> Engineer </span>
                          <span> {element?.user?.nickName} </span>
                        </div>
                      </div>

                      {user?.id == element?.user?.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              onOpenDeleteComment({
                                value: element,
                                index: idx,
                                isEdit: false,
                                isDelete: true,
                              })
                            }
                            disabled={loading}
                            className={`p-0.5 rounded-md ${
                              loading &&
                              deleteComment?.idx == idx &&
                              deleteComment?.isDelete
                                ? "bg-white"
                                : "bg-danger"
                            }`}>
                            {loading &&
                            deleteComment?.idx == idx &&
                            deleteComment?.isDelete == true ? (
                              <FaCircleNotch className=" animate-spin-1.5 w-4 h-4 text-gray cursor-pointer" />
                            ) : (
                              <MdDeleteOutline className="w-4 h-4 text-gray cursor-pointer" />
                            )}
                          </button>

                          {editComment?.idx == idx ? (
                            <button
                              onClick={() =>
                                onUpdateComment({
                                  commentEdit,
                                  attachmentEdit,
                                  taskId: item?.id,
                                  commentId: editComment?.id,
                                })
                              }
                              disabled={loading}
                              className={`p-0.5 rounded-md bg-primary ${
                                loading ? "opacity-75" : ""
                              }`}>
                              {loading ? (
                                <FaCircleNotch className="animate-spin-1.5 w-4 h-4 text-gray cursor-pointer" />
                              ) : (
                                <MdDone className="w-4 h-4 text-gray cursor-pointer" />
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                onEditComment({
                                  value: element,
                                  index: idx,
                                  isEdit: true,
                                })
                              }
                              disabled={loading}
                              className={`p-0.5 rounded-md bg-primary`}>
                              <MdEdit className="w-4 h-4 text-gray cursor-pointer" />
                            </button>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {editComment?.idx == idx ? (
                    <div className="font-normal px-4">
                      <Comments
                        onSubmit={() =>
                          // onCreateComment({ comment, attachment })
                          onUpdateComment({
                            commentEdit,
                            attachmentEdit,
                            taskId: item?.id,
                            commentId: editComment?.id,
                          })
                        }
                        contentEdit={commentEdit}
                        setContentEdit={setCommentEdit}
                        loading={loading}
                        imagesEdit={attachmentEdit}
                        setImagesEdit={setAttachmentEdit}
                        isEdit
                      />
                    </div>
                  ) : (
                    <div className="w-full px-4 font-normal">
                      <div className="w-full border-2 border-t-0 border-gray-5 p-4 rounded-b-lg">
                        {/* <span
                          className="text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html: element?.taskCommentContent,
                          }}></span> */}
                        <span className="text-gray-6 text-sm tracking-wide leading-relaxed">
                          {element?.taskCommentContent}
                        </span>
                        <div className="w-full flex flex-col text-xs gap-2">
                          <p className="text-gray-5">
                            {`Created ${moment(new Date(element?.createdAt))
                              .startOf("hour")
                              .fromNow()}`}
                          </p>

                          {element?.taskCommentAttachment ? (
                            <div className="w-full flex flex-wrap mb-2">
                              <img
                                src={`${url}project/task/attachment/${element?.taskCommentAttachment}`}
                                className="rounded-md h-10 w-10 mr-2 object-cover object-center"
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })
          : null}
      </div>

      {/* delete occupant*/}
      <Modal
        size="small"
        onClose={onCloseDeleteComment}
        isOpen={isOpenDeleteComment}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseDeleteComment}>
            <div className="text-gray-6">
              <h3 className="text-md font-semibold">Delete Comment</h3>
              <p className="text-xs">Are you sure to delete comment ?</p>
            </div>
          </ModalHeader>
          <div className="w-full flex items-center px-4 justify-end gap-2 mb-3">
            <Button
              type="button"
              variant="secondary-outline"
              className="rounded-lg border-2 border-gray-2 shadow-2"
              onClick={onCloseDeleteComment}>
              <span className="text-xs font-semibold">Discard</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              className="rounded-lg border-2 border-primary"
              onClick={() => onDeleteComment(deleteComment)}
              disabled={loading}>
              {loading ? (
                <Fragment>
                  <span className="text-xs">Deleting...</span>
                  <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                </Fragment>
              ) : (
                <span className="text-xs">Yes, Delete it!</span>
              )}
            </Button>
          </div>
        </Fragment>
      </Modal>
    </div>
  );
}
