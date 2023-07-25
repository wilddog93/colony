import moment from "moment";
import React, {
  DetailedHTMLProps,
  Fragment,
  HTMLAttributes,
  useEffect,
  useState,
} from "react";
import { Draggable } from "react-beautiful-dnd";
import {
  MdOutlineChatBubbleOutline,
  MdOutlineDescription,
  MdOutlineFileCopy,
  MdOutlineFileOpen,
  MdOutlineFileUpload,
  MdOutlineTask,
  MdTask,
} from "react-icons/md";
import Teams from "../../../Task/Teams";
import Members from "../../../Task/Members";
import Modal from "../../../Modal";
import TaskFormUpdate from "../../../Forms/employee/tasks/project/TaskFormUpdate";
import { getTasksByIdProject } from "../../../../redux/features/task-management/project/task/taskManagementReducers";
import { useAppDispatch } from "../../../../redux/Hook";
import { useRouter } from "next/router";

type Props = {
  item: any | any[];
  data?: any | any[];
  projectData?: any | any[];
  token?: any;
  index?: any;
  loading?: boolean;
};

const ListItem = ({
  item,
  data,
  token,
  index,
  loading,
  projectData,
}: Props) => {
  const [dataTask, setDataTask] = useState<any | any[]>([]);
  const [isReadMore, setIsReadMore] = useState(false);

  const router = useRouter();
  const { pathname, query } = router;
  // redux
  const dispatch = useAppDispatch();

  // tabs
  const [tabs, setTabs] = useState<string | any>("To Do");

  // modal
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [formTask, setFormTask] = useState<any>(null);

  const onOpenUpdate = (value: any) => {
    if (!value) return;
    let newObj = {
      ...value,
      assignee:
        value?.taskAssignees?.length > 0
          ? value?.taskAssignees?.map((user: any) => ({
              ...user,
              label: `${user?.firstName} ${user?.lastName}`,
              value: `${user?.id}`,
            }))
          : [],
      taskCategory:
        value?.taskCategories?.length > 0
          ? value?.taskCategories?.map((item: any) => ({
              ...item,
              label: `${item?.taskCategoryName}`,
              value: `${item?.id}`,
            }))
          : [],
    };
    setFormTask(newObj);
    setIsOpenUpdate(true);
  };

  const onCloseUpdate = () => {
    setFormTask(null);
    setIsOpenUpdate(false);
  };

  const dateFormat = (date: any) => {
    return moment(new Date(date)).format("DD MMM YYYY");
  };

  const toggleReadMore = () => {};

  useEffect(() => {
    if (data) {
      setDataTask(data);
    }
  }, [data]);

  console.log(formTask, "items-in-task");

  return (
    <Fragment>
      <Draggable draggableId={"draggable-" + item.id.toString()} index={index}>
        {(provided, snapshot) => {
          return (
            <div
              className={`w-full p-3 relative bg-white mb-4 grid gap-5 rounded-xl max-w-xs mx-auto`}
              onDoubleClick={() => onOpenUpdate(item)}
              ref={provided?.innerRef}
              // @ts-ignore
              snapshot={snapshot}
              {...provided.draggableProps}
              {...provided.dragHandleProps}>
              {dataTask?.length > 0
                ? dataTask
                    ?.filter((element: any) => element?.id == item?.id)
                    .map((e: any) => (
                      <React.Fragment key={e?.id}>
                        <div className="flex justify-between text-[#555555] text-sm">
                          <div className="font-bold">{item?.taskCode}</div>

                          <div> Due : {dateFormat(e?.scheduleEnd)} </div>
                        </div>
                        <div className="grid grid-cols-2  gap-1">
                          {e?.detail?.tags?.length > 0
                            ? e?.detail?.tags?.map((i: any, idx: any) => (
                                <div
                                  className="flex rounded-xl py-1 px-3 font-bold text-sm"
                                  style={{
                                    backgroundColor: i?.taskTagColor,
                                    color: i?.taskTagTextColor,
                                  }}
                                  key={idx}>
                                  <span className="flex mx-auto">
                                    {i?.taskTagName}
                                  </span>
                                </div>
                              ))
                            : null}
                        </div>
                        <p className="font-bold"> {item?.content} </p>
                        <p className="text-[#555555] text-sm flex flex-col">
                          {/* {item?.TaskDescription} */}
                          {isReadMore
                            ? e?.taskDescription?.slice(0, 100)
                            : e?.taskDescription}
                          {e?.taskDescription?.length > 100 && (
                            <>
                              {isReadMore ? "..." : ""}
                              {isReadMore ? (
                                <span
                                  className="text-green-300 font-medium py-1 cursor-pointer"
                                  onClick={toggleReadMore}>
                                  Read more
                                </span>
                              ) : (
                                <span
                                  className="text-green-300 font-medium py-1 cursor-pointer"
                                  onClick={toggleReadMore}>
                                  Read less
                                </span>
                              )}
                            </>
                          )}
                        </p>
                      </React.Fragment>
                    ))
                : null}

              <div className="flex w-full gap-3">
                <button
                  // onClick={(id) => handleAttachment(item?.id)}
                  className="flex flex-row text-[#C4C4C4] hover:text-green-300">
                  <MdOutlineFileOpen className="mr-2 w-5 h-5" />
                  <p>{item?.totalAttachment}</p>
                </button>

                <button
                  // onClick={(id) => handleSubtask(item?.id)}
                  className="flex flex-row text-[#C4C4C4] hover:text-green-300">
                  <MdOutlineTask className="mr-2 w-5 h-5" />
                  <p>{item?.totalSubTask}</p>
                </button>
              </div>

              <div className="w-full flex justify-between ">
                <div className="flex flex-row">
                  <Members items={item?.taskAssignees} />
                </div>
                <button
                // onClick={() => handleComment(item?.id)}
                >
                  <div className="flex flex-row text-[#C4C4C4] hover:text-green-300">
                    <MdOutlineChatBubbleOutline className="mr-2 w-6 h-6" />
                    <p>{item?.totalComment}</p>
                  </div>
                </button>
              </div>
            </div>
          );
        }}
      </Draggable>

      {/* modal update */}
      <Modal size="large" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
        <div className="w-full text-sm">
          <TaskFormUpdate
            token={token}
            items={formTask}
            getData={() =>
              dispatch(getTasksByIdProject({ token, id: query?.id }))
            }
            id={query?.id}
            isCloseModal={onCloseUpdate}
            projectMembers={projectData?.projectMembers}
          />
        </div>
      </Modal>
    </Fragment>
  );
};

export default ListItem;
