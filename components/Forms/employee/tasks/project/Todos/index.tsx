import React, { Fragment, useEffect, useMemo, useState } from "react";
import { BsClipboardCheck } from "react-icons/bs";
import {
  MdAdd,
  MdCheckBoxOutlineBlank,
  MdCheckCircleOutline,
  MdClose,
  MdDeleteOutline,
} from "react-icons/md";
import Button from "../../../../../Button/Button";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/Hook";
import {
  deleteTaskTodo,
  getTaskTodos,
  selectTaskTodos,
} from "../../../../../../redux/features/task-management/project/taskTodo/taskTodoReducers";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import Members from "../../../../../Task/Members";
import Modal from "../../../../../Modal";
import { ModalHeader } from "../../../../../Modal/ModalComponent";
import { FaCircleNotch } from "react-icons/fa";
import { toast } from "react-toastify";
import TaskTodoForm from "./TaskTodoForm";

interface Props {
  id?: number | any;
  item?: any;
  member?: any;
  user?: any | any[];
  token?: any;
}

export default function Todos({ id, item, member, user, token }: Props) {
  const [subTasks, setSubTasks] = useState<any | any[]>([]);
  const [isDeleteTodo, setIsDeleteTodo] = useState(false);
  const [isAddTodo, setIsAddTodo] = useState(false);
  const [isUpdateTodo, setIsUpdateTodo] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  // redux
  const dispatch = useAppDispatch();
  const { taskTodos, pending } = useAppSelector(selectTaskTodos);

  const filterTodo = useMemo(() => {
    let qb = RequestQueryBuilder.create();

    qb.sortBy({ field: "createdAt", order: "DESC" });
    qb.query();
    return qb;
  }, []);

  // get task todos
  useEffect(() => {
    if (token) {
      dispatch(
        getTaskTodos({
          token,
          id,
          taskId: item?.id,
          params: filterTodo.queryObject,
        })
      );
    }
  }, [token, filterTodo, item, id]);

  useEffect(() => {
    const arr: any[] = [];
    const { data } = taskTodos;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        arr.push({
          ...item,
          subTaskAssignees:
            item?.subTaskAssignees?.length > 0
              ? item?.subTaskAssignees?.map((user: any) => ({
                  ...user.user,
                }))
              : [],
        });
      });
    }
    setSubTasks(arr);
  }, [taskTodos]);

  // console.log(user, "refresh-value");

  const onChangeStatus = (value: any) => {
    console.log(value, "change-status");
  };

  const handleChangeStatus = (value: any) => {
    onChangeStatus(value);
  };

  const onOpenDelete = (value: any) => {
    setFormData(value);
    setIsDeleteTodo(true);
  };

  const onCloseDelete = () => {
    setFormData(null);
    setIsDeleteTodo(false);
  };

  const onDeleteTodo = (value: any) => {
    dispatch(
      deleteTaskTodo({
        token,
        id,
        taskId: item?.id,
        subTaskId: value?.id,
        isSuccess() {
          toast.dark("Deleted successfully!");
          dispatch(
            getTaskTodos({
              token,
              id,
              taskId: item?.id,
              params: filterTodo.queryObject,
            })
          );
          onCloseDelete();
        },
        isError() {
          console.log("error-taskTodo");
        },
      })
    );
    console.log(value, "delete-todo");
  };

  // add todo
  const onOpenAddTodo = (value: any) => {
    setFormData(value);
    setIsAddTodo(true);
  };

  const onCloseAddTodo = () => {
    setFormData(null);
    setIsAddTodo(false);
  };

  // update todo
  const onOpenUpdateTodo = (value: any) => {
    let newVal: any = {
      ...value,
      assignee:
        value?.subTaskAssignees?.length > 0
          ? value?.subTaskAssignees?.map((user: any) => ({
              ...user,
            }))
          : [],
    };
    setFormData(newVal);
    setIsUpdateTodo(true);
  };

  const onCloseUpdateTodo = () => {
    setFormData(null);
    setIsUpdateTodo(false);
  };

  // console.log(subTasks, "todos");

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex items-center gap-2 text-gray-6 mb-3">
        <BsClipboardCheck className="w-6 h-6" />
        <h3 className="text-lg font-semibold">Checklist</h3>
      </div>

      <div className="w-full flex flex-col gap-3 bg-gray rounded-lg p-4 overflow-y-auto max-h-[250px]">
        {subTasks?.length > 0 ? (
          subTasks?.map((sub: any, idx: any) => {
            return (
              <div
                key={idx}
                className="w-full flex flex-row justify-between bg-white py-3 px-4 rounded-lg shadow-md">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1"
                    onClick={() => handleChangeStatus(sub)}>
                    {sub?.subTaskStatus ? (
                      <MdCheckCircleOutline className="text-primary h-6 w-6 active:scale-90 " />
                    ) : (
                      <MdCheckBoxOutlineBlank className="text-gray-6 hover:text-primary h-6 w-6 active:scale-90" />
                    )}
                    <span className="font-semibold capitalize">
                      {sub?.subTaskName}
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Members
                    items={sub?.subTaskAssignees}
                    token={token}
                    position={
                      subTasks.length > 0 && subTasks.length == 1
                        ? "left"
                        : subTasks.length - 1 === idx
                        ? "top-right"
                        : "bottom-right"
                    }
                    onClick={() => onOpenUpdateTodo(sub)}
                  />
                  <button
                    type="button"
                    onClick={() => onOpenDelete(sub)}
                    className="border-2 border-gray-5 text-gray-5 rounded-full hover:bg-gray-5 hover:text-white active:scale-90">
                    <MdClose className="w-5 h-5 text-gray-500 cursor-pointer" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full flex flex-row justify-between bg-white py-3 px-4 rounded-lg shadow-md">
            <div className="flex justify-center py-8 ">Todos not found</div>
          </div>
        )}
      </div>

      <div className="w-full">
        <Button
          type="button"
          onClick={() => onOpenAddTodo(formData)}
          className="rounded-lg font-semibold text-xs border border-primary shadow-2"
          variant="primary">
          <span>New todo</span>
          <MdAdd className="w-4 h-4" />
        </Button>
      </div>

      {/* delete comment*/}
      <Modal size="small" onClose={onCloseDelete} isOpen={isDeleteTodo}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseDelete}>
            <div className="text-gray-6">
              <h3 className="text-md font-semibold">Delete To Do</h3>
              <p className="text-xs">Are you sure to delete this todo ?</p>
            </div>
          </ModalHeader>
          <div className="w-full flex items-center px-4 justify-end gap-2 mb-3">
            <Button
              type="button"
              variant="secondary-outline"
              className="rounded-lg border-2 border-gray-2 shadow-2"
              onClick={onCloseDelete}>
              <span className="text-xs font-semibold">Discard</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              className="rounded-lg border-2 border-primary"
              onClick={() => onDeleteTodo(formData)}
              disabled={pending}>
              {pending ? (
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

      {/* add todo */}
      <Modal size="small" onClose={onCloseAddTodo} isOpen={isAddTodo}>
        <div className="w-full text-sm">
          <TaskTodoForm
            id={id}
            taskId={item?.id}
            token={token}
            isOpen={isAddTodo}
            isCloseModal={onCloseAddTodo}
            getData={() =>
              dispatch(
                getTaskTodos({
                  token,
                  id,
                  taskId: item?.id,
                  params: filterTodo.queryObject,
                })
              )
            }
            taskAssignees={user}
          />
        </div>
      </Modal>

      {/* update todo */}
      <Modal size="small" onClose={onCloseUpdateTodo} isOpen={isUpdateTodo}>
        <div className="w-full text-sm">
          <TaskTodoForm
            id={id}
            taskId={item?.id}
            token={token}
            isOpen={isUpdateTodo}
            isCloseModal={onCloseUpdateTodo}
            getData={() =>
              dispatch(
                getTaskTodos({
                  token,
                  id,
                  taskId: item?.id,
                  params: filterTodo.queryObject,
                })
              )
            }
            items={formData}
            taskAssignees={user}
            isUpdate
          />
        </div>
      </Modal>
    </div>
  );
}
