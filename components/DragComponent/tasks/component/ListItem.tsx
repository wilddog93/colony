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
  MdChatBubbleOutline,
  MdListAlt,
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
import { BsClipboardCheck } from "react-icons/bs";
import Tooltip from "../../../Tooltip/Tooltip";

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
  const [isHiddenDesc, setIsHiddenDesc] = useState<any | any[]>([]);
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
    setTabs("To Do");
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

  const handleChangeModalTabs = ({ value, tab }: any) => {
    if (!value || !tab) return;
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
    setTabs(tab);
  };

  console.log(item, "data");

  // description
  useEffect(() => {
    let data = [];
    if (dataTask?.length > 0) {
      data = dataTask?.map(({ id, taskDescription }: any) => ({
        id,
        text: taskDescription,
        hide: taskDescription?.length >= 70 ? true : false,
      }));
      setIsHiddenDesc(data);
    } else {
      setIsHiddenDesc([]);
    }
  }, [dataTask]);

  const showDesc = ({ id, text }: any) => {
    let filter = isHiddenDesc?.some((e: any) => e?.id == id && e?.hide);
    if (filter) {
      return `${text?.substring(70, 0)}...`;
    } else {
      return text;
    }
  };

  const readMore = ({ id }: any) => {
    let data: any[] = [];
    let filter = isHiddenDesc?.some((e: any) => e?.id == id && e?.hide == true);
    if (filter) {
      isHiddenDesc.map((items: any) => {
        if (items?.id == id)
          data.push({
            ...items,
            id: items?.id,
            hide: false,
          });
        else data.push({ ...items });
      });
    } else {
      data = isHiddenDesc;
    }
    setIsHiddenDesc(data);
  };

  const readLess = ({ id }: any) => {
    let data = [];
    let filter = isHiddenDesc?.some(
      (e: any) => e?.id == id && e?.hide == false
    );
    if (filter) {
      isHiddenDesc.map((items: any) => {
        if (items?.id == id)
          data.push({
            ...items,
            id: items?.id,
            hide: true,
          });
        else data.push({ ...items });
      });
    } else {
      data = isHiddenDesc;
    }
    setIsHiddenDesc(data);
  };

  let indexCat = [0];

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
                        {/* task category */}
                        <div className="flex flex-wrap items-center gap-1">
                          {e?.taskCategories?.length == 0
                            ? null
                            : e?.taskCategories?.length > 1
                            ? indexCat.map((val: any, idx: any) => (
                                <Fragment>
                                  <div className="w-full flex flex-wrap gap-1">
                                    <div
                                      className="flex items-center rounded-xl py-1 px-3 font-semibold text-xs gap-1"
                                      style={{
                                        backgroundColor:
                                          e?.taskCategories[val]
                                            ?.taskCategoryFillColor,
                                        color:
                                          e?.taskCategories[val]
                                            ?.taskCategoryTextColor,
                                      }}
                                      key={idx}>
                                      <span className="flex mx-auto">
                                        {
                                          e?.taskCategories[val]
                                            ?.taskCategoryName
                                        }
                                      </span>
                                    </div>

                                    {indexCat?.length - 1 == idx ? (
                                      <div className="px-2 py-1 bg-gray text-gray-6 text-xs rounded-full font-semibold">
                                        <span>
                                          +
                                          {e?.taskCategories?.length -
                                            indexCat?.length}
                                        </span>
                                      </div>
                                    ) : null}
                                  </div>
                                </Fragment>
                              ))
                            : e?.taskCategories?.map((val: any, idx: any) => (
                                <div
                                  className="flex rounded-xl py-1 px-3 font-semibold text-xs"
                                  style={{
                                    backgroundColor: val?.taskCategoryFillColor,
                                    color: val?.taskCategoryTextColor,
                                  }}
                                  key={idx}>
                                  <span className="flex mx-auto">
                                    {val?.taskCategoryName}
                                  </span>
                                </div>
                              ))}
                        </div>
                        <p className="font-bold"> {item?.content} </p>
                        <p className="text-[#555555] text-sm flex flex-col">
                          {/* {item?.TaskDescription} */}
                          {!e?.taskDescription
                            ? "-"
                            : showDesc({
                                id: e?.id,
                                text: e?.taskDescription,
                              })}
                        </p>
                      </React.Fragment>
                    ))
                : null}

              <div className="w-full flex justify-between items-center">
                <div className="w-1/2 flex items-center">
                  <Members items={item?.taskAssignees} />
                </div>

                <div className="w-1/2 flex justify-end gap-2">
                  <Tooltip
                    className={`tooltip text-sm focus:outline-none`}
                    classTooltip="p-5 rounded-xl shadow-lg z-1 font-bold w-full min-w-max"
                    tooltip={`Todos`}
                    color="light"
                    position={"top-right"}>
                    <button
                      onClick={() =>
                        handleChangeModalTabs({ value: item, tab: "To Do" })
                      }
                      className="flex items-center text-gray-5 hover:text-primary gap-2">
                      {/* <BsClipboardCheck className="w-5 h-5" /> */}
                      <MdListAlt className="w-6 h-6" />
                      <p className="inline-flex">{item?.totalSubTask}</p>
                    </button>
                  </Tooltip>

                  <Tooltip
                    className={`tooltip text-sm focus:outline-none`}
                    classTooltip="p-5 rounded-xl shadow-lg z-1 font-bold w-full min-w-max"
                    tooltip={`Comments`}
                    color="light"
                    position={"top-right"}>
                    <button
                      onClick={() =>
                        handleChangeModalTabs({ value: item, tab: "Comment" })
                      }>
                      <div className="flex items-center text-gray-5 hover:text-primary gap-2">
                        <MdChatBubbleOutline className="w-6 h-6" />
                        <p className="inline-flex">{item?.totalComment}</p>
                      </div>
                    </button>
                  </Tooltip>
                </div>
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
            tabsMenu={tabs}
          />
        </div>
      </Modal>
    </Fragment>
  );
};

export default ListItem;
