import React, { useEffect, useMemo, useState } from "react";
import { DragDropContext, resetServerContext } from "react-beautiful-dnd";
import KanbanList from "./KanbanList";
import { useAppDispatch, useAppSelector } from "../../../redux/Hook";
import {
  getTasksByIdProject,
  selectTaskManagement,
  updateTaskStatus,
} from "../../../redux/features/task-management/project/task/taskManagementReducers";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getProjectById } from "../../../redux/features/task-management/project/projectManagementReducers";
import { sortByArr } from "../../../utils/useHooks/useFunction";

type Props = {
  item?: any | any[];
  token?: any;
  taskData?: any | any[];
  loading?: boolean;
};

type ElementProps = {
  id?: number | string | any;
  status?: string | any;
  index?: any;
  order?: any;
};

const lists = ["To Do", "In Progress", "Solved", "Done"];

const Kanban = ({ item, taskData, token, loading }: Props) => {
  const router = useRouter();
  const { pathname, query } = router;
  const newData = useMemo(() => taskData, [taskData]);
  const [items, setItems] = useState<any | any[]>([]);
  const [elementRemoved, setElementRemoved] = useState<any | any[]>();
  const [movedTask, setMovedTask] = useState<any | any[]>();

  // redux
  const dispatch = useAppDispatch();
  const { pending } = useAppSelector(selectTaskManagement);

  //   console.log({ taskData, item }, "task-data");

  const getElement = (prefix: any, tasks: any) => {
    let task: any[] = [];
    if (tasks?.length == 0) return;
    const getOrder = (o: any) => {
      return o?.taskOrder;
    };
    let sortByOrder = sortByArr(getOrder, true);
    let taskSort = tasks.sort(sortByOrder);
    taskSort
      ?.filter((x: any) => x?.taskStatus === prefix)
      .map((e: any) => {
        task.push({
          ...e,
          projectName: item?.projectName,
          prefix: e?.taskStatus,
          content: e?.taskName,
          description: e?.taskDescription,
          projectTypes: item?.projectType?.projectTypeName,
          times: {
            scheduleStart: e?.scheduleStart,
            scheduleEnd: e?.scheduleEnd,
          },
          taskRequestStatus: e?.taskRequestStatus,
        });
      });
    // console.log(task, "element");
    return task;
  };

  const generateElement = lists.reduce(
    (previous, prefix) => ({
      ...previous,
      [prefix]: getElement(prefix, newData),
    }),
    {}
  );

  useEffect(() => {
    setItems(generateElement as any);
  }, [newData]);

  //   console.log(newData, "data");

  const removeFromList = (list: any, index: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(index, 1);
    // const [removed] = result.find((item, idx) => idx == index);
    return [removed, result];
  };

  const addToList = (list: any, index: any, element: any) => {
    const result = Array.from(list);
    result.splice(index, 0, element);
    return result;
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) {
      //   console.log(result, "removed-result-destination");
      return;
    }
    const listCopy = { ...items };

    const sourceList = listCopy[result.source.droppableId];
    let [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );
    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination?.droppableId || 0];
    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination?.index || 0,
      removedElement
    );

    setElementRemoved(removedElement);
    setItems(listCopy);
    resetServerContext();
    const newMove = {
      // @ts-ignore
      id: removedElement?.id,
      status: result?.destination?.droppableId,
      index: result?.destination?.index,
      order: result?.destination?.index + 1,
    };
    setMovedTask(newMove);

    // console.log("removed-copy", listCopy);
    // console.log(11, item?.id, "id work");
    // console.log(12, sourceList);
    // console.log(13, result?.destination?.droppableId);
    // console.log("removed-element", removedElement);
    // console.log(15, destinationList);
    // console.log(166, result);
    // console.log(100, item);

    await dispatch(
      updateTaskStatus({
        token,
        id: query?.id,
        taskId: newMove?.id,
        data: newMove,
        isSuccess() {
          toast.dark("Task remove to " + newMove?.status);
          dispatch(getTasksByIdProject({ token, id: query?.id }));
        },
        isError() {
          dispatch(getTasksByIdProject({ token, id: query?.id }));
          console.log("error-move-task");
        },
      })
    );
    // dispatch(getWork(token, query?.id));
    // openModalConfirm();
    // console.log(removedElement?.prefix, "=", result?.destination?.droppableId);
  };

  //   console.log({ elementRemoved, movedTask }, "removed");
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-full grid col-span-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {lists.map((listKey) => {
          return (
            <KanbanList
              key={listKey?.toString()}
              elements={items[listKey]}
              prefix={listKey}
              data={taskData}
              projectData={item}
              token={token}
              loading={loading}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default Kanban;
